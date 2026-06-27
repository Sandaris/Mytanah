import argparse
import json
from . import get_rent_estimate


def main():
    parser = argparse.ArgumentParser(description="Fetch mukim-level rental comps")
    parser.add_argument("--mukim", required=True)
    parser.add_argument("--scheme")
    parser.add_argument("--district")
    parser.add_argument("--state")
    parser.add_argument("--property-type")
    parser.add_argument("--force-refresh", action="store_true")
    args = parser.parse_args()
    result = get_rent_estimate(
        args.mukim,
        scheme=args.scheme,
        district=args.district,
        state=args.state,
        property_type=args.property_type,
        force_refresh=args.force_refresh,
    )
    print(json.dumps(result.__dict__, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
