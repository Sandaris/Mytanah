"""
Call the hermes desktop agent (C:\\Users\\harzi\\rent_scraper_api.py on the home PC)
via its ngrok/Cloudflare tunnel URL and map the response to a RentEstimate.

The hermes endpoint: POST <HERMES_URL>/api/scrape-rent
Body: {"query": "<mukim>", "limit": 10}
"""
import os
import json
import statistics
from datetime import datetime, timezone

import httpx

from .schema import RentEstimate


def call_hermes(mukim: str, timeout: float = 120.0) -> RentEstimate:
    base_url = os.environ.get("HERMES_URL", "").rstrip("/")
    if not base_url:
        raise RuntimeError("HERMES_URL not set")

    try:
        resp = httpx.post(
            f"{base_url}/api/scrape-rent",
            json={"query": mukim, "limit": 10},
            timeout=timeout,
        )
        resp.raise_for_status()
        data = resp.json()
    except httpx.TimeoutException:
        return _fallback(mukim, "Hermes agent timed out")
    except Exception as e:
        return _fallback(mukim, f"Hermes call failed: {e}")

    return _map_response(mukim, data)


def _map_response(mukim: str, data: dict) -> RentEstimate:
    """Map hermes response to RentEstimate — handles a few likely schemas."""
    try:
        now = datetime.now(timezone.utc).isoformat()

        # hermes may return a top-level list or a dict with a listings/results key
        listings = (
            data if isinstance(data, list)
            else data.get("listings")
            or data.get("results")
            or data.get("data")
            or []
        )

        # extract numeric rent values from each listing
        prices = []
        sources = set()
        for item in listings:
            if not isinstance(item, dict):
                continue
            rent = (
                item.get("rent_myr")
                or item.get("price")
                or item.get("monthly_rent")
                or item.get("rent")
                or item.get("amount")
            )
            try:
                v = float(str(rent).replace(",", "").replace("RM", "").strip())
                if 200 <= v <= 30_000:
                    prices.append(v)
            except (TypeError, ValueError):
                pass

            src = item.get("source") or item.get("platform") or item.get("site")
            if src:
                sources.add(str(src).lower())

        # hermes may also supply a pre-computed summary block
        summary = data.get("summary") or data.get("stats") or {}
        if isinstance(summary, dict):
            def _num(key):
                v = summary.get(key)
                try:
                    return float(v) if v is not None else None
                except (TypeError, ValueError):
                    return None

            avg    = _num("avg_rent") or _num("average") or _num("avg")
            median = _num("median_rent") or _num("median")
            mn     = _num("min_rent") or _num("min")
            mx     = _num("max_rent") or _num("max")
            count  = summary.get("count") or summary.get("total") or len(prices)

            # if hermes gave us prices too, recompute from raw data when possible
            if prices:
                prices_sorted = sorted(prices)
                avg    = avg    or round(sum(prices_sorted) / len(prices_sorted))
                median = median or statistics.median(prices_sorted)
                mn     = mn     or prices_sorted[0]
                mx     = mx     or prices_sorted[-1]
                count  = max(int(count or 0), len(prices_sorted))
        else:
            if not prices:
                return _fallback(mukim, f"No prices found in hermes response: {json.dumps(data)[:300]}")
            prices_sorted = sorted(prices)
            avg    = round(sum(prices_sorted) / len(prices_sorted))
            median = statistics.median(prices_sorted)
            mn     = prices_sorted[0]
            mx     = prices_sorted[-1]
            count  = len(prices_sorted)

        if not sources:
            sources = {"mudah.my"}

        n = int(count or 0)
        if n == 0:
            return _fallback(mukim, "Hermes returned zero listings")

        if n >= 15 and len(sources) >= 2:
            confidence = "high"
        elif n >= 8:
            confidence = "medium"
        elif n > 0:
            confidence = "low"
        else:
            confidence = "none"

        return RentEstimate(
            mukim=mukim,
            avg_rent_myr=float(avg) if avg is not None else None,
            min_rent_myr=float(mn)  if mn  is not None else None,
            max_rent_myr=float(mx)  if mx  is not None else None,
            median_rent_myr=float(median) if median is not None else None,
            listing_count=n,
            sources_used=sorted(sources),
            confidence=confidence,
            fetched_at=now,
            notes=data.get("notes") or data.get("note") or "via hermes desktop agent",
            sample_listings=[{"rent_myr": p} for p in sorted(prices)[:5]],
        )

    except Exception as e:
        return _fallback(mukim, f"Failed to parse hermes response: {e} | raw: {json.dumps(data)[:300]}")


def _fallback(mukim: str, notes: str) -> RentEstimate:
    return RentEstimate(
        mukim=mukim,
        avg_rent_myr=None, min_rent_myr=None,
        max_rent_myr=None, median_rent_myr=None,
        listing_count=0, sources_used=[],
        confidence="none",
        fetched_at=datetime.now(timezone.utc).isoformat(),
        notes=notes,
        sample_listings=[],
    )
