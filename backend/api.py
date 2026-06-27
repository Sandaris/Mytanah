"""FastAPI backend exposing the FYP2 property API.

Endpoints
---------
GET  /health                 — service + data status
POST /valuation/predict      — live market-value estimate via Exa web search
GET  /valuation/options      — valid dropdown values for categorical inputs
GET  /hcr/current            — latest housing cycle regime probability + label
POST /hcr/predict            — regime probability for a custom macro vector
GET  /data/query             — filtered slice of the cleaned transactions

Valuation is no longer ML-based: instead of loading a trained model, the user
fills in the property fields and `valuation_comps` asks the Exa Agent to search
Malaysian property portals for comparable sale prices (see valuation_comps/).

Artifacts expected in ./artifacts/ (produced by save_models.py):
    hcr_model.joblib         {model, feature_cols, scaler}
    hcr_latest.json          {period, probability, regime, features}
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
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
_LOCATION_HIERARCHY = ROOT.parent / "processed data" / "location_hierarchy.json"
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
    "valuation_meta": None,  # cat_cols/num_cols/cat_categories derived from the data
    "hcr": None,
    "hcr_latest": None,
    "transactions": None,
    "location_hierarchy": None,
}

# Categorical columns the valuation form offers as dropdowns. Previously sourced
# from the trained model's metadata; now derived straight from the transactions
# dataframe since valuation is web-search based (no model artifact).
VAL_CAT_COLS = ["Property Type", "District", "Mukim", "Scheme Name/Area", "Tenure"]
VAL_NUM_COLS = ["Land", "Area"]


def _build_valuation_meta(df: pd.DataFrame | None) -> dict[str, Any] | None:
    """Dropdown category metadata for /valuation/options, built from the dataset.

    Mirrors the shape the old model artifact exposed (cat_cols/num_cols/
    cat_categories) so the options endpoint is unchanged."""
    if df is None:
        return None
    return {
        "cat_cols": VAL_CAT_COLS,
        "num_cols": VAL_NUM_COLS,
        "cat_categories": {
            c: sorted(df[c].dropna().astype(str).unique().tolist())
            for c in VAL_CAT_COLS
            if c in df.columns
        },
        "name": "exa-web",
    }


@app.on_event("startup")
def load_artifacts() -> None:
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

    # Build the dropdown category metadata from the loaded transactions.
    state["valuation_meta"] = _build_valuation_meta(state["transactions"])

    if _LOCATION_HIERARCHY.exists():
        state["location_hierarchy"] = json.loads(_LOCATION_HIERARCHY.read_text(encoding="utf-8"))


@app.get("/health")
def health() -> dict[str, Any]:
    import os

    df = state["transactions"]
    meta = state.get("valuation_meta")
    hcr_latest = state["hcr_latest"]
    return {
        "status": "ok",
        "version": app.version,
        "valuation": {
            "loaded": meta is not None,
            "source": "exa-web",
            "exa_key_set": bool(os.environ.get("EXA_API_KEY", "").strip()),
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
    country: str = Field("MY", description="MY (Malaysia) | SG (Singapore)")
    district: str = Field(..., examples=["Petaling"])
    # Optional below: Singapore uses district (postal district) + scheme (locality)
    # only; mukim/tenure don't apply there.
    mukim: str | None = Field(None, examples=["Damansara"])
    scheme: str | None = Field(None, examples=["Bandar Utama"])
    tenure: str | None = Field(None, examples=["Freehold"])
    land: float = Field(..., gt=0, description="Plot / built-up size in sq m")
    area: float | None = Field(None, ge=0, description="Built-up sq m (optional for high-rise)")
    # Accepted but ignored — kept so the legacy dashboard (which still posts a
    # model selector) keeps working. Valuation is now web-search based.
    model: str | None = Field(None, description="Deprecated; ignored")


class Comparable(BaseModel):
    price: float
    land: float | None
    area: float | None
    district: str
    scheme: str
    transaction_date: str | None


class WebComparable(BaseModel):
    price: float
    title: str | None = None
    url: str | None = None
    source: str | None = None


class ValuationResponse(BaseModel):
    predicted_price: float | None
    price_low: float | None
    price_high: float | None
    price_per_sqft_land: float | None
    price_per_sqft_area: float | None
    price_per_sqft: float | None = None  # web-derived RM / sq ft (true sqft)
    currency: str = "RM"
    model: str  # value source, e.g. "exa-web"
    val_mape: float | None = None  # always null now (no ML hold-out); kept for back-compat
    confidence: str  # "high" | "medium" | "low" | "none"
    listing_count: int = 0
    sources_used: list[str] = Field(default_factory=list)
    notes: str | None = None
    fetched_at: str | None = None
    inputs_used: dict[str, Any]
    comparables: list[Comparable]  # NAPIC transaction comparables (local dataset)
    web_comparables: list[WebComparable] = Field(default_factory=list)  # Exa listings


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
    """Live market-value estimate from the Exa Agent (web search over Malaysian
    property portals). No trained model is involved — the user's fields drive a
    comparable-listing search whose result is cached on disk. NAPIC comparables
    from the local dataset are attached for context."""
    country = (req.country or "MY").upper()
    is_sg = country == "SG"
    if not is_sg:
        req.district = _resolve_district(req.district)  # map map-name -> dataset name

    from valuation_comps import get_valuation

    est = get_valuation(
        property_type=req.property_type,
        country=country,
        district=req.district,
        mukim=req.mukim,
        scheme=req.scheme,
        tenure=req.tenure,
        land=req.land,
        area=req.area,
    )

    price = est.estimated_value_myr
    price_lo = est.low_myr
    price_hi = est.high_myr
    currency = "SGD" if is_sg else "RM"

    inputs_used = {
        "Property Type": req.property_type,
        "Country": country,
        "District": req.district,
        "Mukim": req.mukim,
        "Scheme Name/Area": req.scheme,
        "Tenure": req.tenure,
        "Land": req.land,
        "Area": req.area,
    }

    # NAPIC comparables only exist for Malaysia; Singapore has no local dataset yet.
    napic_comps = [] if is_sg else _find_comparables(req, n=5)

    return ValuationResponse(
        predicted_price=round(price, 2) if price is not None else None,
        price_low=round(price_lo, 2) if price_lo is not None else None,
        price_high=round(price_hi, 2) if price_hi is not None else None,
        price_per_sqft_land=round(price / req.land, 2) if (price and req.land) else None,
        price_per_sqft_area=round(price / req.area, 2) if (price and req.area) else None,
        price_per_sqft=est.price_per_sqft_myr,
        currency=currency,
        model="exa-web",
        val_mape=None,
        confidence=est.confidence,
        listing_count=est.listing_count,
        sources_used=est.sources_used,
        notes=est.notes,
        fetched_at=est.fetched_at,
        inputs_used=inputs_used,
        comparables=napic_comps,
        web_comparables=[
            WebComparable(
                price=c["price_myr"],
                title=c.get("title"),
                url=c.get("url"),
                source=c.get("source"),
            )
            for c in est.comparables
            if c.get("price_myr") is not None
        ],
    )


def _node_items(nodes: list[dict[str, Any]], key: str = "name") -> list[dict[str, Any]]:
    return [{"value": str(n[key]), "count": int(n.get("tx_count", 0))} for n in nodes]


def _norm_district(name: str) -> str:
    """Normalize a district label so the GeoJSON map names and the dataset names
    line up: drops 'W.P.'/'Bahagian'/'Daerah', folds Hulu<->Ulu, Bharu/Baharu->
    Bahru, Highlands->Highland, and removes 'dan'."""
    s = str(name).lower().strip()
    s = re.sub(r"[.\-,]", " ", s)
    s = re.sub(r"\bw\s*p\b", " ", s)
    s = re.sub(r"\bbahagian\b", " ", s)
    s = re.sub(r"\bdaerah kecil\b", " ", s)
    s = re.sub(r"\bdaerah\b", " ", s)
    s = re.sub(r"\bhulu\b", "ulu", s)
    s = re.sub(r"\b(bharu|baharu|bahru)\b", "baru", s)
    s = re.sub(r"\bhighlands\b", "highland", s)
    s = re.sub(r"\bdan\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _district_index() -> dict[str, Any]:
    """Cached {exact names set, normalized->canonical map} from the hierarchy."""
    idx = state.get("_district_index")
    if idx is None:
        tree = state.get("location_hierarchy") or {}
        names = [d["name"] for d in tree.get("districts", [])]
        idx = {"exact": set(names), "norm": {}}
        for n in names:
            idx["norm"].setdefault(_norm_district(n), n)
        state["_district_index"] = idx
    return idx


def _resolve_district(name: str | None) -> str | None:
    """Map a GeoJSON/UI district name to the dataset's district name.

    The map labels some districts differently from the transaction data
    ('W.P. Kuala Lumpur' -> 'Kuala Lumpur', 'Ulu Langat' -> 'Hulu Langat',
    'Kuching' -> 'Bahagian Kuching', ...). Resolve by exact then normalized
    match; unknown names pass through unchanged (graceful empty result)."""
    if not name:
        return name
    idx = _district_index()
    if name in idx["exact"]:
        return name
    return idx["norm"].get(_norm_district(name), name)


def _location_district(name: str | None) -> dict[str, Any] | None:
    tree = state.get("location_hierarchy")
    if not tree or not name:
        return None
    name = _resolve_district(name)
    for district in tree.get("districts", []):
        if district.get("name") == name:
            return district
    return None


def _location_mukim(district_node: dict[str, Any] | None, name: str | None) -> dict[str, Any] | None:
    if not district_node or not name:
        return None
    for mukim_node in district_node.get("mukims", []):
        if mukim_node.get("name") == name:
            return mukim_node
    return None


def _aggregate_options(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counts: dict[str, int] = {}
    for item in items:
        name = str(item.get("name", "")).strip()
        if not name:
            continue
        counts[name] = counts.get(name, 0) + int(item.get("tx_count", 0))
    return [
        {"value": name, "count": count}
        for name, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    ]


def _scheme_matches(
    district_node: dict[str, Any] | None,
    mukim_name: str | None = None,
    scheme_name: str | None = None,
    road_name: str | None = None,
) -> list[dict[str, Any]]:
    if not district_node:
        return []
    matches: list[dict[str, Any]] = []
    for mukim_node in district_node.get("mukims", []):
        if mukim_name and mukim_node.get("name") != mukim_name:
            continue
        for scheme_node in mukim_node.get("schemes", []):
            if scheme_name and scheme_node.get("name") != scheme_name:
                continue
            if road_name:
                roads = [
                    r for r in scheme_node.get("roads", [])
                    if str(r.get("name", "")).strip() == road_name.strip()
                ]
                for road_node in roads:
                    matches.append(
                        {
                            "mukim": mukim_node,
                            "scheme": scheme_node,
                            "road": road_node,
                            "tx_count": int(road_node.get("tx_count", 0)),
                        }
                    )
            else:
                matches.append(
                    {
                        "mukim": mukim_node,
                        "scheme": scheme_node,
                        "road": None,
                        "tx_count": int(scheme_node.get("tx_count", 0)),
                    }
                )
    return sorted(matches, key=lambda m: (-m["tx_count"], m["mukim"]["name"], m["scheme"]["name"]))


@app.get("/valuation/options")
def valuation_options(
    district: str | None = Query(None, description="Filter mukim/scheme to this district"),
    mukim: str | None = Query(None, description="Filter scheme to this mukim"),
    scheme: str | None = Query(None, description="Filter mukim to the parent of this scheme"),
    road: str | None = Query(None, description="Infer the mukim/scheme that owns this road"),
) -> dict[str, Any]:
    """Dropdown payload for the valuation form.

    Returns category lists *with transaction counts* so the UI can sort by
    popularity, plus cascading filters (district → mukim → scheme) and numeric
    ranges for slider inputs. Passing `scheme` lets the UI infer the parent
    mukim when the user already knows the scheme but not the mukim; passing
    `road` lets it infer both the mukim and scheme that own a known road.
    """
    meta = state.get("valuation_meta")
    df = state["transactions"]
    if meta is None:
        raise HTTPException(503, "Valuation model not loaded.")

    district = _resolve_district(district)  # map map-name -> dataset name

    def counted(col: str, frame: pd.DataFrame | None, top: int = 500) -> list[dict[str, Any]]:
        if frame is None or col not in frame.columns:
            vals = meta["cat_categories"].get(col, [])[:top]
            return [{"value": v, "count": None} for v in vals]
        vc = frame[col].value_counts().head(top)
        return [{"value": str(v), "count": int(c)} for v, c in vc.items()]

    district_node = _location_district(district)
    mukim_node = _location_mukim(district_node, mukim)
    road_clean = road.strip() if road else None

    mukim_options: list[dict[str, Any]] | None = None
    scheme_options: list[dict[str, Any]] | None = None

    if district_node:
        if road_clean:
            matches = _scheme_matches(district_node, mukim_name=mukim, scheme_name=scheme, road_name=road_clean)
            mukim_options = _aggregate_options([m["mukim"] | {"tx_count": m["tx_count"]} for m in matches])
            scheme_options = _aggregate_options([m["scheme"] | {"tx_count": m["tx_count"]} for m in matches])
        elif scheme:
            matches = _scheme_matches(district_node, mukim_name=mukim, scheme_name=scheme)
            mukim_options = _aggregate_options([m["mukim"] | {"tx_count": m["tx_count"]} for m in matches])
            scheme_options = _aggregate_options([m["scheme"] | {"tx_count": m["tx_count"]} for m in matches])
        elif mukim_node:
            mukim_options = _node_items([mukim_node])
            scheme_options = _node_items(mukim_node.get("schemes", []))
        else:
            mukim_options = _node_items(district_node.get("mukims", []))
            all_schemes = [
                scheme_node
                for mukim_candidate in district_node.get("mukims", [])
                for scheme_node in mukim_candidate.get("schemes", [])
            ]
            scheme_options = _aggregate_options(all_schemes)
    else:
        scope = df
        if scope is not None and district:
            scope = scope[scope["District"] == district]
        if scope is not None and mukim:
            scope = scope[scope["Mukim"] == mukim]
        if scope is not None and scheme:
            scope = scope[scope["Scheme Name/Area"] == scheme]
        if scope is not None and road_clean and "Road Name" in scope.columns:
            scope = scope[scope["Road Name"].fillna("").astype(str).str.strip() == road_clean]
        mukim_options = counted("Mukim", scope)
        scheme_options = counted("Scheme Name/Area", scope)

    tree = state.get("location_hierarchy")
    district_options = _node_items(tree.get("districts", [])) if tree else counted("District", df)

    payload: dict[str, Any] = {
        "property_type": counted("Property Type", df),
        "tenure": counted("Tenure", df),
        "district": district_options,
        "mukim": mukim_options or [],
        "scheme": scheme_options or [],
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


@app.get("/valuation/roads")
def valuation_roads(
    district: str | None = Query(None, description="Scope roads to this district"),
    mukim: str | None = Query(None, description="Scope roads to this mukim"),
    scheme: str | None = Query(None, description="Scope roads to this scheme/area"),
    limit: int = Query(15000, ge=1, le=30000),
) -> dict[str, Any]:
    """Real road names for the selected scope (district -> mukim -> scheme).

    The road list is the actual `Road Name` column, not a generated mock. Names
    are whitespace-trimmed, de-duplicated and sorted; the count can be large at
    the district level (the UI type-filters client-side), so it's capped by
    `limit`. `total` reports the true unique count before the cap.
    """
    df = state["transactions"]
    district = _resolve_district(district)  # map map-name -> dataset name
    district_node = _location_district(district)
    if district_node:
        matches = _scheme_matches(district_node, mukim_name=mukim, scheme_name=scheme)
        road_counts: dict[str, int] = {}
        for match in matches:
            for road_node in match["scheme"].get("roads", []):
                name = str(road_node.get("name", "")).strip()
                if not name:
                    continue
                road_counts[name] = road_counts.get(name, 0) + int(road_node.get("tx_count", 0))
        roads = [
            name for name, _ in sorted(road_counts.items(), key=lambda kv: (-kv[1], kv[0]))
        ]
        return {"roads": roads[:limit], "total": len(roads)}

    if df is None or "Road Name" not in df.columns:
        return {"roads": [], "total": 0}

    scope = df
    if district:
        scope = scope[scope["District"] == district]
    if mukim:
        scope = scope[scope["Mukim"] == mukim]
    if scheme:
        scope = scope[scope["Scheme Name/Area"] == scheme]

    names = scope["Road Name"].dropna().astype(str).str.strip()
    names = names[names != ""]
    unique_sorted = sorted(names.unique().tolist())
    return {"roads": unique_sorted[:limit], "total": len(unique_sorted)}


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
    mukim: str | None = None,
    scheme: str | None = None,
    road: str | None = None,
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

    district = _resolve_district(district)  # map map-name -> dataset name

    out = df
    if district:
        out = out[out["District"] == district]
    if mukim:
        out = out[out["Mukim"] == mukim]
    if scheme:
        out = out[out["Scheme Name/Area"] == scheme]
    if road:
        out = out[out["Road Name"].fillna("").astype(str).str.strip() == road.strip()]
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
        # Average / median price per property type (over all matched rows,
        # not just the returned page) — drives the "avg price by type" card.
        by_type = (
            out.groupby("Property Type")["Price"]
            .agg(["count", "mean", "median"])
            .reset_index()
            .sort_values("mean", ascending=False)
        )
        stats["by_type"] = [
            {
                "type": str(r["Property Type"]),
                "count": int(r["count"]),
                "mean": float(r["mean"]),
                "median": float(r["median"]),
            }
            for _, r in by_type.iterrows()
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


@app.get("/rent-comps")
def rent_comps_endpoint(
    mukim: str = Query(..., min_length=1),
    scheme: str | None = Query(None, description="Scheme / taman / area name"),
    district: str | None = Query(None),
    state: str | None = Query(None),
    property_type: str | None = Query(None, description="Property type label for comparable rentals"),
    country: str = Query("MY", description="Country code: MY (Malaysia) or SG (Singapore)"),
) -> dict:
    from rent_comps import get_rent_estimate
    try:
        estimate = get_rent_estimate(
            mukim,
            scheme=scheme,
            district=district,
            state=state,
            property_type=property_type,
            country=country,
        )
        return estimate.__dict__
    except Exception as exc:
        raise HTTPException(503, f"Rent comps unavailable: {exc}") from exc


# ---------------------------------------------------------------------------
# Frontend static hosting — serves the MyPropertyIQ design-system prototype
# at /app, so the React UI shares the API's origin (no CORS in the browser).
# ---------------------------------------------------------------------------

FRONTEND_DIR = ROOT.parent / "frontend"
DASHBOARD_DIR = FRONTEND_DIR / "ui_kits" / "dashboard"


class RevalidateStaticFiles(StaticFiles):
    """StaticFiles that forces revalidation (`Cache-Control: no-cache`).

    The dashboard is a set of separate `.jsx` files transpiled in the browser.
    Default StaticFiles sends ETag/Last-Modified but no Cache-Control, so
    browsers cache the scripts *heuristically* and may serve a stale copy of one
    file alongside a fresh copy of another after a deploy. A mismatched mix (e.g.
    a new TransactionMapPage.jsx calling getDistrictRoads while PropertyMapData.jsx
    is still the old cached version) throws a ReferenceError at render time and
    blanks the page. `no-cache` keeps the cache but requires an ETag revalidation
    on every load (cheap 304s), so the files always move forward together.
    """

    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-cache"
        return response


if FRONTEND_DIR.exists():
    app.mount("/app", RevalidateStaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if DASHBOARD_DIR.exists():
    # Serve the dashboard at clean root URLs: /, /index.html, /dashboard.html, etc.
    app.mount("/", RevalidateStaticFiles(directory=str(DASHBOARD_DIR), html=True), name="root")
else:
    @app.get("/")
    def root() -> RedirectResponse:
        return RedirectResponse(url="/docs")
