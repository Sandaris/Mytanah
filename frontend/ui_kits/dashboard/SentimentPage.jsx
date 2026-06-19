/* eslint-disable no-undef */

/* --- Custom semicircle gauge (no library) ---
   Geometry: half-circle that opens DOWNWARD; the dial sweeps the
   top half from 9 o'clock (score 0) through 12 (50) to 3 (100).
   Score text + zone labels live below the arc — never on it. */
const Gauge = ({ score = 61.4 }) => {
  const r = 100, cx = 140, cy = 110;
  const angleFor = s => -Math.PI + (s / 100) * Math.PI;        // -π → 0
  const ptFor = (s, rr = r) => {
    const a = angleFor(s);
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };
  const arc = (a, b, color, w = 14) => {
    const [x1, y1] = ptFor(a);
    const [x2, y2] = ptFor(b);
    return (
      <path d={`M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`}
        stroke={color} strokeWidth={w} fill="none" strokeLinecap="butt"/>
    );
  };
  const [nx, ny] = ptFor(score, r - 8);
  // Zone label tick positions (just below each band's centre)
  const labelY = cy + 36;
  return (
    <svg viewBox="0 0 280 240" width="100%" style={{ maxWidth: 320, overflow: 'visible' }}>
      {/* track + coloured bands */}
      {arc(0, 100, C.border, 14)}
      {arc(0, 35, C.down, 14)}
      {arc(35, 65, C.stable, 14)}
      {arc(65, 100, C.up, 14)}

      {/* tick marks at zone boundaries */}
      {[0, 35, 65, 100].map(s => {
        const [x1, y1] = ptFor(s, r - 12);
        const [x2, y2] = ptFor(s, r + 12);
        return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={C.raised} strokeWidth="2"/>;
      })}

      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny}
        stroke={C.deep} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="6" fill={C.deep}/>
      <circle cx={cx} cy={cy} r="2.5" fill={C.earth}/>

      {/* score — sits below the dial centre, clear of the arc */}
      <text x={cx} y={labelY} textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace" fontSize="28"
        fill={C.deep} fontWeight="500">
        {score.toFixed(1)}
      </text>
      <text x={cx} y={labelY + 16} textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="10"
        letterSpacing="0.14em" fill={C.earth}
        style={{ textTransform: 'uppercase' }}>
        out of 100
      </text>

      {/* zone labels — well below score, inside viewBox */}
      <text x={cx - r + 14} y={labelY + 70} textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="12" fill={C.mid}>Bearish</text>
      <text x={cx}          y={labelY + 70} textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="12" fill={C.mid}>Neutral</text>
      <text x={cx + r - 14} y={labelY + 70} textAnchor="middle"
        fontFamily="'DM Sans', sans-serif" fontSize="12" fill={C.mid}>Bullish</text>
    </svg>
  );
};

/* --- Simple SVG time-series chart --- */
const MHSI_SERIES = [
  42, 38, 41, 45, 48, 51, 49, 52, 55, 53,
  56, 58, 60, 59, 62, 61, 63, 60, 62, 61.4,
];
const NLP_SERIES = MHSI_SERIES.map((v, i) => v + Math.sin(i / 2) * 4 - 2);
const GT_SERIES  = MHSI_SERIES.map((v, i) => v + Math.cos(i / 1.5) * 5 + 1);
const QLABELS = Array.from({ length: 20 }, (_, i) => {
  const y = 2020 + Math.floor(i / 4);
  const q = (i % 4) + 1;
  return `${y} Q${q}`;
});

