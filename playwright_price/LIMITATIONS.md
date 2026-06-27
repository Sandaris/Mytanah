# Limitations

## Playwright agent needs a local browser

The rent-comps agent (`backend/rent_comps/agent.py`) launches a real browser via
`npx @playwright/mcp@latest`. This was validated locally on macOS where
`/Applications/Google Chrome.app` is present.

On a headless Linux server with no browser installed, `GET /rent-comps` on a
cache miss will fail when Playwright tries to launch Chrome.

### Options to resolve

1. **Install Chromium on the server** — e.g. `sudo apt install chromium-browser`,
   then confirm `@playwright/mcp` can find it in headless mode.

2. **Pre-populate cache locally** — run
   `python -m backend.rent_comps.cli --mukim "<mukim>"` locally for every mukim
   needed for the demo, then ship the resulting `.cache/rent_comps/*.json` files.
   The `/rent-comps` endpoint only reads cache; the live agent never runs on the
   server. Simple for a demo, but breaks for any uncached mukim.
