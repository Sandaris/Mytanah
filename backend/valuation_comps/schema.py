from dataclasses import dataclass, field


@dataclass
class ValuationEstimate:
    """A web-sourced market-value estimate for a single property.

    Produced by the Exa agent (live listing/transaction search) instead of a
    trained ML model. All monetary values are in Malaysian Ringgit (RM).
    """

    estimated_value_myr: float | None
    low_myr: float | None
    high_myr: float | None
    price_per_sqft_myr: float | None
    listing_count: int
    sources_used: list[str]
    confidence: str   # "high" | "medium" | "low" | "none"
    fetched_at: str   # ISO 8601 UTC
    notes: str | None = None
    comparables: list[dict] = field(default_factory=list)
    # True when this is a transient failure (e.g. the Exa call raised or the run
    # didn't complete) rather than a genuine "found nothing". Callers should NOT
    # cache these, so a temporary outage doesn't poison results for the TTL.
    error: bool = False
