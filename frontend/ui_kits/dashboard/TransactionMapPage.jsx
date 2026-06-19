/* eslint-disable no-undef */
/* TransactionMapPage.jsx — "Malaysia Property Transaction Map" tab.
   Layout: interactive map + cascading location search panel on top,
   filtered transaction table below. The search is a strict cascade:
   State → District → Mukim → Scheme/Area → Road → Transactions, and the
   map's state selection stays two-way synced with the State dropdown. */
const { useState, useEffect, useMemo, useRef } = React;

/* ---- small shared bits ------------------------------------------------ */
const Spinner = ({ label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 9, padding: '10px 2px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.mid,
  }}>
    <span className="tmap-spin" style={{
      width: 15, height: 15, borderRadius: '50%',
      border: `2px solid ${C.border}`, borderTopColor: C.earth, display: 'inline-block',
    }}/>
    {label}
  </div>
);

const StepSelect = ({ label, value, placeholder, options, onChange, disabled, loading, loadingLabel, onClear }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
      <Eyebrow style={{ color: disabled ? C.muted : C.earth }}>{label}</Eyebrow>
      {onClear && value && !loading && (
        <button onClick={() => onClear()} style={clearLink}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          Clear
        </button>
      )}
    </div>
    {loading
      ? <Spinner label={loadingLabel}/>
      : (
        <select value={value} disabled={disabled}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', background: disabled ? C.cream : C.cream,
            border: `1px solid ${disabled ? C.border : C.earth + '55'}`,
            color: disabled ? C.muted : C.deep,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box',
            appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.65 : 1,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          }}>
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
  </div>
);

