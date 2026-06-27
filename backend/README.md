# FYP2 Backend API

FastAPI service that exposes a live (web-search) property valuation, the housing cycle regime indicator, and the cleaned transactions dataset to a frontend.

## One-time setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set `EXA_API_KEY` — valuation calls the Exa
Agent to search Malaysian property portals for comparable sale prices. Without a
key, `/valuation/predict` returns `predicted_price: null`.

## Valuation: live web search, not ML

`/valuation/predict` is **not** model-based. The user's property fields drive a
comparable-listing search via the Exa Agent (`backend/valuation_comps/`), which
returns a structured market-value estimate. Results are cached on disk
(`backend/.cache/valuation_comps/`, 48h TTL) so repeat searches are instant.
There is no `torch`/`xgboost` dependency.

## Build the HCR artifact

`save_models.py` builds only the housing-cycle regime (HCR) logit now (valuation
needs no artifact):

```powershell
python save_models.py
```

What it produces:
- `artifacts/hcr_model.joblib` — logistic regression on 6 macro features. Requires `backend/hcr_quarterly.csv`; the script tells you what columns it expects. Export this from `Data Exploration & Cleaning/HCR_Logit_Regression.ipynb`.
- `artifacts/hcr_latest.json` — most recent quarter's regime probability so `GET /hcr/current` is instant.

## Run

```powershell
uvicorn api:app --reload
```

- **App (dashboard UI)**: <http://127.0.0.1:8000/> — auto-redirects to the MyPropertyIQ prototype
- Interactive docs: <http://127.0.0.1:8000/docs>
- Health: <http://127.0.0.1:8000/health>

The frontend (`../frontend/`) is served as static files at `/app/...` from the same uvicorn process, so the React UI calls the API on the same origin — no CORS, no second server.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET`  | `/health` | Service + data status (incl. whether the Exa key is set) |
| `POST` | `/valuation/predict` | Live market-value estimate via Exa web search |
| `GET`  | `/valuation/options` | Dropdown values for each categorical field |
| `GET`  | `/hcr/current` | Latest precomputed regime + probability |
| `POST` | `/hcr/predict` | Regime probability for a custom macro vector |
| `GET`  | `/data/query` | Filter the cleaned transactions (district, type, year, price range) |

### Sample valuation call

```bash
curl -X POST http://127.0.0.1:8000/valuation/predict \
  -H "Content-Type: application/json" \
  -d '{
    "property_type": "2 - 2 1/2 Storey Terraced",
    "district": "Petaling",
    "mukim": "Damansara",
    "scheme": "Bandar Utama",
    "tenure": "Freehold",
    "land": 167,
    "area": 195
  }'
```

`land` / `area` are in **square metres** (the dataset's unit); the valuation
agent converts them to sq ft for the web search. The response includes
`predicted_price`, `price_low`/`price_high`, `confidence`, `listing_count`,
`sources_used`, and `web_comparables` (sample listings with URLs).

### Frontend wiring

CORS is preconfigured for `http://localhost:3000` (CRA/Next dev) and `http://localhost:5173` (Vite). Add more origins in `api.py` if your frontend dev server runs elsewhere.

Minimal fetch from React:

```js
const res = await fetch("http://127.0.0.1:8000/valuation/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const { predicted_price } = await res.json();
```

## Tuning the valuation search

`backend/valuation_comps/` wraps the Exa Agent. Optional `.env` knobs:
- `VAL_EXA_EFFORT` (default `medium`) — Exa agent reasoning effort.
- `VAL_EXA_TIMEOUT_MS` (default `180000`) — poll timeout.

The search query is built in `valuation_comps/context.py` (`exa_query`) and the
structured-output schema + response mapping live in `valuation_comps/exa.py`.
