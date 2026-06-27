from dataclasses import dataclass
import re

SQM_TO_SQFT = 10.7639


# Per-country valuation settings: display name, currency, and the portals the
# Exa agent should search. Defaults to Malaysia for any unknown code.
COUNTRY_SETTINGS = {
    "MY": {
        "name": "Malaysia",
        "currency": "Malaysian Ringgit (RM)",
        "currency_code": "RM",
        "portals": "iProperty, PropertyGuru, EdgeProp, Brickz",
    },
    "SG": {
        "name": "Singapore",
        "currency": "Singapore Dollars (SGD, S$)",
        "currency_code": "SGD",
        "portals": "PropertyGuru, 99.co, EdgeProp SG, SRX, and URA caveat data",
    },
}


@dataclass(frozen=True)
class ValuationContext:
    """The property the user described in the valuation form.

    Sizes arrive from the frontend in square metres (the NAPIC dataset and the
    dashboard both use m²). Property listings quote area in square feet, so
    `exa_query` sends both units to maximise comparable matches. `country`
    ("MY" | "SG") switches the currency, portals, and location label.
    """

    property_type: str
    country: str = "MY"
    district: str | None = None
    mukim: str | None = None
    scheme: str | None = None
    tenure: str | None = None
    land_sqm: float | None = None
    area_sqm: float | None = None

    @classmethod
    def from_kwargs(
        cls,
        *,
        property_type: str,
        country: str = "MY",
        district: str | None = None,
        mukim: str | None = None,
        scheme: str | None = None,
        tenure: str | None = None,
        land: float | None = None,
        area: float | None = None,
    ) -> "ValuationContext":
        def clean(v: str | None) -> str | None:
            if v is None:
                return None
            s = str(v).strip()
            return s or None

        def pos(v: float | None) -> float | None:
            try:
                f = float(v)
            except (TypeError, ValueError):
                return None
            return f if f > 0 else None

        code = (clean(country) or "MY").upper()
        if code not in COUNTRY_SETTINGS:
            code = "MY"

        return cls(
            property_type=clean(property_type) or str(property_type).strip(),
            country=code,
            district=clean(district),
            mukim=clean(mukim),
            scheme=clean(scheme),
            tenure=clean(tenure),
            land_sqm=pos(land),
            area_sqm=pos(area),
        )

    @property
    def settings(self) -> dict:
        return COUNTRY_SETTINGS.get(self.country, COUNTRY_SETTINGS["MY"])

    @property
    def currency_code(self) -> str:
        return self.settings["currency_code"]

    def location_label(self) -> str:
        country_name = self.settings["name"]
        bits = [b for b in (self.scheme, self.mukim, self.district) if b]
        return ", ".join(bits) + (f", {country_name}" if bits else country_name)

    def cache_slug(self) -> str:
        # Round sizes to the nearest 10 m² so near-identical searches share a
        # cache entry instead of fragmenting it on a 1 m² difference.
        def bucket(v: float | None) -> str:
            return str(int(round(v / 10.0) * 10)) if v else "na"

        parts = [
            self.country, self.property_type, self.scheme, self.mukim, self.district,
            self.tenure, f"l{bucket(self.land_sqm)}", f"a{bucket(self.area_sqm)}",
        ]
        raw = "|".join(p for p in parts if p)
        slug = re.sub(r"[^a-z0-9]+", "_", raw.lower())
        return slug.strip("_") or "unknown"

    def exa_query(self) -> str:
        s = self.settings
        location = self.location_label()
        lines = [
            f"Estimate the current market value, in {s['currency']}, of this "
            f"residential property in {s['name']}:",
            f"- Property type: {self.property_type}",
            f"- Location: {location}",
        ]
        if self.tenure:
            lines.append(f"- Tenure: {self.tenure}")
        if self.land_sqm:
            lines.append(
                f"- Land area: {round(self.land_sqm * SQM_TO_SQFT):,} sq ft "
                f"({round(self.land_sqm):,} sq m)"
            )
        if self.area_sqm:
            lines.append(
                f"- Built-up area: {round(self.area_sqm * SQM_TO_SQFT):,} sq ft "
                f"({round(self.area_sqm):,} sq m)"
            )
        lines.append(
            f"Search live {s['name']} property portals ({s['portals']}, etc.) for "
            "comparable sale listings and recent transactions of the same property type "
            "in this area. Base the estimate on the asking and transacted prices of those "
            f"comparables, adjusting for the size above. All prices must be in {s['currency']}. "
            "Return the estimated market value, a realistic low–high range, the price per "
            "sq ft, how many comparable listings you found, the sources used, and up to 6 "
            "sample comparables (price, title, URL). Exclude rentals and room-only listings."
        )
        return "\n".join(lines)
