"""FastAPI backend exposing the FYP2 property models.

Endpoints
---------
GET  /health                 — service + artifact status
POST /valuation/predict      — price prediction (Random Forest by default)
GET  /valuation/options      — valid dropdown values for categorical inputs
GET  /hcr/current            — latest housing cycle regime probability + label
POST /hcr/predict            — regime probability for a custom macro vector
GET  /data/query             — filtered slice of the cleaned transactions

Artifacts expected in ./artifacts/ (produced by save_models.py):
    valuation_model.joblib   {model, num_cols, cat_cols, cat_categories,
                              target_log: bool}
    hcr_model.joblib         {model, feature_cols, scaler}
    hcr_latest.json          {period, probability, regime, features}
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

ROOT = Path(__file__).parent
ARTIFACTS = ROOT / "artifacts"
# Prefer the Parquet for faster startup; fall back to the original Excel.
_PARQUET = ROOT.parent / "processed data" / "transactions.parquet"
_XLSX = ROOT.parent / "processed data" / "Open Transaction Data Cleaned.xlsx"
DATA_FILE = _PARQUET if _PARQUET.exists() else _XLSX

app = FastAPI(title="FYP2 Property API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

state: dict[str, Any] = {
    "valuation": None,
    "hcr": None,
    "hcr_latest": None,
    "transactions": None,
}


@app.on_event("startup")
def load_artifacts() -> None:
    val_path = ARTIFACTS / "valuation_model.joblib"
    if val_path.exists():
        state["valuation"] = joblib.load(val_path)

    hcr_path = ARTIFACTS / "hcr_model.joblib"
    if hcr_path.exists():
        state["hcr"] = joblib.load(hcr_path)

    hcr_latest = ARTIFACTS / "hcr_latest.json"
    if hcr_latest.exists():
        state["hcr_latest"] = json.loads(hcr_latest.read_text())

    if DATA_FILE.exists():
        if DATA_FILE.suffix == ".parquet":
            state["transactions"] = pd.read_parquet(DATA_FILE)
        else:
            state["transactions"] = pd.read_excel(DATA_FILE)


@app.get("/health")
def health() -> dict[str, Any]:
    df = state["transactions"]
    val = state["valuation"]
    hcr_latest = state["hcr_latest"]
    return {
        "status": "ok",
        "version": app.version,
        "valuation": {
            "loaded": val is not None,
            "model": val.get("name") if val else None,
        },
        "hcr": {
            "model_loaded": state["hcr"] is not None,
            "latest_period": hcr_latest.get("period") if hcr_latest else None,
            "latest_regime": hcr_latest.get("regime") if hcr_latest else None,
        },
        "transactions": {
            "loaded": df is not None,
            "rows": int(len(df)) if df is not None else 0,
            "date_range": [
                df["Transaction Date"].min().isoformat(),
                df["Transaction Date"].max().isoformat(),
            ]
            if df is not None and "Transaction Date" in df.columns
            else None,
        },
    }


class ValuationRequest(BaseModel):
    property_type: str = Field(..., examples=["2 - 2 1/2 Storey Terraced"])
    district: str = Field(..., examples=["Petaling"])
    mukim: str = Field(..., examples=["Damansara"])
    scheme: str = Field(..., examples=["Bandar Utama"])
    tenure: str = Field(..., examples=["Freehold"])
    land: float = Field(..., gt=0, description="Plot size in sqft")
    area: float | None = Field(None, ge=0, description="Built-up sqft (optional for high-rise)")


class Comparable(BaseModel):
    price: float
    land: float | None
    area: float | None
    district: str
    scheme: str
    transaction_date: str | None


class ValuationResponse(BaseModel):
    predicted_price: float
    price_low: float
    price_high: float
    price_per_sqft_land: float | None
    price_per_sqft_area: float | None
    currency: str = "RM"
    model: str
    confidence: str  # "high" | "medium" | "low"
    inputs_used: dict[str, Any]
    comparables: list[Comparable]


def _predict_with_band(art, X: pd.DataFrame) -> tuple[float, float, float, float]:
    """Returns (y_mean, y_lo, y_hi, rel_spread) in the model's native space.

    Tries RF per-tree predictions for a true empirical 10/90 band; falls back
    to ±1.28σ around the point using the saved validation residual std.
    """
    pipe = art["model"]
    steps = pipe.named_steps
    if "rf" in steps:
        pre, rf = steps["pre"], steps["rf"]
        Xt = pre.transform(X)
        tree_preds = np.array([t.predict(Xt)[0] for t in rf.estimators_])
        y_mean = float(tree_preds.mean())
        return (
            y_mean,
            float(np.percentile(tree_preds, 10)),
            float(np.percentile(tree_preds, 90)),
            float(tree_preds.std() / max(abs(y_mean), 1e-6)),
        )
    y_mean = float(pipe.predict(X)[0])
    sigma = float(art.get("band_log_std", 0.2))
    return y_mean, y_mean - 1.28 * sigma, y_mean + 1.28 * sigma, sigma


def _find_comparables(req: ValuationRequest, n: int = 5) -> list[Comparable]:
    df = state["transactions"]
    if df is None:
        return []
    same = df[
        (df["Property Type"] == req.property_type)
        & (df["District"] == req.district)
        & (df["Tenure"] == req.tenure)
    ]
    if len(same) == 0:
        same = df[(df["Property Type"] == req.property_type) & (df["District"] == req.district)]
    if len(same) == 0:
        return []
    # rank by land similarity (cheap proxy)
    same = same.assign(_d=(same["Land"] - req.land).abs()).nsmallest(n, "_d")
    out: list[Comparable] = []
    for _, r in same.iterrows():
        out.append(
            Comparable(
                price=float(r["Price"]),
                land=None if pd.isna(r["Land"]) else float(r["Land"]),
                area=None if pd.isna(r["Area"]) else float(r["Area"]),
                district=str(r["District"]),
                scheme=str(r["Scheme Name/Area"]),
                transaction_date=r["Transaction Date"].isoformat()
                if isinstance(r["Transaction Date"], pd.Timestamp)
                else None,
            )
        )
    return out


@app.post("/valuation/predict", response_model=ValuationResponse)
def valuation_predict(req: ValuationRequest) -> ValuationResponse:
    art = state["valuation"]
    if art is None:
        raise HTTPException(503, "Valuation model not loaded. Run save_models.py first.")

    row = {
        "Property Type": req.property_type,
        "District": req.district,
        "Mukim": req.mukim,
        "Scheme Name/Area": req.scheme,
        "Tenure": req.tenure,
        "Land": req.land,
        "Area": req.area if req.area is not None else 0.0,
        "Area_Applicable": 1 if req.area is not None else 0,
    }
    X = pd.DataFrame([row])

    unseen: list[str] = []
    for col in art["cat_cols"]:
        known = art["cat_categories"].get(col, [])
        if X.at[0, col] not in known and known:
            unseen.append(col)
            X.at[0, col] = known[0]

    y_mean, y_lo, y_hi, rel_spread = _predict_with_band(art, X)

    if art.get("target_log"):
        price = float(np.expm1(y_mean))
        price_lo = float(np.expm1(y_lo))
        price_hi = float(np.expm1(y_hi))
    else:
        price, price_lo, price_hi = y_mean, y_lo, y_hi

    if unseen:
        confidence = "low"
    elif rel_spread < 0.05:
        confidence = "high"
    elif rel_spread < 0.12:
        confidence = "medium"
    else:
        confidence = "low"

    return ValuationResponse(
        predicted_price=round(price, 2),
        price_low=round(price_lo, 2),
        price_high=round(price_hi, 2),
        price_per_sqft_land=round(price / req.land, 2) if req.land else None,
        price_per_sqft_area=round(price / req.area, 2) if req.area else None,
        model=art.get("name", "valuation"),
        confidence=confidence,
        inputs_used={**row, "unseen_categories": unseen},
        comparables=_find_comparables(req, n=5),
    )


@app.get("/valuation/options")
def valuation_options(
    district: str | None = Query(None, description="Filter mukim/scheme to this district"),
    mukim: str | None = Query(None, description="Filter scheme to this mukim"),
    scheme: str | None = Query(None, description="Filter mukim to the parent of this scheme"),
) -> dict[str, Any]:
    """Dropdown payload for the valuation form.

    Returns category lists *with transaction counts* so the UI can sort by
    popularity, plus cascading filters (district → mukim → scheme) and numeric
    ranges for slider inputs. Passing `scheme` lets the UI infer the parent
    mukim when the user already knows the scheme but not the mukim.
    """
    art = state["valuation"]
    df = state["transactions"]
    if art is None:
        raise HTTPException(503, "Valuation model not loaded.")

    def counted(col: str, frame: pd.DataFrame | None, top: int = 500) -> list[dict[str, Any]]:
        if frame is None or col not in frame.columns:
            vals = art["cat_categories"].get(col, [])[:top]
            return [{"value": v, "count": None} for v in vals]
        vc = frame[col].value_counts().head(top)
        return [{"value": str(v), "count": int(c)} for v, c in vc.items()]

    scope = df
    if scope is not None and district:
        scope = scope[scope["District"] == district]
    if scope is not None and mukim:
        scope = scope[scope["Mukim"] == mukim]
    if scope is not None and scheme:
        scope = scope[scope["Scheme Name/Area"] == scheme]

    payload: dict[str, Any] = {
        "property_type": counted("Property Type", df),
        "tenure": counted("Tenure", df),
        "district": counted("District", df),
        "mukim": counted("Mukim", scope),
        "scheme": counted("Scheme Name/Area", scope),
    }

    if df is not None:
        payload["ranges"] = {
            "land": {
                "min": float(df["Land"].min()),
                "median": float(df["Land"].median()),
                "max": float(df["Land"].quantile(0.99)),  # cap at p99 to skip outliers
            },
            "area": {
                "min": float(df["Area"].min()),
                "median": float(df["Area"].median()),
                "max": float(df["Area"].quantile(0.99)),
            },
        }
    return payload


class HCRRequest(BaseModel):
    sales_vol_yoy: float
    unsold_co: float
    unsold_uc: float
    planned_supply_yoy: float
    impaired_ratio: float
    credit_gdp_yoy: float


FEATURE_LABELS = {
    "sales_vol_yoy": "Transaction volume (YoY %)",
    "unsold_co": "Completed unsold units",
    "unsold_uc": "Under-construction unsold units",
    "planned_supply_yoy": "Planned supply (YoY %)",
    "impaired_ratio": "Property loan impaired ratio",
    "credit_gdp_yoy": "Credit-to-GDP growth (pp)",
}


class FeatureContribution(BaseModel):
    name: str
    label: str
    raw_value: float
    standardized_value: float
    coefficient: float
    contribution: float  # signed log-odds contribution
    direction: str  # "up" | "down"


class HCRResponse(BaseModel):
    probability: float
    regime: str  # "high" or "low"
    confidence: str  # "high" | "medium" | "low" — based on distance from 0.5
    interpretation: str
    contributions: list[FeatureContribution]


def _hcr_explain(features: dict[str, float]) -> HCRResponse:
    art = state["hcr"]
    cols = art["feature_cols"]
    raw = np.array([[features[c] for c in cols]], dtype=float)
    std = art["scaler"].transform(raw)[0]
    coef = art["model"].coef_[0]
    intercept = float(art["model"].intercept_[0])
    contribs = std * coef
    logit = float(contribs.sum() + intercept)
    p = 1.0 / (1.0 + np.exp(-logit))

    regime = "high" if p >= 0.5 else "low"
    margin = abs(p - 0.5)
    confidence = "high" if margin > 0.3 else "medium" if margin > 0.15 else "low"
    top = sorted(zip(cols, contribs), key=lambda kv: abs(kv[1]), reverse=True)[:3]
    drivers = ", ".join(FEATURE_LABELS.get(c, c) for c, _ in top)
    interpretation = (
        f"Model estimates a {p*100:.1f}% probability of an UP-trend housing regime "
        f"({regime.upper()}). Top drivers: {drivers}."
    )

    return HCRResponse(
        probability=round(float(p), 4),
        regime=regime,
        confidence=confidence,
        interpretation=interpretation,
        contributions=[
            FeatureContribution(
                name=c,
                label=FEATURE_LABELS.get(c, c),
                raw_value=float(features[c]),
                standardized_value=float(std[i]),
                coefficient=float(coef[i]),
                contribution=float(contribs[i]),
                direction="up" if contribs[i] >= 0 else "down",
            )
            for i, c in enumerate(cols)
        ],
    )


@app.get("/hcr/current")
def hcr_current() -> dict[str, Any]:
    latest = state["hcr_latest"]
    if latest is None:
        raise HTTPException(503, "HCR latest snapshot not loaded.")
    out: dict[str, Any] = {
        "period": latest.get("period"),
        "probability": latest.get("probability"),
        "regime": latest.get("regime"),
        "features": latest.get("features", {}),
    }
    # If the live model is loaded, attach contributions & interpretation
    if state["hcr"] is not None and isinstance(latest.get("features"), dict):
        try:
            explained = _hcr_explain(latest["features"])
            out["confidence"] = explained.confidence
            out["interpretation"] = explained.interpretation
            out["contributions"] = [c.model_dump() for c in explained.contributions]
        except Exception:
            pass
    return out


@app.post("/hcr/predict", response_model=HCRResponse)
def hcr_predict(req: HCRRequest) -> HCRResponse:
    if state["hcr"] is None:
        raise HTTPException(503, "HCR model not loaded.")
    return _hcr_explain({c: getattr(req, c) for c in state["hcr"]["feature_cols"]})


SORTABLE = {"Price", "Land", "Area", "Transaction Date", "Year"}


@app.get("/data/query")
def data_query(
    district: str | None = None,
    property_type: str | None = None,
    tenure: str | None = None,
    year: int | None = None,
    min_price: int | None = None,
    max_price: int | None = None,
    sort_by: str = Query("Transaction Date", description=f"One of {sorted(SORTABLE)}"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    df = state["transactions"]
    if df is None:
        raise HTTPException(503, "Transaction dataset not loaded.")
    if sort_by not in SORTABLE:
        raise HTTPException(400, f"sort_by must be one of {sorted(SORTABLE)}")

    out = df
    if district:
        out = out[out["District"].str.contains(district, case=False, na=False)]
    if property_type:
        out = out[out["Property Type"] == property_type]
    if tenure:
        out = out[out["Tenure"] == tenure]
    if year:
        out = out[out["Year"] == year]
    if min_price is not None:
        out = out[out["Price"] >= min_price]
    if max_price is not None:
        out = out[out["Price"] <= max_price]

    total = int(len(out))

    # Aggregate stats — what the frontend needs to render KPI cards / charts
    stats: dict[str, Any] = {}
    if total > 0:
        prices = out["Price"].astype(float)
        stats["price"] = {
            "count": total,
            "mean": float(prices.mean()),
            "median": float(prices.median()),
            "min": float(prices.min()),
            "max": float(prices.max()),
            "p25": float(prices.quantile(0.25)),
            "p75": float(prices.quantile(0.75)),
        }
        # Yearly trend for line charts
        yearly = (
            out.groupby("Year")["Price"]
            .agg(["count", "mean", "median"])
            .reset_index()
            .sort_values("Year")
        )
        stats["yearly"] = [
            {
                "year": int(r["Year"]),
                "count": int(r["count"]),
                "mean": float(r["mean"]),
                "median": float(r["median"]),
            }
            for _, r in yearly.iterrows()
        ]
        # Price histogram (10 bins on log scale → readable buckets)
        log_prices = np.log10(prices.clip(lower=1))
        counts, edges = np.histogram(log_prices, bins=10)
        stats["histogram"] = [
            {
                "range": [round(10 ** edges[i]), round(10 ** edges[i + 1])],
                "count": int(counts[i]),
            }
            for i in range(len(counts))
        ]

    out = out.sort_values(sort_by, ascending=(order == "asc"), na_position="last")
    page = out.iloc[offset : offset + limit]

    rows = page.to_dict(orient="records")
    for r in rows:
        for k, v in r.items():
            if isinstance(v, pd.Timestamp):
                r[k] = v.isoformat()
            elif isinstance(v, float) and np.isnan(v):
                r[k] = None

    return {
        "total_matched": total,
        "returned": len(rows),
        "offset": offset,
        "limit": limit,
        "sort_by": sort_by,
        "order": order,
        "stats": stats,
        "rows": rows,
    }


# ---------------------------------------------------------------------------
# Frontend static hosting — serves the MyPropertyIQ design-system prototype
# at /app, so the React UI shares the API's origin (no CORS in the browser).
# ---------------------------------------------------------------------------

FRONTEND_DIR = ROOT.parent / "frontend"
DASHBOARD_DIR = FRONTEND_DIR / "ui_kits" / "dashboard"

if FRONTEND_DIR.exists():
    app.mount("/app", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


@app.get("/")
def root() -> RedirectResponse:
    if DASHBOARD_DIR.exists():
        return RedirectResponse(url="/app/ui_kits/dashboard/index.html")
    return RedirectResponse(url="/docs")
