import { useState, useMemo, useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard, ScrollReveal } from '@/components/shared'
import { C } from '@/lib/colors'
import {
  CHART_THEME,
  chartAreaGrad,
  chartAxisLine,
  chartAxisPointerLine,
  chartAxisPointerShadow,
  chartCategoryAxisLabel,
  chartGrad,
  chartGrid,
  chartLegend,
  chartLoading,
  chartOpts,
  chartSplitLine,
  chartTooltip,
  chartValueAxisLabel,
  chartVisualMap,
  chartBarRadius,
  withChartBase,
} from '@/lib/chartTheme'

// ---- headline figures (actual, from the parquet) --------------------------
const MKT = {
  txns: 416627,
  valueBn: 208.1,        // sum(Price) = RM 208.09 bn
  medianPrice: 371000,
  medianPpm: 3600,       // median Price / built-up Area (RM per m²)
  freehold: 66.4, leasehold: 33.6,
  coverage: 'Jan 2021 – Mar 2026',
}

// quarterly transaction count [quarter, count]
const MKT_QVOL = [
  ['2021 Q1', 4531], ['2021 Q2', 5842], ['2021 Q3', 10105], ['2021 Q4', 28885],
  ['2022 Q1', 24442], ['2022 Q2', 31553], ['2022 Q3', 33058], ['2022 Q4', 29521],
  ['2023 Q1', 27355], ['2023 Q2', 30650], ['2023 Q3', 30770], ['2023 Q4', 29406],
  ['2024 Q1', 27059], ['2024 Q2', 27321], ['2024 Q3', 25971], ['2024 Q4', 9331],
  ['2025 Q1', 7680], ['2025 Q2', 8398], ['2025 Q3', 9719], ['2025 Q4', 9362],
  ['2026 Q1', 5668],
]

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
]

// [district, count, median price] — top 12 by volume
const MKT_DIST = [
  ['Johor Bahru', 46111, 499000], ['Petaling', 33861, 550000],
  ['Kuala Lumpur', 26365, 560000], ['Hulu Langat', 22984, 440000],
  ['Kinta', 19155, 299000], ['Klang', 18633, 450000],
  ['Seremban', 17492, 380000], ['Gombak', 12386, 444000],
  ['Timur Laut', 11504, 380000], ['Kuala Muda', 10948, 250000],
  ['Kuantan', 10705, 290000], ['Melaka Tengah', 10629, 300000],
]

// price distribution [RM band, count]
const MKT_HIST = [
  ['<200k', 64666], ['200–300k', 83685], ['300–400k', 76812], ['400–500k', 59846],
  ['500–700k', 61421], ['700k–1m', 37976], ['1–1.5m', 17727], ['>1.5m', 14494],
]

const MKT_TENURE = [
  { value: 276848, name: 'Freehold' },
  { value: 139779, name: 'Leasehold' },
]

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
]
const STATE_HIGH = STATE_AVG[0] // Kuala Lumpur — highest average price

const PMED = {}; MKT_PTYPE.forEach(d => { PMED[d[0]] = d[2] })
const DMED = {}; MKT_DIST.forEach(d => { DMED[d[0]] = d[2] })

// ---- shared chart helpers -------------------------------------------------
const mFmt = (n) => Number(n).toLocaleString('en-US')
const mRM = (n) => 'RM ' + mFmt(Math.round(n))

