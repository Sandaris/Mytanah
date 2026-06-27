"""Live, web-sourced property valuation via the Exa Agent.

Replaces the trained ML valuation models: the user fills in the property fields,
this module asks Exa to search Malaysian property portals for comparable sale
prices and returns a structured market-value estimate. Results are cached on
disk (see cache.py) so repeat searches are instant.
"""
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

from .context import ValuationContext
from .schema import ValuationEstimate
from .cache import read_cache, write_cache

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


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

    if os.environ.get("EXA_API_KEY", "").strip():
        from .exa import call_exa
        estimate = call_exa(ctx)
    else:
        estimate = _unavailable("EXA_API_KEY not set — live valuation unavailable")

    write_cache(ctx, estimate)
    return estimate
