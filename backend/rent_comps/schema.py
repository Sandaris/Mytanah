from dataclasses import dataclass, field


@dataclass
class RentEstimate:
    mukim: str
    avg_rent_myr: float | None
    min_rent_myr: float | None
    max_rent_myr: float | None
    median_rent_myr: float | None
    listing_count: int
    sources_used: list[str]
    confidence: str   # "high" (>=15, both sites) | "medium" (>=8) | "low" (<8, >0) | "none" (0)
    fetched_at: str   # ISO 8601 UTC
    notes: str | None = None
    sample_listings: list[dict] = field(default_factory=list)
    currency: str = "RM"   # "RM" | "SGD" — the unit the *_myr amounts are in
    # True for transient failures (Exa raised / run didn't complete). Not cached,
    # so a temporary outage doesn't poison this selection for the cache TTL.
    error: bool = False
