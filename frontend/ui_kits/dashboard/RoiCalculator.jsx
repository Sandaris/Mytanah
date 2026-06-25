/* eslint-disable no-undef */
const { useState: roiUseState, useMemo: roiUseMemo, useEffect: roiUseEffect } = React;

const ROI_DEFAULT_SEED = {
  propertyPrice: 500000,
  locationLabel: 'Manual property estimate',
  propertyType: '',
  sourceModel: 'Manual input',
  rangeLow: null,
  rangeHigh: null,
};

const roiClamp = (value, min, max) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
};

const roiNum = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const roiFmt = (value) => formatRM(Math.round(roiNum(value, 0)));

const roiMonthsLabel = (months) => {
  const m = Math.max(0, Math.round(roiNum(months, 0)));
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (!y) return `${r} mo`;
  if (!r) return `${y} yr`;
  return `${y} yr ${r} mo`;
};

const roiMonthlyPayment = (principal, annualRate, years) => {
  const p = Math.max(0, roiNum(principal, 0));
  const months = Math.max(1, Math.round(roiNum(years, 1) * 12));
  const rate = Math.max(0, roiNum(annualRate, 0)) / 100 / 12;
  if (!p) return 0;
  if (!rate) return p / months;
  return p * rate / (1 - Math.pow(1 + rate, -months));
};

const roiBuildSchedule = ({ principal, annualRate, years, extraMonthly }) => {
  const start = Math.max(0, roiNum(principal, 0));
  const months = Math.max(1, Math.round(roiNum(years, 1) * 12));
  const rate = Math.max(0, roiNum(annualRate, 0)) / 100 / 12;
  const scheduled = roiMonthlyPayment(start, annualRate, years);
  const extra = Math.max(0, roiNum(extraMonthly, 0));
  let balance = start;
  let totalInterest = 0;
  const points = [{ month: 0, balance: start, interest: 0 }];
  let month = 0;
  const maxMonths = months + 1200;

  while (balance > 0.01 && month < maxMonths) {
    month += 1;
    const interest = balance * rate;
    totalInterest += interest;
    const due = Math.min(balance + interest, scheduled + extra);
    const principalPaid = Math.max(0, due - interest);
    balance = Math.max(0, balance - principalPaid);
    points.push({ month, balance, interest: totalInterest });
    if (!rate && scheduled + extra <= 0) break;
  }

  return {
    points,
    months: month,
    monthly: scheduled,
    totalInterest,
    totalPaid: start + totalInterest,
  };
};

const RoiInput = ({ label, value, onChange, suffix, min, max, step = 1 }) => (
  <label style={{ display: 'block' }}>
    <Eyebrow style={{ marginBottom: 7 }}>{label}</Eyebrow>
    <div style={{ position: 'relative' }}>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', background: C.cream, border: `1px solid ${C.earth}40`,
          color: C.deep, fontFamily: "'DM Sans',sans-serif", fontSize: 14,
          borderRadius: 8, padding: suffix ? '11px 44px 11px 12px' : '11px 12px',
          outline: 'none',
        }}/>
      {suffix && (
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted,
          pointerEvents: 'none',
        }}>{suffix}</span>
      )}
    </div>
  </label>
);

const RoiMetric = ({ label, value, sub, accent }) => (
  <Card style={{ padding: 16, minHeight: 94 }}>
    <Eyebrow style={{ fontSize: 10 }}>{label}</Eyebrow>
    <div style={{ marginTop: 8 }}>
      <Mono size={20} color={accent || C.deep}>{value}</Mono>
    </div>
    {sub && (
      <div style={{
        marginTop: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 11.5,
        color: C.mid, lineHeight: 1.35,
      }}>{sub}</div>
    )}
  </Card>
);

