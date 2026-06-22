"""FT-Transformer (Feature-Tokenizer + Transformer) valuation head.

Mirrors `Model Selection/ftTransformer.ipynb` but packaged as a
joblib-serializable wrapper (`FTTransformerRegressor`) the API can load and call
exactly like the sklearn pipelines: `.predict(X)` returns `log1p(Price)` (the
API applies `expm1`), and an empty `.named_steps` makes api._predict_with_band
fall back to the saved ±1.28σ sigma band (the FT model has no quantile heads).

Two deployment-driven design choices:

* **torch is imported lazily** (inside the functions, never at module top level),
  so unpickling the wrapper on a box without torch resident is cheap, and the
  heavy import only happens on the first FT prediction.
* **weights are stored as raw little-endian float32 bytes**, not pickled tensors
  or numpy objects, so the artifact is immune to the numpy 1.26.4 <-> 2.x pickle
  skew that bit the MLP's RandomState (see project memory / DEPLOY notes). The
  torch nn.Module is rebuilt from those bytes on first use.
"""

from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd

# Cap predicted log-price at RM 500M so expm1 can't overflow on the luxury tail.
LOGCAP = math.log(5e8)


def _build_module(cat_cardinalities: list[int], n_num: int, config: dict[str, Any]):
    """Construct the (untrained) torch FTTransformer. torch is imported here so
    this module stays importable for unpickling even without torch installed."""
    import torch
    import torch.nn as nn

    class NumericTokenizer(nn.Module):
        """Each numeric feature -> a d_token vector via its own learnable w & b."""

        def __init__(self, n_num: int, d_token: int):
            super().__init__()
            self.weight = nn.Parameter(torch.empty(n_num, d_token))
            self.bias = nn.Parameter(torch.empty(n_num, d_token))
            nn.init.normal_(self.weight, std=0.01)
            nn.init.normal_(self.bias, std=0.01)

        def forward(self, x_num):  # x_num: (B, n_num)
            return x_num.unsqueeze(-1) * self.weight + self.bias  # (B, n_num, d_token)

    class FTTransformer(nn.Module):
        def __init__(self, cat_cardinalities, n_num, d_token, n_layers, n_heads, dropout):
            super().__init__()
            d_ff = d_token * 2
            self.cat_embs = nn.ModuleList(
                [nn.Embedding(card, d_token) for card in cat_cardinalities]
            )
            for emb in self.cat_embs:
                nn.init.normal_(emb.weight, std=0.01)
            self.num_tok = NumericTokenizer(n_num, d_token) if n_num > 0 else None
            self.cls = nn.Parameter(torch.empty(1, 1, d_token))
            nn.init.normal_(self.cls, std=0.01)
            enc_layer = nn.TransformerEncoderLayer(
                d_model=d_token, nhead=n_heads, dim_feedforward=d_ff, dropout=dropout,
                activation="gelu", batch_first=True, norm_first=True,
            )
            self.encoder = nn.TransformerEncoder(enc_layer, num_layers=n_layers)
            self.head = nn.Sequential(nn.LayerNorm(d_token), nn.ReLU(), nn.Linear(d_token, 1))

        def forward(self, x_cat, x_num):
            B = x_cat.shape[0]
            toks = [emb(x_cat[:, i]).unsqueeze(1) for i, emb in enumerate(self.cat_embs)]
            if self.num_tok is not None:
                toks.append(self.num_tok(x_num))
            x = torch.cat([self.cls.expand(B, -1, -1)] + toks, dim=1)  # (B, 1+T, d)
            x = self.encoder(x)
            return self.head(x[:, 0]).squeeze(1)  # [CLS] -> standardized log-price

    return FTTransformer(
        cat_cardinalities, n_num, config["d_token"], config["n_layers"],
        config["n_heads"], config["dropout"],
    )


