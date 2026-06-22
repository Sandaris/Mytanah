"""Train Random Forest valuation model + HCR logit, dump artifacts the API loads.

Run once before starting the API:
    python backend/save_models.py

This is a thin productionizing wrapper around the notebooks. Once you decide
to upgrade valuation to FT-Transformer, replace the valuation section but
keep the dumped artifact shape:
    {model, num_cols, cat_cols, cat_categories, target_log, name}
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

ROOT = Path(__file__).parent
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)
# Prefer the Parquet (fast) for the new tree/NN models; fall back to the xlsx.
DATA = ROOT.parent / "processed data" / "Open Transaction Data Cleaned.xlsx"
DATA_PARQUET = ROOT.parent / "processed data" / "transactions.parquet"


CAT_COLS = ["Property Type", "District", "Mukim", "Scheme Name/Area", "Tenure"]
NUM_COLS = ["Land", "Area", "Area_Applicable"]
QUANTILE_LO, QUANTILE_HI = 0.1, 0.9  # 80% band (matches the old ±1.28σ width)
Z80 = 1.2816  # 80% two-sided normal z (sigma-band half-width)


def _load_frame() -> pd.DataFrame:
    """Cleaned transactions with the model's engineered columns, from Parquet
    (fast) when available else the source xlsx. Mirrors the notebook prep:
    Area_Applicable flag, NaN fills for Area/Land, drop rows missing the target
    or any categorical."""
    src = DATA_PARQUET if DATA_PARQUET.exists() else DATA
    print(f"[data] loading {src.name}...")
    df = pd.read_parquet(src) if src.suffix == ".parquet" else pd.read_excel(src)
    df = df.copy()
    df["Area_Applicable"] = df["Area"].notna().astype(int)
    df["Area"] = df["Area"].fillna(0.0)
    df["Land"] = df["Land"].fillna(df["Land"].median())
    df = df.dropna(subset=["Price"] + CAT_COLS)
    for c in CAT_COLS:
        df[c] = df[c].astype(str)
    return df


def _val_metrics(model, val: pd.DataFrame) -> tuple[float, float, float]:
    """(log-residual std, R², median abs % error) on the 2025 hold-out, in the
    model's native log target. MdAPE is reported in RM space so it reads as
    'half the estimates land within X% of the sale price'."""
    Xv = val[CAT_COLS + NUM_COLS]
    yv = np.log1p(val["Price"].astype(float)).values
    pv = model.predict(Xv)
    band = float(np.std(yv - pv))
    r2 = float(1 - np.var(yv - pv) / np.var(yv))
    ape = np.abs(np.expm1(pv) - np.expm1(yv)) / np.maximum(np.expm1(yv), 1.0)
    mdape = float(np.median(ape))
    return band, r2, mdape


def _pick_device() -> str:
    """Return 'cuda' if an NVIDIA GPU is visible, else 'cpu'. (xgb.train only
    *warns* without a GPU, so probe nvidia-smi instead of catching an error.)"""
    import shutil
    import subprocess

    if shutil.which("nvidia-smi") is None:
        return "cpu"
    try:
        subprocess.run(["nvidia-smi"], capture_output=True, check=True)
        return "cuda"
    except Exception:
        return "cpu"


def _make_pre() -> ColumnTransformer:
    # OrdinalEncoder -> integer codes per category (no matrix blow-up; XGBoost's
    # histogram tree finds optimal splits on the ordered codes). Fresh instance
    # per pipeline so each head fits its own encoder.
    return ColumnTransformer(
        [
            ("cat", OrdinalEncoder(handle_unknown="use_encoded_value",
                                   unknown_value=-1, dtype=np.int32), CAT_COLS),
            ("num", "passthrough", NUM_COLS),
        ]
    )


def _make_xgb(device: str, alpha: float | None = None) -> xgb.XGBRegressor:
    """Mean regressor (alpha=None) or a pinball-loss quantile head (alpha set)."""
    kw: dict[str, Any] = dict(
        n_estimators=800, max_depth=10, learning_rate=0.05,
        subsample=0.9, colsample_bytree=0.8, tree_method="hist",
        random_state=42, device=device,
    )
    if alpha is not None:
        kw.update(objective="reg:quantileerror", quantile_alpha=alpha)
    return xgb.XGBRegressor(**kw)


def _fit_pipe(device: str, X, y, alpha: float | None = None) -> Pipeline:
    pipe = Pipeline([("pre", _make_pre()), ("xgb", _make_xgb(device, alpha))])
    pipe.fit(X, y)
    return pipe


def train_valuation() -> None:
    df = _load_frame()

    # Chronological split (matches notebook protocol)
    train = df[df["Year"] < 2025]
    print(f"[valuation] train rows: {len(train):,}")

    X = train[CAT_COLS + NUM_COLS]
    y = np.log1p(train["Price"].astype(float))

    device = _pick_device()
    print(f"[valuation] device: {device}")

    # Preserve the already-trained central estimate if an artifact exists, so the
    # documented R² and live valuations don't shift when we (re)build the bands.
    # Delete artifacts/valuation_model.joblib to retrain the mean from scratch.
    art_path = ARTIFACTS / "valuation_model.joblib"
    prev = joblib.load(art_path) if art_path.exists() else None
    if prev is not None and "model" in prev:
        model = prev["model"]
        name = prev.get("name", f"XGBoost-{device.upper()}")
        band_log_std = float(prev.get("band_log_std", 0.20))
        print(f"[valuation] reusing existing mean model ({name}) - bands only")
    else:
        print("[valuation] fitting mean XGBoost...")
        model = _fit_pipe(device, X, y)
        name = f"XGBoost-{device.upper()}"
        band_log_std = 0.20

    # Quantile heads -> per-input lower/upper band (10th / 90th percentile).
    print(f"[valuation] fitting quantile heads (alpha={QUANTILE_LO}/{QUANTILE_HI})...")
    q_lo = _fit_pipe(device, X, y, alpha=QUANTILE_LO)
    q_hi = _fit_pipe(device, X, y, alpha=QUANTILE_HI)

    # Conformalize the quantile band (CQR; Romano et al. 2019) so empirical
    # coverage matches the nominal 80%. The raw heads under-cover on 2025
    # (train->val drift + overfit), so widen by a single log-space offset E
    # calibrated on held-out 2025 data. E is added at predict time in api.py.
    z80 = 1.2816  # 80% two-sided normal z (for the sigma-band comparison)
    conformal = 0.0
    mdape: float | None = None
    nominal = QUANTILE_HI - QUANTILE_LO
    val = df[df["Year"] == 2025]
    if len(val) > 200:
        Xv = val[CAT_COLS + NUM_COLS]
        yv = np.log1p(val["Price"].astype(float)).values
        pv = model.predict(Xv)
        ql, qh = q_lo.predict(Xv), q_hi.predict(Xv)
        band_log_std = float(np.std(yv - pv))
        r2 = 1 - np.var(yv - pv) / np.var(yv)
        ape = np.abs(np.expm1(pv) - np.expm1(yv)) / np.maximum(np.expm1(yv), 1.0)
        mdape = float(np.median(ape))

        # Honest split: calibrate E on half of 2025, measure coverage on the other.
        rng = np.random.default_rng(42)
        cal = rng.random(len(val)) < 0.5
        scores = np.maximum(ql[cal] - yv[cal], yv[cal] - qh[cal])  # CQR conformity
        n = int(cal.sum())
        q_level = min(1.0, np.ceil((n + 1) * nominal) / n)
        conformal = float(np.quantile(scores, q_level, method="higher"))

        tst = ~cal
        lo = np.minimum(ql[tst] - conformal, pv[tst])
        hi = np.maximum(qh[tst] + conformal, pv[tst])
        cov = float(np.mean((yv[tst] >= lo) & (yv[tst] <= hi)))
        width = float(np.median(np.expm1(hi) - np.expm1(lo)))
        # fixed sigma band, same test set, for comparison
        slo, shi = pv[tst] - z80 * band_log_std, pv[tst] + z80 * band_log_std
        scov = float(np.mean((yv[tst] >= slo) & (yv[tst] <= shi)))
        swidth = float(np.median(np.expm1(shi) - np.expm1(slo)))

        print(f"[valuation] validation R2={r2:.3f}  log-residual std={band_log_std:.3f}")
        print(f"[valuation] CQR offset E={conformal:.3f}  (nominal coverage {nominal:.0%})")
        print(f"[valuation] quantile band: coverage={cov:.1%}  median width=RM{width:,.0f}")
        print(f"[valuation] sigma band   : coverage={scov:.1%}  median width=RM{swidth:,.0f}")

    cat_categories = {c: sorted(train[c].dropna().unique().tolist()) for c in CAT_COLS}

    joblib.dump(
        {
            "model": model,
            "num_cols": NUM_COLS,
            "cat_cols": CAT_COLS,
            "cat_categories": cat_categories,
            "target_log": True,
            "band_log_std": band_log_std,
            "quantile_lo": q_lo,
            "quantile_hi": q_hi,
            "quantile_alpha": [QUANTILE_LO, QUANTILE_HI],
            "quantile_conformal": conformal,
            "val_mape": mdape,
            "name": name,
        },
        art_path,
    )
    print(f"[valuation] saved -> {art_path}")


def train_rf() -> None:
    """Tuned Random Forest valuation head -> artifacts/valuation_rf.joblib.

    Light RandomizedSearch on a subsample (full CV over 400k rows is overkill),
    then refit the best config on the whole pre-2025 train set. The pipeline's
    regressor step is named 'rf' so api.py builds the prediction band from the
    per-tree spread (no separate quantile heads needed)."""
    df = _load_frame()
    train = df[df["Year"] < 2025]
    val = df[df["Year"] == 2025]
    print(f"[rf] train rows: {len(train):,}")
    X = train[CAT_COLS + NUM_COLS]
    y = np.log1p(train["Price"].astype(float))

    sub = train.sample(min(40000, len(train)), random_state=42)
    Xs, ys = sub[CAT_COLS + NUM_COLS], np.log1p(sub["Price"].astype(float))
    grid = {
        "rf__n_estimators": [200, 300, 400],
        "rf__max_depth": [18, 22, 26],
        "rf__min_samples_leaf": [2, 4, 8],
        "rf__max_features": ["sqrt", 0.5, 1.0],
    }
    base = Pipeline([("pre", _make_pre()),
                     ("rf", RandomForestRegressor(n_jobs=-1, random_state=42))])
    print("[rf] tuning on 40k subsample (12 candidates x 3-fold)...")
    search = RandomizedSearchCV(
        base, grid, n_iter=12, cv=3, scoring="neg_mean_absolute_error",
        random_state=42, n_jobs=1, verbose=1,  # RF already uses all cores
    )
    search.fit(Xs, ys)
    best = {k.replace("rf__", ""): v for k, v in search.best_params_.items()}
    print(f"[rf] best params: {best}")

    print("[rf] refitting best config on full train...")
    pipe = Pipeline([("pre", _make_pre()),
                     ("rf", RandomForestRegressor(n_jobs=-1, random_state=42, **best))])
    pipe.fit(X, y)

    band_log_std, mdape = 0.20, None
    if len(val) > 200:
        band_log_std, r2, mdape = _val_metrics(pipe, val)
        print(f"[rf] validation R2={r2:.3f}  log-residual std={band_log_std:.3f}  MdAPE={mdape:.1%}")

    cat_categories = {c: sorted(train[c].dropna().unique().tolist()) for c in CAT_COLS}
    out = ARTIFACTS / "valuation_rf.joblib"
    joblib.dump(
        {
            "model": pipe,
            "num_cols": NUM_COLS,
            "cat_cols": CAT_COLS,
            "cat_categories": cat_categories,
            "target_log": True,
            "band_log_std": band_log_std,
            "val_mape": mdape,
            "name": "Random Forest (tuned)",
        },
        out,
        compress=3,  # trees compress well -> keep the artifact loadable
    )
    print(f"[rf] saved -> {out}")


def train_ft() -> None:
    """FT-Transformer valuation head -> artifacts/valuation_ft.joblib.

    Feature-Tokenizer + Transformer (PyTorch): every categorical and numeric
    feature becomes a token, a learnable [CLS] token is prepended, and a small
    Transformer encoder attends across them to predict the standardized
    log-price. See Model Selection/ftTransformer.ipynb for the architecture and
    the fairness protocol; the training + serving code lives in ft_transformer.py
    so the artifact is a portable, torch-lazy wrapper. No quantile heads, so
    api.py falls back to a ±1.28σ band from the saved log-residual std."""
    from ft_transformer import fit_ft_transformer

    df = _load_frame()
    train = df[df["Year"] < 2025]
    val = df[df["Year"] == 2025]
    print(f"[ft] train rows: {len(train):,}")

    # Land/Area are standardized; Area_Applicable stays a raw 0/1 token.
    std_cols = ["Land", "Area"]
    print("[ft] training FT-Transformer (early stopping on 2025 val RMSE)...")
    model = fit_ft_transformer(
        train, val, cat_cols=CAT_COLS, num_cols=NUM_COLS, std_cols=std_cols,
    )

    band_log_std, mdape = 0.20, None
    if len(val) > 200:
        band_log_std, r2, mdape = _val_metrics(model, val)
        print(f"[ft] validation R2={r2:.3f}  log-residual std={band_log_std:.3f}  MdAPE={mdape:.1%}")

    cat_categories = {c: sorted(train[c].dropna().unique().tolist()) for c in CAT_COLS}
    out = ARTIFACTS / "valuation_ft.joblib"
    joblib.dump(
        {
            "model": model,
            "num_cols": NUM_COLS,
            "cat_cols": CAT_COLS,
            "cat_categories": cat_categories,
            "target_log": True,
            "band_log_std": band_log_std,
            "val_mape": mdape,
            "name": "FT-Transformer",
        },
        out,
        compress=3,
    )
    print(f"[ft] saved -> {out}")


def train_hcr() -> None:
    """Placeholder HCR trainer using a synthetic-but-shaped dataset.

    The real series (mean house price, unsold units, impaired loan ratio,
    credit-to-GDP, planned supply) live across multiple Data Understanding
    notebooks. Wire them into a single quarterly DataFrame with these columns
    and rerun this function:
        sales_vol_yoy, unsold_co, unsold_uc, planned_supply_yoy,
        impaired_ratio, credit_gdp_yoy, cycle_pos
    """
    feature_cols = [
        "sales_vol_yoy",
        "unsold_co",
        "unsold_uc",
        "planned_supply_yoy",
        "impaired_ratio",
        "credit_gdp_yoy",
    ]

    hcr_csv = ROOT / "hcr_quarterly.csv"
    if hcr_csv.exists():
        print(f"[hcr] loading {hcr_csv}")
        q = pd.read_csv(hcr_csv)
    else:
        print("[hcr] hcr_quarterly.csv missing - skipping HCR model training.")
        print("[hcr] Export the assembled quarterly panel from HCR_Logit_Regression.ipynb")
        print(f"[hcr] to {hcr_csv} with columns: {feature_cols + ['cycle_pos', 'period']}")
        return

    X = q[feature_cols].values
    y = q["cycle_pos"].astype(int).values

    scaler = StandardScaler().fit(X)
    logit = LogisticRegression(max_iter=1000).fit(scaler.transform(X), y)

    joblib.dump(
        {"model": logit, "scaler": scaler, "feature_cols": feature_cols},
        ARTIFACTS / "hcr_model.joblib",
    )

    last = q.iloc[-1]
    p = float(logit.predict_proba(scaler.transform([last[feature_cols].values]))[0, 1])
    snapshot = {
        "period": str(last.get("period", "latest")),
        "probability": p,
        "regime": "high" if p >= 0.5 else "low",
        "features": {c: float(last[c]) for c in feature_cols},
    }
    (ARTIFACTS / "hcr_latest.json").write_text(json.dumps(snapshot, indent=2))
    print(f"[hcr] saved model + latest snapshot (p={p:.3f}, regime={snapshot['regime']})")


if __name__ == "__main__":
    import sys

    targets = sys.argv[1:] or ["valuation", "rf", "ft", "hcr"]
    if "valuation" in targets:
        train_valuation()
    if "rf" in targets:
        train_rf()
    if "ft" in targets:
        train_ft()
    if "hcr" in targets:
        train_hcr()
    print("done.")
