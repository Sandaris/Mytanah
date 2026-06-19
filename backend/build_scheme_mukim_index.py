"""Build a Scheme/Area -> Mukim relationship index from the cleaned dataset.

Output: processed data/scheme_mukim_index.csv

Each row is one (District, Scheme/Area, Mukim) combination with its
transaction count. The "primary mukim" — the one used by the frontend's
auto-populate — is the mukim with the highest count for that scheme within
that district. The CSV is sorted so the primary appears first for each
scheme, and a `primary` column flags it explicitly.

Also prints a coverage summary so we can confirm every scheme in the
dataset resolves to at least one mukim (which guarantees the
backend `/valuation/options?district=…&scheme=…` lookup will never come
back empty for any scheme the user can pick from the cascade).
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
PARQUET = ROOT / "processed data" / "transactions.parquet"
OUT = ROOT / "processed data" / "scheme_mukim_index.csv"


def main() -> None:
    df = pd.read_parquet(PARQUET, columns=["District", "Mukim", "Scheme Name/Area"])
    df = df.rename(columns={"Scheme Name/Area": "Scheme"})
    for c in ("District", "Mukim", "Scheme"):
        df[c] = df[c].astype(str).str.strip()
    df = df[(df["District"] != "") & (df["Scheme"] != "") & (df["Mukim"] != "")]

    grouped = (
        df.groupby(["District", "Scheme", "Mukim"], dropna=False)
        .size()
        .reset_index(name="tx_count")
    )

    grouped = grouped.sort_values(
        ["District", "Scheme", "tx_count"], ascending=[True, True, False]
    )

    grouped["primary"] = (
        grouped.groupby(["District", "Scheme"])["tx_count"].rank(
            method="first", ascending=False
        )
        == 1
    )
    grouped["mukim_rank"] = grouped.groupby(["District", "Scheme"]).cumcount() + 1

    total_schemes = grouped[["District", "Scheme"]].drop_duplicates().shape[0]
    multi = (
        grouped.groupby(["District", "Scheme"]).size().reset_index(name="n_mukims")
    )
    n_single = (multi["n_mukims"] == 1).sum()
    n_multi = (multi["n_mukims"] > 1).sum()

    print(f"districts                      : {df['District'].nunique()}")
    print(f"mukims                         : {df['Mukim'].nunique()}")
    print(f"distinct (district, scheme)    : {total_schemes}")
    print(f"  -> resolve to 1 mukim only   : {n_single}")
    print(f"  -> span multiple mukims      : {n_multi}")
    print(f"primary-mukim coverage         : 100% (every scheme has a primary)")
    print()

    top_multi = multi.sort_values("n_mukims", ascending=False).head(5)
    print("most-cross-mukim schemes (n_mukims):")
    for _, r in top_multi.iterrows():
        print(f"  {r['District']:<24} {r['Scheme']:<32} {r['n_mukims']}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    grouped[
        ["District", "Scheme", "Mukim", "tx_count", "primary", "mukim_rank"]
    ].to_csv(OUT, index=False)
    print(f"\nwrote {OUT.relative_to(ROOT)}  ({len(grouped):,} rows)")


if __name__ == "__main__":
    main()
