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


def train_valuation() -> None:
    print("[valuation] loading data…")
    df = pd.read_excel(DATA)

    cat_cols = ["Property Type", "District", "Mukim", "Scheme Name/Area", "Tenure"]
    num_cols = ["Land", "Area", "Area_Applicable"]

    df = df.copy()
    df["Area_Applicable"] = df["Area"].notna().astype(int)
    df["Area"] = df["Area"].fillna(0.0)
    df["Land"] = df["Land"].fillna(df["Land"].median())
    df = df.dropna(subset=["Price"] + cat_cols)
    for c in cat_cols:
        df[c] = df[c].astype(str)

    # Chronological split (matches notebook protocol)
    train = df[df["Year"] < 2025]
    print(f"[valuation] train rows: {len(train):,}")

    X = train[cat_cols + num_cols]
    y = np.log1p(train["Price"].astype(float))

    # OrdinalEncoder -> integer codes for each category (no matrix blow-up,
    # XGBoost's histogram tree finds optimal splits on the ordered codes).
    pre = ColumnTransformer(
        [
            ("cat", OrdinalEncoder(handle_unknown="use_encoded_value",
                                   unknown_value=-1, dtype=np.int32), cat_cols),
            ("num", "passthrough", num_cols),
        ]
    )
    # GPU path. Falls back to CPU hist if the GPU isn't usable.
    try:
        booster = xgb.XGBRegressor(
            n_estimators=800,
            max_depth=10,
            learning_rate=0.05,
            subsample=0.9,
            colsample_bytree=0.8,
            tree_method="hist",
            device="cuda",
            random_state=42,
            verbosity=1,
        )
        device_used = "cuda"
    except Exception:
        booster = xgb.XGBRegressor(
            n_estimators=800,
            max_depth=10,
            learning_rate=0.05,
            tree_method="hist",
            n_jobs=-1,
            random_state=42,
        )
        device_used = "cpu"

    model = Pipeline([("pre", pre), ("xgb", booster)])

    print(f"[valuation] fitting XGBoost ({device_used})…")
    model.fit(X, y)

    # Validation residual std (in log space) -> drives the API's confidence band
    val = df[df["Year"] == 2025]
    band_log_std = 0.20  # sane default
    if len(val) > 50:
        Xv = val[cat_cols + num_cols]
        yv = np.log1p(val["Price"].astype(float))
        pv = model.predict(Xv)
        band_log_std = float(np.std(yv.values - pv))
        r2 = 1 - np.var(yv.values - pv) / np.var(yv.values)
        print(f"[valuation] validation R²={r2:.3f}  log-residual std={band_log_std:.3f}")

    cat_categories = {c: sorted(train[c].dropna().unique().tolist()) for c in cat_cols}

    joblib.dump(
        {
            "model": model,
            "num_cols": num_cols,
            "cat_cols": cat_cols,
            "cat_categories": cat_categories,
            "target_log": True,
            "band_log_std": band_log_std,
            "name": f"XGBoost-{device_used.upper()}",
        },
        ARTIFACTS / "valuation_model.joblib",
    )
    print(f"[valuation] saved -> {ARTIFACTS / 'valuation_model.joblib'}")


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
        print("[hcr] hcr_quarterly.csv missing — skipping HCR model training.")
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
