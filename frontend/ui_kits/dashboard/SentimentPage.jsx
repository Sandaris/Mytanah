/* eslint-disable no-undef */

const HCR_LATEST = {
  period: '2025 Q3',
  probability: 0.1718,
  regime: 'low',
};

const HCR_INDICATORS = [
  { key: 'sales_vol_yoy', label: 'Transaction volume YoY', unit: '%', chart: 'bar', values: [{ period: '2023 Q4', value: 10.46 }, { period: '2024 Q1', value: 16.61 }, { period: '2024 Q2', value: -3.20 }, { period: '2024 Q3', value: 2.70 }, { period: '2024 Q4', value: 1.63 }, { period: '2025 Q1', value: -5.61 }, { period: '2025 Q2', value: 3.26 }, { period: '2025 Q3', value: -5.16 }] },
  { key: 'unsold_co', label: 'Completed unsold units', unit: ' units', chart: 'line', values: [{ period: '2023 Q4', value: 25816.00 }, { period: '2024 Q1', value: 24208.00 }, { period: '2024 Q2', value: 22642.00 }, { period: '2024 Q3', value: 21968.00 }, { period: '2024 Q4', value: 23149.00 }, { period: '2025 Q1', value: 23515.00 }, { period: '2025 Q2', value: 26911.00 }, { period: '2025 Q3', value: 28672.00 }] },
  { key: 'unsold_uc', label: 'Under-construction unsold units', unit: ' units', chart: 'line', values: [{ period: '2023 Q4', value: 51132.00 }, { period: '2024 Q1', value: 54320.00 }, { period: '2024 Q2', value: 57934.00 }, { period: '2024 Q3', value: 60552.00 }, { period: '2024 Q4', value: 60934.00 }, { period: '2025 Q1', value: 62753.00 }, { period: '2025 Q2', value: 65033.00 }, { period: '2025 Q3', value: 69356.00 }] },
  { key: 'planned_supply_yoy', label: 'Planned supply YoY', unit: '%', chart: 'bar', values: [{ period: '2023 Q4', value: -4.55 }, { period: '2024 Q1', value: -0.47 }, { period: '2024 Q2', value: 4.39 }, { period: '2024 Q3', value: 6.93 }, { period: '2024 Q4', value: 3.57 }, { period: '2025 Q1', value: -3.20 }, { period: '2025 Q2', value: -20.01 }, { period: '2025 Q3', value: -37.07 }] },
  { key: 'impaired_ratio', label: 'Property loan impaired ratio', unit: '%', chart: 'line', values: [{ period: '2023 Q4', value: 1.36 }, { period: '2024 Q1', value: 1.34 }, { period: '2024 Q2', value: 1.32 }, { period: '2024 Q3', value: 1.25 }, { period: '2024 Q4', value: 1.20 }, { period: '2025 Q1', value: 1.17 }, { period: '2025 Q2', value: 1.14 }, { period: '2025 Q3', value: 1.12 }] },
  { key: 'credit_gdp_yoy', label: 'Credit-to-GDP YoY', unit: '%', chart: 'bar', values: [{ period: '2023 Q4', value: 3.24 }, { period: '2024 Q1', value: 3.65 }, { period: '2024 Q2', value: 1.22 }, { period: '2024 Q3', value: -1.21 }, { period: '2024 Q4', value: -1.38 }, { period: '2025 Q1', value: -1.20 }, { period: '2025 Q2', value: 0.25 }, { period: '2025 Q3', value: 1.86 }] },
];

