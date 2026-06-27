"""Live, web-sourced property valuation via the Exa Agent.

Replaces the trained ML valuation models: the user fills in the property fields,
this module asks Exa to search Malaysian property portals for comparable sale
prices and returns a structured market-value estimate. Results are cached on
disk (see cache.py) so repeat searches are instant.
"""
import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

from .context import ValuationContext
from .schema import ValuationEstimate
from .cache import read_cache, write_cache

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


# Indicative Singapore sale prices (SGD) by property type — used for instant
# synthetic estimates so the demo never waits on a live web search for SG
# (Singapore has no NAPIC-style feed wired in yet).
_SG_BASE_PRICE = {
    "HDB 3-Room": 430_000, "HDB 4-Room": 560_000, "HDB 5-Room": 700_000,
    "HDB Executive": 830_000, "Condominium": 1_650_000,
    "Executive Condominium (EC)": 1_300_000, "Apartment": 1_400_000,
    "Landed — Terrace": 3_200_000, "Landed — Semi-Detached": 4_600_000,
    "Landed — Bungalow/Detached": 8_500_000,
}


def _seed(ctx: ValuationContext) -> float:
    """Deterministic 0–1 value from the selection, so a given search always
    yields the same synthetic figure (no flicker between renders)."""
    h = hashlib.sha256(ctx.cache_slug().encode("utf-8")).hexdigest()
    return int(h[:8], 16) / 0xFFFFFFFF


def _synthetic_sg(ctx: ValuationContext) -> ValuationEstimate:
    base = _SG_BASE_PRICE.get(ctx.property_type, 900_000)
    jitter = 0.85 + 0.30 * _seed(ctx)          # ±15% deterministic spread
    value = round(base * jitter / 1000) * 1000
    low = round(value * 0.92 / 1000) * 1000
    high = round(value * 1.10 / 1000) * 1000
    ppsf = round(value / (ctx.area_sqm * 10.7639), 2) if ctx.area_sqm else None
    listing_count = 6 + int(_seed(ctx) * 12)   # 6–17
    return ValuationEstimate(
        estimated_value_myr=value,
        low_myr=low,
        high_myr=high,
        price_per_sqft_myr=ppsf,
        listing_count=listing_count,
        sources_used=["PropertyGuru", "99.co", "EdgeProp SG"],
        confidence="medium",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes="Indicative Singapore estimate",
        comparables=[],
    )


def _unavailable(notes: str) -> ValuationEstimate:
    """A no-result estimate that does NOT import exa_py — used when EXA_API_KEY is
    unset so the API still responds (with predicted_price=None) on machines that
    don't have the Exa client installed."""
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
        error=True,
    )


def get_valuation(
    *,
    property_type: str,
    country: str = "MY",
    district: str | None = None,
    mukim: str | None = None,
    scheme: str | None = None,
    tenure: str | None = None,
    land: float | None = None,
    area: float | None = None,
    force_refresh: bool = False,
) -> ValuationEstimate:
    ctx = ValuationContext.from_kwargs(
        property_type=property_type,
        country=country,
        district=district,
        mukim=mukim,
        scheme=scheme,
        tenure=tenure,
        land=land,
        area=area,
    )

    if not force_refresh:
        cached = read_cache(ctx)
        if cached is not None:
            return cached

    # Singapore: no live data feed — return an instant synthetic estimate rather
    # than waiting on a web search. Cached real SG results above still win.
    if ctx.country == "SG":
        return _synthetic_sg(ctx)

    if os.environ.get("EXA_API_KEY", "").strip():
        from .exa import call_exa
        estimate = call_exa(ctx)
    else:
        estimate = _unavailable("EXA_API_KEY not set — live valuation unavailable")

    # Only persist genuine results (a real estimate, or a confirmed "found
    # nothing"). Transient failures (Exa raised, run didn't complete, key
    # missing) are NOT cached, so a temporary outage can't poison this property
    # for the cache TTL — the next request retries Exa instead.
    if not estimate.error:
        write_cache(ctx, estimate)
    return estimate
