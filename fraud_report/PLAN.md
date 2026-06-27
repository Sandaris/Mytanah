# Fraud-Risk Research Report — Implementation Plan

## Context

The hackathon track is **Trust, Commerce & Fraud**. The existing valuation dashboard
already predicts a fair-value price range for a property from comparable transactions,
but it has no way to flag a transaction's *declared* price as suspicious, and no way to
explain *why* a deviation might be fraud vs. a legitimate edge case. A pure "the model
says it's off, here's a canned explanation" flag was judged too thin (the AI would be
fabricating a justification it doesn't actually have evidence for).

The agreed direction: when a reviewer (lender/loan officer) enters a property's
**declared transaction price** alongside the usual valuation inputs, the system computes
a local price-gap flag for free/instantly, and — only on request — generates a **research
report** that uses live web search to gather real external evidence (scheme/area
reputation, local market sentiment) to help the reviewer judge whether the gap is
explainable or worth escalating.

Key constraint discovered during exploration: the transaction dataset
(`processed data/transactions.parquet`) has **no seller/agent/developer name fields** —
only District → Mukim → Scheme Name/Area → Road Name. So research is scoped to the
**scheme/area and district level**, not individual people. There is currently **no
LLM or web-search infrastructure anywhere in the repo** — this is new from scratch.
Decision: use the Claude API's built-in `web_search` tool (single Messages API call does
search + synthesis), triggered **on-demand by a button**, not automatically, to control
cost and keep the demo flow fast.

> Note: this plan is expected to change — the user is doing further research before
> implementation begins.

## User Flow

1. Reviewer fills the existing valuation form (`property_type`, `district`, `mukim`,
   `scheme`, `tenure`, `land`, `area`) — unchanged.
2. **New field**: "Declared transaction price" (RM).
3. On submit, the existing `/valuation/predict` call still returns the price range +
   comparables, rendered as today. New: a **price-gap badge** (computed client-side or
   in a tiny new backend helper, no LLM involved) showing the declared price's position
   vs. the range — e.g. "32% below lower bound — Red", "within range — Green",
   "18% above upper bound — Amber". Default tiers (configurable): within range = Green,
   ≤25% outside = Amber, >25% outside = Red.
4. A **"Run research report"** button appears next to the badge. Clicking it calls the
   new backend endpoint, shows a loading state (this call takes several seconds because
   it does live web search), then renders the report.

## Report Structure (rendered as a new Card-based section, matching existing
`ValuationPage.jsx` visual pattern — Card/Eyebrow/Mono/Display primitives, same color
system)

1. **Verdict header** — risk tier badge (Green/Amber/Red) + one-line summary, e.g.
   "Declared price is 32% below the model's predicted range for this scheme."
2. **Price Gap Summary** — declared price, predicted range, % deviation, plain language.
   (No LLM needed — this is the same data already computed in step 3 above, just
   re-shown at the top of the report for context.)
   **Chart — Price Position Gauge (inline SVG, backend-generated):** a horizontal
   number-line spanning from the lowest comparable transaction to the highest, with
   a shaded band marking the predicted range (low→high) and a vertical marker pin
   for the declared price. Colour of the pin matches the verdict tier (green/amber/red).
   This lets the reviewer see at a glance *where* the declared price sits relative
   to both the model range and the real transaction spread — no numbers to mentally
   map. The backend computes all coordinates from the comparables data and emits
   the SVG as a Jinja2 string; no JS charting library is involved.
   SVG must carry explicit `width` and `height` attributes per html-to-pdf-best-practices Rule 5.
3. **Historical Transacted Price & PSF (By Area)** — pulled directly from the
   existing `transactions.parquet` dataset (no web search, no LLM needed). Query
   all transactions in the same `scheme`/`area` and `property_type` from the past
   3 years, compute median price, PSF range, min/max, and transaction count.
   Renders as a comparables table so the reviewer can see the actual benchmark
   the declared price is being measured against — more authoritative than any
   model prediction alone because it is raw, named, dated transactions.
   If fewer than 3 comparables exist in the scheme, widen to mukim level and flag
   this in the output.
   **Chart — Yearly Median Price Bar Chart (inline SVG, backend-generated):** group
   the same comparables by year and plot a vertical bar per year showing the median
   transaction price. Bars use `var(--mid)` fill; the declared price is overlaid as
   a horizontal dashed line in the verdict colour so the reviewer can see how the
   declared price compares to each year's market level and whether prices are trending
   up, stable, or erratic. Y-axis labels are JetBrains Mono; x-axis shows years.
   Computed entirely from `transactions.parquet` — no LLM, no web search.
   SVG must carry explicit `width` and `height` attributes per html-to-pdf-best-practices Rule 5.
4. **Household Income Context** — web_search findings on the district's median
   household income (source: DOSM Household Income and Basic Amenities Survey,
   well-indexed and findable). Gives the reviewer a demand-side anchor: if median
   household income in the district is RM4,500/month, that implies a realistic
   price ceiling for local buyers and helps judge whether a declared price is
   plausible for the area's population. Cite the DOSM source and survey year.
5. **Synthesis & Recommendation** — short LLM-written paragraph weighing the price-gap
   math against the research findings, ending in one of: "Proceed — gap plausibly
   explained by [reason]" / "Escalate — no external evidence explains the gap" /
   "Inconclusive — insufficient public information."
6. **Sources** — flat list of URLs the web_search tool actually used, for audit/compliance
   trail (a lender reviewing this needs to be able to check the citations themselves).

## Data Flow / Implementation

