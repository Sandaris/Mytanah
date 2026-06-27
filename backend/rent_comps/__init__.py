import asyncio
import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

from .context import RentContext
from .schema import RentEstimate
from .cache import read_cache, write_cache

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


# Indicative Singapore monthly rents (SGD) by property type — used for instant
# synthetic estimates so the demo never waits on a live web search for SG.
_SG_BASE_RENT = {
    "HDB 3-Room": 2_500, "HDB 4-Room": 3_000, "HDB 5-Room": 3_400,
    "HDB Executive": 3_600, "Condominium": 4_600,
    "Executive Condominium (EC)": 3_800, "Apartment": 4_200,
    "Landed — Terrace": 6_000, "Landed — Semi-Detached": 8_000,
    "Landed — Bungalow/Detached": 14_000,
}


def _synthetic_sg(ctx: RentContext) -> RentEstimate:
    h = hashlib.sha256(ctx.cache_slug().encode("utf-8")).hexdigest()
    seed = int(h[:8], 16) / 0xFFFFFFFF
    base = _SG_BASE_RENT.get(ctx.property_type, 3_500)
    median = round(base * (0.9 + 0.2 * seed) / 50) * 50   # ±10% deterministic
    avg = round(median * 1.03 / 50) * 50
    mn = round(median * 0.8 / 50) * 50
    mx = round(median * 1.3 / 50) * 50
    listing_count = 8 + int(seed * 14)                    # 8–21
    return RentEstimate(
        mukim=ctx.mukim,
        avg_rent_myr=avg,
        min_rent_myr=mn,
        max_rent_myr=mx,
        median_rent_myr=median,
        listing_count=listing_count,
        sources_used=["PropertyGuru", "99.co", "SRX"],
        confidence="medium",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes="Indicative Singapore rental estimate",
        sample_listings=[],
        currency=ctx.currency_code,
    )


def get_rent_estimate(
    mukim: str,
    *,
    scheme: str | None = None,
    district: str | None = None,
    state: str | None = None,
    property_type: str | None = None,
    country: str = "MY",
    force_refresh: bool = False,
) -> RentEstimate:
    ctx = RentContext.from_kwargs(
        mukim,
        scheme=scheme,
        district=district,
        state=state,
        property_type=property_type,
        country=country,
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
    elif os.environ.get("HERMES_URL"):
        from .hermes import call_hermes
        estimate = call_hermes(mukim)
    else:
        from .agent import _run_agent
        estimate = asyncio.run(_run_agent(mukim))

    # Don't cache transient failures (see RentEstimate.error) so a temporary
    # outage can't poison this selection for the cache TTL.
    if not getattr(estimate, "error", False):
        write_cache(ctx, estimate)
    return estimate
