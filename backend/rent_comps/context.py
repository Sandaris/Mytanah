from dataclasses import dataclass
import re


@dataclass(frozen=True)
class RentContext:
    mukim: str
    scheme: str | None = None
    district: str | None = None
    state: str | None = None
    property_type: str | None = None

    @classmethod
    def from_kwargs(
        cls,
        mukim: str,
        *,
        scheme: str | None = None,
        district: str | None = None,
        state: str | None = None,
        property_type: str | None = None,
    ) -> "RentContext":
        def clean(v: str | None) -> str | None:
            if v is None:
                return None
            s = str(v).strip()
            return s or None

        return cls(
            mukim=clean(mukim) or mukim.strip(),
            scheme=clean(scheme),
            district=clean(district),
            state=clean(state),
            property_type=clean(property_type),
        )

    def cache_slug(self) -> str:
        parts = [self.mukim, self.scheme, self.district, self.state, self.property_type]
        raw = "|".join(p for p in parts if p)
        slug = raw.lower()
        slug = re.sub(r"[^a-z0-9]+", "_", slug)
        return slug.strip("_") or "unknown"

    def location_label(self) -> str:
        bits = [b for b in (self.scheme, self.mukim, self.district, self.state) if b]
        return ", ".join(bits)

    def exa_query(self) -> str:
        location = self.location_label()
        lines = [
            f"Find current residential rental market prices in Malaysia for: {location}.",
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
            "Return aggregate monthly rent statistics (min, max, average, median) from live listing data."
        )
        return " ".join(lines)