const HCR_CYCLE = [
  { period: '1989 Q1', year: 1989.00, cyc: 6.87, pos: 1 },
  { period: '1989 Q2', year: 1989.25, cyc: 4.08, pos: 1 },
  { period: '1989 Q3', year: 1989.50, cyc: 1.29, pos: 1 },
  { period: '1989 Q4', year: 1989.75, cyc: -1.51, pos: 0 },
  { period: '1990 Q1', year: 1990.00, cyc: -3.18, pos: 0 },
  { period: '1990 Q2', year: 1990.25, cyc: -6.32, pos: 0 },
  { period: '1990 Q3', year: 1990.50, cyc: -8.81, pos: 0 },
  { period: '1990 Q4', year: 1990.75, cyc: -4.43, pos: 0 },
  { period: '1991 Q1', year: 1991.00, cyc: -0.42, pos: 0 },
  { period: '1991 Q2', year: 1991.25, cyc: 3.33, pos: 1 },
  { period: '1991 Q3', year: 1991.50, cyc: 2.69, pos: 1 },
  { period: '1991 Q4', year: 1991.75, cyc: 2.02, pos: 1 },
  { period: '1992 Q1', year: 1992.00, cyc: 2.74, pos: 1 },
  { period: '1992 Q2', year: 1992.25, cyc: 3.12, pos: 1 },
  { period: '1992 Q3', year: 1992.50, cyc: 1.08, pos: 1 },
  { period: '1992 Q4', year: 1992.75, cyc: -0.58, pos: 0 },
  { period: '1993 Q1', year: 1993.00, cyc: -1.85, pos: 0 },
  { period: '1993 Q2', year: 1993.25, cyc: -4.16, pos: 0 },
  { period: '1993 Q3', year: 1993.50, cyc: -6.67, pos: 0 },
  { period: '1993 Q4', year: 1993.75, cyc: -7.77, pos: 0 },
  { period: '1994 Q1', year: 1994.00, cyc: -6.71, pos: 0 },
  { period: '1994 Q2', year: 1994.25, cyc: -10.37, pos: 0 },
  { period: '1994 Q3', year: 1994.50, cyc: -9.60, pos: 0 },
  { period: '1994 Q4', year: 1994.75, cyc: -5.20, pos: 0 },
  { period: '1995 Q1', year: 1995.00, cyc: -0.20, pos: 0 },
  { period: '1995 Q2', year: 1995.25, cyc: 2.11, pos: 1 },
  { period: '1995 Q3', year: 1995.50, cyc: 4.00, pos: 1 },
  { period: '1995 Q4', year: 1995.75, cyc: 7.05, pos: 1 },
  { period: '1996 Q1', year: 1996.00, cyc: 11.34, pos: 1 },
  { period: '1996 Q2', year: 1996.25, cyc: 13.37, pos: 1 },
  { period: '1996 Q3', year: 1996.50, cyc: 14.02, pos: 1 },
  { period: '1996 Q4', year: 1996.75, cyc: 14.74, pos: 1 },
  { period: '1997 Q1', year: 1997.00, cyc: 16.98, pos: 1 },
  { period: '1997 Q2', year: 1997.25, cyc: 15.63, pos: 1 },
  { period: '1997 Q3', year: 1997.50, cyc: 10.80, pos: 1 },
  { period: '1997 Q4', year: 1997.75, cyc: 4.21, pos: 1 },
  { period: '1998 Q1', year: 1998.00, cyc: 2.22, pos: 1 },
  { period: '1998 Q2', year: 1998.25, cyc: -4.07, pos: 0 },
  { period: '1998 Q3', year: 1998.50, cyc: -9.31, pos: 0 },
  { period: '1998 Q4', year: 1998.75, cyc: -8.72, pos: 0 },
  { period: '1999 Q1', year: 1999.00, cyc: -10.47, pos: 0 },
  { period: '1999 Q2', year: 1999.25, cyc: -10.68, pos: 0 },
  { period: '1999 Q3', year: 1999.50, cyc: -9.11, pos: 0 },
  { period: '1999 Q4', year: 1999.75, cyc: -5.76, pos: 0 },
  { period: '2000 Q1', year: 2000.00, cyc: -4.30, pos: 0 },
  { period: '2000 Q2', year: 2000.25, cyc: -1.12, pos: 0 },
  { period: '2000 Q3', year: 2000.50, cyc: -1.09, pos: 0 },
  { period: '2000 Q4', year: 2000.75, cyc: -0.59, pos: 0 },
  { period: '2001 Q1', year: 2001.00, cyc: -2.02, pos: 0 },
  { period: '2001 Q2', year: 2001.25, cyc: -2.23, pos: 0 },
  { period: '2001 Q3', year: 2001.50, cyc: -2.05, pos: 0 },
  { period: '2001 Q4', year: 2001.75, cyc: -2.16, pos: 0 },
  { period: '2002 Q1', year: 2002.00, cyc: -2.35, pos: 0 },
  { period: '2002 Q2', year: 2002.25, cyc: -1.48, pos: 0 },
  { period: '2002 Q3', year: 2002.50, cyc: -0.83, pos: 0 },
  { period: '2002 Q4', year: 2002.75, cyc: 1.43, pos: 1 },
  { period: '2003 Q1', year: 2003.00, cyc: 0.90, pos: 1 },
  { period: '2003 Q2', year: 2003.25, cyc: -1.23, pos: 0 },
  { period: '2003 Q3', year: 2003.50, cyc: 2.29, pos: 1 },
  { period: '2003 Q4', year: 2003.75, cyc: 2.76, pos: 1 },
  { period: '2004 Q1', year: 2004.00, cyc: 4.75, pos: 1 },
  { period: '2004 Q2', year: 2004.25, cyc: 3.11, pos: 1 },
  { period: '2004 Q3', year: 2004.50, cyc: 1.63, pos: 1 },
  { period: '2004 Q4', year: 2004.75, cyc: 2.06, pos: 1 },
  { period: '2005 Q1', year: 2005.00, cyc: 3.09, pos: 1 },
  { period: '2005 Q2', year: 2005.25, cyc: 3.81, pos: 1 },
  { period: '2005 Q3', year: 2005.50, cyc: 1.01, pos: 1 },
  { period: '2005 Q4', year: 2005.75, cyc: 1.21, pos: 1 },
  { period: '2006 Q1', year: 2006.00, cyc: 1.83, pos: 1 },
  { period: '2006 Q2', year: 2006.25, cyc: 0.69, pos: 1 },
  { period: '2006 Q3', year: 2006.50, cyc: -1.08, pos: 0 },
  { period: '2006 Q4', year: 2006.75, cyc: 3.65, pos: 1 },
  { period: '2007 Q1', year: 2007.00, cyc: 4.35, pos: 1 },
  { period: '2007 Q2', year: 2007.25, cyc: 2.10, pos: 1 },
  { period: '2007 Q3', year: 2007.50, cyc: 1.77, pos: 1 },
  { period: '2007 Q4', year: 2007.75, cyc: 1.70, pos: 1 },
  { period: '2008 Q1', year: 2008.00, cyc: 4.73, pos: 1 },
  { period: '2008 Q2', year: 2008.25, cyc: 1.74, pos: 1 },
  { period: '2008 Q3', year: 2008.50, cyc: 2.30, pos: 1 },
  { period: '2008 Q4', year: 2008.75, cyc: -3.16, pos: 0 },
  { period: '2009 Q1', year: 2009.00, cyc: -4.42, pos: 0 },
  { period: '2009 Q2', year: 2009.25, cyc: -4.50, pos: 0 },
  { period: '2009 Q3', year: 2009.50, cyc: -5.95, pos: 0 },
  { period: '2009 Q4', year: 2009.75, cyc: -6.39, pos: 0 },
  { period: '2010 Q1', year: 2010.00, cyc: -8.40, pos: 0 },
  { period: '2010 Q2', year: 2010.25, cyc: -6.91, pos: 0 },
  { period: '2010 Q3', year: 2010.50, cyc: -8.96, pos: 0 },
  { period: '2010 Q4', year: 2010.75, cyc: -7.99, pos: 0 },
  { period: '2011 Q1', year: 2011.00, cyc: -7.71, pos: 0 },
  { period: '2011 Q2', year: 2011.25, cyc: -8.38, pos: 0 },
  { period: '2011 Q3', year: 2011.50, cyc: -9.13, pos: 0 },
  { period: '2011 Q4', year: 2011.75, cyc: -5.53, pos: 0 },
  { period: '2012 Q1', year: 2012.00, cyc: -2.30, pos: 0 },
  { period: '2012 Q2', year: 2012.25, cyc: -1.49, pos: 0 },
  { period: '2012 Q3', year: 2012.50, cyc: -2.98, pos: 0 },
  { period: '2012 Q4', year: 2012.75, cyc: 3.91, pos: 1 },
  { period: '2013 Q1', year: 2013.00, cyc: -0.61, pos: 0 },
  { period: '2013 Q2', year: 2013.25, cyc: 1.76, pos: 1 },
  { period: '2013 Q3', year: 2013.50, cyc: 5.39, pos: 1 },
  { period: '2013 Q4', year: 2013.75, cyc: 2.82, pos: 1 },
  { period: '2014 Q1', year: 2014.00, cyc: 0.95, pos: 1 },
  { period: '2014 Q2', year: 2014.25, cyc: 3.88, pos: 1 },
  { period: '2014 Q3', year: 2014.50, cyc: 5.01, pos: 1 },
  { period: '2014 Q4', year: 2014.75, cyc: 2.63, pos: 1 },
  { period: '2015 Q1', year: 2015.00, cyc: 3.20, pos: 1 },
  { period: '2015 Q2', year: 2015.25, cyc: 0.66, pos: 1 },
  { period: '2015 Q3', year: 2015.50, cyc: 2.25, pos: 1 },
  { period: '2015 Q4', year: 2015.75, cyc: -0.69, pos: 0 },
  { period: '2016 Q1', year: 2016.00, cyc: 3.68, pos: 1 },
  { period: '2016 Q2', year: 2016.25, cyc: 1.77, pos: 1 },
  { period: '2016 Q3', year: 2016.50, cyc: 3.65, pos: 1 },
  { period: '2016 Q4', year: 2016.75, cyc: 2.33, pos: 1 },
  { period: '2017 Q1', year: 2017.00, cyc: 7.31, pos: 1 },
  { period: '2017 Q2', year: 2017.25, cyc: 7.09, pos: 1 },
  { period: '2017 Q3', year: 2017.50, cyc: 9.23, pos: 1 },
  { period: '2017 Q4', year: 2017.75, cyc: 7.76, pos: 1 },
  { period: '2018 Q1', year: 2018.00, cyc: 7.18, pos: 1 },
  { period: '2018 Q2', year: 2018.25, cyc: 5.53, pos: 1 },
  { period: '2018 Q3', year: 2018.50, cyc: 5.17, pos: 1 },
  { period: '2018 Q4', year: 2018.75, cyc: 3.82, pos: 1 },
  { period: '2019 Q1', year: 2019.00, cyc: 4.14, pos: 1 },
  { period: '2019 Q2', year: 2019.25, cyc: 2.58, pos: 1 },
  { period: '2019 Q3', year: 2019.50, cyc: 2.22, pos: 1 },
  { period: '2019 Q4', year: 2019.75, cyc: -0.03, pos: 0 },
  { period: '2020 Q1', year: 2020.00, cyc: 1.23, pos: 1 },
  { period: '2020 Q2', year: 2020.25, cyc: -1.96, pos: 0 },
  { period: '2020 Q3', year: 2020.50, cyc: -7.24, pos: 0 },
  { period: '2020 Q4', year: 2020.75, cyc: -5.08, pos: 0 },
  { period: '2021 Q1', year: 2021.00, cyc: -5.97, pos: 0 },
  { period: '2021 Q2', year: 2021.25, cyc: -7.80, pos: 0 },
  { period: '2021 Q3', year: 2021.50, cyc: -13.32, pos: 0 },
  { period: '2021 Q4', year: 2021.75, cyc: -7.78, pos: 0 },
  { period: '2022 Q1', year: 2022.00, cyc: -6.84, pos: 0 },
  { period: '2022 Q2', year: 2022.25, cyc: -8.03, pos: 0 },
  { period: '2022 Q3', year: 2022.50, cyc: -3.11, pos: 0 },
  { period: '2022 Q4', year: 2022.75, cyc: -3.03, pos: 0 },
  { period: '2023 Q1', year: 2023.00, cyc: 1.71, pos: 1 },
  { period: '2023 Q2', year: 2023.25, cyc: -1.87, pos: 0 },
  { period: '2023 Q3', year: 2023.50, cyc: -1.59, pos: 0 },
  { period: '2023 Q4', year: 2023.75, cyc: 0.88, pos: 1 },
  { period: '2024 Q1', year: 2024.00, cyc: 4.21, pos: 1 },
  { period: '2024 Q2', year: 2024.25, cyc: 3.19, pos: 1 },
  { period: '2024 Q3', year: 2024.50, cyc: 4.58, pos: 1 },
  { period: '2024 Q4', year: 2024.75, cyc: 7.73, pos: 1 },
  { period: '2025 Q1', year: 2025.00, cyc: 7.05, pos: 1 },
  { period: '2025 Q2', year: 2025.25, cyc: 3.60, pos: 1 },
  { period: '2025 Q3', year: 2025.50, cyc: -9.14, pos: 0 },
];

