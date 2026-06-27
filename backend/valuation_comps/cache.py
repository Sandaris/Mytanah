import json
import dataclasses
from datetime import datetime, timezone, timedelta
from pathlib import Path

from .context import ValuationContext
from .schema import ValuationEstimate

CACHE_DIR = Path(__file__).resolve().parent.parent / ".cache" / "valuation_comps"

TTL_WITH_RESULTS = timedelta(hours=48)
TTL_EMPTY = timedelta(hours=1)


def read_cache(ctx: ValuationContext) -> ValuationEstimate | None:
    try:
        path = CACHE_DIR / f"{ctx.cache_slug()}.json"
        if not path.exists():
            return None
        data = json.loads(path.read_text(encoding="utf-8"))
        fetched_at = datetime.fromisoformat(data["fetched_at"])
        if fetched_at.tzinfo is None:
            fetched_at = fetched_at.replace(tzinfo=timezone.utc)
        has_value = data.get("estimated_value_myr") is not None
        # Skip entries explicitly marked as errors.
        if data.get("error", False):
            return None
        # Legacy entries (written before the error field existed) that have no
        # value are likely cached transient failures — force a fresh fetch.
        if "error" not in data and not has_value:
            return None
        ttl = TTL_WITH_RESULTS if has_value else TTL_EMPTY
        if datetime.now(timezone.utc) - fetched_at > ttl:
            return None
        return ValuationEstimate(
            estimated_value_myr=data.get("estimated_value_myr"),
            low_myr=data.get("low_myr"),
            high_myr=data.get("high_myr"),
            price_per_sqft_myr=data.get("price_per_sqft_myr"),
            listing_count=data.get("listing_count", 0),
            sources_used=data.get("sources_used", []),
            confidence=data.get("confidence", "none"),
            fetched_at=data["fetched_at"],
            notes=data.get("notes"),
            comparables=data.get("comparables", []),
        )
    except Exception:
        return None


def write_cache(ctx: ValuationContext, estimate: ValuationEstimate) -> None:
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        path = CACHE_DIR / f"{ctx.cache_slug()}.json"
        path.write_text(
            json.dumps(dataclasses.asdict(estimate), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except Exception:
        pass
