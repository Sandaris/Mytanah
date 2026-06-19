/* eslint-disable no-undef */
/* RiskPage — Housing Cycle Regime composite indicator.
   Pulls /hcr/current from the FastAPI backend. Falls back to a small mock
   payload (the original design fixtures) when the API is unreachable or the
   HCR model artifact hasn't been built yet (e.g. before save_models.py
   produces hcr_latest.json). */

const { useState, useEffect } = React;

const SIG = { up: C.up, stable: C.stable, down: C.down };
const SIG_LBL = { up: 'Supportive', stable: 'Neutral', down: 'Pressuring' };

const FALLBACK = {
  period: 'Q1 2025',
  probability: 0.71,
  regime: 'high',
  interpretation:
    'Backend offline — showing design fixtures. Run save_models.py and refresh.',
  contributions: [
    { label: 'House Price Index YoY',  raw_value: 5.8,   contribution:  0.42, direction: 'up'   },
    { label: 'Loan-to-Value ratio',    raw_value: 78.2,  contribution:  0.31, direction: 'up'   },
    { label: 'Transaction Volume',     raw_value: 24180, contribution:  0.10, direction: 'up'   },
    { label: 'Overhang (units)',       raw_value: 27940, contribution: -0.28, direction: 'down' },
    { label: 'Interest rate (OPR)',    raw_value: 3.00,  contribution: -0.05, direction: 'down' },
    { label: 'Affordability (P/I)',    raw_value: 5.4,   contribution: -0.18, direction: 'down' },
  ],
};

const REGIME_LABEL = {
  high: 'Upward Pressure',
  low:  'Downward Pressure',
};

/* Format the raw indicator value for display — keep it short. */
const fmtVal = (v) => {
  if (v == null) return '—';
  if (Math.abs(v) >= 1000) return v.toLocaleString();
  if (Math.abs(v) >= 10)   return v.toFixed(1);
  return v.toFixed(2);
};

const IndicatorCard = ({ d, maxAbs }) => {
  const sig = d.direction === 'up' ? 'up' : 'down';
  const widthPct = Math.max(6, Math.min(100, (Math.abs(d.contribution) / maxAbs) * 100));
  return (
    <Card>
      <Eyebrow>{d.label || d.name}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
        <Mono size={22}>{fmtVal(d.raw_value)}</Mono>
        <span style={{
          background: SIG[sig] + '1F', color: SIG[sig],
          padding: '3px 10px', borderRadius: 9999,
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '.1em',
        }}>{SIG_LBL[sig]}</span>
      </div>
      <div style={{ height: 6, background: C.cream, borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
        <div style={{
          width: widthPct + '%', height: '100%',
          background: SIG[sig], transition: 'width 1s',
        }}/>
      </div>
      <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: C.muted }}>
        contribution {d.contribution >= 0 ? '+' : ''}{d.contribution.toFixed(2)}
      </div>
    </Card>
  );
};

const RiskPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    window.API.hcrCurrent()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => {
        if (!cancelled) { setError(e.message); setData(FALLBACK); }
      });
    return () => { cancelled = true; };
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 40, color: C.mid, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
        Loading Housing Cycle Regime…
      </div>
    );
  }

  const regimeLabel = REGIME_LABEL[data.regime] || 'Stable';
  const heroBorder = data.regime === 'high' ? C.up : data.regime === 'low' ? C.down : C.stable;
  const compositeScore = (data.probability - 0.5).toFixed(2); // signed deviation from neutral
  const contribs = data.contributions || [];
  const maxAbs = Math.max(...contribs.map((c) => Math.abs(c.contribution)), 0.01);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && (
        <div style={{
          background: C.earth + '12', border: `1px solid ${C.earth}55`,
          borderRadius: 8, padding: '10px 14px',
          fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.deep,
        }}>
          API unreachable — showing fallback fixtures. ({error})
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: C.deep, color: C.cream, borderRadius: 14,
        padding: '28px 32px', borderBottom: `4px solid ${heroBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <Eyebrow style={{ color: C.earthLight }}>HCR Composite — {data.period || '—'}</Eyebrow>
          <Display size={46} color={C.cream} weight={400} style={{ marginTop: 6, display: 'block' }}>
            {regimeLabel}
          </Display>
          {data.interpretation && (
            <div style={{
              marginTop: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              color: C.earthLight, maxWidth: 640, lineHeight: 1.5,
            }}>{data.interpretation}</div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <Eyebrow style={{ color: C.earthLight }}>Up-trend probability</Eyebrow>
          <div style={{ marginTop: 4 }}>
            <Mono size={28} color={C.earthLight}>{(data.probability * 100).toFixed(1)}%</Mono>
          </div>
          <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.earthLight, opacity: 0.7 }}>
            score {compositeScore >= 0 ? '+' : ''}{compositeScore}
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {contribs.map((d, i) => <IndicatorCard key={d.name || i} d={d} maxAbs={maxAbs}/>)}
      </div>

      {/* History */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <Display size={20} weight={500} style={{ display: 'block' }}>HP-Filter Decomposition &amp; Housing Cycle</Display>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.mid, marginTop: 3 }}>
              Malaysia mean house price · HP filter (λ = 1600, quarterly) · 1988–2025
            </div>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.mid }}>
            cycle_pos = 1 when price sits above its long-run trend
          </span>
        </div>
        <div style={{ marginTop: 18 }}><CyclicalChart/></div>
      </Card>
    </div>
  );
};

Object.assign(window, { RiskPage });