const HCR_PERIODS = [
  { from: 1997.5, to: 1999.0, label: 'AFC' },
  { from: 2008.5, to: 2009.5, label: 'GFC' },
  { from: 2010.75, to: 2011.75, label: 'LTV restriction for third and subsequent housing loans' },
  { from: 2011.0, to: 2013.75, label: 'Housing boom' },
  { from: 2014.0, to: 2016.75, label: 'Cooling measures / RPGT tightening' },
  { from: 2020.0, to: 2021.75, label: 'COVID-19 disruption' },
  { from: 2022.25, to: 2024.75, label: 'Post-pandemic housing recovery' },
];

const hcrPct = (v) => (v * 100).toFixed(1) + '%';
const hcrNum = (v, unit = '') => {
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('en-MY') + unit;
  return v.toFixed(Math.abs(v) < 10 ? 2 : 1) + unit;
};
const hcrQuarter = (p) => {
  if (p.period) return p.period;
  const year = Math.floor(p.year);
  const q = Math.max(1, Math.min(4, Math.floor((p.year - year) * 4 + 1.05)));
  return `${year} Q${q}`;
};
const hcrEventForYear = (year) => {
  const found = HCR_PERIODS.filter(e => year >= e.from && year <= e.to).map(e => e.label);
  return found.join(', ');
};

