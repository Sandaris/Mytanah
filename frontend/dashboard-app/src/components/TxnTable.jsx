/* TxnTable.jsx — filter bar + property transaction table */
import { C, Eyebrow, Display, Mono, Pill, PrimitiveCard as Card } from '@/components/shared/primitives'
import { formatRM } from '@/lib/propertyData'

const numFmt = (n) => n == null ? '—' : n.toLocaleString('en-MY')

const TH = ({ children, right }) => (
  <th style={{
    textAlign: right ? 'right' : 'left', padding: '11px 14px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '.08em', color: C.cream,
    whiteSpace: 'nowrap', position: 'sticky', top: 0, background: C.deep, zIndex: 1,
  }}>{children}</th>
);
const TD = ({ children, right, mono, strong }) => (
  <td style={{
    textAlign: right ? 'right' : 'left', padding: '11px 14px',
    fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
    fontSize: 13, color: strong ? C.deep : C.mid, fontWeight: strong ? 600 : 400,
    whiteSpace: 'nowrap', borderBottom: `1px solid ${C.border}`,
  }}>{children}</td>
);

const PriceInput = ({ value, onChange, placeholder }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6, background: C.cream,
    border: `1px solid ${C.earth}40`, borderRadius: 8, padding: '8px 10px',
  }}>
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.muted }}>RM</span>
    <input value={value ? (+value).toLocaleString('en-MY') : ''}
      onChange={e => onChange(e.target.value.replace(/[^0-9]/g, ''))}
      placeholder={placeholder} inputMode="numeric"
      style={{
        border: 0, background: 'transparent', outline: 'none', width: '100%',
        fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.deep,
      }}/>
  </div>
);

