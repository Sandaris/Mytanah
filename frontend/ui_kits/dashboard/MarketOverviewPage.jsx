/* eslint-disable no-undef */
/* MarketOverviewPage.jsx — Malaysia residential property market overview.
   Every figure here is computed from the cleaned NAPIC Open Transaction Data
   (processed data/transactions.parquet — 416,627 transactions, Jan 2021–Mar 2026),
   following Data_Understanding_Open_Transaction.ipynb. Charts via Apache ECharts. */

// ---- headline figures (actual, from the parquet) --------------------------
const MKT = {
  txns: 416627,
  valueBn: 208.1,        // sum(Price) = RM 208.09 bn
  medianPrice: 371000,
  medianPpm: 3600,       // median Price / built-up Area (RM per m²)
  freehold: 66.4, leasehold: 33.6,
  coverage: 'Jan 2021 – Mar 2026',
};

// quarterly transaction count [quarter, count]
const MKT_QVOL = [
  ['2021 Q1', 4531], ['2021 Q2', 5842], ['2021 Q3', 10105], ['2021 Q4', 28885],
  ['2022 Q1', 24442], ['2022 Q2', 31553], ['2022 Q3', 33058], ['2022 Q4', 29521],
  ['2023 Q1', 27355], ['2023 Q2', 30650], ['2023 Q3', 30770], ['2023 Q4', 29406],
  ['2024 Q1', 27059], ['2024 Q2', 27321], ['2024 Q3', 25971], ['2024 Q4', 9331],
  ['2025 Q1', 7680], ['2025 Q2', 8398], ['2025 Q3', 9719], ['2025 Q4', 9362],
  ['2026 Q1', 5668],
];

// [label, transaction count, median price] — sorted by count desc
const MKT_PTYPE = [
  ['2-2½ Storey Terraced', 118722, 540000],
  ['1-1½ Storey Terraced', 93697, 285000],
  ['Condominium/Apartment', 65780, 385000],
  ['Low-Cost House', 28351, 190000],
  ['1-1½ Storey Semi-D', 22030, 380000],
  ['Low-Cost Flat', 21190, 145000],
  ['Detached', 18939, 500000],
  ['2-2½ Storey Semi-D', 18071, 869000],
  ['Flat', 16504, 210000],
  ['Cluster House', 9092, 537000],
  ['Town House', 4251, 360000],
];

// [district, count, median price] — top 12 by volume
const MKT_DIST = [
  ['Johor Bahru', 46111, 499000], ['Petaling', 33861, 550000],
  ['Kuala Lumpur', 26365, 560000], ['Hulu Langat', 22984, 440000],
  ['Kinta', 19155, 299000], ['Klang', 18633, 450000],
  ['Seremban', 17492, 380000], ['Gombak', 12386, 444000],
  ['Timur Laut', 11504, 380000], ['Kuala Muda', 10948, 250000],
  ['Kuantan', 10705, 290000], ['Melaka Tengah', 10629, 300000],
];

// price distribution [RM band, count]
const MKT_HIST = [
  ['<200k', 64666], ['200–300k', 83685], ['300–400k', 76812], ['400–500k', 59846],
  ['500–700k', 61421], ['700k–1m', 37976], ['1–1.5m', 17727], ['>1.5m', 14494],
];

const MKT_TENURE = [
  { value: 276848, name: 'Freehold' },
  { value: 139779, name: 'Leasehold' },
];

// average price per state (RM) — every district mapped to its state, all
// 416,627 rows. [state, mean price, median price, transaction count] — avg desc.
const STATE_AVG = [
  ['Kuala Lumpur', 982117, 560000, 26365],
  ['Putrajaya', 932481, 683500, 772],
  ['Selangor', 608509, 454000, 112047],
  ['Penang', 520642, 380000, 34288],
  ['Johor', 516664, 450000, 73570],
  ['Labuan', 460126, 420000, 380],
  ['Sabah', 445800, 355000, 7528],
  ['Sarawak', 420804, 385000, 12220],
  ['Negeri Sembilan', 383139, 335000, 25349],
  ['Melaka', 325464, 280000, 19347],
  ['Pahang', 315395, 280000, 18906],
  ['Perak', 315099, 271000, 42350],
  ['Kelantan', 313353, 300000, 6702],
  ['Kedah', 310985, 280000, 24733],
  ['Terengganu', 308658, 320000, 10032],
  ['Perlis', 271519, 259000, 2038],
];
const STATE_HIGH = STATE_AVG[0]; // Kuala Lumpur — highest average price

