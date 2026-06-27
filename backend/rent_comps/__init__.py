import asyncio
import os
from .schema import RentEstimate
from .cache import read_cache, write_cache


def get_rent_estimate(mukim: str, *, force_refresh: bool = False) -> RentEstimate:
    if not force_refresh:
        cached = read_cache(mukim)
        if cached is not None:
            return cached

    if os.environ.get("HERMES_URL"):
        from .hermes import call_hermes
        estimate = call_hermes(mukim)
    else:
        from .agent import _run_agent
        estimate = asyncio.run(_run_agent(mukim))

    write_cache(mukim, estimate)
    return estimate
