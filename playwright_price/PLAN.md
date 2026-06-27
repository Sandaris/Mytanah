# Rent Comps + ROI Cash Flow (Claude Agent SDK + Playwright MCP)

## Context

The ROI Calculator (`frontend/ui_kits/dashboard/RoiCalculator.jsx`) already
exists — it's a reducing-balance loan planner that computes monthly installment,
total interest, and payoff timeline given property price + loan parameters.

The **missing piece** is rental income. A teammate is building the ROI
calculator; the contribution from this repo is:
1. Fetch a live market-rent estimate for the property's mukim via a Playwright
   MCP agent browsing PropertyGuru/Mudah.
2. Feed it into the ROI calculator to compute the core investment metric:

```
Monthly rental income  (from Playwright scrape)
− Monthly installment  (from loan calculator)
= Net cash flow / month

Net cash flow × 12 = Annual cash generated
Net cash flow × loan_years × 12 = Total cash generated over loan term
```

A positive number means the property pays for itself (and more). A negative
number means the investor tops up each month — still useful to know by how much.

We validated manually (via Playwright MCP) that real rent data can be scraped
from Mudah.my and PropertyGuru.com.my for a given area. The backend module
(`backend/rent_comps/`) was designed as a standalone prototype; this plan wires
it into `backend/api.py` and surfaces the results in the ROI calculator.

**User flow:**
1. User runs valuation → sees predicted price range → clicks **Export to ROI
   Calculator** (already exists, passes `seed` including `mukim` — see below).
2. ROI Calculator opens with loan inputs pre-filled from the valuation seed.
3. New **Market Rent** panel auto-triggers `GET /rent-comps?mukim=<mukim>` on
   mount, shows a loading state, then renders median rent + confidence.
4. ROI summary appears below: monthly cash flow, annual cash generated, and
   total cash generated over the full loan term — all updating live as the user
   adjusts loan inputs.

Scope decisions already made (do not revisit):
- No bedroom-count filtering — mukim-level average rent only.
- No specific-building search — mukim-wide listings, broader than one condo.
- Caching required (48h TTL) since each agent run costs real Anthropic spend.
- All ROI figures are derived values (rent from API, installment from existing
  loan calc) — no extra API calls, update instantly when loan inputs change.

## Environment (verified)

- Node v24.13.0 / npx available. `claude` CLI installed and already
  authenticated (this session runs through it) — Claude Agent SDK can ride on
  that login, no `ANTHROPIC_API_KEY` needed.
- `npx -y @playwright/mcp@latest --version` works (0.0.76) — fetched on demand,
  no global install.
- `claude-agent-sdk` Python package not yet installed — add to
  `backend/requirements.txt`.
- Python 3.12.13 in `backend/.venv`.

## Module structure

New package `backend/rent_comps/` (sibling to `api.py`, `ft_transformer.py`,
`build_scheme_mukim_index.py` — matches existing single-purpose-module
convention):

```
backend/rent_comps/
    __init__.py   # exports get_rent_estimate(), RentEstimate
    schema.py     # RentEstimate dataclass — no new deps, safe to import always
    cache.py      # file-cache get/set/TTL — no new deps
    agent.py       # Claude Agent SDK + Playwright MCP invocation (defers the
                   #  claude_agent_sdk import to inside the function, so
                   #  importing the package doesn't require the SDK unless a
                   #  cache miss actually triggers an agent run)
    cli.py         # argparse entrypoint for manual testing
backend/.cache/rent_comps/
    <mukim_slug>.json   # one cache file per mukim, created at runtime (gitignored)
```

Run manually as: `python -m backend.rent_comps.cli --mukim "Bandar Petaling Jaya"`

## Claude Agent SDK usage (confirmed against installed `claude-agent-sdk==0.2.110`)

```python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

options = ClaudeAgentOptions(
    system_prompt=SYSTEM_PROMPT,
    mcp_servers={
        "playwright": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@playwright/mcp@latest"],
        }
    },
    allowed_tools=[
        "mcp__playwright__browser_navigate",
        "mcp__playwright__browser_evaluate",   # primary extraction method
        "mcp__playwright__browser_snapshot",   # fallback only (diagnosis/zero-result cases)
        "mcp__playwright__browser_click",
        "mcp__playwright__browser_type",
        "mcp__playwright__browser_press_key",
        "mcp__playwright__browser_wait_for",
        "mcp__playwright__browser_close",
    ],
    permission_mode="bypassPermissions",  # scripted run, no human approval loop
    max_turns=40,                          # hard cap on tool calls
    max_budget_usd=2.0,                    # SDK-level cost circuit breaker
    model="claude-sonnet-4-5",
)

final_text = None
async for message in query(prompt=TASK_PROMPT, options=options):
    if isinstance(message, ResultMessage):
        final_text = message.result
```