const TxnTable = ({
  sel, loading, txns, filtered, availTypes, types, setTypes,
  yearMode, setYearMode, yr, setYr, price, setPrice, years, median, fill,
}) => {
  // before any search is run, the bottom sheet can stay hidden.
  if (!txns && !loading) return null;

  const toggleType = (t) => setTypes(
    types.includes(t) ? types.filter(x => x !== t) : [...types, t]
  );

  const filtersActive = types.length !== availTypes.length || yr.single || yr.from || yr.to || price.min || price.max;

  return (
    <Card style={{
      padding: 0, overflow: 'hidden',
      ...(fill ? { height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'none', border: 0, borderRadius: 0 } : {}),
    }}>
      {/* header strip */}
      <div style={{
        padding: '18px 22px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 12, flexShrink: 0, paddingRight: fill ? 104 : 22,
      }}>
        <div>
          <Display size={20} weight={500}>Property Transactions</Display>
          <div style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid, marginTop: 3,
          }}>
            {sel.road ? `${sel.road} · ${sel.area} · ${sel.mukim} · ${sel.district} · ${sel.state}` : ''}
          </div>
        </div>
        {txns && txns.length > 0 && (
          <div style={{ display: 'flex', gap: 22 }}>
            <div>
              <Eyebrow>Records</Eyebrow>
              <Mono size={20}>{filtered.length}<span style={{ fontSize: 12, color: C.muted }}> / {txns.length}</span></Mono>
            </div>
            <div>
              <Eyebrow>Median Price</Eyebrow>
              <Mono size={20}>{median != null ? formatRM(median) : '—'}</Mono>
            </div>
          </div>
        )}
      </div>

      {/* filters */}
      {txns && txns.length > 0 && !loading && (
        <div style={{
          padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18,
          background: C.cream + '80', flexShrink: 0,
        }}>
          {/* Year */}
          <div>
            <Eyebrow style={{ marginBottom: 7, display: 'flex', justifyContent: 'space-between' }}>
              <span>Year</span>
              <span style={{ display: 'flex', gap: 4 }}>
                {['single', 'range'].map(m => (
                  <button key={m} onClick={() => setYearMode(m)} style={{
                    border: 0, background: yearMode === m ? C.deep : 'transparent',
                    color: yearMode === m ? C.cream : C.mid, borderRadius: 5,
                    padding: '2px 8px', fontSize: 10, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif", textTransform: 'capitalize',
                  }}>{m}</button>
                ))}
              </span>
            </Eyebrow>
            {yearMode === 'single'
              ? <MiniSelect value={yr.single} onChange={v => setYr({ ...yr, single: v })}
                  placeholder="Any year" options={years}/>
              : <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <MiniSelect value={yr.from} onChange={v => setYr({ ...yr, from: v })}
                    placeholder="From" options={years}/>
                  <span style={{ color: C.muted }}>–</span>
                  <MiniSelect value={yr.to} onChange={v => setYr({ ...yr, to: v })}
                    placeholder="To" options={years}/>
                </div>}
          </div>

          {/* Price */}
          <div>
            <Eyebrow style={{ marginBottom: 7 }}>Transaction Price</Eyebrow>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <PriceInput value={price.min} onChange={v => setPrice({ ...price, min: v })} placeholder="Min"/>
              <span style={{ color: C.muted }}>–</span>
              <PriceInput value={price.max} onChange={v => setPrice({ ...price, max: v })} placeholder="Max"/>
            </div>
          </div>

          {/* Property Type */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Eyebrow style={{ marginBottom: 7 }}>Property Type</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {availTypes.map(t => (
                <Pill key={t} active={types.includes(t)} onClick={() => toggleType(t)}>{t}</Pill>
              ))}
              {filtersActive && (
                <button onClick={() => { setTypes(availTypes); setYr({ single: '', from: '', to: '' }); setPrice({ min: '', max: '' }); }}
                  style={{
                    border: `1px dashed ${C.muted}`, background: 'transparent', color: C.mid,
                    borderRadius: 9999, padding: '8px 14px', fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}>Clear filters</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* body */}
      {loading ? (
        <div style={{ padding: '50px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.mid,
            fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            <span className="tmap-spin" style={{ width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${C.border}`, borderTopColor: C.earth }}/>
            Loading property transactions…
          </div>
        </div>
      ) : (txns && txns.length === 0) ? (
        <EmptyState title="No property transaction records found for this location."
          sub="Try a different road, scheme, or district."/>
      ) : (filtered.length === 0) ? (
        <EmptyState title="No transactions match the selected filters."
          sub="Adjust the year, price, or property-type filters above."/>
      ) : (
        <div style={{ overflow: 'auto', ...(fill ? { flex: 1, minHeight: 0 } : {}) }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1080 }}>
            <thead>
              <tr>
                <TH>State</TH><TH>District</TH><TH>Mukim</TH><TH>Scheme / Area</TH>
                <TH>Road Name</TH><TH>Property Type</TH><TH>Tenure</TH>
                <TH right>Year</TH><TH right>Land (m²)</TH><TH right>Built-up (m²)</TH>
                <TH right>Price/m²</TH><TH right>Transaction Price (RM)</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} style={{ transition: 'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.cream}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <TD>{r.state}</TD>
                  <TD>{r.district}</TD>
                  <TD>{r.mukim}</TD>
                  <TD strong>{r.area}</TD>
                  <TD>{r.road}</TD>
                  <TD>{r.type}</TD>
                  <TD>{r.tenure}</TD>
                  <TD right mono>{r.year}</TD>
                  <TD right mono>{numFmt(r.land)}</TD>
                  <TD right mono>{numFmt(r.built)}</TD>
                  <TD right mono>{r.ppsf ? 'RM ' + numFmt(r.ppsf) : '—'}</TD>
                  <TD right mono strong>{formatRM(r.price)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

const MiniSelect = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{
    background: C.cream, border: `1px solid ${C.earth}40`, color: C.deep,
    fontFamily: "'DM Sans',sans-serif", fontSize: 13, borderRadius: 8,
    padding: '8px 10px', appearance: 'none', cursor: 'pointer', flex: 1, minWidth: 0,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='3 5 7 9 11 5'/></svg>")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
  }}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const EmptyState = ({ title, sub }) => (
  <div style={{ padding: '54px 24px', textAlign: 'center' }}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted}
      strokeWidth="1.4" style={{ margin: '0 auto 14px', display: 'block' }}>
      <path d="M3 13h6l1.5 2h3l1.5-2h6"/>
      <path d="M5 13V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/>
    </svg>
    <Display size={20} weight={500} style={{ display: 'block' }}>{title}</Display>
    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginTop: 6 }}>{sub}</div>
  </div>
);

export default TxnTable
