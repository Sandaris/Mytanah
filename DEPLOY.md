# Deploy runbook — MyPropertyIQ (FYP2)

This repo is deployed to a single GCP VM. The VM is **not** a git clone — files
are pushed up over `gcloud compute scp`. When the user says "deploy", do the
steps below without asking for confirmation.

## Target

| Item            | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| GCP instance    | `kw-property-valuation`                                          |
| Zone            | `asia-southeast1-a`                                              |
| External IP     | `34.87.4.244`                                                    |
| Public URL      | `http://34.87.4.244/`                                            |
| VM user         | `kaiwen_pixalink_io`                                             |
| App dir on VM   | `/home/kaiwen_pixalink_io/fyp2/`                                 |
| systemd service | `fyp2.service` (runs uvicorn on **port 80**)                     |
| Health endpoint | `GET http://34.87.4.244/` → 307 redirect when up                 |

The service binds privileged port 80 thanks to
`AmbientCapabilities=CAP_NET_BIND_SERVICE` in the unit file — do not change
that or you will need to run as root. Port 80 is reachable because the VM has
the `http-server` network tag and the project has the default
`default-allow-http` firewall rule.

## SSH — important quirk

**Use direct SSH, not IAP.** The conditional IAP tunnel grant currently fails
with `4033: 'not authorized'`. Direct SSH over the external IP works:

```bash
gcloud compute ssh kw-property-valuation --zone=asia-southeast1-a --command="…"
```

Do **not** pass `--tunnel-through-iap`. Do **not** request additional IAM
roles to "fix" IAP — the user has explicitly refused that. IAM is sufficient.

## SCP — important quirk

`gcloud compute scp` on Windows mangles backslash paths
(`C:\Users\...` becomes `C:UsersUser...`). Always use **forward slashes**:

```bash
gcloud compute scp \
  "C:/Users/User/Documents/APU/FYP2/path/to/file" \
  kw-property-valuation:/home/kaiwen_pixalink_io/fyp2/path/to/file \
  --zone=asia-southeast1-a
```

## Deploy procedure

1. **Check local git is clean and pushed** (so the deployed state matches the
   commit history):

   ```bash
   git status
   git log --oneline -5
   ```

   If the local branch is ahead of `origin/main`, push first.

2. **Diff against what's on the VM** to find which files actually need to go
   up. Compare commit timestamps to the VM file mtimes, or just diff the
   commits since the last known deploy:

   ```bash
   git log --name-status <last-deployed-sha>..HEAD
   ```

   If you don't know the last deployed SHA, SSH in and `ls -la` the suspected
   files. Frontend changes and backend changes are independent — only sync
   the dirs that actually changed.

3. **SCP the changed files** (parallel SCP calls are fine, one per file):

   - Use forward-slash paths (see above).
   - For deletions on the VM, do them over SSH:
     `rm path` or `rm -rf dir`.
   - Do **not** SCP the venv, `__pycache__`, `*.parquet` unless they actually
     changed, or `node_modules`.

4. **Restart the service only if backend changed.** Static frontend assets
   are served directly from disk by FastAPI's static mount, so frontend-only
   changes (jsx, css, images, video) are live the moment SCP finishes — no
   restart needed.

   When `backend/api.py`, `backend/requirements.txt`, `backend/save_models.py`,
   anything in `backend/artifacts/`, `backend/rent_comps/`, or
   `backend/valuation_comps/` changes, restart:

   ```bash
   gcloud compute ssh kw-property-valuation --zone=asia-southeast1-a \
     --command="sudo systemctl restart fyp2 && sleep 8 && systemctl status fyp2 --no-pager | head -15"
   ```

   **If `requirements.txt` changed**, install into the venv *before* restarting:

   ```bash
   gcloud compute ssh kw-property-valuation --zone=asia-southeast1-a \
     --command="/home/kaiwen_pixalink_io/fyp2/backend/.venv/bin/pip install -r /home/kaiwen_pixalink_io/fyp2/backend/requirements.txt"
   ```

   **Valuation needs `EXA_API_KEY`** in `backend/.env` on the VM (the same key
   the rent-comps agent uses). `/valuation/predict` now searches property portals
   via the Exa Agent instead of loading a trained model — there is no longer any
   `torch`/`xgboost` dependency. It works for both Malaysia (RM) and Singapore
   (SGD, `country: "SG"`). Without the key, valuation returns `predicted_price:
   null` and the dashboard shows "valuation unavailable".

   The `sleep 8` is just a safety margin for uvicorn + the dataframe load on cold
   start, so an immediate `curl` doesn't race the boot and report
   `local_health=000` even though the service is fine.

5. **Smoke-test the live URL:**

   ```bash
   curl -sS -o /dev/null -w "%{http_code}\n" --max-time 10 http://34.87.4.244/
   # expect: 307 (root redirects to the dashboard)
   curl -sS -o /dev/null -w "%{http_code}\n" --max-time 10 \
     http://34.87.4.244/app/ui_kits/dashboard/index.html
   # expect: 200
   ```

   If you changed any specific frontend asset, also `curl -I` it to confirm
   the new size lands.

## What lives where on the VM

```
/home/kaiwen_pixalink_io/fyp2/
├── backend/
│   ├── api.py                    # FastAPI entrypoint (uvicorn loads api:app)
│   ├── requirements.txt
│   ├── save_models.py
│   ├── artifacts/                # HCR logit bundle (hcr_model.joblib, hcr_latest.json)
│   ├── valuation_comps/          # Exa web-search valuation agent (MY + SG)
│   ├── rent_comps/               # Exa/Playwright rent-comps agent
│   └── .venv/                    # Python venv — do NOT scp this
├── frontend/
│   └── ui_kits/dashboard/        # the live UI
└── processed data/
    ├── transactions.parquet      # cleaned dataset (~4.4 MB)
    └── scheme_mukim_index.csv    # Scheme/Area → Mukim index
```

## systemd unit (for reference)

`/etc/systemd/system/fyp2.service` on the VM:

```ini
[Unit]
Description=FYP2 Property API (FastAPI/uvicorn)
After=network-online.target

[Service]
Type=simple
User=kaiwen_pixalink_io
WorkingDirectory=/home/kaiwen_pixalink_io/fyp2/backend
Environment=PYTHONUNBUFFERED=1
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
ExecStart=/home/kaiwen_pixalink_io/fyp2/backend/.venv/bin/uvicorn api:app --host 0.0.0.0 --port 80 --workers 1
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

If the unit file itself ever changes, run `sudo systemctl daemon-reload`
before restarting the service.

## Troubleshooting

- **`4033: 'not authorized'` on SSH** — you used `--tunnel-through-iap`. Drop
  that flag and try direct SSH.
- **`local_health=000` right after restart** — model is still loading. Wait
  ~8 seconds and retry.
- **`scp` says "No such file or directory" with a mangled path** — you used
  Windows backslashes. Switch to forward slashes.
- **CRLF warnings on `git add`** — harmless Windows line-ending noise; ignore.
- **External port-8000 is firewall-blocked.** The service binds port 80 on
  purpose. Don't move it back to 8000 unless you also add a firewall rule.
