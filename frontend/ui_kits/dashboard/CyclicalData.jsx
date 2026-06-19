/* eslint-disable no-undef */
/* CyclicalData.jsx — Malaysia mean house price HP-filter decomposition.
   Produces a quarterly series 1988–2025 with: price level (RM '000),
   a smooth HP-style trend, the cyclical component (price − trend), and the
   binary housing-cycle dependent variable cycle_pos (1 = above trend).
   Built deterministically so it's stable across reloads. */

function _mulb(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function _lerp(an, year) {
  if (year <= an[0][0]) return an[0][1];
  const last = an[an.length - 1];
  if (year >= last[0]) return last[1];
  for (let i = 0; i < an.length - 1; i++) {
    const [x0, y0] = an[i], [x1, y1] = an[i + 1];
    if (year >= x0 && year <= x1) return y0 + (y1 - y0) * ((year - x0) / (x1 - x0));
  }
  return last[1];
}
function _gsmooth(arr, sigma) {
  const n = arr.length, out = new Array(n), R = Math.ceil(sigma * 3);
  for (let i = 0; i < n; i++) {
    let s = 0, w = 0;
    for (let j = -R; j <= R; j++) {
      const k = i + j; if (k < 0 || k >= n) continue;
      const g = Math.exp(-(j * j) / (2 * sigma * sigma));
      s += arr[k] * g; w += g;
    }
    out[i] = s / w;
  }
  return out;
}

// long-run trend level (RM '000)
const LEVEL = [
  [1988, 68], [1990, 80], [1992, 95], [1994, 112], [1996, 134], [1997.5, 150],
  [1999, 146], [2001, 150], [2003, 158], [2005, 168], [2007, 184], [2008.5, 198],
  [2010, 206], [2012, 236], [2013, 270], [2014, 320], [2015, 350], [2016, 366],
  [2017, 386], [2018, 406], [2019, 426], [2020, 433], [2021, 433], [2022, 446],
  [2023, 463], [2024, 479], [2025, 495], [2025.5, 500],
];
// cyclical deviation (RM '000) — shapes the booms/troughs in the figure
const CYCLE = [
  [1988.0, 6.5], [1989.0, 7.0], [1990.5, -9.0], [1991.5, 3.5], [1993.0, -2.0],
  [1994.5, -10.5], [1995.5, -3.0], [1997.0, 16.0], [1998.3, -2.0], [1998.9, -10.5],
  [1999.6, -10.0], [2000.6, -3.0], [2002.0, -1.5], [2003.5, 4.5], [2004.5, 1.0],
  [2005.5, 4.5], [2006.5, 1.5], [2008.0, 4.7], [2009.3, 0.0], [2010.5, -6.0],
  [2011.5, -8.5], [2012.3, -9.0], [2013.0, -2.0], [2013.7, 4.0], [2014.5, 2.0],
  [2015.5, 5.0], [2016.5, 1.5], [2017.5, 9.0], [2018.3, 6.5], [2019.0, 2.5],
  [2019.7, -1.0], [2020.3, -3.0], [2021.0, -7.0], [2021.7, -12.5], [2022.3, -8.0],
  [2023.0, -1.0], [2023.7, 3.5], [2024.5, 7.5], [2025.2, 6.0], [2025.5, -9.5],
];

function buildDecomp() {
  const rnd = _mulb(20250408);
  const pts = [];
  for (let q = 0; q <= 150; q++) {           // 1988 Q1 .. 2025 Q3
    const year = 1988 + q / 4;
    const lvl = _lerp(LEVEL, year);
    const cyc = _lerp(CYCLE, year) + Math.sin(q * 1.6) * 0.5 + (rnd() - 0.5) * 0.9;
    const price = +(lvl + cyc).toFixed(2);
    pts.push({ q, year, price, cyc: +cyc.toFixed(2) });
  }
  // HP-style smooth trend on the price level
  const trend = _gsmooth(pts.map(p => p.price), 7);
  pts.forEach((p, i) => { p.trend = +trend[i].toFixed(2); p.pos = p.cyc >= 0 ? 1 : 0; });
  return pts;
}

const DECOMP = buildDecomp();

// shared event bands (muted but distinguishable hues)
const EVENT_BANDS = [
  { from: 1997.4, to: 1999.4, label: 'Asian Financial Crisis', color: '#C2912E' },
  { from: 2008.0, to: 2009.3, label: 'GFC', color: '#8A6FA6' },
  { from: 2013.4, to: 2016.5, label: 'Property Cooling Measures', color: '#5E82A0' },
  { from: 2019.0, to: 2021.5, label: 'COVID-19', color: '#B0573E' },
  { from: 2023.0, to: 2025.3, label: 'Post-COVID Boom', color: '#4E8A5E' },
];

Object.assign(window, { DECOMP, EVENT_BANDS });
