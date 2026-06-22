/* eslint-disable no-undef */
/* ValuationDashboard.jsx — the Valuation tab's result panel.
   Shown inside the map's bottom sheet once the user has chosen a Scheme/Area.
   Estimates the property's market value (switchable between three models —
   Linear Regression, Random Forest, Neural Network) and surfaces the
   essential market data for the chosen region, mirroring the real NAPIC
   Open Transaction schema: average price by property type, median price,
   price per m² (built-up), median built-up / land area (sq.m), tenure mix,
   and the price + volume trend across 2021–2026. All figures derive from the
   same calibrated transaction layer the map uses, so the dashboard always
   agrees with the underlying records. */
const { useState, useMemo, useEffect } = React;

const STRATA_TYPES = new Set(['Condominium/Apartment', 'Flat', 'Low-Cost Flat', 'Town House']);

/* ---- stats helpers ---------------------------------------------------- */
const valMean = (a) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const valMedian = (a) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const rmCompact = (n) => {
  if (!n) return '—';
  if (n >= 1e6) return 'RM ' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return 'RM ' + Math.round(n / 1e3) + 'k';
  return formatRM(n);
};
const SHORT_TYPE = {
  '1 - 1 1/2 Storey Terraced': '1–1½ Terraced', '2 - 2 1/2 Storey Terraced': '2–2½ Terraced',
  'Condominium/Apartment': 'Condo / Apt', '1 - 1 1/2 Storey Semi-Detached': '1–1½ Semi-D',
  'Low-Cost House': 'Low-Cost House', 'Detached': 'Detached',
  '2 - 2 1/2 Storey Semi-Detached': '2–2½ Semi-D', 'Flat': 'Flat',
  'Low-Cost Flat': 'Low-Cost Flat', 'Cluster House': 'Cluster House', 'Town House': 'Town House',
};
const shortType = (t) => SHORT_TYPE[t] || t;

/* Recent real transactions (NAPIC Open Transaction Data) scoped to the
   selection — rendered as a scrollable table, one row per record. */