const PMED = {}; MKT_PTYPE.forEach(d => { PMED[d[0]] = d[2]; });
const DMED = {}; MKT_DIST.forEach(d => { DMED[d[0]] = d[2]; });

// ---- shared chart helpers -------------------------------------------------
const mFmt = (n) => Number(n).toLocaleString('en-US');
const mRM = (n) => 'RM ' + mFmt(Math.round(n));
const _mg = (x2, y2, a, b) => new window.echarts.graphic.LinearGradient(0, 0, x2, y2, [
  { offset: 0, color: a }, { offset: 1, color: b },
]);
const MKT_TT = {
  backgroundColor: C.deep, borderColor: C.deep, padding: [8, 10],
  textStyle: { color: C.cream, fontFamily: "'DM Sans',sans-serif", fontSize: 12 },
};
const MKT_AXM = { color: C.mid, fontFamily: "'JetBrains Mono',monospace", fontSize: 10 };

// self-contained ECharts wrapper (inits once, re-applies option, resizes)
const MktChart = ({ option, height = 260 }) => {
  const elRef = React.useRef(null);
  const chartRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.echarts || !elRef.current) return undefined;
    const chart = window.echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);
    // belt-and-braces: re-measure once layout / page transition settles
    const raf = requestAnimationFrame(() => chart.resize());
    const t = setTimeout(() => chart.resize(), 320);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, []);
  React.useEffect(() => {
    if (chartRef.current && option) chartRef.current.setOption(option, true);
  }, [option]);
  return <div ref={elRef} style={{ width: '100%', height }}/>;
};

