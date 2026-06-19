/* eslint-disable no-undef */
const DISTRICT_PRICES = [
  { name: 'Petaling',     price: 620 },
  { name: 'Hulu Langat',  price: 470 },
  { name: 'Klang',        price: 380 },
  { name: 'Gombak',       price: 540 },
  { name: 'Sepang',       price: 420 },
  { name: 'Kuala Selangor', price: 310 },
];
const MAX = 700;

const FACTORS = [
  { name: 'Built-up area',      weight: 0.34 },
  { name: 'District median',    weight: 0.27 },
  { name: 'Property type',      weight: 0.18 },
  { name: 'Tenure',             weight: 0.12 },
  { name: 'Age of property',    weight: 0.09 },
];

const ValuationPage = ({ ctx }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 20 }}>
    {/* Left: inputs summary */}
    <Card style={{ padding: 28 }}>
      <Eyebrow>Property Details</Eyebrow>
      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        {Object.entries({
          State: ctx.state, District: ctx.district,
          'Property Type': ctx.type, Tenure: ctx.tenure,
          'Built-Up': `${ctx.built} sq ft`,
          'Land Area': `${ctx.land} sq ft`,
          'Age': `${ctx.age} years`,
        }).map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            borderBottom: `1px solid ${C.border}`, paddingBottom: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}>
            <span style={{ color: C.mid }}>{k}</span>
            <span style={{ color: C.deep, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <Eyebrow style={{ marginTop: 26 }}>Model</Eyebrow>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <Pill active>Hedonic</Pill>
        <Pill>Gradient Boost</Pill>
        <Pill>Ensemble</Pill>
      </div>
      <Button style={{ marginTop: 24, width: '100%' }}>Re-estimate</Button>
    </Card>

    {/* Right: outputs */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        <Card borderTop={C.down}>
          <Eyebrow>Lower Bound</Eyebrow>
          <div style={{ marginTop: 8 }}><Mono size={24}>RM 380,000</Mono></div>
          <div style={{ marginTop: 4 }}><Mono size={11} color={C.mid}>−15.6%</Mono></div>
        </Card>
        <Card borderTop={C.earth}>
          <Eyebrow>Central Estimate</Eyebrow>
          <div style={{ marginTop: 8 }}><Mono size={24}>RM 450,000</Mono></div>
          <div style={{ marginTop: 4 }}><Mono size={11} color={C.mid}>±0.0%</Mono></div>
        </Card>
        <Card borderTop={C.up}>
          <Eyebrow>Upper Bound</Eyebrow>
          <div style={{ marginTop: 8 }}><Mono size={24}>RM 540,000</Mono></div>
          <div style={{ marginTop: 4 }}><Mono size={11} color={C.mid}>+20.0%</Mono></div>
        </Card>
      </div>

      <Card style={{ padding: 24 }}>
        <Display size={20} weight={500}>Median Prices by District — {ctx.state}</Display>
        <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
          {DISTRICT_PRICES.map(d => {
            const isActive = d.name === ctx.district;
            return (
              <div key={d.name} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 80px',
                alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: isActive ? C.earth : C.mid, fontWeight: isActive ? 600 : 400,
                }}>{d.name}</span>
                <div style={{ height: 18, background: C.cream, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(d.price / MAX) * 100}%`, height: '100%',
                    background: isActive ? C.earth : C.mid, transition: 'width 1s',
                  }}/>
                </div>
                <Mono size={13} style={{ textAlign: 'right' }}>RM {d.price}k</Mono>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${C.earth}80`,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <Eyebrow>Your central estimate</Eyebrow>
          <Mono size={14} color={C.earth}>RM 450k</Mono>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <Display size={20} weight={500}>Contributing Factors</Display>
        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          {FACTORS.map(f => (
            <div key={f.name} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 50px',
              alignItems: 'center', gap: 12,
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.deep,
              }}>{f.name}</span>
              <div style={{ height: 6, background: C.cream, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${f.weight * 100}%`, height: '100%', background: C.earth }}/>
              </div>
              <Mono size={12} color={C.mid} style={{ textAlign: 'right' }}>
                {(f.weight * 100).toFixed(0)}%
              </Mono>
            </div>
          ))}
        </div>
        <div className="fineprint" style={{
          marginTop: 18, fontSize: 11, color: C.muted, fontStyle: 'italic',
        }}>
          Estimates are indicative and based on NAPIC 2021–2025 transaction data.
          Not a formal valuation.
        </div>
      </Card>
    </div>
  </div>
);

Object.assign(window, { ValuationPage });