const RoiTimelineChart = ({ base, extra, principal }) => {
  const W = 920, H = 280, padL = 74, padR = 28, padTop = 24, padBot = 42;
  const maxMonth = Math.max(
    1,
    base.points[base.points.length - 1]?.month || 0,
    extra.points[extra.points.length - 1]?.month || 0,
  );
  const maxAmount = Math.max(1, principal);
  const x = (month) => padL + (month / maxMonth) * (W - padL - padR);
  const y = (amount) => padTop + (1 - amount / maxAmount) * (H - padTop - padBot);
  const path = (points) => points
    .map((p, i) => `${i ? 'L' : 'M'}${x(p.month).toFixed(1)} ${y(p.balance).toFixed(1)}`)
    .join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxMonth * t));
  const amountTicks = [1, 0.75, 0.5, 0.25, 0].map((t) => Math.round(maxAmount * t));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={padL} y={padTop} width={W - padL - padR} height={H - padTop - padBot}
        fill={C.cream} stroke={C.border} rx="8"/>
      {amountTicks.map((a) => (
        <g key={'a' + a}>
          <line x1={padL} x2={W - padR} y1={y(a)} y2={y(a)} stroke={C.border} strokeDasharray="4 6"/>
          <text x={padL - 10} y={y(a) + 4} textAnchor="end"
            fontFamily="'JetBrains Mono',monospace" fontSize="10" fill={C.muted}>{rmCompact(a)}</text>
        </g>
      ))}
      {ticks.map((m) => (
        <g key={'m' + m}>
          <line x1={x(m)} x2={x(m)} y1={padTop} y2={H - padBot} stroke={C.border} strokeOpacity="0.55"/>
          <text x={x(m)} y={H - 14} textAnchor="middle"
            fontFamily="'DM Sans',sans-serif" fontSize="11" fill={C.mid}>{Math.round(m / 12)} yr</text>
        </g>
      ))}
      <path d={path(base.points)} fill="none" stroke={C.light} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d={path(extra.points)} fill="none" stroke={C.earth} strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={x(base.months)} cy={y(0)} r="4" fill={C.light}/>
      <circle cx={x(extra.months)} cy={y(0)} r="4" fill={C.earth}/>
      <text x={padL} y={14} fontFamily="'DM Sans',sans-serif" fontSize="11" fill={C.mid}>
        Remaining principal over time
      </text>
      <g transform={`translate(${W - 248} 8)`}>
        <rect width="220" height="34" rx="17" fill={C.raised} stroke={C.border}/>
        <line x1="16" x2="40" y1="12" y2="12" stroke={C.light} strokeWidth="2.4"/>
        <text x="48" y="16" fontFamily="'DM Sans',sans-serif" fontSize="11" fill={C.mid}>normal schedule</text>
        <line x1="16" x2="40" y1="25" y2="25" stroke={C.earth} strokeWidth="2.8"/>
        <text x="48" y="29" fontFamily="'DM Sans',sans-serif" fontSize="11" fill={C.mid}>with extra payment</text>
      </g>
    </svg>
  );
};