// ---- choropleth ↔ bar morph: average price by state (the showpiece) -------
const StatePriceMorph = () => {
  const elRef = useRef(null)
  const chartRef = useRef(null)
  const optionsRef = useRef(null)
  const [view, setView] = useState('map')   // 'map' | 'bar'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!elRef.current) return undefined
    const chart = echarts.init(elRef.current, CHART_THEME, { renderer: 'canvas' })
    chartRef.current = chart
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(elRef.current)
    const t0 = setTimeout(() => chart.resize(), 320)
    let disposed = false

    const asc = [...STATE_AVG].sort((a, b) => a[1] - b[1]) // ascending → highest at top of the bar list
    const items = asc.map(d => ({ name: d[0], value: d[1] }))
    const META = Object.fromEntries(STATE_AVG.map(d => [d[0], d]))
    const visualMap = chartVisualMap({
      min: 270000, max: 700000, calculable: true,
      text: ['High', 'Low'],
      formatter: (v) => 'RM' + Math.round(v / 1000) + 'k',
    })
    const tooltip = chartTooltip({
      trigger: 'item',
      formatter: (p) => {
        const m = META[p.name]
        return `${p.name}<br/>Avg price: <b>${mRM(p.value)}</b>` +
          (m ? `<br/>Median ${mRM(m[2])} · ${mFmt(m[3])} txns` : '')
      },
    })
    const mapOption = withChartBase({
      visualMap, tooltip,
      series: [{
        id: 'statePrice', type: 'map', map: 'malaysia', roam: true,
        aspectScale: 1, zoom: 1.06,
        universalTransition: true, animationDurationUpdate: 1500,
        data: items, label: { show: false },
        itemStyle: { borderColor: C.cream, borderWidth: 0.6 },
        emphasis: { label: { show: true, color: C.deep, fontFamily: "'DM Sans',sans-serif" }, itemStyle: { areaColor: C.earthLight } },
        select: { disabled: true },
      }],
    })
    const barOption = withChartBase({
      visualMap, tooltip,
      grid: chartGrid({ left: 118, right: 74, top: 8, bottom: 62 }),
      xAxis: {
        type: 'value',
        splitLine: chartSplitLine,
        axisLabel: chartValueAxisLabel({ formatter: (v) => 'RM' + Math.round(v / 1000) + 'k' }),
      },
      yAxis: {
        type: 'category', data: items.map(i => i.name),
        axisTick: { show: false }, axisLine: chartAxisLine,
        axisLabel: chartCategoryAxisLabel(),
      },
      series: {
        id: 'statePrice', type: 'bar', universalTransition: true, animationDurationUpdate: 1500,
        barWidth: '62%', data: items.map(i => i.value),
        label: { show: true, position: 'right', ...chartValueAxisLabel(), formatter: (p) => 'RM' + Math.round(p.value / 1000) + 'k' },
      },
    })

    optionsRef.current = { map: mapOption, bar: barOption }

    chart.showLoading(chartLoading)
    fetch('/malaysia-states.geojson').then(r => r.json()).then(geo => {
      if (disposed) return
      echarts.registerMap('malaysia', geo)
      chart.hideLoading()
      chart.setOption(mapOption)
      chart.resize()
      setReady(true)
    }).catch(() => { if (!disposed) chart.hideLoading() })

    return () => { disposed = true; clearTimeout(t0); ro.disconnect(); chart.dispose(); chartRef.current = null }
  }, [])

  // morph between the two views whenever the toggle flips (universalTransition)
  useEffect(() => {
    if (!ready || !chartRef.current || !optionsRef.current) return
    chartRef.current.setOption(view === 'map' ? optionsRef.current.map : optionsRef.current.bar, true)
  }, [view, ready])

  return (
    <div className="w-full">
      <div className="flex justify-center mb-1">
        <div className="inline-flex gap-1 bg-[#DCD7C9] p-1 rounded-full border border-[#C8C3B8] shadow-md">
          {[['map', 'Map'], ['bar', 'Ranking']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)}
              className={`rounded-full px-5 py-1.5 text-[12.5px] font-semibold transition-all duration-200 ${
                view === id ? 'bg-[#2C3930] text-[#DCD7C9]' : 'bg-transparent text-[#3F4F44]'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={elRef} style={{ width: '100%', height: 430 }} />
    </div>
  )
}

// ---- ChartCard — shadcn Card wrapper --------------------------------------
const ChartCard = ({ title, note, children }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-baseline gap-3">
        <CardTitle className="font-display text-[18px] font-medium text-[#2C3930]">{title}</CardTitle>
        {note && <span className="text-[11.5px] text-[#3F4F44] text-right">{note}</span>}
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

// ---- Main page ------------------------------------------------------------
export default function MarketOverviewPage() {
  const volOption = useMemo(() => withChartBase({
    grid: chartGrid(),
    tooltip: {
      trigger: 'axis', ...chartTooltip(),
      axisPointer: chartAxisPointerLine,
      valueFormatter: (v) => mFmt(v) + ' transactions',
    },
    xAxis: {
      type: 'category', data: MKT_QVOL.map(d => d[0]), boundaryGap: false,
      axisLine: chartAxisLine, axisTick: { show: false },
      axisLabel: { ...chartValueAxisLabel(), interval: (i, v) => v.endsWith('Q1'), formatter: (v) => v.split(' ')[0] },
    },
    yAxis: {
      type: 'value', splitLine: chartSplitLine,
      axisLabel: { ...chartValueAxisLabel(), formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) },
    },
    series: [{
      type: 'line', smooth: true, showSymbol: false, data: MKT_QVOL.map(d => d[1]),
      lineStyle: { color: C.earth, width: 2.4 },
      areaStyle: { color: chartAreaGrad(C.earth, 0.34, 0.02) },
      markArea: {
        silent: true, itemStyle: { color: C.deep, opacity: 0.05 },
        label: { show: true, position: 'top', ...chartValueAxisLabel({ fontSize: 9, fontFamily: "'DM Sans',sans-serif" }), formatter: 'provisional' },
        data: [[{ xAxis: '2024 Q4' }, { xAxis: '2026 Q1' }]],
      },
    }],
  }), [])

  const histOption = useMemo(() => withChartBase({
    grid: chartGrid({ left: 46, right: 16, top: 18, bottom: 30 }),
    tooltip: { trigger: 'axis', ...chartTooltip(), axisPointer: chartAxisPointerShadow, valueFormatter: (v) => mFmt(v) },
    xAxis: {
      type: 'category', data: MKT_HIST.map(d => d[0]),
      axisLine: chartAxisLine, axisTick: { show: false },
      axisLabel: { ...chartValueAxisLabel(), fontSize: 9, interval: 0 },
    },
    yAxis: { type: 'value', splitLine: chartSplitLine, axisLabel: { ...chartValueAxisLabel(), formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
    series: [{ type: 'bar', barWidth: '62%', data: MKT_HIST.map(d => d[1]), itemStyle: { borderRadius: chartBarRadius.vertical, color: chartGrad(0, 1, C.earthLight, C.earth) } }],
  }), [])

  const tenureOption = useMemo(() => withChartBase({
    tooltip: { trigger: 'item', ...chartTooltip(), formatter: (p) => `${p.name}<br/><b>${mFmt(p.value)}</b> (${p.percent}%)` },
    legend: chartLegend({ bottom: 2 }),
    series: [{
      type: 'pie', radius: ['54%', '80%'], center: ['50%', '45%'], data: MKT_TENURE,
      itemStyle: { borderColor: C.cream, borderWidth: 3 },
      label: { ...chartCategoryAxisLabel({ fontSize: 12 }), formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: C.border } },
      color: [C.earth, C.mid],
    }],
  }), [])

  const ptypeCountOption = useMemo(() => {
    const asc = [...MKT_PTYPE].reverse()
    return withChartBase({
      grid: chartGrid({ left: 142, right: 56, top: 6, bottom: 22 }),
      tooltip: {
        trigger: 'axis', ...chartTooltip(), axisPointer: chartAxisPointerShadow,
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Transactions: <b>${mFmt(p.value)}</b><br/>Median: ${mRM(PMED[p.name])}` },
      },
      xAxis: { type: 'value', splitLine: chartSplitLine, axisLabel: { ...chartValueAxisLabel(), formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
      yAxis: { type: 'category', data: asc.map(d => d[0]), axisTick: { show: false }, axisLine: chartAxisLine, axisLabel: chartCategoryAxisLabel() },
      series: [{
        type: 'bar', barWidth: '62%', data: asc.map(d => d[1]),
        itemStyle: { borderRadius: chartBarRadius.horizontal, color: chartGrad(1, 0, C.earthLight, C.earth) },
        label: { show: true, position: 'right', ...chartValueAxisLabel(), formatter: (p) => mFmt(p.value) },
      }],
    })
  }, [])

  const ptypePriceOption = useMemo(() => {
    const byPrice = [...MKT_PTYPE].sort((a, b) => a[2] - b[2])
    return withChartBase({
      grid: chartGrid({ left: 142, right: 64, top: 6, bottom: 22 }),
      tooltip: {
        trigger: 'axis', ...chartTooltip(), axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(63,79,68,0.08)' } },
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Median price: <b>${mRM(p.value)}</b>` },
      },
      xAxis: { type: 'value', splitLine: chartSplitLine, axisLabel: { ...chartValueAxisLabel(), formatter: (v) => 'RM' + v / 1000 + 'k' } },
      yAxis: { type: 'category', data: byPrice.map(d => d[0]), axisTick: { show: false }, axisLine: chartAxisLine, axisLabel: chartCategoryAxisLabel() },
      series: [{
        type: 'bar', barWidth: '62%', data: byPrice.map(d => d[2]),
        itemStyle: { borderRadius: chartBarRadius.horizontal, color: chartGrad(1, 0, C.light, C.mid) },
        label: { show: true, position: 'right', ...chartValueAxisLabel(), formatter: (p) => 'RM' + Math.round(p.value / 1000) + 'k' },
      }],
    })
  }, [])

  const distOption = useMemo(() => {
    const asc = [...MKT_DIST].reverse()
    return withChartBase({
      grid: chartGrid({ left: 122, right: 58, top: 6, bottom: 24 }),
      tooltip: {
        trigger: 'axis', ...chartTooltip(), axisPointer: chartAxisPointerShadow,
        formatter: (ps) => { const p = ps[0]; return `${p.name}<br/>Transactions: <b>${mFmt(p.value)}</b><br/>Median: ${mRM(DMED[p.name])}` },
      },
      xAxis: { type: 'value', splitLine: chartSplitLine, axisLabel: { ...chartValueAxisLabel(), formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) } },
      yAxis: { type: 'category', data: asc.map(d => d[0]), axisTick: { show: false }, axisLine: chartAxisLine, axisLabel: chartCategoryAxisLabel() },
      series: [{
        type: 'bar', barWidth: '64%', data: asc.map(d => d[1]),
        itemStyle: { borderRadius: chartBarRadius.horizontal, color: chartGrad(1, 0, C.earthLight, C.earth) },
        label: { show: true, position: 'right', ...chartValueAxisLabel(), formatter: (p) => mFmt(p.value) },
      }],
    })
  }, [])

  return (
    <div className="p-6 space-y-5">
      <ScrollReveal>
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A27B5C]">
            Property Market Overview
          </p>
          <span className="font-display text-[28px] font-medium text-[#2C3930] block mt-1.5">
            Malaysia residential property market
          </span>
          <div className="mt-1.5 font-sans text-[13px] text-[#3F4F44]">
            {mFmt(MKT.txns)} transactions · {MKT.coverage} · source: NAPIC Open Transaction Data
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
        <ScrollReveal delay={0}><StatCard label="Transactions" value={mFmt(MKT.txns)} sub="residential, 2021–2026" /></ScrollReveal>
        <ScrollReveal delay={60}><StatCard label="Total value" value={`RM ${MKT.valueBn} bn`} sub="sum of all sale prices" accent={C.earth} /></ScrollReveal>
        <ScrollReveal delay={120}><StatCard label="Median price" value={mRM(MKT.medianPrice)} sub="mean RM 499,460" /></ScrollReveal>
        <ScrollReveal delay={180}><StatCard label="Median unit price" value={`RM ${mFmt(MKT.medianPpm)}`} sub="per m² · ≈ RM 334 psf" /></ScrollReveal>
        <ScrollReveal delay={240}><StatCard label="Freehold share" value={`${MKT.freehold}%`} sub={`Leasehold ${MKT.leasehold}%`} accent={C.up} /></ScrollReveal>
      </div>

      <ScrollReveal>
        <ChartCard title="Average price by state" note="toggle map / ranking · drag / scroll to explore the map">
          <div className="flex items-baseline gap-2.5 flex-wrap mt-0.5 mb-0.5">
            <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#DCD7C9] bg-[#A27B5C] px-2.5 py-0.5 rounded-full">
              Highest
            </span>
            <span className="font-display text-[20px] font-medium text-[#2C3930]">{STATE_HIGH[0]}</span>
            <span className="font-mono text-[17px] font-medium text-[#A27B5C]">{mRM(STATE_HIGH[1])} avg</span>
            <span className="font-sans text-[12px] text-[#3F4F44]">
              · median {mRM(STATE_HIGH[2])} across {mFmt(STATE_HIGH[3])} transactions
            </span>
          </div>
          <StatePriceMorph />
        </ChartCard>
      </ScrollReveal>

      <ScrollReveal>
        <ChartCard title="Transaction volume" note="quarterly · 2024 Q4 onward still being reported">
          <ReactECharts option={volOption} style={{ height: 300 }} opts={chartOpts} />
          <p className="mt-2 font-sans text-[11.5px] text-[#3F4F44] leading-relaxed">
            The market ran at ~30,000 sales a quarter through 2022–2024. The shaded tail is provisional —
            NAPIC registers transactions with a lag, so recent quarters understate true activity.
          </p>
        </ChartCard>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-1">
          <ChartCard title="Price distribution" note="count by RM band">
            <ReactECharts option={histOption} style={{ height: 240 }} opts={chartOpts} />
          </ChartCard>
          <ChartCard title="Tenure" note="freehold vs leasehold">
            <ReactECharts option={tenureOption} style={{ height: 240 }} opts={chartOpts} />
          </ChartCard>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-1">
          <ChartCard title="Transactions by property type" note="terraced homes dominate">
            <ReactECharts option={ptypeCountOption} style={{ height: 320 }} opts={chartOpts} />
          </ChartCard>
          <ChartCard title="Median price by property type" note="RM, secondary market">
            <ReactECharts option={ptypePriceOption} style={{ height: 320 }} opts={chartOpts} />
          </ChartCard>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <ChartCard title="Top districts by transaction volume" note="Klang Valley + Johor lead">
          <ReactECharts option={distOption} style={{ height: 360 }} opts={chartOpts} />
        </ChartCard>
      </ScrollReveal>
    </div>
  )
}
