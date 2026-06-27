import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv

from .context import RentContext
from .schema import RentEstimate
from .cache import read_cache, write_cache

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def get_rent_estimate(
    mukim: str,
    *,
    scheme: str | None = None,
    district: str | None = None,
    state: str | None = None,
    property_type: str | None = None,
    force_refresh: bool = False,
) -> RentEstimate:
    ctx = RentContext.from_kwargs(
        mukim,
        scheme=scheme,
        district=district,
        state=state,
        property_type=property_type,
    )

    if not force_refresh:
        cached = read_cache(ctx)
        if cached is not None:
            return cached

    if os.environ.get("EXA_API_KEY", "").strip():
        from .exa import call_exa
        estimate = call_exa(ctx)
    elif os.environ.get("HERMES_URL"):
        from .hermes import call_hermes
        estimate = call_hermes(mukim)
    else:
        from .agent import _run_agent
        estimate = asyncio.run(_run_agent(mukim))

    write_cache(ctx, estimate)
    return estimate