- `query()` is an async generator — wrap the whole thing in `asyncio.run(...)`.
- Do **not** rely on `output_format`/`structured_output` — unverified whether
  the CLI populates it reliably for a custom schema. Instead, have the system
  prompt instruct the agent to end its final message with a fenced
  ` ```json ... ``` ` block; `agent.py` regexes it out of `ResultMessage.result`
  and `json.loads`s it. Fully under our control, easy to debug.
- Log `ResultMessage.total_cost_usd` and `ResultMessage.num_turns` during
  testing to get a real cost-per-run number (currently just an estimate).

## Prompt design

**System prompt** (static, in `agent.py`):
- Role: data-collection agent gathering Malaysian residential rental prices for
  a given mukim via Playwright MCP browser tools.
- Scope: aggregate-only, mukim-wide, no bedroom filtering.
- Target sites, priority order: **PropertyGuru.com.my first** (validated:
  Cloudflare "Just a moment" passes automatically after a brief wait),
  then **Mudah.my** as fallback/supplement (validated: area-wide browsing
  works; freetext search to a specific building is unreliable, so only use it
  for area-wide browsing).
- Navigation pattern: after navigating to the search results page, use a single
  `browser_evaluate` call to extract and aggregate prices directly from the DOM
  — **do NOT use `browser_snapshot`** for price extraction. Snapshot is only
  needed if `browser_evaluate` returns zero results (e.g. page didn't render,
  fallback to snapshot to diagnose). Do **not** click into individual listing
  pages, that would ~10x the tool-call count.
- Extraction JS pattern (validated against PropertyGuru):
  ```js
  () => {
    const seen = new Set();
    const prices = [];
    document.querySelectorAll('[class*="price"]').forEach(el => {
      const m = el.innerText.match(/^RM ([\d,]+) \/mo/);
      if (m && !seen.has(m[1])) {
        seen.add(m[1]);
        prices.push(parseFloat(m[1].replace(/,/g, '')));
      }
    });
    prices.sort((a, b) => a - b);
    const n = prices.length;
    const avg = prices.reduce((s, v) => s + v, 0) / n;
    const median = n % 2 === 0 ? (prices[n/2-1] + prices[n/2]) / 2 : prices[Math.floor(n/2)];
    return { prices, n, min: prices[0], max: prices[n-1], avg: Math.round(avg), median };
  }
  ```
  For Mudah.my the selector will differ — instruct the agent to adapt the
  `querySelectorAll` selector if the PropertyGuru one returns 0 results.
- Stopping rule: aim for 15-20 distinct rent figures combined across both
  sites, 1-2 result pages per site is enough, then stop and synthesize.
- Fallback rule: if one site yields nothing (blocked/empty/no location match),
  use the other alone and reflect this in `sources_used`/`confidence`. If both
  yield nothing, return the explicit zero-listing JSON shape — **never
  fabricate numbers**, state this forcefully in the prompt.
- Extraction rule: parse "RM X,XXX /mo" patterns; skip listings where price vs.
  deposit is ambiguous rather than guessing.
- Output contract: final message must be ONLY a fenced `json` block containing
  exactly the fields in the schema below, nothing else after it.

**Task prompt** (per call): short, e.g.
`f"Find market rent estimates for residential rentals in the mukim '{mukim}', Malaysia. Follow your instructions for target sites, sampling size, and the required JSON output format."`

## Caching design (`cache.py`)

File-based, one JSON file per mukim, matching the spirit of this repo's
existing `hcr_latest.json` snapshot pattern.

```python
CACHE_DIR = Path(__file__).resolve().parent.parent / ".cache" / "rent_comps"
TTL_HOURS = 48   # shorter (1h) for a "none"/zero-listing result, see Error Handling

def _slugify(mukim: str) -> str: ...  # lowercase, non-alnum runs -> "_"

def read_cache(mukim: str) -> RentEstimate | None: ...
def write_cache(mukim: str, estimate: RentEstimate) -> None: ...
```

`read_cache` returns `None` (treated as a miss) on missing file, corrupt JSON,
or stale `fetched_at`. Add `backend/.cache/` to `.gitignore` (verify it isn't
already accidentally tracked first).

Top-level entry point (`__init__.py`):

```python
def get_rent_estimate(mukim: str, *, force_refresh: bool = False) -> RentEstimate:
    if not force_refresh:
        cached = read_cache(mukim)
        if cached is not None:
            return cached
    estimate = asyncio.run(_run_agent(mukim))  # agent.py
    write_cache(mukim, estimate)
    return estimate
```

