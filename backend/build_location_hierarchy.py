"""Build the full location cascade from cleaned Open Transaction data.

Outputs:
  processed data/location_hierarchy.json
  processed data/location_hierarchy_edges.csv
  processed data/location_hierarchy_summary.json

The hierarchy is path-based:
  District -> Mukim -> Scheme Name/Area -> Road Name

Names are only de-duplicated inside their parent path. This is intentional:
the same mukim, scheme, or road label can appear under multiple parents, so a
global "one parent per label" index would lose valid relationships.
"""
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
PARQUET = ROOT / "processed data" / "transactions.parquet"
XLSX = ROOT / "processed data" / "Open Transaction Data Cleaned.xlsx"
OUT_JSON = ROOT / "processed data" / "location_hierarchy.json"
OUT_EDGES = ROOT / "processed data" / "location_hierarchy_edges.csv"
OUT_SUMMARY = ROOT / "processed data" / "location_hierarchy_summary.json"

DISTRICT = "District"
MUKIM = "Mukim"
SCHEME = "Scheme Name/Area"
ROAD = "Road Name"
LEVELS = [DISTRICT, MUKIM, SCHEME, ROAD]


def clean_text(value: Any) -> str:
    # Keep the RAW label; only trim leading/trailing whitespace (NaN -> "").
    # Internal whitespace is preserved on purpose, so distinct raw strings such as
    # "LORONG  4/49A" vs "LORONG 4/49A" stay separate nodes — nothing is
    # canonicalized or merged. Matching in api.py is strip-only to match this.
    if pd.isna(value):
        return ""
    return str(value).strip()


def read_locations() -> pd.DataFrame:
    cols = [DISTRICT, MUKIM, SCHEME, ROAD]
    if PARQUET.exists():
        df = pd.read_parquet(PARQUET, columns=cols)
    else:
        df = pd.read_excel(XLSX, usecols=cols)

    for col in cols:
        df[col] = df[col].map(clean_text)

    required = [DISTRICT, MUKIM, SCHEME]
    before = len(df)
    df = df[(df[required] != "").all(axis=1)].copy()
    dropped_required = before - len(df)
    return df, dropped_required


def count_children(
    df: pd.DataFrame,
    parent_cols: list[str],
    child_col: str,
) -> pd.DataFrame:
    cols = parent_cols + [child_col]
    scope = df[(df[cols] != "").all(axis=1)]
    return (
        scope.groupby(cols, dropna=False)
        .size()
        .reset_index(name="tx_count")
        .sort_values(parent_cols + ["tx_count", child_col], ascending=[True] * len(parent_cols) + [False, True])
    )


def attach_path_counts(node: dict[str, Any], tx_count: int, missing_road_count: int = 0) -> None:
    node["tx_count"] = int(tx_count)
    if missing_road_count:
        node["missing_road_count"] = int(missing_road_count)


def build_hierarchy(df: pd.DataFrame) -> tuple[dict[str, Any], list[dict[str, Any]], dict[str, Any]]:
    hierarchy: dict[str, Any] = {"districts": []}
    edge_rows: list[dict[str, Any]] = []

    district_counts = df.groupby(DISTRICT).size().sort_values(ascending=False)
    district_nodes: dict[str, dict[str, Any]] = {}
    for district, tx_count in district_counts.items():
        node = {"name": district, "tx_count": int(tx_count), "mukims": []}
        hierarchy["districts"].append(node)
        district_nodes[district] = node

    # District -> Mukim
    for _, row in count_children(df, [DISTRICT], MUKIM).iterrows():
        district, mukim, tx_count = row[DISTRICT], row[MUKIM], int(row["tx_count"])
        parent = district_nodes[district]
        parent.setdefault("_mukim_nodes", {})
        child = {"name": mukim, "tx_count": tx_count, "schemes": []}
        parent["mukims"].append(child)
        parent["_mukim_nodes"][mukim] = child
        edge_rows.append(
            {
                "parent_level": "district",
                "parent_path": district,
                "parent_name": district,
                "child_level": "mukim",
                "child_name": mukim,
                "tx_count": tx_count,
            }
        )

    # Mukim -> Scheme/Area within each district.
    for _, row in count_children(df, [DISTRICT, MUKIM], SCHEME).iterrows():
        district, mukim, scheme = row[DISTRICT], row[MUKIM], row[SCHEME]
        tx_count = int(row["tx_count"])
        parent = district_nodes[district]["_mukim_nodes"][mukim]
        parent.setdefault("_scheme_nodes", {})
        child = {"name": scheme, "tx_count": tx_count, "roads": [], "missing_road_count": 0}
        parent["schemes"].append(child)
        parent["_scheme_nodes"][scheme] = child
        edge_rows.append(
            {
                "parent_level": "mukim",
                "parent_path": f"{district}|{mukim}",
                "parent_name": mukim,
                "child_level": "scheme_area",
                "child_name": scheme,
                "tx_count": tx_count,
            }
        )

    # Scheme/Area -> Road Name within each district and mukim.
    road_counts = count_children(df, [DISTRICT, MUKIM, SCHEME], ROAD)
    for _, row in road_counts.iterrows():
        district, mukim, scheme, road = row[DISTRICT], row[MUKIM], row[SCHEME], row[ROAD]
        tx_count = int(row["tx_count"])
        parent = district_nodes[district]["_mukim_nodes"][mukim]["_scheme_nodes"][scheme]
        parent["roads"].append({"name": road, "tx_count": tx_count})
        edge_rows.append(
            {
                "parent_level": "scheme_area",
                "parent_path": f"{district}|{mukim}|{scheme}",
                "parent_name": scheme,
                "child_level": "road",
                "child_name": road,
                "tx_count": tx_count,
            }
        )

    missing_road = df[df[ROAD] == ""].groupby([DISTRICT, MUKIM, SCHEME]).size()
    for (district, mukim, scheme), count in missing_road.items():
        scheme_node = district_nodes[district]["_mukim_nodes"][mukim]["_scheme_nodes"][scheme]
        scheme_node["missing_road_count"] = int(count)

    # Remove private lookup maps before serializing.
    for district_node in hierarchy["districts"]:
        for mukim_node in district_node["mukims"]:
            mukim_node.pop("_scheme_nodes", None)
        district_node.pop("_mukim_nodes", None)

    summary = summarize(df, dropped_required=0, edge_rows=edge_rows)
    return hierarchy, edge_rows, summary


