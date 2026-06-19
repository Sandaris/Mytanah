/* eslint-disable no-undef */
/* CyclicalChart.jsx — three stacked panels sharing one x-axis (1988–2025):
   Panel 1  Mean House Price vs HP Trend
   Panel 2  Cyclical Component (price − trend), green above / red below
   Panel 3  cycle_pos dependent variable (1 = above trend, 0 = below)
   Recoloured into the dashboard's warm palette. */

function _hex(c, a) {
  const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* small boxed annotation label with an optional connector */
const Callout = ({ x, y, text, color, anchor = 'middle', line }) => {
  const lines = text.split('\n');
  const wBox = Math.max(...lines.map(l => l.length)) * 5.6 + 14;
  const hBox = lines.length * 12 + 8;
  const bx = anchor === 'middle' ? x - wBox / 2 : anchor === 'end' ? x - wBox : x;
  return (
    <g>
      {line && <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
        stroke={color} strokeWidth="1.2" markerEnd="" opacity="0.8"/>}
      {line && <circle cx={line.x2} cy={line.y2} r="2.4" fill={color}/>}
      <rect x={bx} y={y - hBox / 2} width={wBox} height={hBox} rx="4"
        fill={C.raised} stroke={color} strokeWidth="1.2"/>
      {lines.map((l, i) => (
        <text key={i} x={bx + wBox / 2} y={y - hBox / 2 + 13 + i * 12} textAnchor="middle"
          fontFamily="'DM Sans', sans-serif" fontSize="9.5" fontWeight="600" fill={color}>{l}</text>
      ))}
    </g>
  );
};

const CyclicalChart = () => {
  const W = 1000, H = 730;
  const xL = 78, xR = W - 30;
  const yearMin = 1988, yearMax = 2026;
  const sx = (yr) => xL + ((yr - yearMin) / (yearMax - yearMin)) * (xR - xL);

  // panel vertical extents
  const P1 = { t: 50, b: 286 }, P2 = { t: 350, b: 580 }, P3 = { t: 626, b: 668 };

  // panel 1 scale: price RM '000
  const pMin = 50, pMax = 515;
  const syP = (v) => P1.b - ((v - pMin) / (pMax - pMin)) * (P1.b - P1.t);
  // panel 2 scale: cyclical RM '000
  const cMin = -15, cMax = 17.5;
  const syC = (v) => P2.b - ((v - cMin) / (cMax - cMin)) * (P2.b - P2.t);
  const zeroC = syC(0);

  const priceLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syP(p.price).toFixed(1)}`).join(' ');
  const trendLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syP(p.trend).toFixed(1)}`).join(' ');
  const cycFill = `M${sx(DECOMP[0].year).toFixed(1)} ${zeroC.toFixed(1)} `
    + DECOMP.map(p => `L${sx(p.year).toFixed(1)} ${syC(p.cyc).toFixed(1)}`).join(' ')
    + ` L${sx(DECOMP[DECOMP.length - 1].year).toFixed(1)} ${zeroC.toFixed(1)} Z`;
  const cycLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syC(p.cyc).toFixed(1)}`).join(' ');

  const xTicks = [1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
  const qW = (sx(DECOMP[1].year) - sx(DECOMP[0].year));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* ===== shared event bands (panels 1 & 2) ===== */}
      {EVENT_BANDS.map(b => {
        const bx = sx(b.from), bw = sx(b.to) - sx(b.from);
        return (
          <g key={b.label}>
            <rect x={bx} y={P1.t} width={bw} height={P1.b - P1.t} fill={_hex(b.color, 0.11)}/>
            <rect x={bx} y={P2.t} width={bw} height={P2.b - P2.t} fill={_hex(b.color, 0.11)}/>
          </g>
        );
      })}

      {/* ===== PANEL 1: price vs trend ===== */}
      <text x={xL} y={P1.t - 18} fontFamily="'DM Sans',sans-serif" fontSize="13" fontWeight="700" fill={C.deep}>
        Panel 1 · Mean House Price vs HP Trend
      </text>
      {[100, 200, 300, 400, 500].map(v => (
        <g key={'p1g' + v}>
          <line x1={xL} y1={syP(v)} x2={xR} y2={syP(v)} stroke={C.border} strokeWidth="1" opacity="0.5" strokeDasharray="2 4"/>
          <text x={xL - 9} y={syP(v) + 3.5} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.mid}>RM {v}K</text>
        </g>
      ))}
      <path d={trendLine} fill="none" stroke={C.earth} strokeWidth="2.4" strokeDasharray="7 4" strokeLinecap="round"/>
      <path d={priceLine} fill="none" stroke={C.deep} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* panel-1 event labels */}
      <Callout x={sx(1998.4)} y={syP(150)} text={'Asian\nFinancial Crisis'} color="#C2912E"/>
      <Callout x={sx(2008.6)} y={syP(168)} text={'GFC'} color="#8A6FA6"/>
      <Callout x={sx(2014.9)} y={syP(360)} text={'Property\nCooling Measures'} color="#5E82A0"/>
      <Callout x={sx(2019.5)} y={syP(430)} text={'Pre-COVID\nSlowdown'} color="#B0573E"/>
      <Callout x={sx(2020.6)} y={syP(268)} text={'COVID-19'} color="#B0573E"/>
      <Callout x={sx(2024.1)} y={syP(150)} text={'Post-COVID\nBoom'} color="#4E8A5E"/>
      {/* legend */}
      <g transform={`translate(${xL + 6}, ${P1.t + 8})`}>
        <line x1="0" y1="0" x2="24" y2="0" stroke={C.deep} strokeWidth="2.2"/>
        <text x="30" y="3.5" fontFamily="'DM Sans',sans-serif" fontSize="10.5" fill={C.mid}>Mean House Price</text>
        <line x1="0" y1="16" x2="24" y2="16" stroke={C.earth} strokeWidth="2.2" strokeDasharray="6 3"/>
        <text x="30" y="19.5" fontFamily="'DM Sans',sans-serif" fontSize="10.5" fill={C.mid}>HP Trend (λ = 1600)</text>
      </g>

      {/* ===== PANEL 2: cyclical component ===== */}
      <text x={xL} y={P2.t - 18} fontFamily="'DM Sans',sans-serif" fontSize="13" fontWeight="700" fill={C.deep}>
        Panel 2 · Cyclical Component (Mean Price − HP Trend)
      </text>
      {[-10, -5, 0, 5, 10, 15].map(v => (
        <g key={'p2g' + v}>
          <line x1={xL} y1={syC(v)} x2={xR} y2={syC(v)} stroke={C.border} strokeWidth="1" opacity={v === 0 ? 0 : 0.5} strokeDasharray="2 4"/>
          <text x={xL - 9} y={syC(v) + 3.5} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.mid}>{v > 0 ? '+' : ''}{v}K</text>
        </g>
      ))}
      <defs>
        <clipPath id="cyc-above"><rect x={xL} y={P2.t} width={xR - xL} height={zeroC - P2.t}/></clipPath>
        <clipPath id="cyc-below"><rect x={xL} y={zeroC} width={xR - xL} height={P2.b - zeroC}/></clipPath>
      </defs>
      <path d={cycFill} fill={_hex(C.up, 0.30)} clipPath="url(#cyc-above)"/>
      <path d={cycFill} fill={_hex(C.down, 0.28)} clipPath="url(#cyc-below)"/>
      <line x1={xL} y1={zeroC} x2={xR} y2={zeroC} stroke={C.deep} strokeWidth="1.25"/>
      <path d={cycLine} fill="none" stroke={C.mid} strokeWidth="1.6" strokeLinejoin="round"/>
      {/* panel-2 callouts */}
      <Callout x={sx(1996.0)} y={syC(14.5)} text={'Property boom\n1994–96'} color={C.down}
        line={{ x1: sx(1996.0), y1: syC(13), x2: sx(1997.0), y2: syC(15.5) }}/>
      <Callout x={sx(2001.3)} y={syC(-11.5)} text={'Post-AFC\ntrough'} color="#8A6FA6"
        line={{ x1: sx(2001.3), y1: syC(-10), x2: sx(1999.6), y2: syC(-9.6) }}/>
      <Callout x={sx(2011.8)} y={syC(15)} text={'Post-GFC\nrebound 2013'} color={C.down}
        line={{ x1: sx(2012.6), y1: syC(13.5), x2: sx(2013.7), y2: syC(3.8) }}/>
      <Callout x={sx(2021.0)} y={syC(-13.5)} text={'Pre-COVID /\nCOVID trough'} color={C.down}
        line={{ x1: sx(2021.0), y1: syC(-12), x2: sx(2021.7), y2: syC(-12) }}/>
      <Callout x={sx(2024.0)} y={syC(13.5)} text={'Post-COVID\nrecovery'} color={C.up}
        line={{ x1: sx(2024.0), y1: syC(12), x2: sx(2024.5), y2: syC(7.8) }}/>
      {/* fill legend */}
      <g transform={`translate(${xL + 6}, ${P2.t + 6})`}>
        <rect x="0" y="-4" width="13" height="9" rx="2" fill={_hex(C.up, 0.4)}/>
        <text x="18" y="3.5" fontFamily="'DM Sans',sans-serif" fontSize="10" fill={C.mid}>Above trend (cycle_pos = 1)</text>
        <rect x="160" y="-4" width="13" height="9" rx="2" fill={_hex(C.down, 0.4)}/>
        <text x="178" y="3.5" fontFamily="'DM Sans',sans-serif" fontSize="10" fill={C.mid}>Below trend (cycle_pos = 0)</text>
      </g>

      {/* ===== PANEL 3: cycle_pos strip ===== */}
      <text x={xL} y={P3.t - 12} fontFamily="'DM Sans',sans-serif" fontSize="13" fontWeight="700" fill={C.deep}>
        Panel 3 · Dependent Variable — cycle_pos
      </text>
      <rect x={xL} y={P3.t} width={xR - xL} height={P3.b - P3.t} fill={C.cream}/>
      {DECOMP.map((p, i) => (
        <rect key={'p3' + i} x={sx(p.year) - qW / 2} y={P3.t} width={qW + 0.6} height={P3.b - P3.t}
          fill={p.pos ? _hex(C.up, 0.55) : _hex(C.down, 0.5)}/>
      ))}
      <rect x={xL} y={P3.t} width={xR - xL} height={P3.b - P3.t} fill="none" stroke={C.border}/>
      <text x={xL - 9} y={P3.t + 9} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill={C.mid}>1 ▲</text>
      <text x={xL - 9} y={P3.b - 3} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill={C.mid}>0 ▼</text>

      {/* ===== shared x-axis ===== */}
      {xTicks.map(yr => (
        <g key={yr}>
          <line x1={sx(yr)} y1={P3.b} x2={sx(yr)} y2={P3.b + 5} stroke={C.mid} strokeWidth="1"/>
          <text x={sx(yr)} y={P3.b + 18} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.mid}>{yr}</text>
        </g>
      ))}
    </svg>
  );
};

Object.assign(window, { CyclicalChart });
