# Limitations

## Playwright agent cannot run on the deployed VM

The rent-comps agent (`backend/rent_comps/agent.py`) launches a real browser via
`npx @playwright/mcp@latest`. This was validated locally on macOS where
`/Applications/Google Chrome.app` is present.

The production backend runs on GCP VM `kw-property-valuation` (`34.87.4.244`,
`asia-southeast1-a`), which is a headless Linux server with no browser or display
installed. When the deployed backend receives `GET /rent-comps` and triggers a
cache miss, the Playwright MCP process will fail immediately trying to launch Chrome.

### Options to resolve

1. **Install Chromium on the VM** — `sudo apt install chromium-browser`, then
   confirm `@playwright/mcp` can find it in headless mode. One-time setup,
   ~150 MB. Proper fix for a live agent flow.

2. **Pre-populate cache locally, deploy the cache** — run
   `python -m backend.rent_comps.cli --mukim "<mukim>"` locally for every mukim
   needed for the demo, commit or SCP the resulting `.cache/rent_comps/*.json`
   files to the VM. The `/rent-comps` endpoint only reads cache; the live agent
   never runs on the VM. Simple for a demo, but breaks for any uncached mukim.
