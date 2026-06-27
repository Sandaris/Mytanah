from dataclasses import dataclass
import re


# Per-country rental settings: display name, currency, and the portals the Exa
# agent should search. Defaults to Malaysia for any unknown code. Mirrors
# valuation_comps.context.COUNTRY_SETTINGS so both flows stay consistent.
COUNTRY_SETTINGS = {
    "MY": {
        "name": "Malaysia",
        "currency": "Malaysian Ringgit (RM)",
        "currency_code": "RM",
        "portals": "iProperty, PropertyGuru, EdgeProp, Mudah",
    },
    "SG": {
        "name": "Singapore",
        "currency": "Singapore Dollars (SGD, S$)",
        "currency_code": "SGD",
        "portals": "PropertyGuru, 99.co, EdgeProp SG, SRX",
    },
}


@dataclass(frozen=True)
class RentContext:
    mukim: str
    scheme: str | None = None
    district: str | None = None
    state: str | None = None
    property_type: str | None = None
    country: str = "MY"

    @classmethod
    def from_kwargs(
        cls,
        mukim: str,
        *,
        scheme: str | None = None,
        district: str | None = None,
        state: str | None = None,
        property_type: str | None = None,
        country: str = "MY",
    ) -> "RentContext":
        def clean(v: str | None) -> str | None:
            if v is None:
                return None
            s = str(v).strip()
            return s or None

        code = (clean(country) or "MY").upper()
        if code not in COUNTRY_SETTINGS:
            code = "MY"

        return cls(
            mukim=clean(mukim) or mukim.strip(),
            scheme=clean(scheme),
            district=clean(district),
            state=clean(state),
            property_type=clean(property_type),
            country=code,
        )

    @property
    def settings(self) -> dict:
        return COUNTRY_SETTINGS.get(self.country, COUNTRY_SETTINGS["MY"])

    @property
    def currency_code(self) -> str:
        return self.settings["currency_code"]

    def cache_slug(self) -> str:
        parts = [self.country, self.mukim, self.scheme, self.district, self.state, self.property_type]
        raw = "|".join(p for p in parts if p)
        slug = raw.lower()
        slug = re.sub(r"[^a-z0-9]+", "_", slug)
        return slug.strip("_") or "unknown"

    def location_label(self) -> str:
        # Dedupe repeated bits (e.g. SG passes the postal district as both the
        # mukim anchor and the district) so the label reads cleanly.
        seen: list[str] = []
        for b in (self.scheme, self.mukim, self.district, self.state):
            if b and b not in seen:
                seen.append(b)
        return ", ".join(seen)

    def exa_query(self) -> str:
        s = self.settings
        location = self.location_label()
        lines = [
            f"Find current residential rental market prices in {s['name']} for: {location}.",
        ]
        if self.property_type:
            lines.append(
                f'Focus on comparable whole-unit rentals matching property type "{self.property_type}". '
                "Exclude room-only, bedspace, and partition rentals."
            )
        else:
            lines.append(
                "Focus on whole-unit residential rentals. "
                "Exclude room-only, bedspace, and partition rentals."
            )
        lines.append(
            f"Search live {s['name']} property portals ({s['portals']}, etc.). "
            f"All rents must be monthly amounts in {s['currency']}. "
            "Return aggregate monthly rent statistics (min, max, average, median) from live listing data."
        )
        return " ".join(lines)
