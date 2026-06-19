/* Thin client for the FastAPI backend.
   Exposed as `window.API` so any Babel-rendered JSX can call it.
   When the frontend is served from FastAPI's StaticFiles mount, paths are
   same-origin and CORS is a non-issue. */
(function () {
  // Resolve API base: same origin when served via FastAPI, else localhost.
  const sameOrigin = location.protocol.startsWith('http');
  const BASE = sameOrigin
    ? location.origin
    : 'http://127.0.0.1:8000';

  async function req(path, opts = {}) {
    const res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (!res.ok) {
      let detail = res.statusText;
      try { detail = (await res.json()).detail || detail; } catch (_) {}
      const e = new Error(`API ${res.status}: ${detail}`);
      e.status = res.status;
      throw e;
    }
    return res.json();
  }

  window.API = {
    base: BASE,
    health: () => req('/health'),

    valuationOptions: (filters = {}) => {
      const q = new URLSearchParams(filters).toString();
      return req('/valuation/options' + (q ? '?' + q : ''));
    },
    valuationPredict: (payload) =>
      req('/valuation/predict', { method: 'POST', body: JSON.stringify(payload) }),

    hcrCurrent: () => req('/hcr/current'),
    hcrPredict: (payload) =>
      req('/hcr/predict', { method: 'POST', body: JSON.stringify(payload) }),

    dataQuery: (params = {}) => {
      const q = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
      ).toString();
      return req('/data/query' + (q ? '?' + q : ''));
    },
  };
})();