const RegimePanel = ({ latest }) => {
  const p = Math.max(0, Math.min(1, latest.probability ?? HCR_LATEST.probability));
  const high = p > 0.5;
  return (
    <Card style={{ padding: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>Housing cycle sentiment signal</Eyebrow>
          <Display size={34} weight={500} style={{ display: 'block', marginTop: 8 }}>
            House prices are currently{' '}
            <span style={{ color: high ? C.down : C.up, fontWeight: 700 }}>{high ? 'HIGH' : 'LOW'}</span>
          </Display>
          <div style={{ marginTop: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.mid }}>
            Current prediction for dependent variable <Mono size={12}>cycle_pos = 1</Mono> at {latest.period || HCR_LATEST.period}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Eyebrow>Prediction</Eyebrow>
          <Mono size={34} color={high ? C.down : C.up}>{hcrPct(p)}</Mono>
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <div style={{
          position: 'relative', height: 34, borderRadius: 9999,
          background: `linear-gradient(90deg, ${C.up} 0%, #f4f1ea 50%, ${C.down} 100%)`,
          border: `1px solid ${C.border}`, boxShadow: 'inset 0 1px 4px rgba(44,57,48,.16)',
        }}>
          <div style={{
            position: 'absolute', left: `calc(${p * 100}% - 8px)`, top: -7,
            width: 16, height: 48, borderRadius: 9999, background: C.deep,
            boxShadow: `0 0 0 4px ${C.raised}, 0 8px 24px ${high ? C.down : C.up}88`,
          }}/>
        </div>
        <div style={{
          marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.mid,
        }}>
          <span>0.00 low-price regime</span>
          <span style={{ textAlign: 'center' }}>0.50 neutral threshold</span>
          <span style={{ textAlign: 'right' }}>1.00 high-price regime</span>
        </div>
      </div>
    </Card>
  );
};

const CycleComponentChart = () => {
  const pts = HCR_CYCLE.map(p => ({ ...p, event: hcrEventForYear(p.year) }));
  const [hover, setHover] = React.useState(null);
  if (!pts.length) return null;

  const W = 980, H = 330, xL = 56, xR = W - 24, yT = 28, yB = H - 42;
  const minYear = 1988, maxYear = 2026;
  const minC = Math.min(...pts.map(p => p.cyc), -14);
  const maxC = Math.max(...pts.map(p => p.cyc), 16);
  const sx = (year) => xL + ((year - minYear) / (maxYear - minYear)) * (xR - xL);
  const sy = (cyc) => yB - ((cyc - minC) / (maxC - minC)) * (yB - yT);
  const zero = sy(0);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${sy(p.cyc).toFixed(1)}`).join(' ');
  const fill = `M${sx(pts[0].year).toFixed(1)} ${zero.toFixed(1)} ${pts.map(p => `L${sx(p.year).toFixed(1)} ${sy(p.cyc).toFixed(1)}`).join(' ')} L${sx(pts[pts.length - 1].year).toFixed(1)} ${zero.toFixed(1)} Z`;
  const nearest = (clientX, rect) => {
    const svgX = ((clientX - rect.left) / rect.width) * W;
    return pts.reduce((best, p) => Math.abs(sx(p.year) - svgX) < Math.abs(sx(best.year) - svgX) ? p : best, pts[0]);
  };

  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <Display size={22} weight={500}>HP-filter cyclical component</Display>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid }}>
          Mean price minus HP trend, RM '000
        </span>
      </div>
      <div style={{ position: 'relative', marginTop: 14 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const p = nearest(e.clientX, rect);
            setHover({ p, left: (sx(p.year) / W) * 100, x: sx(p.year), y: sy(p.cyc) });
          }}>
          <defs>
            <clipPath id="hcr-cycle-up"><rect x={xL} y={yT} width={xR - xL} height={zero - yT}/></clipPath>
            <clipPath id="hcr-cycle-down"><rect x={xL} y={zero} width={xR - xL} height={yB - zero}/></clipPath>
          </defs>
          {HCR_PERIODS.map(e => (
            <rect key={e.label} x={sx(e.from)} y={yT} width={Math.max(1, sx(e.to) - sx(e.from))}
              height={yB - yT} fill={C.earth} opacity="0.07"/>
          ))}
          {[-10, -5, 0, 5, 10, 15].map(v => (
            <g key={v}>
              <line x1={xL} x2={xR} y1={sy(v)} y2={sy(v)}
                stroke={v === 0 ? C.deep : C.border} strokeWidth={v === 0 ? 1.2 : 1} strokeDasharray={v === 0 ? '' : '2 5'}/>
              <text x={xL - 8} y={sy(v) + 3} textAnchor="end"
                fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.mid}>{v > 0 ? '+' : ''}{v}</text>
            </g>
          ))}
          <path d={fill} fill={C.up} opacity="0.28" clipPath="url(#hcr-cycle-up)"/>
          <path d={fill} fill={C.down} opacity="0.24" clipPath="url(#hcr-cycle-down)"/>
          <path d={line} fill="none" stroke={C.deep} strokeWidth="1.8" strokeLinejoin="round"/>
          {[1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025].map(y => (
            <g key={y}>
              <line x1={sx(y)} x2={sx(y)} y1={yB} y2={yB + 5} stroke={C.mid}/>
              <text x={sx(y)} y={H - 14} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.mid}>{y}</text>
            </g>
          ))}
          {hover && (
            <g>
              <line x1={hover.x} x2={hover.x} y1={yT} y2={yB} stroke={C.earth} strokeWidth="1.1" strokeDasharray="3 4"/>
              <circle cx={hover.x} cy={hover.y} r="4.4" fill={hover.p.cyc >= 0 ? C.up : C.down}
                stroke={C.raised} strokeWidth="2"/>
            </g>
          )}
        </svg>
        {hover && (
          <div style={{
            position: 'absolute', left: `min(calc(${hover.left}% + 8px), calc(100% - 250px))`, top: 16,
            width: 242, padding: '10px 12px', borderRadius: 8, background: C.deep, color: C.cream,
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.42,
            boxShadow: '0 16px 40px rgba(20,28,22,.28)', pointerEvents: 'none',
          }}>
            <Mono size={12} color={C.cream}>{hcrQuarter(hover.p)}</Mono>
            <div style={{ marginTop: 4 }}>Cycle: <b>{hover.p.cyc >= 0 ? '+' : ''}{hover.p.cyc.toFixed(2)}k</b></div>
            <div>{hover.p.cyc >= 0 ? 'Above trend / upward pressure' : 'Below trend / low-price pressure'}</div>
            {hover.p.event && <div style={{ marginTop: 5, color: C.earthLight }}>{hover.p.event}</div>}
          </div>
        )}
      </div>
    </Card>
  );
};

const IndicatorChart = ({ ind }) => {
  const vals = ind.values;
  const latest = vals[vals.length - 1];
  const prev = vals[vals.length - 2] || vals[0];
  const up = latest.value >= prev.value;
  const accent = up ? C.down : C.up;
  const base = C.earth;
  const W = 330, H = 138, xL = 18, xR = W - 18, yT = 16, yB = H - 28;
  const lo = Math.min(...vals.map(v => v.value), 0);
  const hi = Math.max(...vals.map(v => v.value), 0);
  const span = hi - lo || 1;
  const sx = (i) => xL + (i / Math.max(1, vals.length - 1)) * (xR - xL);
  const sy = (v) => yB - ((v - lo) / span) * (yB - yT);
  const zero = sy(0);
  const line = vals.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)} ${sy(v.value).toFixed(1)}`).join(' ');

  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
        <div>
          <Eyebrow>{ind.key}</Eyebrow>
          <Display size={17} weight={500} style={{ display: 'block', marginTop: 4 }}>{ind.label}</Display>
        </div>
        <Mono size={13} color={accent}>{hcrNum(latest.value, ind.unit)}</Mono>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginTop: 10, overflow: 'visible' }}>
        <defs>
          <filter id={`glow-${ind.key}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <line x1={xL} x2={xR} y1={zero} y2={zero} stroke={C.border} strokeWidth="1"/>
        {ind.chart === 'bar' ? vals.map((v, i) => {
          const latestBar = i === vals.length - 1;
          const y0 = sy(Math.max(v.value, 0)), y1 = sy(Math.min(v.value, 0));
          const h = Math.max(2, Math.abs(y1 - y0));
          return (
            <rect key={v.period} x={sx(i) - 9} y={Math.min(y0, y1)} width="18" height={h} rx="4"
              fill={latestBar ? accent : base} opacity={latestBar ? 1 : 0.48}
              filter={latestBar ? `url(#glow-${ind.key})` : ''}/>
          );
        }) : (
          <>
            <path d={line} fill="none" stroke={base} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.72"/>
            {vals.map((v, i) => {
              const latestDot = i === vals.length - 1;
              return <circle key={v.period} cx={sx(i)} cy={sy(v.value)} r={latestDot ? 4.4 : 2.7}
                fill={latestDot ? accent : C.raised} stroke={latestDot ? accent : base} strokeWidth="1.7"
                filter={latestDot ? `url(#glow-${ind.key})` : ''}/>;
            })}
          </>
        )}
        <text x={xL} y={H - 7} fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill={C.muted}>{vals[0].period}</text>
        <text x={xR} y={H - 7} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" fill={C.muted}>{latest.period}</text>
        <text x={xR - 4} y={Math.max(10, sy(latest.value) - 8)} textAnchor="end"
          fontFamily="'JetBrains Mono',monospace" fontSize="10.5" fontWeight="700" fill={accent}>
          {hcrNum(latest.value, ind.unit)}
        </text>
      </svg>
    </Card>
  );
};

const SentimentPage = () => {
  const [latest, setLatest] = React.useState(HCR_LATEST);
  React.useEffect(() => {
    let dead = false;
    if (!window.API || !window.API.hcrCurrent) return undefined;
    window.API.hcrCurrent()
      .then(data => {
        if (!dead && data && typeof data.probability === 'number') {
          setLatest({
            period: data.period || HCR_LATEST.period,
            probability: data.probability,
            regime: data.regime || (data.probability > 0.5 ? 'high' : 'low'),
          });
        }
      })
      .catch(() => {});
    return () => { dead = true; };
  }, []);

  return (
    <div className="hcr-page" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <style>{`
        @media (max-width: 980px) {
          .hcr-indicator-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <RegimePanel latest={latest}/>
      <CycleComponentChart/>
      <Card style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <Display size={22} weight={500}>Recent two years of regression indicators</Display>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid }}>
            Latest point glows red for uptrend, green for downtrend
          </span>
        </div>
        <div className="hcr-indicator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          {HCR_INDICATORS.map(ind => <IndicatorChart key={ind.key} ind={ind}/>)}
        </div>
      </Card>
    </div>
  );
};

Object.assign(window, { SentimentPage });