// ---- choropleth ↔ bar morph: average price by state (the showpiece) -------
const StatePriceMorph = () => {
  const elRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const optionsRef = React.useRef(null);
  const [view, setView] = React.useState('map');   // 'map' | 'bar'
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (!window.echarts || !elRef.current) return undefined;
    const chart = window.echarts.init(elRef.current, null, { renderer: 'canvas' });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);
    const t0 = setTimeout(() => chart.resize(), 320);
    let disposed = false;

    const asc = [...STATE_AVG].sort((a, b) => a[1] - b[1]); // ascending → highest at top of the bar list
    const items = asc.map(d => ({ name: d[0], value: d[1] }));
    const META = Object.fromEntries(STATE_AVG.map(d => [d[0], d]));
    const RAMP = ['#DCC2A6', '#CBA886', '#B98E66', '#9E7350', '#7C5639', '#5E3E26'];
    const visualMap = {
      type: 'continuous', min: 270000, max: 700000, calculable: true,
      orient: 'horizontal', left: 'center', bottom: 2, itemWidth: 12, itemHeight: 90,
      inRange: { color: RAMP }, text: ['High', 'Low'],
      textStyle: { color: C.mid, fontFamily: "'JetBrains Mono',monospace", fontSize: 9 },
      formatter: (v) => 'RM' + Math.round(v / 1000) + 'k',
    };
    const tooltip = {
      ...MKT_TT, trigger: 'item',
      formatter: (p) => {
        const m = META[p.name];
        return `${p.name}<br/>Avg price: <b>${mRM(p.value)}</b>` +
          (m ? `<br/>Median ${mRM(m[2])} · ${mFmt(m[3])} txns` : '');
      },
    };
    const mapOption = {
      backgroundColor: 'transparent', visualMap, tooltip,
      series: [{
        id: 'statePrice', type: 'map', map: 'malaysia', roam: true,
        aspectScale: 1, zoom: 1.06,
        universalTransition: true, animationDurationUpdate: 1500,
        data: items, label: { show: false },
        itemStyle: { borderColor: C.cream, borderWidth: 0.6 },
        emphasis: { label: { show: true, color: C.deep, fontFamily: "'DM Sans',sans-serif" }, itemStyle: { areaColor: C.earthLight } },
        select: { disabled: true },
      }],
    };
    const barOption = {
      backgroundColor: 'transparent', visualMap, tooltip,
      grid: { left: 118, right: 74, top: 8, bottom: 62 },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } }, axisLabel: { ...MKT_AXM, formatter: (v) => 'RM' + Math.round(v / 1000) + 'k' } },
      yAxis: { type: 'category', data: items.map(i => i.name), axisTick: { show: false }, axisLine: { lineStyle: { color: C.border } }, axisLabel: { color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 11 } },
      series: {
        id: 'statePrice', type: 'bar', universalTransition: true, animationDurationUpdate: 1500,
        barWidth: '62%', data: items.map(i => i.value),
        label: { show: true, position: 'right', color: C.mid, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", formatter: (p) => 'RM' + Math.round(p.value / 1000) + 'k' },
      },
    };

    optionsRef.current = { map: mapOption, bar: barOption };

    chart.showLoading({ text: 'Loading map…', textColor: C.mid, color: C.earth, maskColor: 'rgba(255,255,255,0)' });
    fetch('./malaysia-states.geojson').then(r => r.json()).then(geo => {
      if (disposed) return;
      window.echarts.registerMap('malaysia', geo);
      chart.hideLoading();
      chart.setOption(mapOption);
      chart.resize();
      setReady(true);
    }).catch(() => { if (!disposed) chart.hideLoading(); });

    return () => { disposed = true; clearTimeout(t0); ro.disconnect(); chart.dispose(); chartRef.current = null; };
  }, []);

  // morph between the two views whenever the toggle flips (universalTransition)
  React.useEffect(() => {
    if (!ready || !chartRef.current || !optionsRef.current) return;
    chartRef.current.setOption(view === 'map' ? optionsRef.current.map : optionsRef.current.bar, true);
  }, [view, ready]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <div style={{
          display: 'inline-flex', gap: 4, background: C.cream, padding: 4, borderRadius: 9999,
          border: `1px solid ${C.border}`, boxShadow: '0 3px 12px rgba(44,57,48,.14)',
        }}>
          {[['map', 'Map'], ['bar', 'Ranking']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              border: 0, borderRadius: 9999, padding: '6px 20px',
              background: view === id ? C.deep : 'transparent',
              color: view === id ? C.cream : C.mid,
              fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all .2s',
            }}>{label}</button>
          ))}
        </div>
      </div>
      <div ref={elRef} style={{ width: '100%', height: 430 }}/>
    </div>
  );
};

const Kpi = ({ label, value, sub, accent }) => (
  <Card style={{ padding: 18 }}>
    <Eyebrow>{label}</Eyebrow>
    <Mono size={25} color={accent || C.deep} style={{ display: 'block', marginTop: 8 }}>{value}</Mono>
    {sub && (
      <div style={{ marginTop: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid }}>{sub}</div>
    )}
  </Card>
);

const ChartCard = ({ title, note, children }) => (
  <Card style={{ padding: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
      <Display size={18} weight={500}>{title}</Display>
      {note && (
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid, textAlign: 'right' }}>{note}</span>
      )}
    </div>
    {children}
  </Card>
);