## Output schema (`schema.py`)

Plain `dataclass` (not Pydantic — keeps this module dependency-light;
converting to Pydantic later when wired into `api.py` is trivial):

```python
@dataclass
class RentEstimate:
    mukim: str
    avg_rent_myr: float | None
    min_rent_myr: float | None
    max_rent_myr: float | None
    median_rent_myr: float | None       # robust against single luxury outliers
    listing_count: int
    sources_used: list[str]             # e.g. ["propertyguru.com.my", "mudah.my"]
    confidence: str                     # "high" (>=15, both sources) | "medium" (>=8) | "low" (<8) | "none" (0)
    fetched_at: str                     # ISO 8601 UTC
    notes: str | None = None            # caveats: blocked source, retries, etc.
    sample_listings: list[dict] = field(default_factory=list)
    # each: {"source": str, "rent_myr": float, "room_type": str | None, "title": str | None}
```

## Error handling

| Failure | Handling |
|---|---|
| Playwright MCP server fails to start | Catch SDK connection/process errors around the `async for` loop; return `RentEstimate` with `listing_count=0`, rent fields `None`, `confidence="none"`, `notes` explaining it. Cache this with a **short 1h TTL** so a transient hiccup doesn't poison the cache for 48h. |
| Agent forced-stop (`max_turns`/`max_budget_usd` hit) | Same "none"-confidence fallback, `notes` states forced stop — there's likely no parseable final JSON. |
| Zero listings found (valid agent run) | Not an error — return as-is with `confidence="none"`, but use the same short 1h TTL so the next call retries soon. |
| Malformed/missing JSON in final message | Regex for the fenced block; on failure to find/parse, fallback shape with `notes=f"Could not parse agent output: {repr(raw_text)[:500]}"`. Never propagate the parse exception. |
| Both sites blocked | Surfaces via the prompt's own fallback instructions into the "zero listings" path — agent self-reports in `notes`. |

Principle: `get_rent_estimate()` never raises for "the world didn't cooperate"
reasons — always returns a `RentEstimate` with confidence/notes communicating
degraded results. Genuine bugs may still propagate.

## requirements.txt change

Append after the existing torch block in `backend/requirements.txt`, as its own
commented section (not interleaved with the ML stack):

```
# Rent-comps prototype (backend/rent_comps/): Claude Agent SDK drives a
# Playwright MCP browser session to scrape mukim-level market rent. Isolated
# from the core ML/API deps above — agent.py defers this import to first use.
claude-agent-sdk==0.2.110
```

No requirements.txt entry for `@playwright/mcp` itself — it's an npm package
fetched on demand via `npx`.

## Manual verification plan (feasibility check, not a unit-test suite)

1. **Known-good mukim**: `python -m backend.rent_comps.cli --mukim "Bandar Petaling Jaya"`
   (the mukim containing Centrestage Designer Suite / Jalan Kemajuan PJ per
   `scheme_mukim_index.csv`). Expect `listing_count` ~10-25, `avg_rent_myr`/
   `median_rent_myr` landing in the RM 550-1,800 band already observed manually
   this session, `sources_used` including PropertyGuru.
2. **Second mukim** with different listing density (e.g. another PJ-area mukim
   from the CSV) — confirm it doesn't crash and `confidence` drops sensibly if
   listings are sparser.
3. **Cache hit**: re-run the same mukim immediately — confirm near-instant
   return, identical `fetched_at`, no agent invocation. Then re-run with a
   `--force-refresh` CLI flag and confirm it re-invokes the agent.
4. **Cache corruption resilience**: corrupt the cache file manually, re-run,
   confirm it's treated as a miss (re-runs agent) rather than crashing.
5. **Cost/turn-count observation**: print `ResultMessage.total_cost_usd` and
   `num_turns` in CLI verbose output — get a real per-run cost number (not
   currently measured) before this is ever wired into a user-facing flow.
6. **Bad mukim name**: run with a nonsense string — confirm graceful
   `confidence="none"` degradation, no crash, no hallucinated numbers.

## Open risks (explicitly flagged, not glossed over)

1. **`output_format`/`structured_output` reliability is unverified** for a
   Playwright-tool-using run with a custom schema — deliberately not used;
   fenced-JSON-in-final-message is the fallback-proof choice.
