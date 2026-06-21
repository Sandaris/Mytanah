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
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

ROOT = Path(__file__).parent
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)
DATA = ROOT.parent / "processed data" / "Open Transaction Data Cleaned.xlsx"


CAT_COLS = ["Property Type", "District", "Mukim", "Scheme Name/Area", "Tenure"]
NUM_COLS = ["Land", "Area", "Area_Applicable"]
QUANTILE_LO, QUANTILE_HI = 0.1, 0.9  # 80% band (matches the old ±1.28σ width)


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
    print("[valuation] loading data...")
    df = pd.read_excel(DATA)

    df = df.copy()
    df["Area_Applicable"] = df["Area"].notna().astype(int)
    df["Area"] = df["Area"].fillna(0.0)
    df["Land"] = df["Land"].fillna(df["Land"].median())
    df = df.dropna(subset=["Price"] + CAT_COLS)
    for c in CAT_COLS:
        df[c] = df[c].astype(str)

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
    nominal = QUANTILE_HI - QUANTILE_LO
    val = df[df["Year"] == 2025]
    if len(val) > 200:
        Xv = val[CAT_COLS + NUM_COLS]
        yv = np.log1p(val["Price"].astype(float)).values
        pv = model.predict(Xv)
        ql, qh = q_lo.predict(Xv), q_hi.predict(Xv)
        band_log_std = float(np.std(yv - pv))
        r2 = 1 - np.var(yv - pv) / np.var(yv)

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
            "name": name,
        },
        art_path,
    )
    print(f"[valuation] saved -> {art_path}")


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
    train_valuation()
    train_hcr()
    print("done.")