/* ---- main page -------------------------------------------------------- */
const TransactionMapPage = ({ onEngage, navOpen, variant }) => {
  const isVal = variant === 'valuation'; // Valuation tab swaps the table for the AVM dashboard
  const [geo, setGeo] = useState(null);
  const [geoErr, setGeoErr] = useState(false);

  const [sel, setSel] = useState({ state: '', district: '', propertyType: '', mukim: '', area: '', road: '' });
  const [load, setLoad] = useState({ d: false, m: false, a: false, r: false, t: false });
  const [txns, setTxns] = useState(null); // null = not loaded yet
  const [region, setRegion] = useState('west');
  const [panelOpen, setPanelOpen] = useState(false); // starts minimized; auto-expands after State + District
  const [sheetOpen, setSheetOpen] = useState(true);
  const [sheetMax, setSheetMax] = useState(false); // table expanded to full page
  const [searched, setSearched] = useState(null); // snapshot of the selection when Search was pressed

  // filters
  const [types, setTypes] = useState([]);      // selected property types
  const [yearMode, setYearMode] = useState('range');
  const [yr, setYr] = useState({ single: '', from: '', to: '' });
  const [price, setPrice] = useState({ min: '', max: '' });

  const timers = useRef([]);
  const bodyRef = useRef(null);
  const delay = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // when a new cascade step is revealed, scroll the panel body to show it
  useEffect(() => {
    const el = bodyRef.current;
    if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [sel.district, sel.mukim, sel.area, sel.road, load.m, load.a, load.r]);

  useEffect(() => {
    loadMalaysiaGeo().then(setGeo).catch(() => setGeoErr(true));
  }, []);

  /* Live mukim + scheme lists from the backend, scoped to the user's selection.
     The frontend's mock generator is kept as a fallback in case the API is
     offline or the chosen mock district/mukim doesn't exist in the dataset. */
  const [apiMukims, setApiMukims] = useState(null);
  const [apiAreas, setApiAreas] = useState(null);
  useEffect(() => {
    if (!sel.district) { setApiMukims(null); setApiAreas(null); return; }
    let cancelled = false;
    const q = { district: sel.district };
    if (sel.mukim) q.mukim = sel.mukim;
    window.API.valuationOptions(q)
      .then(opts => {
        if (cancelled) return;
        setApiMukims((opts.mukim || []).map(o => o.value));
        setApiAreas((opts.scheme || []).map(o => o.value));
      })
      .catch(() => {
        if (cancelled) return;
        setApiMukims(null); setApiAreas(null);
      });
    return () => { cancelled = true; };
  }, [sel.district, sel.mukim]);

  // option lists (derived strictly from the current selection)
  const districts = geo && sel.state ? geo.byName[sel.state].districts.map(d => d.name) : [];
  const mockMukims = sel.district ? getMukims(sel.state, sel.district) : [];
  const mukims = (apiMukims && apiMukims.length) ? apiMukims : mockMukims;
  // Scheme/Area can be browsed at the mukim level (if a mukim is chosen) OR
  // directly at the district level (Mukim is optional).
  const mockAreas = sel.mukim
    ? getAreas(sel.state, sel.district, sel.mukim)
    : (sel.district ? getDistrictAreas(sel.state, sel.district) : []);
  const areas = (apiAreas && apiAreas.length) ? apiAreas : mockAreas;
  const roads = sel.area ? getRoads(sel.state, sel.district, sel.mukim, sel.area) : [];

  /* cascade handlers — each resets every level below it and clears prior results.
     Selecting the blank option (or pressing Clear) deselects that level. */
  const selectState = (state) => {
    setSel({ state: state || '', district: '', propertyType: '', mukim: '', area: '', road: '' });
    setSearched(null); setTxns(null);
    if (state) {
      if (onEngage) onEngage(); // reveal the dashboard chrome on first engagement
      if (geo) setRegion(geo.regionOf(state));
      setLoad(l => ({ ...l, d: true })); delay(() => setLoad(l => ({ ...l, d: false })), 450);
    }
  };
  const selectDistrict = (district) => {
    setSel(s => ({ ...s, district: district || '', propertyType: '', mukim: '', area: '', road: '' }));
    setSearched(null); setTxns(null);
    if (district) {
      setPanelOpen(true); // surface the panel so the user can refine
      setLoad(l => ({ ...l, m: true, a: true }));
      delay(() => setLoad(l => ({ ...l, m: false, a: false })), 450);
    }
  };
  const selectMukim = (mukim) => {
    setSel(s => ({ ...s, mukim: mukim || '', area: '', road: '' }));
    setSearched(null); setTxns(null);
    if (mukim) { setLoad(l => ({ ...l, a: true })); delay(() => setLoad(l => ({ ...l, a: false })), 450); }
  };
  const selectArea = (area) => {
    setSel(s => {
      // if no mukim was picked, infer the one that owns this scheme/area so the
      // hierarchy stays consistent. Mock lookup is a synchronous best-effort;
      // the backend lookup below upgrades it for live schemes.
      const mukim = s.mukim || (area ? (getAreaMukim(s.state, s.district, area) || '') : '');
      return { ...s, mukim, area: area || '', road: '' };
    });
    setSearched(null); setTxns(null);
    if (area) { setLoad(l => ({ ...l, r: true })); delay(() => setLoad(l => ({ ...l, r: false })), 450); }

    // Live mukim inference: ask the backend which mukim owns this scheme.
    // Only fires when the user picked a scheme but no mukim yet.
    if (area && sel.district) {
      window.API.valuationOptions({ district: sel.district, scheme: area })
        .then(opts => {
          const top = (opts.mukim || [])[0];
          if (!top) return;
          setSel(s => (s.area === area && !s.mukim ? { ...s, mukim: top.value } : s));
        })
        .catch(() => {});
    }
  };
  const selectRoad = (road) => {
    setSel(s => ({ ...s, road: road || '' }));
    setSearched(null); setTxns(null);
  };
  const selectPropertyType = (propertyType) => {
    setSel(s => ({ ...s, propertyType: propertyType || '' }));
    setSearched(null); setTxns(null);
  };

  /* explicit Search — gathers results for whatever level is filled. Road is
     optional; a mukim- or district-level search is allowed. */
  const canSearch = !!sel.district && !!sel.propertyType;
  const runSearch = () => {
    if (!sel.district) return;
    const snap = { ...sel };
    setSearched(snap);
    setSheetOpen(true);
    if (onEngage) onEngage();
    if (isVal) setPanelOpen(false); // minimise Location Search so it doesn't cover the dashboard
    setLoad(l => ({ ...l, t: true }));
    delay(() => {
      if (!isVal) {
        const rows = getTransactionsForScope(snap);
        setTxns(rows);
        setTypes(snap.propertyType ? [snap.propertyType] : [...new Set(rows.map(r => r.type))]);
        setYearMode('range'); setYr({ single: '', from: '', to: '' }); setPrice({ min: '', max: '' });
      }
      setLoad(l => ({ ...l, t: false }));
    }, 600);
  };

  const availTypes = useMemo(() => txns ? [...new Set(txns.map(r => r.type))].sort() : [], [txns]);

  const filtered = useMemo(() => {
    if (!txns) return [];
    return txns.filter(r => {
      if (types.length && !types.includes(r.type)) return false;
      if (yearMode === 'single' && yr.single && r.year !== +yr.single) return false;
      if (yearMode === 'range') {
        if (yr.from && r.year < +yr.from) return false;
        if (yr.to && r.year > +yr.to) return false;
      }
      if (price.min && r.price < +price.min) return false;
      if (price.max && r.price > +price.max) return false;
      return true;
    });
  }, [txns, types, yearMode, yr, price]);

  const medianPrice = useMemo(() => {
    if (!filtered.length) return null;
    const s = filtered.map(r => r.price).sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  }, [filtered]);

  /* status hint */
  let hint;
  if (!sel.state) hint = isVal ? 'Select a state to begin a valuation.' : 'Select a state to explore property transactions.';
  else if (!sel.district) hint = `${sel.state}. Choose a district to continue.`;
  else if (!sel.propertyType) hint = `${sel.district}, ${sel.state}. Select a property type to continue.`;
  else if (searched) hint = isVal
    ? `Valuation ready for ${searched.area || searched.mukim || searched.district}.`
    : `Showing ${searched.road || searched.area || searched.mukim || searched.district}.`;
  else hint = `${sel.district}, ${sel.state}. Refine by mukim / scheme / road (all optional), then press Search.`;

  if (geoErr) return (
    <div style={{ padding: 28 }}>
      <Card><div style={{ fontFamily: "'DM Sans',sans-serif", color: C.down }}>
        Unable to load the Malaysia map data. Please check your connection and reload.
      </div></Card>
    </div>
  );

  const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
  const sheetVisible = !!searched || sheetMax; // results appear once Search runs (kept while maximized)
  // Slide the Location Search clear of the floating nav while it's open.
  const searchLeft = navOpen ? 252 : 16;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'linear-gradient(165deg, #E7E3DA 0%, #DCD7C9 55%, #CFC9BA 100%)' }}>
      {/* ===== FULL-BLEED MAP ===== */}
      {geo
        ? <MalaysiaMap geo={geo}
            selectedState={sel.state || null}
            selectedDistrict={sel.district || null}
            region={region}
            onRegionChange={(r) => { if (!sel.state) setRegion(r); }}
            onSelectState={selectState}
            onSelectDistrict={selectDistrict}/>
        : <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 12,
          }}>
            <span className="tmap-spin" style={{
              width: 30, height: 30, borderRadius: '50%',
              border: `3px solid ${C.border}`, borderTopColor: C.earth,
            }}/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", color: C.mid, fontSize: 13 }}>
              Loading Malaysia map…
            </span>
          </div>}

      {/* ===== FLOATING SEARCH PANEL =====
           Hidden while the table is maximized to full page — the search fields
           live in TxnFullPage's header instead, so they don't overlap. */}
      {!sheetMax && (panelOpen ? (
        <div className="tmap-panel" style={{
          position: 'absolute', top: 16, left: searchLeft, width: 366, maxWidth: 'calc(100% - 32px)',
          maxHeight: sheetVisible && sheetOpen ? (isVal ? 'calc(38% - 36px)' : 'calc(46% - 40px)') : 'calc(100% - 32px)',
          display: 'flex', flexDirection: 'column',
          background: C.raised, border: `1px solid ${C.border}`, borderRadius: 14,
          boxShadow: '0 12px 36px rgba(44,57,48,.20)', zIndex: 20,
          transition: 'left .5s cubic-bezier(.16,1,.3,1)',
          animation: 'tmapPanelIn .35s cubic-bezier(.16,1,.3,1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px 12px',
          }}>
            <div>
              <Eyebrow>Explore</Eyebrow>
              <Display size={20} weight={500} style={{ display: 'block', marginTop: 2 }}>Location Search</Display>
            </div>
            <button onClick={() => setPanelOpen(false)} title="Collapse"
              style={iconBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
          </div>

          <div ref={bodyRef} style={{ padding: '0 18px', overflowY: 'auto', flex: 1 }}>
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: searched ? C.deep : C.earthFaint,
              border: `1px solid ${searched ? C.deep : C.earth + '40'}`,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, lineHeight: 1.45,
              color: searched ? C.cream : C.mid,
            }}>{hint}</div>

            <div style={{ margin: '16px 0 18px', display: 'grid', gap: 13 }}>
              <StepSelect label="① Property Type · required" value={sel.propertyType}
                placeholder="Select a property type" options={PROPERTY_TYPES_ALL}
                onChange={selectPropertyType} onClear={() => selectPropertyType('')}/>

              <StepSelect label="② State" value={sel.state} placeholder="Select state"
                options={geo ? geo.stateNames : []} onChange={selectState}
                onClear={() => selectState('')}/>

              <StepSelect label="③ District" value={sel.district}
                placeholder={sel.state ? 'Select district' : 'Select a state first'}
                options={districts} onChange={selectDistrict}
                disabled={!sel.state} loading={load.d} loadingLabel="Loading districts…"
                onClear={() => selectDistrict('')}/>

              {sel.district && (
                <div style={{ display: 'grid', gap: 9 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid }}>
                    <span style={{ fontWeight: 600, color: C.earth }}>④ Narrow down</span>
                    <span> — select a mukim and / or a scheme / area (optional)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                        <Eyebrow style={{ color: C.earth }}>Mukim</Eyebrow>
                        {sel.mukim && !load.m && (
                          <button onClick={() => selectMukim('')} style={clearLink}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
                            Clear
                          </button>
                        )}
                      </div>
                      {load.m
                        ? <Spinner label="Loading…"/>
                        : <Combobox value={sel.mukim} placeholder="Search mukim"
                            options={mukims} onChange={selectMukim}/>}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                        <Eyebrow style={{ color: C.earth }}>Scheme / Area</Eyebrow>
                        {sel.area && !load.a && (
                          <button onClick={() => selectArea('')} style={clearLink}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
                            Clear
                          </button>
                        )}
                      </div>
                      {load.a
                        ? <Spinner label="Loading…"/>
                        : <Combobox value={sel.area} placeholder="Search scheme"
                            options={areas} onChange={selectArea}/>}
                    </div>
                  </div>
                </div>
              )}

              {sel.area && (
                <StepSelect label="⑤ Road Name (optional)" value={sel.road}
                  placeholder="Any road" options={roads} onChange={selectRoad}
                  loading={load.r} loadingLabel="Loading road names…" onClear={() => selectRoad('')}/>
              )}

              <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: 2 }}>
                <button onClick={runSearch} disabled={!canSearch} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: canSearch ? C.deep : C.border, color: canSearch ? C.cream : C.muted,
                  border: 0, borderRadius: 9, padding: '12px 16px', cursor: canSearch ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, transition: 'background .2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  {searched ? 'Update search' : (isVal ? 'Value this area' : 'Search')}
                </button>
                {(sel.state || sel.district) && (
                  <button onClick={() => selectState('')} style={{
                    background: 'transparent', border: `1px solid ${C.border}`, color: C.mid, borderRadius: 9,
                    padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>Clear</button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setPanelOpen(true)} style={{
          position: 'absolute', top: 16, left: searchLeft, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 9,
          background: C.deep, color: C.cream, border: 0, borderRadius: 9999,
          padding: '11px 18px', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
          fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 20px rgba(44,57,48,.24)',
          transition: 'left .5s cubic-bezier(.16,1,.3,1)',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Location Search
          {searched && !isVal && txns && <span style={{
            background: C.earth, borderRadius: 9999, padding: '1px 8px', fontSize: 11,
          }}>{filtered.length}</span>}
        </button>
      ))}

      {/* ===== BOTTOM SHEET: TRANSACTION TABLE ===== */}
      {sheetVisible && (
        <div className="tmap-sheet" style={{
          position: 'absolute', zIndex: 15,
          left: sheetMax ? 0 : 16, right: sheetMax ? 0 : 16,
          bottom: sheetMax ? 0 : 16, top: sheetMax ? 0 : 'auto',
          height: sheetMax ? 'auto' : (sheetOpen ? (isVal ? 'min(62%, 580px)' : 'min(48%, 460px)') : 52),
          display: 'flex', flexDirection: 'column',
          background: C.raised,
          border: sheetMax ? 'none' : `1px solid ${C.border}`,
          borderRadius: sheetMax ? 0 : 14,
          boxShadow: sheetMax ? 'none' : '0 -8px 36px rgba(44,57,48,.18)', overflow: 'hidden',
          transition: 'height .34s cubic-bezier(.16,1,.3,1), left .3s, right .3s, bottom .3s, border-radius .3s',
          animation: 'tmapSheetIn .4s cubic-bezier(.16,1,.3,1)',
        }}>
          {!sheetOpen && !sheetMax && (
            <button onClick={() => setSheetOpen(true)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px', background: 'transparent', border: 0, cursor: 'pointer',
            }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.deep }}>
                {isVal
                  ? `Estimated Valuation · ${(searched && (searched.area || searched.mukim || searched.district)) || sel.area || sel.district}`
                  : `Property Transactions${txns ? ` · ${filtered.length} of ${txns.length}` : ''}`}
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
          )}
          {(sheetOpen || sheetMax) && (
            <React.Fragment>
              {!sheetMax && (
                <div style={{ position: 'absolute', top: 16, right: 18, zIndex: 4, display: 'flex', gap: 8 }}>
                  <button onClick={() => { setYearMode('range'); setSheetMax(true); }} title="Expand to full page"
                    style={iconBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  </button>
                  <button onClick={() => setSheetOpen(false)} title="Collapse" style={iconBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>
              )}
              {isVal ? (
                sheetMax ? (
                  <TxnFullPage variant="valuation"
                    sel={sel} geo={geo} searched={searched} onSearch={runSearch} canSearch={canSearch}
                    onExit={() => { setSheetMax(false); setPanelOpen(false); }}
                    districts={districts} mukims={mukims} areas={areas} roads={roads}
                    selectState={selectState} stateNames={geo ? geo.stateNames : []}
                    selectDistrict={selectDistrict} selectMukim={selectMukim}
                    selectArea={selectArea} selectRoad={selectRoad}
                    selectPropertyType={selectPropertyType}
                    clearAll={() => { selectState(''); setSheetMax(false); setPanelOpen(true); }}
                    load={load} txns={txns} filtered={filtered}
                    availTypes={availTypes} types={types} setTypes={setTypes}
                    yr={yr} setYr={setYr} price={price} setPrice={setPrice} years={YEARS}/>
                ) : (
                  <ValuationDashboard sel={searched || sel} loading={load.t}/>
                )
              ) : sheetMax ? (
                <TxnFullPage
                  sel={sel} geo={geo} searched={searched} onSearch={runSearch} canSearch={canSearch}
                  onExit={() => { setSheetMax(false); setPanelOpen(true); }}
                  districts={districts} mukims={mukims} areas={areas} roads={roads}
                  selectState={selectState} stateNames={geo ? geo.stateNames : []}
                  selectDistrict={selectDistrict} selectMukim={selectMukim}
                  selectArea={selectArea} selectRoad={selectRoad}
                  selectPropertyType={selectPropertyType}
                  clearAll={() => { selectState(''); setSheetMax(false); setPanelOpen(true); }}
                  load={load} txns={txns} filtered={filtered}
                  availTypes={availTypes} types={types} setTypes={setTypes}
                  yr={yr} setYr={setYr} price={price} setPrice={setPrice} years={YEARS}/>
              ) : (
                <TxnTable fill
                  sel={searched || sel} loading={load.t} txns={txns} filtered={filtered}
                  availTypes={availTypes} types={types} setTypes={setTypes}
                  yearMode={yearMode} setYearMode={setYearMode} yr={yr} setYr={setYr}
                  price={price} setPrice={setPrice} years={YEARS} median={medianPrice}/>
              )}
            </React.Fragment>
          )}
        </div>
      )}

      <style>{`
        @keyframes tmapspin { to { transform: rotate(360deg); } }
        .tmap-spin { animation: tmapspin .8s linear infinite; }
        @keyframes tmapPanelIn { from {opacity:0; transform:translateX(-16px)} to {opacity:1; transform:none} }
        @keyframes tmapSheetIn { from {opacity:0; transform:translateY(24px)} to {opacity:1; transform:none} }
        @keyframes tmapPop { from {opacity:0; transform:translateY(-6px)} to {opacity:1; transform:none} }
        @media (max-width: 720px) {
          .tmap-panel { width: calc(100% - 32px) !important; }
        }
      `}</style>
    </div>
  );
};

const iconBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, borderRadius: 8, background: C.cream,
  border: `1px solid ${C.border}`, color: C.mid, cursor: 'pointer', flexShrink: 0,
};

const clearLink = {
  border: 0, background: 'transparent', color: C.muted, cursor: 'pointer',
  fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, padding: 0,
  display: 'flex', alignItems: 'center', gap: 3,
};

Object.assign(window, { TransactionMapPage });
