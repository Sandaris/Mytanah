"""
Estimate a property's market value via the Exa Agent (live web search).

Requires EXA_API_KEY in backend/.env. Optional:
    VAL_EXA_EFFORT      (default medium)   — Exa agent reasoning effort
    VAL_EXA_TIMEOUT_MS  (default 180000)   — poll timeout in milliseconds
"""
import os
import statistics
from datetime import datetime, timezone

from exa_py import Exa

from .context import ValuationContext
from .schema import ValuationEstimate

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "estimated_value_myr": {"type": ["number", "null"]},
        "low_myr": {"type": ["number", "null"]},
        "high_myr": {"type": ["number", "null"]},
        "price_per_sqft_myr": {"type": ["number", "null"]},
        "listing_count": {"type": "integer", "minimum": 0},
        "sources_used": {"type": "array", "items": {"type": "string"}},
        "confidence": {"type": "string", "enum": ["high", "medium", "low", "none"]},
        "notes": {"type": ["string", "null"]},
        "comparables": {
            "type": "array",
            "maxItems": 6,
            "items": {
                "type": "object",
                "properties": {
                    "price_myr": {"type": "number"},
                    "title": {"type": "string"},
                    "url": {"type": "string"},
                    "source": {"type": "string"},
                },
                "required": ["price_myr"],
            },
        },
    },
    "required": [
        "estimated_value_myr",
        "low_myr",
        "high_myr",
        "listing_count",
        "sources_used",
        "confidence",
    ],
}

# Plausible Malaysian residential sale-price window (RM). Anything outside this
# is treated as a parsing/units error and dropped.
_MIN_PRICE = 30_000
_MAX_PRICE = 200_000_000


def call_exa(ctx: ValuationContext) -> ValuationEstimate:
    api_key = os.environ.get("EXA_API_KEY", "").strip()
    if not api_key:
        return _fallback(ctx, "EXA_API_KEY not set", error=True)

    effort = os.environ.get("VAL_EXA_EFFORT", "medium").strip() or "medium"
    timeout_ms = int(os.environ.get("VAL_EXA_TIMEOUT_MS", "180000"))

    exa = Exa(api_key)
    query = ctx.exa_query()

    try:
        run = exa.agent.runs.create(
            query=query,
            output_schema=OUTPUT_SCHEMA,
            effort=effort,
        )
        run = exa.agent.runs.poll_until_finished(
            run.id,
            poll_interval=4000,
            timeout_ms=timeout_ms,
        )
    except Exception as e:
        return _fallback(ctx, f"Exa call failed: {e}", error=True)

    if run.status != "completed":
        msg = run.error.message if run.error else f"run status: {run.status}"
        return _fallback(ctx, f"Exa run did not complete: {msg}", error=True)

    data = run.output.structured if run.output else None
    if not isinstance(data, dict):
        return _fallback(ctx, "Exa returned no structured output", error=True)

    return _map_response(ctx, data)


def _num(v) -> float | None:
    if v is None:
        return None
    try:
        return float(str(v).replace(",", "").replace("RM", "").strip())
    except (TypeError, ValueError):
        return None


def _in_range(v: float | None) -> float | None:
    return v if v is not None and _MIN_PRICE <= v <= _MAX_PRICE else None


def _confidence(listing_count: int, sources_used: list[str], stated: str | None) -> str:
    if stated in {"high", "medium", "low", "none"}:
        return stated
    if listing_count >= 8 and len(sources_used) >= 2:
        return "high"
    if listing_count >= 4:
        return "medium"
    if listing_count > 0:
        return "low"
    return "none"


def _map_response(ctx: ValuationContext, data: dict) -> ValuationEstimate:
    now = datetime.now(timezone.utc).isoformat()

    listing_count = int(data.get("listing_count") or 0)
    sources_used = [str(s) for s in (data.get("sources_used") or []) if s]

    comps_in = data.get("comparables") or []
    comps: list[dict] = []
    comp_prices: list[float] = []
    for item in comps_in:
        if not isinstance(item, dict):
            continue
        price = _in_range(_num(item.get("price_myr")))
        if price is None:
            continue
        comp_prices.append(price)
        comps.append({
            "price_myr": price,
            "title": str(item.get("title") or "").strip() or None,
            "url": str(item.get("url") or "").strip() or None,
            "source": str(item.get("source") or "").strip() or None,
        })

    value = _in_range(_num(data.get("estimated_value_myr")))
    low = _in_range(_num(data.get("low_myr")))
    high = _in_range(_num(data.get("high_myr")))
    ppsf = _num(data.get("price_per_sqft_myr"))

    # Backfill anything the agent left blank from the comparables it returned.
    if comp_prices:
        comp_prices.sort()
        value = value or round(statistics.median(comp_prices))
        low = low or comp_prices[0]
        high = high or comp_prices[-1]

    if value is None:
        return _fallback(ctx, data.get("notes") or "Exa found no comparable sale prices")

    # Guarantee a sane, ordered band around the point estimate.
    if low is None or low > value:
        low = round(value * 0.9)
    if high is None or high < value:
        high = round(value * 1.1)

    if ppsf is None and ctx.area_sqm:
        ppsf = round(value / (ctx.area_sqm * 10.7639), 2)

    return ValuationEstimate(
        estimated_value_myr=value,
        low_myr=low,
        high_myr=high,
        price_per_sqft_myr=ppsf,
        listing_count=listing_count,
        sources_used=sources_used,
        confidence=_confidence(listing_count, sources_used, data.get("confidence")),
        fetched_at=now,
        notes=data.get("notes") or "via Exa Agent",
        comparables=comps[:6],
    )


def _fallback(ctx: ValuationContext, notes: str, error: bool = False) -> ValuationEstimate:
    return ValuationEstimate(
        estimated_value_myr=None,
        low_myr=None,
        high_myr=None,
        price_per_sqft_myr=None,
        listing_count=0,
        sources_used=[],
        confidence="none",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes=notes,
        comparables=[],
        error=error,
    )