def labels_with_multiple_parent_paths(df: pd.DataFrame, label_col: str, parent_cols: list[str]) -> int:
    grouped = df.groupby(label_col)[parent_cols].nunique(dropna=False)
    if isinstance(grouped, pd.Series):
        return int((grouped > 1).sum())
    parent_paths = df[parent_cols + [label_col]].drop_duplicates().groupby(label_col).size()
    return int((parent_paths > 1).sum())


def summarize(df: pd.DataFrame, dropped_required: int, edge_rows: list[dict[str, Any]]) -> dict[str, Any]:
    nonblank_roads = df[df[ROAD] != ""]
    district_mukim = df[[DISTRICT, MUKIM]].drop_duplicates()
    mukim_scheme = df[[DISTRICT, MUKIM, SCHEME]].drop_duplicates()
    scheme_road = nonblank_roads[[DISTRICT, MUKIM, SCHEME, ROAD]].drop_duplicates()

    top_children = {
        "mukims_per_district_max": int(district_mukim.groupby(DISTRICT).size().max()),
        "schemes_per_mukim_path_max": int(mukim_scheme.groupby([DISTRICT, MUKIM]).size().max()),
        "roads_per_scheme_path_max": int(scheme_road.groupby([DISTRICT, MUKIM, SCHEME]).size().max())
        if len(scheme_road)
        else 0,
    }

    return {
        "source": str(PARQUET.relative_to(ROOT) if PARQUET.exists() else XLSX.relative_to(ROOT)),
        "rows_used": int(len(df)),
        "rows_dropped_missing_required_location": int(dropped_required),
        "unique_labels": {
            "district": int(df[DISTRICT].nunique()),
            "mukim": int(df[MUKIM].nunique()),
            "scheme_area": int(df[SCHEME].nunique()),
            "road": int(nonblank_roads[ROAD].nunique()),
        },
        "path_counts": {
            "district_mukim_edges": int(len(district_mukim)),
            "mukim_scheme_edges": int(len(mukim_scheme)),
            "scheme_road_edges": int(len(scheme_road)),
            "all_edges": int(len(edge_rows)),
        },
        "road_quality": {
            "blank_or_null_road_rows": int((df[ROAD] == "").sum()),
            "nonblank_road_rows": int((df[ROAD] != "").sum()),
            "scheme_paths_with_missing_road_rows": int(
                df[df[ROAD] == ""][[DISTRICT, MUKIM, SCHEME]].drop_duplicates().shape[0]
            ),
        },
        "ambiguous_labels": {
            "mukim_labels_under_multiple_districts": labels_with_multiple_parent_paths(df, MUKIM, [DISTRICT]),
            "scheme_labels_under_multiple_mukim_paths": labels_with_multiple_parent_paths(
                df, SCHEME, [DISTRICT, MUKIM]
            ),
            "road_labels_under_multiple_scheme_paths": labels_with_multiple_parent_paths(
                nonblank_roads, ROAD, [DISTRICT, MUKIM, SCHEME]
            ),
        },
        "max_children": top_children,
    }


def main() -> None:
    df, dropped_required = read_locations()
    hierarchy, edge_rows, summary = build_hierarchy(df)
    summary["rows_dropped_missing_required_location"] = dropped_required

    OUT_JSON.write_text(json.dumps(hierarchy, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    pd.DataFrame(edge_rows).to_csv(OUT_EDGES, index=False)
    OUT_SUMMARY.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_EDGES.relative_to(ROOT)}")
    print(f"wrote {OUT_SUMMARY.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