const RoiCalculator = ({ seed }) => {
  const source = seed && Number(seed.propertyPrice) > 0 ? seed : ROI_DEFAULT_SEED;
  const [price, setPrice] = roiUseState(Math.round(source.propertyPrice));
  const [depositPct, setDepositPct] = roiUseState(10);
  const [loanPct, setLoanPct] = roiUseState(90);
  const [annualRate, setAnnualRate] = roiUseState(4.2);
  const [years, setYears] = roiUseState(30);
  const [extraMonthly, setExtraMonthly] = roiUseState(0);

  roiUseEffect(() => {
    if (seed && Number(seed.propertyPrice) > 0) setPrice(Math.round(seed.propertyPrice));
  }, [seed && seed.propertyPrice]);

  const safe = roiUseMemo(() => {
    const p = roiClamp(price, 1, 100000000);
    const dep = roiClamp(depositPct, 0, 100);
    const loan = roiClamp(loanPct, 0, 100);
    const rate = roiClamp(annualRate, 0, 30);
    const yrs = roiClamp(years, 1, 40);
    const extra = Math.max(0, roiNum(extraMonthly, 0));
    return { p, dep, loan, rate, yrs, extra };
  }, [price, depositPct, loanPct, annualRate, years, extraMonthly]);

  const deposit = safe.p * safe.dep / 100;
  const principal = safe.p * safe.loan / 100;
  const baseSchedule = roiUseMemo(() => (
    roiBuildSchedule({ principal, annualRate: safe.rate, years: safe.yrs, extraMonthly: 0 })
  ), [principal, safe.rate, safe.yrs]);
  const extraSchedule = roiUseMemo(() => (
    roiBuildSchedule({ principal, annualRate: safe.rate, years: safe.yrs, extraMonthly: safe.extra })
  ), [principal, safe.rate, safe.yrs, safe.extra]);
  const interestSaved = Math.max(0, baseSchedule.totalInterest - extraSchedule.totalInterest);
  const monthsSaved = Math.max(0, baseSchedule.months - extraSchedule.months);
  const location = source.locationLabel || ROI_DEFAULT_SEED.locationLabel;
  const rangeText = source.rangeLow && source.rangeHigh
    ? `${rmCompact(source.rangeLow)} - ${rmCompact(source.rangeHigh)}`
    : 'editable estimate';

  const onDepositChange = (value) => {
    const dep = roiClamp(value, 0, 100);
    setDepositPct(dep);
    setLoanPct(+(100 - dep).toFixed(2));
  };
  const onLoanChange = (value) => {
    const loan = roiClamp(value, 0, 100);
    setLoanPct(loan);
    setDepositPct(+(100 - loan).toFixed(2));
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
        <div>
          <Eyebrow>ROI Calculator</Eyebrow>
          <Display size={30} weight={500}>Reducing-balance loan planner</Display>
        </div>
        <div style={{
          padding: '9px 13px', borderRadius: 9999, background: C.deep, color: C.cream,
          fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
        }}>Malaysia loan model</div>
      </div>

      <div className="roi-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <Card style={{ padding: 18 }}>
            <Eyebrow>Exported valuation</Eyebrow>
            <div style={{ marginTop: 8 }}>
              <Display size={23} weight={500}>{location}</Display>
            </div>
            <div style={{ marginTop: 8, display: 'grid', gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.mid }}>
              <span>{source.propertyType || 'Property type not selected'}</span>
              <span>{source.sourceModel || 'Manual input'} - {rangeText}</span>
            </div>
          </Card>

          <Card style={{ padding: 18 }}>
            <div style={{ display: 'grid', gap: 14 }}>
              <RoiInput label="Property price" value={price} min={1} step={1000}
                onChange={(v) => setPrice(roiClamp(v, 1, 100000000))} suffix="RM"/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <RoiInput label="Deposit" value={depositPct} min={0} max={100} step={0.1}
                  onChange={onDepositChange} suffix="%"/>
                <RoiInput label="Loan" value={loanPct} min={0} max={100} step={0.1}
                  onChange={onLoanChange} suffix="%"/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <RoiInput label="Interest" value={annualRate} min={0} max={30} step={0.01}
                  onChange={(v) => setAnnualRate(roiClamp(v, 0, 30))} suffix="%"/>
                <RoiInput label="Years" value={years} min={1} max={40} step={1}
                  onChange={(v) => setYears(roiClamp(v, 1, 40))}/>
              </div>
              <RoiInput label="Extra monthly payment" value={extraMonthly} min={0} step={100}
                onChange={(v) => setExtraMonthly(Math.max(0, roiNum(v, 0)))} suffix="RM"/>
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div className="roi-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <RoiMetric label="Deposit amount" value={roiFmt(deposit)} sub={`${safe.dep.toFixed(1)}% upfront`}/>
            <RoiMetric label="Loan principal" value={roiFmt(principal)} sub={`${safe.loan.toFixed(1)}% financed`}/>
            <RoiMetric label="Monthly installment" value={roiFmt(baseSchedule.monthly)} sub="reducing balance"/>
            <RoiMetric label="Interest without extra" value={roiFmt(baseSchedule.totalInterest)}
              sub={roiMonthsLabel(baseSchedule.months)}/>
            <RoiMetric label="Interest with extra" value={roiFmt(extraSchedule.totalInterest)}
              sub={roiMonthsLabel(extraSchedule.months)} accent={safe.extra ? C.earth : C.deep}/>
            <RoiMetric label="Interest saved" value={roiFmt(interestSaved)}
              sub={`${roiMonthsLabel(monthsSaved)} faster payoff`} accent={interestSaved ? C.up : C.mid}/>
          </div>

          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <Display size={18} weight={500}>Loan timeline</Display>
                <div style={{ marginTop: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid }}>
                  Normal schedule compared with recurring extra monthly payment.
                </div>
              </div>
              <Mono size={13} color={interestSaved ? C.up : C.mid}>{roiFmt(interestSaved)} saved</Mono>
            </div>
            <div style={{ marginTop: 18 }}>
              <RoiTimelineChart base={baseSchedule} extra={extraSchedule} principal={principal}/>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .roi-grid { grid-template-columns: 1fr !important; }
          .roi-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .roi-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { RoiCalculator });
