"""
Fetch mukim-level rental comps via Exa Agent.

Requires EXA_API_KEY in backend/.env. Optional: EXA_EFFORT (default medium),
EXA_TIMEOUT_MS (default 180000).
"""
import os
import statistics
from datetime import datetime, timezone

from exa_py import Exa

from .context import RentContext
from .schema import RentEstimate

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "mukim": {"type": "string"},
        "avg_rent_myr": {"type": ["number", "null"]},
        "min_rent_myr": {"type": ["number", "null"]},
        "max_rent_myr": {"type": ["number", "null"]},
        "median_rent_myr": {"type": ["number", "null"]},
        "listing_count": {"type": "integer", "minimum": 0},
        "sources_used": {"type": "array", "items": {"type": "string"}},
        "confidence": {"type": "string", "enum": ["high", "medium", "low", "none"]},
        "notes": {"type": ["string", "null"]},
        "sample_listings": {
            "type": "array",
            "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {
                    "rent_myr": {"type": "number"},
                    "source": {"type": "string"},
                    "title": {"type": "string"},
                    "url": {"type": "string"},
                },
                "required": ["rent_myr"],
            },
        },
    },
    "required": [
        "mukim",
        "avg_rent_myr",
        "min_rent_myr",
        "max_rent_myr",
        "median_rent_myr",
        "listing_count",
        "sources_used",
        "confidence",
    ],
}


def call_exa(ctx: RentContext) -> RentEstimate:
    api_key = os.environ.get("EXA_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("EXA_API_KEY not set")

    effort = os.environ.get("EXA_EFFORT", "medium").strip() or "medium"
    timeout_ms = int(os.environ.get("EXA_TIMEOUT_MS", "180000"))

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


def _confidence(listing_count: int, sources_used: list[str], stated: str | None) -> str:
    if stated in {"high", "medium", "low", "none"}:
        return stated
    if listing_count >= 15 and len(sources_used) >= 2:
        return "high"
    if listing_count >= 8:
        return "medium"
    if listing_count > 0:
        return "low"
    return "none"


def _map_response(ctx: RentContext, data: dict) -> RentEstimate:
    now = datetime.now(timezone.utc).isoformat()

    listing_count = int(data.get("listing_count") or 0)
    sources_used = [str(s) for s in (data.get("sources_used") or []) if s]
    sample_listings = data.get("sample_listings") or []

    prices = []
    for item in sample_listings:
        if isinstance(item, dict):
            v = _num(item.get("rent_myr"))
            if v is not None and 200 <= v <= 30_000:
                prices.append(v)

    avg = _num(data.get("avg_rent_myr"))
    median = _num(data.get("median_rent_myr"))
    mn = _num(data.get("min_rent_myr"))
    mx = _num(data.get("max_rent_myr"))

    if prices and listing_count > 0:
        prices_sorted = sorted(prices)
        avg = avg or round(sum(prices_sorted) / len(prices_sorted))
        median = median or float(statistics.median(prices_sorted))
        mn = mn or prices_sorted[0]
        mx = mx or prices_sorted[-1]

    if listing_count == 0:
        return _fallback(ctx, data.get("notes") or "Exa found no rental listings")

    return RentEstimate(
        mukim=data.get("mukim") or ctx.mukim,
        avg_rent_myr=avg,
        min_rent_myr=mn,
        max_rent_myr=mx,
        median_rent_myr=median,
        listing_count=listing_count,
        sources_used=sources_used,
        confidence=_confidence(listing_count, sources_used, data.get("confidence")),
        fetched_at=now,
        notes=data.get("notes") or "via Exa Agent",
        sample_listings=sample_listings[:5],
        currency=ctx.currency_code,
    )


def _fallback(ctx: RentContext, notes: str, error: bool = False) -> RentEstimate:
    return RentEstimate(
        mukim=ctx.mukim,
        avg_rent_myr=None,
        min_rent_myr=None,
        max_rent_myr=None,
        median_rent_myr=None,
        listing_count=0,
        sources_used=[],
        confidence="none",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes=notes,
        sample_listings=[],
        currency=ctx.currency_code,
        error=error,
    )