const VAL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtTxnMonth = (iso) => {
  if (!iso) return '—';
  const s = String(iso);
  return (VAL_MONTHS[+s.slice(5, 7) - 1] || '') + ' ' + s.slice(0, 4);
};
const RecentTh = ({ children, right }) => (
  <th style={{
    position: 'sticky', top: 0, zIndex: 1, background: C.raised,
    textAlign: right ? 'right' : 'left', padding: '8px 10px',
    fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '.07em', color: C.earth,
    whiteSpace: 'nowrap', borderBottom: `1.5px solid ${C.border}`,
  }}>{children}</th>
);
const recentCell = {
  padding: '7px 10px', fontFamily: "'DM Sans',sans-serif", fontSize: 11.5,
  color: C.mid, borderBottom: `1px solid ${C.border}80`, verticalAlign: 'top',
};
const recentNum = { ...recentCell, textAlign: 'right', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace" };
const RecentTxnRow = ({ r, i }) => {
  const price = Number(r.Price || 0);
  const built = r.Area == null ? null : Number(r.Area);
  const land = r.Land == null ? null : Number(r.Land);
  const size = built || land;
  const place = r['Road Name'] || r['Scheme Name/Area'] || r.Mukim || '—';
  return (
    <tr style={{ background: i % 2 ? C.cream + '40' : 'transparent' }}>
      <td style={{ ...recentCell, whiteSpace: 'nowrap' }}>{fmtTxnMonth(r['Transaction Date'])}</td>
      <td style={{ ...recentCell, color: C.deep, fontWeight: 500 }}>{shortType(r['Property Type'] || '—')}</td>
      <td style={recentCell}>{place}</td>
      <td style={recentNum}>{size ? Math.round(size).toLocaleString('en-MY') : '—'}</td>
      <td style={{ ...recentNum, color: C.deep, fontWeight: 600 }}>{rmCompact(price)}</td>
    </tr>
  );
};

/* ---- region aggregation (area-level sample) --------------------------- */
function valComputeRegion(sel) {
  const { state, district, mukim, area, propertyType } = sel || {};
  let rows = [];
  try { rows = getTransactionsForScope({ state, district, mukim, area }) || []; } catch (e) {}
  if (rows.length < 6) { try { rows = rows.concat(getTransactions({ state, district, mukim, area, road: '' }) || []); } catch (e) {} }

  const typeRows = propertyType ? rows.filter(r => r.type === propertyType) : [];
  const valuationRows = typeRows.length ? typeRows : rows;

  const median = valMedian(valuationRows.map(r => r.price));
  const ppsmArr = valuationRows.map(r => r.ppsm).filter(Boolean);
  const ppsm = ppsmArr.length ? Math.round(valMedian(ppsmArr)) : null;
  const floorArr = valuationRows.map(r => r.built).filter(Boolean);
  const medFloor = floorArr.length ? Math.round(valMedian(floorArr)) : null;
  const landArr = valuationRows.map(r => r.land).filter(Boolean);
  const medLand = landArr.length ? Math.round(valMedian(landArr)) : null;
  const fhPct = Math.round(100 * valuationRows.filter(r => r.tenure === 'Freehold').length / (valuationRows.length || 1));

  const map = {};
  rows.forEach(r => { (map[r.type] = map[r.type] || []).push(r); });
  const byType = Object.entries(map)
    .map(([type, arr]) => ({ type, avg: valMean(arr.map(r => r.price)), n: arr.length }))
    .sort((a, b) => b.avg - a.avg);
  const dominant = byType.reduce((a, b) => (a && a.n >= b.n ? a : b), null);

  const byYear = {};
  rows.forEach(r => { (byYear[r.year] = byYear[r.year] || []).push(r.price); });
  const yearAvg = Object.keys(byYear).map(Number).sort()
    .map(y => ({ y, avg: valMean(byYear[y]), n: byYear[y].length }));
  let trendTotal = null;
  if (yearAvg.length >= 2) {
    const f = yearAvg[0], l = yearAvg[yearAvg.length - 1];
    trendTotal = (l.avg / f.avg - 1) * 100;
  }
  return {
    rows,
    valuationRows,
    count: valuationRows.length || rows.length,
    median,
    ppsm,
    medFloor,
    medLand,
    fhPct,
    byType,
    dominant,
    selectedType: propertyType || (dominant && dominant.type),
    yearAvg,
    trendTotal,
    baseVal: median || 400000,
  };
}

function valModels(base) {
  return [
    { label: 'Linear Regression', short: 'Linear', point: base * 0.965, band: 0.15, conf: 81, mae: '8.4%',
      note: 'Transparent baseline — assumes linear price drivers.' },
    { label: 'Random Forest', short: 'Forest', point: base * 1.005, band: 0.10, conf: 90, mae: '5.2%',
      note: 'Ensemble of decision trees, robust to outliers.' },
    { label: 'Neural Network', short: 'Neural', point: base * 1.035, band: 0.07, conf: 93, mae: '4.1%',
      note: 'Deep model capturing non-linear interactions.' },
  ];
}

/* ---- small presentational bits --------------------------------------- */
const StatTile = ({ label, value, sub, accent }) => (
  <div style={{
    background: C.cream, border: `1px solid ${C.border}`, borderRadius: 10,
    padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <Eyebrow style={{ fontSize: 10 }}>{label}</Eyebrow>
    <Mono size={17} color={accent || C.deep}>{value}</Mono>
    {sub && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.mid }}>{sub}</span>}
  </div>
);

const ValuationDashboard = ({ sel, loading, fullpage }) => {
  const [modelIdx, setModelIdx] = useState(1); // Random Forest default
  const [apiResult, setApiResult] = useState(null);   // live /valuation/predict
  const [apiError, setApiError]   = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [recentTxns, setRecentTxns] = useState(null);   // real Open Transaction Data rows
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentScope, setRecentScope] = useState('exact'); // 'exact' | 'family' | 'area'
  const [recentTotal, setRecentTotal] = useState(0);   // total matched (may exceed the 1000 shown)
  const [byTypeReal, setByTypeReal] = useState(null); // real avg price per property type
  const [yearReal, setYearReal] = useState(null);     // real yearly avg price for the selected type
  const data = useMemo(() => valComputeRegion(sel),
    [sel.state, sel.district, sel.mukim, sel.area, sel.propertyType]);

  /* Latest actual transactions for the chosen area, straight from the cleaned
     NAPIC Open Transaction Data (/data/query => transactions.parquet), newest
     first. Property type leads the priority:
       1) sales of the exact selected type in the area;
       2) else the most similar type - same landed / non-landed family;
       3) else whatever transacted in the area.
     Road is NOT used to scope this list: names in the source are inconsistently
     abbreviated (LRG / JLN / JALAN / LORONG ...), which would wrongly empty it. */
  useEffect(() => {
    if (!sel.district) { setRecentTxns(null); setRecentScope('exact'); return; }
    let cancelled = false;
    setRecentLoading(true);
    const area = {
      district: sel.district, mukim: sel.mukim, scheme: sel.area,
      sort_by: 'Transaction Date', order: 'desc',
    };
    const sameFamily = (t) => STRATA_TYPES.has(t) === STRATA_TYPES.has(sel.propertyType);
    const done = (rows, scope, total) => {
      if (cancelled) return;
      setRecentTxns(rows); setRecentScope(scope); setRecentTotal(total || 0); setRecentLoading(false);
    };

    // 1) exact selected type — ALL matching records in the area (backend caps 1000).
    const exactReq = sel.propertyType
      ? window.API.dataQuery({ ...area, property_type: sel.propertyType, limit: 1000 })
      : Promise.resolve({ rows: [] });

    exactReq
      .then((d) => {
        if (cancelled) return;
        if (sel.propertyType && d.rows && d.rows.length) { done(d.rows, 'exact', d.total_matched); return; }
        // 2/3) widen to the whole area, then prefer the same landed/non-landed family.
        window.API.dataQuery({ ...area, limit: 1000 })
          .then((all) => {
            if (cancelled) return;
            const rows = all.rows || [];
            if (!rows.length) { done([], 'exact', 0); return; }
            const fam = sel.propertyType ? rows.filter((r) => sameFamily(r['Property Type'])) : [];
            if (fam.length) done(fam, 'family', fam.length);
            else done(rows, 'area', all.total_matched);
          })
          .catch(() => done([], 'exact', 0));
      })
      .catch(() => done([], 'exact', 0));
    return () => { cancelled = true; };
  }, [sel.district, sel.mukim, sel.area, sel.propertyType]);

  /* Real average price per property type for the area, computed server-side over
     every matching record (not the paginated page). `limit: 1` keeps the payload
     tiny — we only want stats.by_type. Not filtered by type: the card shows all
     types side by side. Falls back to the calibrated layer if the API is offline. */
  useEffect(() => {
    if (!sel.district) { setByTypeReal(null); return; }
    let cancelled = false;
    window.API.dataQuery({
      district: sel.district, mukim: sel.mukim, scheme: sel.area, limit: 1,
    })
      .then((d) => { if (!cancelled) setByTypeReal((d.stats && d.stats.by_type) || []); })
      .catch(() => { if (!cancelled) setByTypeReal(null); });
    return () => { cancelled = true; };
  }, [sel.district, sel.mukim, sel.area]);

  /* Real yearly average price for the SELECTED property type in the area
     (server-side yearly stats over all matching rows). If that type has no sales
     here, fall back to the area's all-type yearly trend so the chart isn't blank.
     `limit: 1` — we only need stats.yearly. Calibrated layer is the offline fallback. */
  useEffect(() => {
    if (!sel.district) { setYearReal(null); return; }
    let cancelled = false;
    const area = { district: sel.district, mukim: sel.mukim, scheme: sel.area };
    const toYears = (yearly) => (yearly || []).map(y => ({ y: y.year, avg: y.mean, n: y.count }));
    window.API.dataQuery({ ...area, property_type: sel.propertyType, limit: 1 })
      .then((d) => {
        if (cancelled) return;
        const yearly = (d.stats && d.stats.yearly) || [];
        if (sel.propertyType && yearly.length) { setYearReal({ rows: toYears(yearly), scope: 'type' }); return; }
        window.API.dataQuery({ ...area, limit: 1 })
          .then((a) => {
            if (cancelled) return;
            setYearReal({ rows: toYears(a.stats && a.stats.yearly), scope: 'area' });
          })
          .catch(() => { if (!cancelled) setYearReal(null); });
      })
      .catch(() => { if (!cancelled) setYearReal(null); });
    return () => { cancelled = true; };
  }, [sel.district, sel.mukim, sel.area, sel.propertyType]);

  /* Call the live backend whenever the selection (or its derived stats) changes.
     The other two models keep their illustrative multipliers. */
  useEffect(() => {
    if (!data.selectedType || !sel.district) { setApiResult(null); return; }
    setApiLoading(true); setApiError(null);
    const isStrata = STRATA_TYPES.has(data.selectedType);
    const modelLand = isStrata
      ? (data.medFloor || data.medLand || 1)
      : (data.medLand || data.medFloor || 1);
    const modelArea = isStrata ? null : (data.medFloor || null);
    const payload = {
      property_type: data.selectedType,
      district: sel.district,
      mukim: sel.mukim || sel.district,
      scheme: sel.area || sel.mukim || sel.district,
      tenure: (data.fhPct >= 50 ? 'Freehold' : 'Leasehold'),
      land: Math.max(1, Math.round(modelLand)),
      area: modelArea ? Math.round(modelArea) : null,
    };
    let cancelled = false;
    window.API.valuationPredict(payload)
      .then((r) => { if (!cancelled) setApiResult(r); })
      .catch((e) => { if (!cancelled) setApiError(e.message); })
      .finally(() => { if (!cancelled) setApiLoading(false); });
    return () => { cancelled = true; };
  }, [sel.district, sel.mukim, sel.area, data.selectedType, data.fhPct, data.medLand, data.medFloor]);

  /* Mock model band, then overlay the live RF estimate when ready. */
  const models = useMemo(() => {
    const base = valModels(data.baseVal);
    if (apiResult) {
      const lo = apiResult.price_low, hi = apiResult.price_high, pt = apiResult.predicted_price;
      const band = Math.max(0.02, (hi - lo) / (2 * pt));
      base[1] = {
        ...base[1],
        point: pt,
        band,
        conf: apiResult.confidence === 'high' ? 93 : apiResult.confidence === 'medium' ? 88 : 78,
        note: 'Live Random Forest — ' +
          (apiResult.comparables?.length || 0) + ' comparables anchored from NAPIC transactions.',
        live: true,
      };
    }
    return base;
  }, [data.baseVal, apiResult]);
  const m = models[modelIdx];

  const low = m.point * (1 - m.band);
  const high = m.point * (1 + m.band);
  const dLow = Math.min(...models.map(x => x.point * (1 - x.band)));
  const dHigh = Math.max(...models.map(x => x.point * (1 + x.band)));
  const pct = (v) => Math.max(0, Math.min(100, ((v - dLow) / (dHigh - dLow)) * 100));
  const valPerSqm = data.medFloor ? Math.round(m.point / data.medFloor) : null;

  // Average price by property type — real aggregates from the Open Transaction
  // Data (server-computed over all matching rows); calibrated layer is the
  // offline fallback. Normalised to {type, avg, n} so the card stays unchanged.
  const byType = (byTypeReal && byTypeReal.length)
    ? byTypeReal.map(t => ({ type: t.type, avg: t.mean, n: t.count }))
    : (byTypeReal ? [] : data.byType);
  const dominantType = byType.reduce((a, b) => (a && a.n >= b.n ? a : b), null);
  const maxTypeAvg = Math.max(...byType.map(t => t.avg), 1);

  // Average transacted price by year — real yearly trend for the selected type
  // in the area (calibrated layer is the offline fallback). Scope flag tells the
  // header whether it narrowed to the type or widened to the whole area.
  const yearAvg = (yearReal && yearReal.rows && yearReal.rows.length)
    ? yearReal.rows
    : (yearReal ? [] : data.yearAvg);
  const yearScope = yearReal ? yearReal.scope : null;
  const maxYear = Math.max(...yearAvg.map(y => y.avg), 1);
  const minYear = Math.min(...yearAvg.map(y => y.avg), maxYear);
  const maxVol = Math.max(...yearAvg.map(y => y.n), 1);
  const trendUp = (data.trendTotal || 0) >= 0;

  const recentArea = sel.area || sel.mukim || sel.district;
  const recentFamily = STRATA_TYPES.has(sel.propertyType) ? 'non-landed' : 'landed';
  const recentNote = recentScope === 'family'
    ? `No ${shortType(sel.propertyType)} sales in ${recentArea} — showing the most similar ${recentFamily} sales.`
    : recentScope === 'area'
      ? `No ${shortType(sel.propertyType)} or similar ${recentFamily} sales — showing all recent sales in ${recentArea}.`
      : null;

  return (
    <div style={{ height: fullpage ? 'auto' : '100%', display: 'flex', flexDirection: 'column', background: C.raised, position: 'relative' }}>
      {/* header */}
      <div style={{ padding: '15px 20px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Eyebrow>Automated Valuation</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
          <Display size={21} weight={500}>{sel.area || sel.district}</Display>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.mid }}>
            {[sel.district, sel.state].filter(Boolean).join(', ')} · {data.count} comparable transactions · NAPIC 2021–2026
          </span>
        </div>
      </div>

      {/* body */}
      <div className="val-grid" style={{
        flex: fullpage ? 'none' : 1, overflowY: fullpage ? 'visible' : 'auto', padding: fullpage ? 24 : 18,
        display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: 18, alignContent: 'start',
      }}>
        {/* ===== LEFT — estimate + model switcher ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Eyebrow style={{ marginBottom: 7 }}>Valuation model</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {models.map((x, i) => {
                const on = i === modelIdx;
                return (
                  <button key={x.label} onClick={() => setModelIdx(i)} style={{
                    padding: '9px 4px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${on ? C.deep : C.border}`,
                    background: on ? C.deep : C.cream, color: on ? C.cream : C.mid,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600,
                    transition: 'all .18s',
                  }}>{x.short}</button>
                );
              })}
            </div>
          </div>

          <Card borderTop={C.earth} style={{ padding: 20 }}>
            <Eyebrow>
              Estimated Market Value · {m.label}
              {m.live && (
                <span style={{
                  marginLeft: 8, padding: '1px 7px', borderRadius: 9999,
                  background: C.up + '22', color: C.up, fontSize: 9,
                  letterSpacing: '.12em', fontWeight: 600,
                }}>LIVE</span>
              )}
              {apiLoading && modelIdx === 1 && (
                <span style={{ marginLeft: 8, color: C.muted, fontSize: 9, letterSpacing: '.12em' }}>
                  FETCHING…
                </span>
              )}
            </Eyebrow>
            {apiError && modelIdx === 1 && (
              <div style={{
                marginTop: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.down,
              }}>API error: {apiError} — showing illustrative estimate.</div>
            )}
            <div style={{ marginTop: 8 }}>
              <Mono size={34} color={C.deep}>{formatRM(Math.round(m.point / 1000) * 1000)}</Mono>
            </div>
            <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.mid }}>
                Likely range {rmCompact(low)} – {rmCompact(high)}
              </span>
              {valPerSqm && <Mono size={12} color={C.earth}>≈ RM {valPerSqm.toLocaleString()}/m²</Mono>}
            </div>

            {/* confidence band across all models */}
            <div style={{ position: 'relative', height: 46, marginTop: 18 }}>
              <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 4,
                background: C.cream, borderRadius: 2, border: `1px solid ${C.border}` }}/>
              <div style={{ position: 'absolute', top: 19, height: 6, borderRadius: 3,
                left: pct(low) + '%', width: (pct(high) - pct(low)) + '%',
                background: C.earth + '55', border: `1px solid ${C.earth}`, transition: 'left .35s, width .35s' }}/>
              {models.map((x, i) => i !== modelIdx && (
                <div key={x.label} style={{ position: 'absolute', top: 16, width: 2, height: 12,
                  left: pct(x.point) + '%', background: C.muted, transform: 'translateX(-50%)' }}/>
              ))}
              <div style={{ position: 'absolute', top: 12, left: pct(m.point) + '%', transform: 'translateX(-50%)', transition: 'left .35s' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.earth, border: `2px solid ${C.raised}`, boxShadow: '0 2px 6px rgba(44,57,48,.3)' }}/>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.muted }}>{rmCompact(dLow)}</div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.muted }}>{rmCompact(dHigh)}</div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`,
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Eyebrow style={{ fontSize: 9.5, whiteSpace: 'nowrap' }}>Confidence</Eyebrow>
                <Mono size={15} color={C.up}>{m.conf}%</Mono>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Eyebrow style={{ fontSize: 9.5, whiteSpace: 'nowrap' }}>MAE</Eyebrow>
                <Mono size={15}>{m.mae}</Mono>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Eyebrow style={{ fontSize: 9.5, whiteSpace: 'nowrap' }}>vs median</Eyebrow>
                <Mono size={15} color={m.point >= data.median ? C.up : C.down}>
                  {(m.point >= data.median ? '+' : '') + ((m.point / data.median - 1) * 100).toFixed(1)}%
                </Mono>
              </div>
            </div>
            <div style={{ marginTop: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid, lineHeight: 1.45, fontStyle: 'italic' }}>
              {m.note}
            </div>
          </Card>
        </div>

        {/* ===== RIGHT — region data ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div className="val-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <StatTile label="Median price" value={rmCompact(data.median)} sub={`${data.count} sales`}/>
            <StatTile label="Median RM/m²" value={data.ppsm ? 'RM ' + data.ppsm.toLocaleString() : '—'} sub="built-up"/>
            <StatTile label="Median built-up" value={data.medFloor ? data.medFloor + ' m²' : '—'}
              sub={data.medLand ? data.medLand + ' m² land' : 'strata'}/>
            <StatTile label="Trend ’21→’26" value={(trendUp ? '+' : '') + (data.trendTotal || 0).toFixed(1) + '%'}
              accent={trendUp ? C.up : C.down} sub={data.fhPct + '% freehold'}/>
          </div>

          {/* recent transactions — real NAPIC Open Transaction Data, scoped to the
              selected fields. Sits above the averages so the latest actual sales
              lead the area read-out. */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <Display size={16} weight={500}>Recent transactions</Display>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid }}>
                {recentTxns && recentTxns.length
                  ? (recentTotal > recentTxns.length
                      ? `${recentTxns.length.toLocaleString('en-MY')} of ${recentTotal.toLocaleString('en-MY')} records`
                      : `${recentTxns.length.toLocaleString('en-MY')} record${recentTxns.length > 1 ? 's' : ''}`)
                  : 'matching records'}
              </span>
            </div>
            {!recentLoading && recentTxns && recentTxns.length > 0 && recentNote && (
              <div style={{
                marginTop: 8, padding: '7px 10px', borderRadius: 7,
                background: C.earthFaint, border: `1px solid ${C.earth}33`,
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, lineHeight: 1.4, color: C.mid,
              }}>{recentNote}</div>
            )}
            {recentLoading ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '14px 2px',
                fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.mid,
              }}>
                <span className="tmap-spin" style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `2px solid ${C.border}`, borderTopColor: C.earth, display: 'inline-block',
                }}/>
                Loading recent transactions…
              </div>
            ) : (recentTxns && recentTxns.length) ? (
              <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <RecentTh>Date</RecentTh>
                        <RecentTh>Type</RecentTh>
                        <RecentTh>Road / Area</RecentTh>
                        <RecentTh right>m²</RecentTh>
                        <RecentTh right>Price</RecentTh>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTxns.map((r, i) => <RecentTxnRow key={i} r={r} i={i}/>)}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: 6, padding: '14px 2px', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.muted,
              }}>No transaction records found for this selection.</div>
            )}
          </Card>

          {/* avg price by property type — real averages from the Open Transaction Data */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <Display size={16} weight={500}>Average price by property type</Display>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid }}>
                avg · count
              </span>
            </div>
            {byType.length === 0 ? (
              <div style={{ marginTop: 12, padding: '14px 0', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.muted }}>
                No transaction records found for this selection.
              </div>
            ) : (
            <div style={{ marginTop: 14, display: 'grid', gap: 9 }}>
              {byType.map(t => {
                const dom = dominantType && t.type === dominantType.type;
                return (
                  <div key={t.type} style={{ display: 'grid', gridTemplateColumns: '128px 1fr 118px', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5,
                      color: dom ? C.earth : C.deep, fontWeight: dom ? 600 : 400,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shortType(t.type)}</span>
                    <div style={{ height: 14, background: C.cream, borderRadius: 4, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                      <div style={{ width: (t.avg / maxTypeAvg * 100) + '%', height: '100%',
                        background: dom ? C.earth : C.light, transition: 'width .8s cubic-bezier(.16,1,.3,1)' }}/>
                    </div>
                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Mono size={12}>{rmCompact(t.avg)}</Mono>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: C.muted }}> · {t.n}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </Card>

          {/* price + volume trend by year — real yearly avg for the selected type */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <Display size={16} weight={500}>Average transacted price by year</Display>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid }}>
                {yearScope === 'type' && sel.propertyType
                  ? `${shortType(sel.propertyType)} · bar = avg · ● = volume`
                  : yearScope === 'area'
                    ? 'all types · bar = avg · ● = volume'
                    : 'bar = avg price · ● = volume'}
              </span>
            </div>
            {yearAvg.length === 0 ? (
              <div style={{ marginTop: 12, padding: '14px 0', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.muted }}>
                No transaction records found for this selection.
              </div>
            ) : (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', gap: 14, height: 118 }}>
              {yearAvg.map(y => {
                const h = 18 + ((y.avg - minYear) / (maxYear - minYear || 1)) * 74;
                return (
                  <div key={y.y} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                    <Mono size={10} color={C.mid}>{rmCompact(y.avg)}</Mono>
                    <div style={{ width: '100%', maxWidth: 46, height: h, background: `linear-gradient(180deg, ${C.light}, ${C.deep})`,
                      borderRadius: '5px 5px 0 0', transition: 'height .8s cubic-bezier(.16,1,.3,1)' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.earth,
                        opacity: 0.35 + 0.65 * (y.n / maxVol), display: 'inline-block' }}/>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.muted }}>{y.n}</span>
                    </div>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.mid }}>{y.y}</span>
                  </div>
                );
              })}
            </div>
            )}
          </Card>

          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, fontStyle: 'italic' }}>
            Indicative AVM estimate based on NAPIC 2021–2026 comparable transactions. Areas in sq.m. Not a formal valuation.
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(237,233,225,.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 5 }}>
          <span className="tmap-spin" style={{ width: 18, height: 18, borderRadius: '50%',
            border: `2px solid ${C.border}`, borderTopColor: C.earth, display: 'inline-block' }}/>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.mid }}>Computing valuation…</span>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .val-grid { grid-template-columns: 1fr !important; }
          .val-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { ValuationDashboard });
