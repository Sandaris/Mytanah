import json
import re
import dataclasses
from datetime import datetime, timezone, timedelta
from pathlib import Path

from .schema import RentEstimate

CACHE_DIR = Path(__file__).resolve().parent.parent / ".cache" / "rent_comps"

TTL_WITH_RESULTS = timedelta(hours=48)
TTL_EMPTY = timedelta(hours=1)


def _slugify(mukim: str) -> str:
    slug = mukim.lower()
    slug = re.sub(r"[^a-z0-9]+", "_", slug)
    slug = slug.strip("_")
    return slug


def read_cache(mukim: str) -> RentEstimate | None:
    try:
        path = CACHE_DIR / f"{_slugify(mukim)}.json"
        if not path.exists():
            return None
        data = json.loads(path.read_text(encoding="utf-8"))
        fetched_at = datetime.fromisoformat(data["fetched_at"])
        if fetched_at.tzinfo is None:
            fetched_at = fetched_at.replace(tzinfo=timezone.utc)
        listing_count = data.get("listing_count", 0)
        ttl = TTL_WITH_RESULTS if listing_count > 0 else TTL_EMPTY
        if datetime.now(timezone.utc) - fetched_at > ttl:
            return None
        return RentEstimate(
            mukim=data["mukim"],
            avg_rent_myr=data.get("avg_rent_myr"),
            min_rent_myr=data.get("min_rent_myr"),
            max_rent_myr=data.get("max_rent_myr"),
            median_rent_myr=data.get("median_rent_myr"),
            listing_count=listing_count,
            sources_used=data.get("sources_used", []),
            confidence=data.get("confidence", "none"),
            fetched_at=data["fetched_at"],
            notes=data.get("notes"),
            sample_listings=data.get("sample_listings", []),
        )
    except Exception:
        return None


def write_cache(mukim: str, estimate: RentEstimate) -> None:
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        path = CACHE_DIR / f"{_slugify(mukim)}.json"
        path.write_text(
            json.dumps(dataclasses.asdict(estimate), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except Exception:
        pass
