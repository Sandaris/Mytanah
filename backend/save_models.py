"""Train the HCR (housing-cycle regime) logit and dump the artifacts the API loads.

Property valuation is no longer ML-based — it is web-search driven via the Exa
Agent (see backend/valuation_comps/), so this script only builds the HCR model.

Run once before starting the API:
    python backend/save_models.py        # builds HCR from hcr_quarterly.csv

Artifacts written to ./artifacts/:
    hcr_model.joblib   {model, scaler, feature_cols}
    hcr_latest.json    {period, probability, regime, features}
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).parent
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)


def train_hcr() -> None:
    """Fit the HCR logit from the assembled quarterly macro panel.

    The real series (mean house price, unsold units, impaired loan ratio,
    credit-to-GDP, planned supply) live across multiple Data Understanding
    notebooks. Export them as a single quarterly DataFrame with these columns
    and rerun this function:
        sales_vol_yoy, unsold_co, unsold_uc, planned_supply_yoy,
        impaired_ratio, credit_gdp_yoy, cycle_pos, period
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

    targets = sys.argv[1:] or ["hcr"]
    if "hcr" in targets:
        train_hcr()
    print("done.")