const MarketOverviewPage = () => {
  const volOption = React.useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { left: 56, right: 22, top: 22, bottom: 44 },
    tooltip: {
      trigger: 'axis', ...MKT_TT,
      axisPointer: { type: 'line', lineStyle: { color: C.earth, width: 1, type: [3, 4] } },
      valueFormatter: (v) => mFmt(v) + ' transactions',
    },
    xAxis: {
      type: 'category', data: MKT_QVOL.map(d => d[0]), boundaryGap: false,
      axisLine: { lineStyle: { color: C.border } }, axisTick: { show: false },
      axisLabel: { ...MKT_AXM, interval: (i, v) => v.endsWith('Q1'), formatter: (v) => v.split(' ')[0] },
    },
    yAxis: {
      type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } },
      axisLabel: { ...MKT_AXM, formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) },
    },
    series: [{
      type: 'line', smooth: true, showSymbol: false, data: MKT_QVOL.map(d => d[1]),
      lineStyle: { color: C.earth, width: 2.4 },
      areaStyle: { color: _mg(0, 1, 'rgba(162,123,92,0.34)', 'rgba(162,123,92,0.02)') },
      markArea: {
        silent: true, itemStyle: { color: C.deep, opacity: 0.05 },
        label: { show: true, position: 'top', color: C.mid, fontSize: 9, fontFamily: "'DM Sans',sans-serif", formatter: 'provisional' },
        data: [[{ xAxis: '2024 Q4' }, { xAxis: '2026 Q1' }]],
      },
    }],
  }), []);

  const histOption = React.useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { left: 46, right: 16, top: 18, bottom: 30 },
    tooltip: { trigger: 'axis', ...MKT_TT, axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(162,123,92,0.10)' } }, valueFormatter: (v) => mFmt(v) },
    xAxis: {
      type: 'category', data: MKT_HIST.map(d => d[0]),
      axisLine: { lineStyle: { color: C.border } }, axisTick: { show: false },
      axisLabel: { ...MKT_AXM, fontSize: 9, interval: 0 },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } }, axisLabel: { ...MKT_AXM, formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
    series: [{ type: 'bar', barWidth: '62%', data: MKT_HIST.map(d => d[1]), itemStyle: { borderRadius: [5, 5, 0, 0], color: _mg(0, 1, C.earthLight, C.earth) } }],
  }), []);

  const tenureOption = React.useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', ...MKT_TT, formatter: (p) => `${p.name}<br/><b>${mFmt(p.value)}</b> (${p.percent}%)` },
    legend: { bottom: 2, textStyle: { color: C.mid, fontFamily: "'DM Sans',sans-serif" } },
    series: [{
      type: 'pie', radius: ['54%', '80%'], center: ['50%', '45%'], data: MKT_TENURE,
      itemStyle: { borderColor: C.cream, borderWidth: 3 },
      label: { color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 12, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: C.border } },
      color: [C.earth, C.mid],
    }],
  }), []);

  const ptypeCountOption = React.useMemo(() => {
    const asc = [...MKT_PTYPE].reverse();
    return {
      backgroundColor: 'transparent',
      grid: { left: 142, right: 56, top: 6, bottom: 22 },
      tooltip: {
        trigger: 'axis', ...MKT_TT, axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(162,123,92,0.10)' } },
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Transactions: <b>${mFmt(p.value)}</b><br/>Median: ${mRM(PMED[p.name])}`; },
      },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } }, axisLabel: { ...MKT_AXM, formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
      yAxis: { type: 'category', data: asc.map(d => d[0]), axisTick: { show: false }, axisLine: { lineStyle: { color: C.border } }, axisLabel: { color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: '62%', data: asc.map(d => d[1]),
        itemStyle: { borderRadius: [0, 5, 5, 0], color: _mg(1, 0, C.earthLight, C.earth) },
        label: { show: true, position: 'right', color: C.mid, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", formatter: (p) => mFmt(p.value) },
      }],
    };
  }, []);

  const ptypePriceOption = React.useMemo(() => {
    const byPrice = [...MKT_PTYPE].sort((a, b) => a[2] - b[2]);
    return {
      backgroundColor: 'transparent',
      grid: { left: 142, right: 64, top: 6, bottom: 22 },
      tooltip: {
        trigger: 'axis', ...MKT_TT, axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(63,79,68,0.10)' } },
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Median price: <b>${mRM(p.value)}</b>`; },
      },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } }, axisLabel: { ...MKT_AXM, formatter: (v) => 'RM' + v / 1000 + 'k' } },
      yAxis: { type: 'category', data: byPrice.map(d => d[0]), axisTick: { show: false }, axisLine: { lineStyle: { color: C.border } }, axisLabel: { color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: '62%', data: byPrice.map(d => d[2]),
        itemStyle: { borderRadius: [0, 5, 5, 0], color: _mg(1, 0, C.light, C.mid) },
        label: { show: true, position: 'right', color: C.mid, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", formatter: (p) => 'RM' + Math.round(p.value / 1000) + 'k' },
      }],
    };
  }, []);

  const distOption = React.useMemo(() => {
    const asc = [...MKT_DIST].reverse();
    return {
      backgroundColor: 'transparent',
      grid: { left: 122, right: 58, top: 6, bottom: 24 },
      tooltip: {
        trigger: 'axis', ...MKT_TT, axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(162,123,92,0.10)' } },
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Transactions: <b>${mFmt(p.value)}</b><br/>Median: ${mRM(DMED[p.name])}`; },
      },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: C.border, type: [2, 5] } }, axisLabel: { ...MKT_AXM, formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
      yAxis: { type: 'category', data: asc.map(d => d[0]), axisTick: { show: false }, axisLine: { lineStyle: { color: C.border } }, axisLabel: { color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: '64%', data: asc.map(d => d[1]),
        itemStyle: { borderRadius: [0, 5, 5, 0], color: _mg(1, 0, C.earthLight, C.earth) },
        label: { show: true, position: 'right', color: C.mid, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", formatter: (p) => mFmt(p.value) },
      }],
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <style>{`
        @media (max-width: 980px) { .mkt-2col { grid-template-columns: 1fr !important; } }
      `}</style>

      <div>
        <Eyebrow>Property Market Overview</Eyebrow>
        <Display size={28} weight={500} style={{ display: 'block', marginTop: 6 }}>
          Malaysia residential property market
        </Display>
        <div style={{ marginTop: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.mid }}>
          {mFmt(MKT.txns)} transactions · {MKT.coverage} · source: NAPIC Open Transaction Data
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <Kpi label="Transactions" value={mFmt(MKT.txns)} sub="residential, 2021–2026"/>
        <Kpi label="Total value" value={`RM ${MKT.valueBn} bn`} accent={C.earth} sub="sum of all sale prices"/>
        <Kpi label="Median price" value={mRM(MKT.medianPrice)} sub="mean RM 499,460"/>
        <Kpi label="Median unit price" value={`RM ${mFmt(MKT.medianPpm)}`} sub="per m² · ≈ RM 334 psf"/>
        <Kpi label="Freehold share" value={`${MKT.freehold}%`} accent={C.up} sub={`Leasehold ${MKT.leasehold}%`}/>
      </div>

      <ChartCard title="Average price by state" note="toggle map / ranking · drag / scroll to explore the map">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 2, marginBottom: 2 }}>
          <span style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em',
            textTransform: 'uppercase', color: C.cream, background: C.earth, padding: '3px 9px', borderRadius: 9999,
          }}>Highest</span>
          <Display size={20} weight={500}>{STATE_HIGH[0]}</Display>
          <Mono size={17} color={C.earth}>{mRM(STATE_HIGH[1])} avg</Mono>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid }}>
            · median {mRM(STATE_HIGH[2])} across {mFmt(STATE_HIGH[3])} transactions
          </span>
        </div>
        <StatePriceMorph/>
      </ChartCard>

      <ChartCard title="Transaction volume" note="quarterly · 2024 Q4 onward still being reported">
        <MktChart option={volOption} height={300}/>
        <div style={{ marginTop: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.mid, lineHeight: 1.5 }}>
          The market ran at ~30,000 sales a quarter through 2022–2024. The shaded tail is provisional —
          NAPIC registers transactions with a lag, so recent quarters understate true activity.
        </div>
      </ChartCard>

      <div className="mkt-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <ChartCard title="Price distribution" note="count by RM band">
          <MktChart option={histOption} height={240}/>
        </ChartCard>
        <ChartCard title="Tenure" note="freehold vs leasehold">
          <MktChart option={tenureOption} height={240}/>
        </ChartCard>
      </div>

      <div className="mkt-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <ChartCard title="Transactions by property type" note="terraced homes dominate">
          <MktChart option={ptypeCountOption} height={320}/>
        </ChartCard>
        <ChartCard title="Median price by property type" note="RM, secondary market">
          <MktChart option={ptypePriceOption} height={320}/>
        </ChartCard>
      </div>

      <ChartCard title="Top districts by transaction volume" note="Klang Valley + Johor lead">
        <MktChart option={distOption} height={360}/>
      </ChartCard>

    </div>
  );
};

Object.assign(window, { MarketOverviewPage });