**Backend (`backend/api.py`)**
- New endpoint `POST /fraud-risk/report`. Request body: the same fields as
  `/valuation/predict` (`property_type`, `district`, `mukim`, `scheme`, `tenure`, `land`,
  `area`) plus `declared_price` (float) and the `predicted_range` already computed by the
  client's prior `/valuation/predict` call (avoids re-running the model).
- **Section 3 (comparables) is computed locally before the LLM call** — query
  `transactions.parquet` with pandas/DuckDB, filter to same `scheme`, `property_type`,
  and transactions within the last 3 years. Compute `median_price`, `median_psf`,
  `min_price`, `max_price`, `count`. If count < 3, widen to `mukim` level and set a
  `widened: true` flag. Also compute `yearly_medians: [{year, median_price}, ...]` for
  the bar chart. Pass the result as structured context into the Claude prompt rather
  than asking the LLM to derive it — the LLM must not hallucinate comparables.
- **Charts are generated server-side as inline SVG strings** before the PDF template
  is rendered. Two SVG helpers (pure Python, no external chart library):
  - `build_price_gauge_svg(declared, range_low, range_high, comp_min, comp_max, tier)`
    → outputs the Section 2 horizontal number-line gauge.
  - `build_yearly_bar_svg(yearly_medians, declared_price, tier)`
    → outputs the Section 3 yearly median bar chart with declared-price overlay line.
  Both functions live in `backend/report_charts.py` and return an SVG string that is
  injected directly into the Jinja2 HTML template. No JS, no external image files.
- The endpoint then builds a single Claude Messages API call (`anthropic` Python SDK,
  new dependency in `requirements.txt`) with the `web_search` server tool enabled.
  System prompt instructs Claude to: search for `{district}` median household income
  (DOSM source), then return a **structured JSON** response matching all 6 sections
  (use a JSON schema in the prompt — ask Claude to emit a fenced JSON block with fields
  `verdict`, `gap_summary`, `comparables: {transactions: [...], median_price, median_psf,
  count, widened}`, `household_income: {median_myr, source, year}`,
  `recommendation`, `sources: [...]`).
- `ANTHROPIC_API_KEY` read from environment (document in `.env`, do not
  commit). New module-level constant alongside other config in `api.py`.
- Simple in-memory cache (mirror the existing `_MODEL_CACHE` LRU pattern already in
  `api.py`) keyed by `(scheme, district, declared_price_bucket)` so repeated/demo clicks
  don't re-trigger paid API calls.
- No change to `/valuation/predict` — the price-gap badge math can be done entirely in
  the frontend from the response it already returns, no backend change needed there.

**Frontend**
- `ValuationPage.jsx`: add the declared-price input (reuse existing input/Combobox
  styling), compute the gap badge in-component, render the "Run research report" button
  conditionally once a prediction + declared price are present.
- New component, e.g. `FraudReportCard.jsx`, mirroring the Card composition used in
  `ValuationPage.jsx`, rendering the 6 report sections from the JSON response. Add a
  loading/spinner state (existing pattern, e.g. "DATA UNAVAILABLE"/"LIVE" badges already
  used elsewhere) since the call takes several seconds.
- `api.js`: add `fraudRiskReport(payload)` following the existing `req()` wrapper
  convention (same pattern as `valuationPredict`).

**PDF Export**

When the reviewer clicks "Export PDF", the backend renders the report as a PDF using
Playwright (`page.pdf()`) and streams the bytes back.

**All PDF HTML/CSS must follow `fraud_report/html_to_pdf_skill/SKILL.md` exactly.** This
skill defines:
- The design system tokens (colors, fonts) to use
- Every component pattern: `Card`, `Eyebrow`, `Mono`, `Display`, verdict badge
- The **cover page** layout — dark/light split, accent bar, verdict strip at boundary,
  6-cell meta grid, footer
- The report section layout and comparables table styling
- Print-safety rules (`print-color-adjust`, `page-break-inside`, font loading)
- The Playwright runner config (`print_background=True`, `networkidle` wait)

Reference the skill before writing any HTML template for the PDF — do not invent new
colors, fonts, or layout patterns outside of what is defined there.

New backend endpoint `GET /fraud-risk/report/pdf?ref=<report_ref>`:
- Retrieves the cached report JSON by `ref`
- Renders `fraud_report_template.html` (Jinja2) with the report data
- Calls Playwright `page.pdf()` with `print_background=True`, A4, 40/44px margins
- Streams the PDF bytes back with `Content-Type: application/pdf`

## Verification

1. Manually call `POST /fraud-risk/report` with a known scheme/declared price via curl
   once `ANTHROPIC_API_KEY` is set, confirm it returns the 6-section JSON with:
   - `comparables.count` > 0 and `comparables.transactions` containing real rows from
     `transactions.parquet` (not hallucinated)
   - `household_income.median_myr` populated with a real DOSM figure and `source` cited
   - `sources` non-empty (web_search was actually used for section 4)
2. Run the dashboard locally (`uvicorn backend.api:app`), open the valuation page, enter a
   declared price clearly outside the predicted range, confirm the gap badge renders
   correctly (Green/Amber/Red tiers) without calling the backend.
3. Click "Run research report", confirm the loading state shows, then the
   `FraudReportCard` renders all 6 sections with real citations.
4. Confirm repeating the same request hits the in-memory cache (no duplicate API cost) —
   check server logs / response latency on second call.
5. Spot-check one declared price *within* the predicted range — confirm the button still
   works but the verdict reads as low-risk/Green and the recommendation says "Proceed."