class FTTransformerRegressor:
    """Picklable inference wrapper around a trained FT-Transformer.

    Holds only portable state (plain python, dicts, and weights as raw bytes);
    the torch nn.Module is rebuilt lazily on the first `predict`. `.predict(X)`
    takes a DataFrame with `cat_cols + num_cols` and returns un-standardized
    `log1p(Price)` (the API inverts with expm1)."""

    def __init__(self, *, cat_cols, num_cols, std_cols, vocab, cat_cardinalities,
                 num_mean, num_std, y_mean, y_std, weights, config):
        self.cat_cols = list(cat_cols)
        self.num_cols = list(num_cols)
        self.std_cols = list(std_cols)
        self.vocab = vocab  # {col: {category: idx>=1}}; index 0 reserved for OOV
        self.cat_cardinalities = list(cat_cardinalities)
        self.num_mean = {k: float(v) for k, v in num_mean.items()}
        self.num_std = {k: float(v) for k, v in num_std.items()}
        self.y_mean = float(y_mean)
        self.y_std = float(y_std)
        self.config = dict(config)
        # weights: {param_name: (shape_tuple, raw_le_float32_bytes)}
        self._weights = weights
        self._model = None  # live torch module; rebuilt on demand, never pickled

    # Drop the live torch module on pickle; keep only the portable state above.
    def __getstate__(self):
        state = self.__dict__.copy()
        state["_model"] = None
        return state

    def _ensure_model(self):
        if self._model is not None:
            return self._model
        import torch

        module = _build_module(self.cat_cardinalities, len(self.num_cols), self.config)
        state_dict = {}
        for name, (shape, raw) in self._weights.items():
            arr = np.frombuffer(raw, dtype="<f4").reshape(shape).copy()  # copy -> writable
            state_dict[name] = torch.from_numpy(arr)
        module.load_state_dict(state_dict)
        module.eval()
        self._model = module
        return module

    @property
    def named_steps(self):
        # api._predict_with_band reads pipe.named_steps; an empty mapping (no
        # 'rf' key) routes the FT model to the sigma-band fallback.
        return {}

    def _encode(self, X: pd.DataFrame):
        cat_mat = np.stack(
            [X[c].astype(str).map(self.vocab[c]).fillna(0).astype(np.int64).values
             for c in self.cat_cols],
            axis=1,
        )
        num = X[self.num_cols].astype(np.float64).copy()
        for c in self.std_cols:
            num[c] = (num[c] - self.num_mean[c]) / self.num_std[c]
        return cat_mat, num.values.astype(np.float32)

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        import torch

        module = self._ensure_model()
        cat_mat, num_block = self._encode(X)
        outs = []
        with torch.no_grad():
            for i in range(0, len(X), 8192):
                xc = torch.as_tensor(cat_mat[i:i + 8192])
                xn = torch.as_tensor(num_block[i:i + 8192])
                outs.append(module(xc, xn).cpu().numpy())
        scaled = np.concatenate(outs).astype(np.float64)
        return np.clip(scaled * self.y_std + self.y_mean, None, LOGCAP)