2. **Mukim name vs. site search term is fuzzy** — CSV mukim names (e.g. "Bdr
   Petaling Jaya Selatan") may not match site autocomplete exactly. Prompt
   permits the agent to use a reasonable colloquial variant for searching while
   still reporting the original mukim string in output. Worth observing during
   manual testing; a mukim→search-term lookup table is a possible future
   refinement, out of scope now.
3. **Cloudflare/anti-bot risk on sustained automated use** — manual validation
   this session was a single interactive run; repeated/batched automated runs
   (e.g. across many mukims) risk stricter bot detection over time. The 48h
   cache mitigates steady-state risk; a cold-start batch across many mukims is
   the highest-risk scenario and should be tested cautiously, not assumed safe.
4. **Cost per run is currently an estimate** ("~15-20 tool calls" from manual
   exploration, no `total_cost_usd` measured) — step 5 of the verification plan
   produces a real number; do not wire this into any per-page-load user flow
   before that's known.
5. **`permission_mode="bypassPermissions"`** is required for a non-interactive
   scripted run; scoped tightly by `allowed_tools` containing only the
   Playwright MCP tools. Verify during testing the agent never reaches for
   Bash/Read/Write.

---

## Phase 2 — Wiring into the App (new work)

### Backend: new API endpoint

Add to `backend/api.py`:

```python
@app.get("/rent-comps")
async def rent_comps(mukim: str = Query(..., min_length=1)):
    from backend.rent_comps import get_rent_estimate
    estimate = get_rent_estimate(mukim)          # uses 48h file cache
    return estimate.__dict__
```

- Runs synchronously (wraps `asyncio.run` inside `get_rent_estimate`) — acceptable
  because the call is cache-gated; a live agent run is the slow path only on first
  request per mukim per 48h.
- No auth — same as all other endpoints in this app.
- Returns the `RentEstimate` fields as JSON directly.

### Seed: add `mukim` field

`ValuationDashboard.jsx` already builds a `seed` object before navigating to the
ROI Calculator page. Add `mukim` to it:

```js
// inside the "Export to ROI Calculator" handler
const seed = {
  propertyPrice: predicted_mid,
  locationLabel: `${scheme}, ${district}`,
  propertyType: property_type,
  sourceModel: 'Valuation model',
  rangeLow: range_low,
  rangeHigh: range_high,
  mukim: mukim,          // ← new field
};
```

The `ROI_DEFAULT_SEED` in `RoiCalculator.jsx` should also get `mukim: null` as
a fallback so it renders safely when opened without a valuation seed.

### Frontend: Market Rent panel

New section inside `RoiCalculator` component, rendered below the existing 3×2
metrics grid. Structure:

```
┌─────────────────────────────────────────────────────────────┐
│ MARKET RENT  (Plentong · via PropertyGuru/Mudah · high)     │
│                                                             │
│  Median rent   RM 1,450 / mo                                │
│  Range         RM 900 – RM 2,100  ·  17 listings scraped   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RENTAL ROI                                                  │
│                                                             │
│  Monthly rental income    +RM 1,450                         │
│  Monthly installment       −RM 2,218                        │
│  ──────────────────────────────────                         │
│  Net cash flow / month     −RM 768   ← red                 │
│                                                             │
│  Annual cash generated     −RM 9,216                        │
│  Total over 30 yr term    −RM 276,480                       │
└─────────────────────────────────────────────────────────────┘
```

Formulas:
```
net_monthly   = median_rent − installment
annual        = net_monthly × 12
total_term    = net_monthly × loan_years × 12
```

Implementation notes:
- Use `roiUseEffect` on mount (and when `seed.mukim` changes) to call
  `GET /rent-comps?mukim=<seed.mukim>`. Show a "Fetching market rent…" loading
  state in the card while the request is in flight.
- If `seed.mukim` is null/missing (manual-entry mode), hide the panel entirely.
- If the API returns `confidence: "none"` / `listing_count: 0`, show
  "No rental listings found for this mukim" — do not show the ROI block.
- Uses `estimate.median_rent_myr` vs `baseSchedule.monthly` from the existing
  loan calc — purely derived, updates live when loan inputs change.
- Color: green (`C.up`) if net_monthly ≥ 0, red (`C.down`) if negative.
- Reuse existing `RoiMetric` / `Card` / `Eyebrow` / `Mono` primitives.

### Critical files (Phase 2)

- `backend/api.py` — one new `GET /rent-comps` endpoint
- `frontend/ui_kits/dashboard/RoiCalculator.jsx` — Market Rent + Cash Flow panels
- `frontend/ui_kits/dashboard/ValuationDashboard.jsx` — add `mukim` to seed

## Critical files

- `backend/rent_comps/agent.py`
- `backend/rent_comps/schema.py`
- `backend/rent_comps/cache.py`
- `backend/rent_comps/cli.py`
- `backend/rent_comps/__init__.py`
- `backend/requirements.txt` (one new dependency line)
- `.gitignore` (add `backend/.cache/` if not already covered)