const TimeSeries = () => {
  const w = 720, h = 240, pad = 36;
  const yMin = 20, yMax = 80;
  const sx = i => pad + (i / (MHSI_SERIES.length - 1)) * (w - pad * 2);
  const sy = v => h - pad - ((v - yMin) / (yMax - yMin)) * (h - pad * 2);
  const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${sx(i)} ${sy(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block' }}>
      {/* bands */}
      <rect x={pad} y={sy(35)} width={w - pad * 2} height={sy(yMin) - sy(35)}
        fill={C.down} opacity="0.05"/>
      <rect x={pad} y={sy(yMax)} width={w - pad * 2} height={sy(65) - sy(yMax)}
        fill={C.up} opacity="0.05"/>
      {/* grid */}
      {[35, 50, 65].map(v => (
        <line key={v} x1={pad} y1={sy(v)} x2={w - pad} y2={sy(v)}
          stroke={C.border} strokeWidth="1" strokeDasharray="2 3"/>
      ))}
      {/* y labels */}
      {[20, 35, 50, 65, 80].map(v => (
        <text key={v} x={pad - 6} y={sy(v) + 3} textAnchor="end"
          fontFamily="'JetBrains Mono', monospace" fontSize="10" fill={C.mid}>{v}</text>
      ))}
      {/* lines */}
      <path d={path(GT_SERIES)} fill="none" stroke={C.mid} strokeWidth="1.5"
        strokeDasharray="2 4" opacity="0.7"/>
      <path d={path(NLP_SERIES)} fill="none" stroke={C.earth} strokeWidth="1.5"
        strokeDasharray="6 4"/>
      <path d={path(MHSI_SERIES)} fill="none" stroke={C.deep} strokeWidth="2.5"/>
      {/* x labels */}
      {[0, 4, 8, 12, 16, 19].map(i => (
        <text key={i} x={sx(i)} y={h - 12} textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace" fontSize="10" fill={C.mid}>
          {QLABELS[i]}
        </text>
      ))}
    </svg>
  );
};

const Legend = () => (
  <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
    {[
      { lbl: 'MHSI (smoothed)', stroke: C.deep, style: 'solid' },
      { lbl: 'NLP score', stroke: C.earth, style: 'dashed' },
      { lbl: 'Google Trends', stroke: C.mid, style: 'dotted' },
    ].map(l => (
      <div key={l.lbl} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.mid,
      }}>
        <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke={l.stroke} strokeWidth="2"
          strokeDasharray={l.style === 'dashed' ? '6 3' : l.style === 'dotted' ? '2 3' : '0'}/></svg>
        {l.lbl}
      </div>
    ))}
  </div>
);

const SentimentPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {/* Top metric row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
      <Card>
        <Eyebrow>MHSI Score</Eyebrow>
        <div style={{ marginTop: 8 }}><Mono size={26}>61.4</Mono>
          <Mono size={12} color={C.up} style={{ marginLeft: 8 }}>▲ 2.4</Mono></div>
        <div style={{ marginTop: 4, fontSize: 11, color: C.mid }}>vs. last quarter</div>
      </Card>
      <Card>
        <Eyebrow>Sentiment Zone</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <Display size={22} weight={400}>Bullish</Display>
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: C.mid }}>≥ 65 = Bullish</div>
      </Card>
      <Card>
        <Eyebrow>News volume</Eyebrow>
        <div style={{ marginTop: 8 }}><Mono size={26}>1,284</Mono>
          <Mono size={12} color={C.up} style={{ marginLeft: 8 }}>▲ 11.2%</Mono></div>
        <div style={{ marginTop: 4, fontSize: 11, color: C.mid }}>articles, Q1 2025</div>
      </Card>
    </div>

    {/* Gauge + commentary side by side */}
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Eyebrow style={{ alignSelf: 'flex-start' }}>Composite Reading</Eyebrow>
        <div style={{ marginTop: 8 }}><Gauge score={61.4}/></div>
      </Card>
      <Card style={{ borderLeft: `4px solid ${C.earth}`, padding: 24 }}>
        <Eyebrow>Market Commentary</Eyebrow>
        <p className="editorial" style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 18, color: C.deep, marginTop: 10, lineHeight: 1.5,
        }}>
          Sentiment edged into bullish territory this quarter as NLP coverage
          of new launches softened and Google search interest for
          "rumah lelong" eased. The MHSI smoothed line crosses 60 for the
          first time since 2022, supported by stable transaction velocity
          in Petaling and a modest uptick in primary-market enquiries.
        </p>
      </Card>
    </div>

    {/* Time series */}
    <Card style={{ padding: 24 }}>
      <Display size={20} weight={500}>MHSI — 2020 Q1 to 2025 Q1</Display>
      <Legend/>
      <div style={{ marginTop: 12 }}><TimeSeries/></div>
    </Card>
  </div>
);

Object.assign(window, { SentimentPage });