def fit_ft_transformer(train_df: pd.DataFrame, val_df: pd.DataFrame, *,
                       cat_cols, num_cols, std_cols,
                       d_token: int = 64, n_layers: int = 3, n_heads: int = 4,
                       dropout: float = 0.1, max_epochs: int = 100,
                       patience: int = 10, batch_size: int = 2048, lr: float = 1e-3,
                       weight_decay: float = 1e-4, seed: int = 42,
                       verbose: bool = True) -> "FTTransformerRegressor":
    """Train the FT-Transformer and return a ready-to-serve regressor.

    All vocab / scaler / target statistics are fit on `train_df` only. Early
    stopping watches validation RMSE in RM (patience `patience`); the best
    weights are restored before packaging."""
    import torch
    import torch.nn as nn

    torch.manual_seed(seed)
    np.random.seed(seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    if verbose:
        print(f"  [ft] device: {device}")

    # --- train-only categorical vocab (index 0 reserved for OOV/unknown) ---
    vocab: dict[str, dict[str, int]] = {}
    cat_cardinalities: list[int] = []
    for c in cat_cols:
        keep = sorted(train_df[c].astype(str).unique())
        vocab[c] = {k: i + 1 for i, k in enumerate(keep)}
        cat_cardinalities.append(len(vocab[c]) + 1)

    # --- train-only numeric standardization (std_cols only) ---
    num_mean, num_std = {}, {}
    for c in std_cols:
        col = train_df[c].astype(float)
        s = float(col.std())
        num_mean[c] = float(col.mean())
        num_std[c] = s if s and not math.isnan(s) else 1.0

    def encode(frame: pd.DataFrame):
        cat_mat = np.stack(
            [frame[c].astype(str).map(vocab[c]).fillna(0).astype(np.int64).values
             for c in cat_cols],
            axis=1,
        )
        nb = frame[num_cols].astype(np.float64).copy()
        for c in std_cols:
            nb[c] = (nb[c] - num_mean[c]) / num_std[c]
        return cat_mat, nb.values.astype(np.float32)

    # --- train-only target standardization ---
    ytr_log = np.log1p(train_df["Price"].astype(float).values)
    y_mean = float(ytr_log.mean())
    ys = float(np.std(ytr_log))
    y_std = ys if ys and not math.isnan(ys) else 1.0

    Xc_tr, Xn_tr = encode(train_df)
    Xc_va, Xn_va = encode(val_df)
    yva_log = np.log1p(val_df["Price"].astype(float).values)

    Xc_tr_t = torch.as_tensor(Xc_tr, device=device)
    Xn_tr_t = torch.as_tensor(Xn_tr, device=device)
    y_tr_t = torch.as_tensor(((ytr_log - y_mean) / y_std).astype(np.float32), device=device)
    Xc_va_t = torch.as_tensor(Xc_va, device=device)
    Xn_va_t = torch.as_tensor(Xn_va, device=device)

    config = {"d_token": d_token, "n_layers": n_layers, "n_heads": n_heads, "dropout": dropout}
    model = _build_module(cat_cardinalities, len(num_cols), config).to(device)
    if verbose:
        n_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        print(f"  [ft] trainable parameters: {n_params:,}")

    opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=weight_decay)
    loss_fn = nn.HuberLoss()

    def val_rmse_rm() -> float:
        model.eval()
        outs = []
        with torch.no_grad():
            for i in range(0, len(Xc_va_t), 8192):
                outs.append(model(Xc_va_t[i:i + 8192], Xn_va_t[i:i + 8192]).cpu().numpy())
        plog = np.clip(np.concatenate(outs).astype(np.float64) * y_std + y_mean, None, LOGCAP)
        return float(np.sqrt(np.mean((np.expm1(yva_log) - np.expm1(plog)) ** 2)))

    n = len(Xc_tr_t)
    best, best_state, wait = float("inf"), None, 0
    for ep in range(max_epochs):
        model.train()
        perm = np.random.permutation(n)
        run = 0.0
        for i in range(0, n, batch_size):
            idx = torch.as_tensor(perm[i:i + batch_size], device=device)
            opt.zero_grad()
            loss = loss_fn(model(Xc_tr_t[idx], Xn_tr_t[idx]), y_tr_t[idx])
            loss.backward()
            opt.step()
            run += loss.item() * len(idx)
        v = val_rmse_rm()
        if v < best - 1.0:  # > RM1 improvement counts
            best = v
            best_state = {k: t.detach().cpu().clone() for k, t in model.state_dict().items()}
            wait = 0
        else:
            wait += 1
        if verbose and (ep % 3 == 0 or wait >= patience):
            print(f"  [ft] ep{ep:02d}  train_huber {run / n:.4f}  val_RMSE RM {v:,.0f}"
                  + ("  <- best" if wait == 0 else ""))
        if wait >= patience:
            if verbose:
                print(f"  [ft] early stop at epoch {ep} (best val RMSE RM {best:,.0f})")
            break

    if best_state is not None:
        model.load_state_dict(best_state)
    model.eval()

    weights = {
        name: (tuple(t.shape), t.detach().cpu().numpy().astype("<f4").tobytes())
        for name, t in model.state_dict().items()
    }
    reg = FTTransformerRegressor(
        cat_cols=cat_cols, num_cols=num_cols, std_cols=std_cols, vocab=vocab,
        cat_cardinalities=cat_cardinalities, num_mean=num_mean, num_std=num_std,
        y_mean=y_mean, y_std=y_std, weights=weights, config=config,
    )
    reg._model = model.to("cpu")  # reuse in-process (dropped on pickle)
    return reg
