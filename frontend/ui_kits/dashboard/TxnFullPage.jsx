/* eslint-disable no-undef */
/* TxnFullPage.jsx — the maximized ("full page") presentation of the
   transaction explorer. Same underlying state/handlers as the docked
   bottom-sheet, re-laid-out as a spreadsheet-style workspace:
   a horizontal Location Search stepper, an expanded filter bar
   (property type + year-from/to pills + min/max price), a summary
   stats strip, and an airy light-header table. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SQM = (sqft) => sqft ? +(sqft / 10.7639).toFixed(1) : null;
const num1 = (n) => n == null ? '—' : n.toLocaleString('en-MY', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* horizontal numbered cascade step */
const StepDrop = ({ n, label, value, placeholder, options, onChange, disabled, loading, onClear, searchable }) => (
  <div style={{ flex: 1, minWidth: 200 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: disabled ? C.muted : C.earth, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700,
      }}>{n}</span>
      <Eyebrow style={{ color: disabled ? C.muted : C.earth, letterSpacing: '.12em' }}>{label}</Eyebrow>
      {onClear && value && (
        <button onClick={onClear} title={`Clear ${label}`} style={{
          marginLeft: 'auto', border: 0, background: 'transparent', cursor: 'pointer',
          color: C.muted, display: 'flex', padding: 2,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        </button>
      )}
    </div>
    <div style={{ position: 'relative' }}>
      {searchable ? (
        <Combobox value={value} placeholder={placeholder} options={options}
          onChange={onChange} disabled={disabled || loading} size="lg"/>
      ) : (
      <select value={value} disabled={disabled || loading}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: disabled ? C.cream + '80' : C.cream,
          border: `1px solid ${disabled ? C.border : C.earth + '50'}`,
          color: disabled ? C.muted : (value ? C.deep : C.muted),
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          borderRadius: 9, padding: '13px 15px', appearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
        }}>
        <option value="">{loading ? 'Loading…' : placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      )}
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div style={{
    flex: 1, minWidth: 150, background: C.cream, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '14px 18px',
  }}>
    <Eyebrow style={{ fontSize: 10.5 }}>{label}</Eyebrow>
    <div style={{ marginTop: 6 }}><Mono size={20}>{value}</Mono></div>
  </div>
);

const YearPills = ({ label, value, onPick, years }) => (
  <div>
    <Eyebrow style={{ marginBottom: 8 }}>{label}</Eyebrow>
    <div style={{ display: 'flex', gap: 6 }}>
      {years.map(y => (
        <button key={y} onClick={() => onPick(value === String(y) ? '' : String(y))} style={{
          border: `1px solid ${value === String(y) ? C.deep : C.border}`,
          background: value === String(y) ? C.deep : C.cream,
          color: value === String(y) ? C.cream : C.deep,
          borderRadius: 9999, padding: '8px 13px', cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500,
          transition: 'all .15s', fontFeatureSettings: "'tnum'",
        }}>{y}</button>
      ))}
    </div>
  </div>
);

const FullHeadCell = ({ children, right }) => (
  <th style={{
    textAlign: right ? 'right' : 'left', padding: '13px 18px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '.1em', color: C.earth,
    whiteSpace: 'nowrap', position: 'sticky', top: 0, background: C.raised,
    borderBottom: `1.5px solid ${C.border}`, zIndex: 1,
  }}>{children}</th>
);
const FullCell = ({ children, right, mono, strong, muted }) => (
  <td style={{
    textAlign: right ? 'right' : 'left', padding: '14px 18px',
    fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
    fontSize: 13.5, color: muted ? C.muted : (strong ? C.deep : C.mid),
    fontWeight: strong ? 600 : 400, whiteSpace: 'nowrap',
  }}>{children}</td>
);

const TxnFullPage = (p) => {
  const { sel, geo, districts, mukims, areas, roads, stateNames,
    selectState, selectDistrict, selectMukim, selectArea, selectRoad, selectPropertyType,
    clearAll, onExit,
    load, txns, filtered, availTypes, types, setTypes, yr, setYr, price, setPrice, years } = p;
  const isVal = p.variant === 'valuation';

  const prices = filtered.map(r => r.price);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const sorted = prices.slice().sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  const min = sorted.length ? sorted[0] : null;
  const max = sorted.length ? sorted[sorted.length - 1] : null;

  const typeValue = (types.length === availTypes.length || types.length === 0) ? 'all' : types[0];
  const onTypeChange = (v) => setTypes(v === 'all' ? availTypes : [v]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ===== LOCATION SEARCH ===== */}
        <Card style={{ padding: '22px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <Display size={24} weight={500} style={{ display: 'block' }}>Location Search</Display>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: C.mid, marginTop: 4 }}>
                {isVal
                  ? (sel.area ? `${sel.area} — automated valuation & area market data`
                     : 'Drill down to a specific area to value the property')
                  : (sel.state ? `${sel.state} — drill down to a specific area to view transactions`
                     : 'Drill down to a specific area to view transactions')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => p.onSearch && p.onSearch()} disabled={!p.canSearch} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                border: 0, background: p.canSearch ? C.deep : C.border, color: p.canSearch ? C.cream : C.muted,
                borderRadius: 9, padding: '9px 16px', cursor: p.canSearch ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {p.searched ? 'Update' : (isVal ? 'Value area' : 'Search')}
              </button>
              <button onClick={clearAll} style={{
                border: 0, background: 'transparent', color: C.earth, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
                padding: '4px 2px',
              }}>Clear all</button>
              <button onClick={onExit} title="Exit full page" style={{
                display: 'flex', alignItems: 'center', gap: 7,
                border: `1px solid ${C.border}`, background: C.cream, color: C.deep,
                borderRadius: 9, padding: '9px 15px', cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                  <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
                Exit full page
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <StepDrop n={1} label={isVal ? 'Property Type · required' : 'Property Type'}
              value={sel.propertyType} placeholder="Select a property type…"
              options={PROPERTY_TYPES_ALL} onChange={selectPropertyType}
              onClear={() => selectPropertyType('')} searchable/>
            <StepDrop n={2} label="State" value={sel.state} placeholder="Select state…"
              options={stateNames} onChange={selectState} onClear={() => selectState('')}/>
            <StepDrop n={3} label="District" value={sel.district} placeholder="Select district…"
              options={districts} onChange={selectDistrict} disabled={!sel.state} loading={load.d}
              onClear={() => selectDistrict('')} searchable/>
            <StepDrop n={4} label="Mukim (optional)" value={sel.mukim} placeholder="Search mukim…"
              options={mukims} onChange={selectMukim} disabled={!sel.district} loading={load.m}
              onClear={() => selectMukim('')} searchable/>
            <StepDrop n={5} label="Scheme / Area" value={sel.area} placeholder="Search scheme…"
              options={areas} onChange={selectArea} disabled={!sel.district} loading={load.a}
              onClear={() => selectArea('')} searchable/>
            <StepDrop n={6} label="Road Name" value={sel.road} placeholder="Select road…"
              options={roads} onChange={selectRoad} disabled={!sel.area} loading={load.r}
              onClear={() => selectRoad('')}/>
          </div>
        </Card>

        {/* ===== VALUATION DASHBOARD (full-page) ===== */}
        {isVal && (
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {p.searched
              ? <ValuationDashboard sel={p.searched} loading={load.t} fullpage onExportRoi={p.onExportRoi}/>
              : <FullEmpty title="Choose a location and press Search to value the area."
                  sub="Pick at least a district — mukim, scheme/area and road are optional."/>}
          </Card>
        )}

        {/* ===== FILTERS + STATS + TABLE ===== */}
        {!isVal && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {/* filter bar */}
          <div style={{
            padding: '22px 26px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', gap: 30, flexWrap: 'wrap', alignItems: 'flex-end',
          }}>
            <div style={{ minWidth: 240, flex: '0 0 auto' }}>
              <Eyebrow style={{ marginBottom: 8 }}>Property Type</Eyebrow>
              <select value={typeValue} onChange={e => onTypeChange(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box', background: C.cream,
                border: `1px solid ${C.earth}50`, color: C.deep,
                fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, borderRadius: 9,
                padding: '12px 15px', appearance: 'none', cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
              }}>
                <option value="all">All property types</option>
                {availTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <YearPills label="Year From" value={yr.from} years={years}
              onPick={v => setYr({ ...yr, single: '', from: v })}/>
            <YearPills label="Year To" value={yr.to} years={years}
              onPick={v => setYr({ ...yr, single: '', to: v })}/>
            <div>
              <Eyebrow style={{ marginBottom: 8 }}>Min Price (RM)</Eyebrow>
              <input value={price.min ? (+price.min).toLocaleString('en-MY') : ''}
                onChange={e => setPrice({ ...price, min: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="e.g. 200,000" inputMode="numeric" style={priceBox}/>
            </div>
            <div>
              <Eyebrow style={{ marginBottom: 8 }}>Max Price (RM)</Eyebrow>
              <input value={price.max ? (+price.max).toLocaleString('en-MY') : ''}
                onChange={e => setPrice({ ...price, max: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="e.g. 1,000,000" inputMode="numeric" style={priceBox}/>
            </div>
          </div>

          {/* stats strip */}
          {txns && txns.length > 0 && (
            <div style={{
              padding: '18px 26px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', gap: 14, flexWrap: 'wrap', background: C.cream + '60',
            }}>
              <StatCard label="Transactions" value={filtered.length}/>
              <StatCard label="Avg Price" value={avg != null ? formatRM(avg) : '—'}/>
              <StatCard label="Median Price" value={median != null ? formatRM(median) : '—'}/>
              <StatCard label="Min Price" value={min != null ? formatRM(min) : '—'}/>
              <StatCard label="Max Price" value={max != null ? formatRM(max) : '—'}/>
            </div>
          )}

          {/* table */}
          {load.t ? (
            <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.mid,
                fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                <span className="tmap-spin" style={{ width: 18, height: 18, borderRadius: '50%',
                  border: `2px solid ${C.border}`, borderTopColor: C.earth }}/>
                Loading property transactions…
              </div>
            </div>
          ) : (!txns) ? (
            <FullEmpty title="Choose a location and press Search."
              sub="Pick at least a district to load transactions."/>
          ) : (txns && txns.length === 0) ? (
            <FullEmpty title="No property transaction records found for this location."
              sub="Try a different road, scheme, or district."/>
          ) : (filtered.length === 0) ? (
            <FullEmpty title="No transactions match the selected filters."
              sub="Adjust the property type, year, or price filters above."/>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 980 }}>
                <thead>
                  <tr>
                    <FullHeadCell>Year</FullHeadCell>
                    <FullHeadCell>Mo</FullHeadCell>
                    <FullHeadCell>Property Type</FullHeadCell>
                    <FullHeadCell>Scheme / Area</FullHeadCell>
                    <FullHeadCell>Road</FullHeadCell>
                    <FullHeadCell>Tenure</FullHeadCell>
                    <FullHeadCell right>Floor (sqm)</FullHeadCell>
                    <FullHeadCell right>Land (sqm)</FullHeadCell>
                    <FullHeadCell right>Price (RM)</FullHeadCell>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const mo = +r.date.slice(5, 7) - 1;
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}80`,
                        background: i % 2 ? C.cream + '40' : 'transparent', transition: 'background .12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = C.cream}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 ? C.cream + '40' : 'transparent'}>
                        <FullCell mono strong>{r.year}</FullCell>
                        <FullCell muted>{MONTHS[mo]}</FullCell>
                        <FullCell>{r.type}</FullCell>
                        <FullCell strong>{r.area}</FullCell>
                        <FullCell muted>{r.road}</FullCell>
                        <FullCell>{r.tenure}</FullCell>
                        <FullCell right mono>{r.built == null ? '—' : r.built.toLocaleString('en-MY')}</FullCell>
                        <FullCell right mono>{r.land == null ? '—' : r.land.toLocaleString('en-MY')}</FullCell>
                        <FullCell right mono strong>{formatRM(r.price)}</FullCell>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        )}
      </div>
    </div>
  );
};

const priceBox = {
  width: 170, boxSizing: 'border-box', background: C.cream,
  border: `1px solid ${C.earth}50`, color: C.deep,
  fontFamily: "'JetBrains Mono',monospace", fontSize: 14, borderRadius: 9,
  padding: '12px 14px', outline: 'none',
};

const FullEmpty = ({ title, sub }) => (
  <div style={{ padding: '70px 24px', textAlign: 'center' }}>
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={C.muted}
      strokeWidth="1.4" style={{ margin: '0 auto 16px', display: 'block' }}>
      <path d="M3 13h6l1.5 2h3l1.5-2h6"/>
      <path d="M5 13V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/>
    </svg>
    <Display size={24} weight={500} style={{ display: 'block' }}>{title}</Display>
    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginTop: 7 }}>{sub}</div>
  </div>
);

Object.assign(window, { TxnFullPage });
