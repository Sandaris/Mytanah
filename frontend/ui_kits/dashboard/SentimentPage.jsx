/* eslint-disable no-undef */

const HCR_FINDINGS = {
  sample: '2003 Q1 to 2025 Q3',
  observations: 91,
  positiveClass: '56 / 91 quarters',
  positiveShare: '61.5%',
  target: 'cycle_pos = 1',
  targetMeaning: 'Mean house price is above its HP-filter long-run trend, so the housing cycle is in an upward-pressure regime.',
  metrics: [
    {
      label: 'AUC',
      value: '0.9031',
      tone: C.up,
      note: 'Excellent discrimination',
      explain: 'AUC measures how well the logit model ranks above-trend quarters ahead of below-trend quarters. 0.9031 is excellent, so the model separates the two regimes well.',
    },
    {
      label: 'Accuracy',
      value: '84%',
      tone: C.up,
      note: 'Threshold = 0.5',
      explain: 'Accuracy is the share of quarters classified correctly when predicted probability >= 0.5 is treated as upward pressure. The model classified 84% of the 91 model-ready quarters correctly.',
    },
    {
      label: 'McFadden R^2',
      value: '0.3875',
      tone: C.up,
      note: 'Strong logit fit',
      explain: 'McFadden R^2 compares the fitted logit model against an intercept-only model. Values above 0.20 are usually acceptable for logit models; 0.3875 indicates strong explanatory fit.',
    },
    {
      label: 'Nagelkerke R^2',
      value: '0.5478',
      tone: C.up,
      note: 'Moderate-to-strong',
      explain: 'Nagelkerke R^2 rescales pseudo-R^2 toward a 0-1 range. 0.5478 means the six indicators explain a meaningful share of housing-cycle regime variation.',
    },
  ],
  drivers: [
    {
      name: 'Completed unsold stock',
      variable: 'unsold_co',
      coef: '-2.2431',
      or: '0.1061',
      p: '0.0001',
      direction: 'down',
      label: 'Downward pressure',
      meaning: 'A one-standard-deviation increase in completed unsold units is associated with much lower odds of an above-trend housing regime.',
    },
    {
      name: 'Under-construction unsold stock',
      variable: 'unsold_uc',
      coef: '1.8993',
      or: '6.6812',
      p: '0.0001',
      direction: 'up',
      label: 'Upward pressure',
      meaning: 'A one-standard-deviation increase in under-construction unsold units is associated with higher odds of an above-trend regime in this fitted model.',
    },
    {
      name: 'Credit-to-GDP growth',
      variable: 'credit_gdp_yoy',
      coef: '-0.9427',
      or: '0.3896',
      p: '0.0057',
      direction: 'down',
      label: 'Downward pressure',
      meaning: 'A one-standard-deviation increase in credit-to-GDP YoY growth is associated with lower odds of an above-trend housing regime in this specification.',
    },
  ],
  diagnostics: [
    { variable: 'sales_vol_yoy', label: 'Transaction volume YoY', coef: '-0.0117', or: '0.9884', p: '0.9699', sig: 'Not significant' },
    { variable: 'planned_supply_yoy', label: 'Planned supply YoY', coef: '0.4874', or: '1.6281', p: '0.1675', sig: 'Not significant' },
    { variable: 'impaired_ratio', label: 'Property loan impaired ratio', coef: '0.2542', or: '1.2894', p: '0.5627', sig: 'Not significant' },
  ],
  calibration: {
    value: '0.0000',
    explain: 'Hosmer-Lemeshow p-value tests calibration. p <= 0.05 suggests the predicted probabilities are not perfectly calibrated, so read the model as a strong directional signal rather than an exact probability engine.',
  },
};

const Tooltip = ({ children, align = 'left' }) => (
  <div className={`hcr-tooltip hcr-tooltip-${align}`} role="tooltip">{children}</div>
);

const InfoPill = ({ label = 'Hover for meaning' }) => (
  <span className="hcr-info-pill">{label}</span>
);

const Explainable = ({ children, explanation, style, align = 'left', className = '' }) => (
  <div
    className={`hcr-explainable ${className}`}
    tabIndex="0"
    style={{ position: 'relative', outline: 'none', ...style }}
  >
    {children}
    <Tooltip align={align}>{explanation}</Tooltip>
  </div>
);

const toneColor = (direction) => direction === 'up' ? C.up : C.down;

const MetricCard = ({ metric }) => (
  <Explainable
    explanation={metric.explain}
    align="right"
    style={{ minHeight: '100%' }}
  >
    <Card style={{ height: '100%', borderTop: `3px solid ${metric.tone}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <Eyebrow>{metric.label}</Eyebrow>
        <InfoPill/>
      </div>
      <div style={{ marginTop: 10 }}>
        <Mono size={28} color={metric.tone}>{metric.value}</Mono>
      </div>
      <div style={{ marginTop: 5, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.mid }}>
        {metric.note}
      </div>
    </Card>
  </Explainable>
);

const DriverCard = ({ driver }) => {
  const color = toneColor(driver.direction);
  return (
    <Explainable
      explanation={`${driver.meaning} Coefficient ${driver.coef} is the signed log-odds effect after standardisation. Odds ratio ${driver.or} converts that effect into odds terms. p=${driver.p} means the effect is statistically significant at 5%.`}
      align="right"
      style={{ minHeight: '100%' }}
    >
      <Card style={{ height: '100%', borderTop: `3px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <Eyebrow>{driver.variable}</Eyebrow>
            <Display size={22} weight={500} style={{ display: 'block', marginTop: 6 }}>
              {driver.name}
            </Display>
          </div>
          <span style={{
            flexShrink: 0, background: color + '1F', color,
            padding: '4px 9px', borderRadius: 9999,
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '.08em',
          }}>{driver.label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
          <div>
            <Eyebrow style={{ fontSize: 9 }}>Coef</Eyebrow>
            <Mono size={17}>{driver.coef}</Mono>
          </div>
          <div>
            <Eyebrow style={{ fontSize: 9 }}>Odds Ratio</Eyebrow>
            <Mono size={17}>{driver.or}</Mono>
          </div>
          <div>
            <Eyebrow style={{ fontSize: 9 }}>p-value</Eyebrow>
            <Mono size={17}>{driver.p}</Mono>
          </div>
        </div>
      </Card>
    </Explainable>
  );
};

const DiagnosticsRow = ({ row }) => (
  <Explainable
    explanation={`${row.label} was included in the model but is not statistically significant here. Coefficient ${row.coef} shows direction in log-odds, odds ratio ${row.or} translates it into odds, and p=${row.p} means there is not enough evidence to claim a reliable effect.`}
    align="right"
  >
    <div className="hcr-table-row" style={{
      display: 'grid', gridTemplateColumns: '1.5fr .75fr .75fr .75fr 1fr',
      gap: 12, alignItems: 'center', padding: '12px 0',
      borderTop: `1px solid ${C.border}`,
    }}>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.deep, fontWeight: 600 }}>
          {row.label}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, marginTop: 2 }}>
          {row.variable}
        </div>
      </div>
      <Mono size={13}>{row.coef}</Mono>
      <Mono size={13}>{row.or}</Mono>
      <Mono size={13}>{row.p}</Mono>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.mid }}>{row.sig}</span>
    </div>
  </Explainable>
);

const MiniBar = ({ label, value, max, color, explanation }) => {
  const width = Math.max(8, Math.min(100, (value / max) * 100));
  return (
    <Explainable explanation={explanation} align="right">
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 70px', gap: 12, alignItems: 'center' }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.mid }}>{label}</div>
        <div style={{ height: 8, background: C.cream, borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ width: `${width}%`, height: '100%', background: color }}/>
        </div>
        <Mono size={12}>{value}</Mono>
      </div>
    </Explainable>
  );
};

const SentimentPage = () => {
  const maxVif = 1.61;
  return (
    <div className="hcr-page" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        .hcr-page .hcr-explainable {
          border-radius: 12px;
          cursor: help;
        }
        .hcr-page .hcr-explainable:focus-visible {
          box-shadow: 0 0 0 3px ${C.earth}55;
        }
        .hcr-page .hcr-tooltip {
          position: absolute;
          z-index: 80;
          top: calc(100% + 8px);
          left: 0;
          width: min(340px, calc(100vw - 80px));
          background: ${C.deep};
          color: ${C.cream};
          border: 1px solid ${C.earth}80;
          border-radius: 8px;
          padding: 10px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          line-height: 1.45;
          box-shadow: 0 16px 40px rgba(20,28,22,.28);
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
          transition: opacity .16s, transform .16s;
        }
        .hcr-page .hcr-tooltip-right {
          left: auto;
          right: 0;
        }
        .hcr-page .hcr-explainable:hover > .hcr-tooltip,
        .hcr-page .hcr-explainable:focus > .hcr-tooltip,
        .hcr-page .hcr-explainable:focus-within > .hcr-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        .hcr-page .hcr-info-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          border: 1px solid ${C.earth}55;
          color: ${C.earth};
          border-radius: 9999px;
          padding: 3px 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .hcr-page .hcr-table-row:hover {
          background: ${C.earth}10;
        }
        @media (max-width: 960px) {
          .hcr-page .hcr-grid-4,
          .hcr-page .hcr-grid-3,
          .hcr-page .hcr-hero {
            grid-template-columns: 1fr !important;
          }
          .hcr-page .hcr-table-row {
            grid-template-columns: 1fr !important;
            gap: 6px !important;
          }
        }
      `}</style>

      <Explainable
        explanation={`This page uses the HCR_Logit_Regression notebook as the sentiment source. ${HCR_FINDINGS.target} means ${HCR_FINDINGS.targetMeaning}`}
      >
        <div className="hcr-hero" style={{
          display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 20,
          background: C.deep, color: C.cream, borderRadius: 14,
          padding: '28px 32px', borderBottom: `4px solid ${C.earth}`,
        }}>
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Eyebrow style={{ color: C.earthLight }}>Model-derived sentiment index</Eyebrow>
              <InfoPill label="Explain"/>
            </div>
            <Display size={44} color={C.cream} weight={400} style={{ display: 'block', marginTop: 8 }}>
              Housing Cycle Sentiment Signal
            </Display>
            <p style={{
              margin: '10px 0 0', maxWidth: 780,
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.55,
              color: C.earthLight,
            }}>
              The old page used dummy MHSI, news, NLP, and Google Trends values. This version reads sentiment
              as a housing-cycle signal: the logit model estimates whether Malaysia mean house price is above
              its HP-filter trend.
            </p>
          </div>
          <div style={{
            background: 'rgba(220,215,201,.08)', border: `1px solid ${C.earth}55`,
            borderRadius: 10, padding: 16,
          }}>
            <Eyebrow style={{ color: C.earthLight }}>Target Index</Eyebrow>
            <Mono size={23} color={C.cream}>{HCR_FINDINGS.target}</Mono>
            <div style={{ marginTop: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.earthLight, lineHeight: 1.45 }}>
              {HCR_FINDINGS.positiveClass} are upward-pressure quarters ({HCR_FINDINGS.positiveShare}) in the model-ready sample.
            </div>
          </div>
        </div>
      </Explainable>

      <div className="hcr-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {HCR_FINDINGS.metrics.map((metric) => <MetricCard key={metric.label} metric={metric}/>)}
      </div>

      <div className="hcr-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {HCR_FINDINGS.drivers.map((driver) => <DriverCard key={driver.variable} driver={driver}/>)}
      </div>

      <div className="hcr-grid-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr 1fr', gap: 20 }}>
        <Explainable
          explanation="This card explains model calibration. The HCR model ranks regimes well, but the Hosmer-Lemeshow result says the exact predicted probabilities should be treated carefully."
          style={{ minHeight: '100%' }}
        >
          <Card style={{ height: '100%', borderLeft: `4px solid ${C.stable}` }}>
            <Eyebrow>Calibration Caveat</Eyebrow>
            <div style={{ marginTop: 10 }}>
              <Mono size={26} color={C.stable}>H-L p = {HCR_FINDINGS.calibration.value}</Mono>
            </div>
            <p style={{ margin: '10px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.mid, lineHeight: 1.5 }}>
              {HCR_FINDINGS.calibration.explain}
            </p>
          </Card>
        </Explainable>

        <Explainable
          explanation={`The sample window is ${HCR_FINDINGS.sample}. N=${HCR_FINDINGS.observations} means the model was fitted on 91 quarters after merging all required predictors and removing missing rows.`}
          style={{ minHeight: '100%' }}
        >
          <Card style={{ height: '100%' }}>
            <Eyebrow>Model Window</Eyebrow>
            <Display size={24} weight={500} style={{ display: 'block', marginTop: 9 }}>
              {HCR_FINDINGS.sample}
            </Display>
            <div style={{ marginTop: 10 }}>
              <Mono size={22}>{HCR_FINDINGS.observations}</Mono>
              <span style={{ marginLeft: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.mid }}>model-ready quarters</span>
            </div>
          </Card>
        </Explainable>

        <Explainable
          explanation="VIF checks whether predictors duplicate each other too strongly. Every variable is below 5, so the notebook reports no multicollinearity flags."
          align="right"
          style={{ minHeight: '100%' }}
        >
          <Card style={{ height: '100%' }}>
            <Eyebrow>Multicollinearity</Eyebrow>
            <Display size={24} weight={500} style={{ display: 'block', marginTop: 9 }}>
              No VIF flags
            </Display>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <MiniBar label="unsold_uc" value={1.61} max={maxVif} color={C.up}
                explanation="VIF 1.61 is far below the moderate threshold of 5, so this predictor is not strongly duplicated by other inputs."/>
              <MiniBar label="unsold_co" value={1.59} max={maxVif} color={C.up}
                explanation="VIF 1.59 is far below the moderate threshold of 5, so this predictor is safe from severe multicollinearity."/>
              <MiniBar label="credit_gdp_yoy" value={1.13} max={maxVif} color={C.up}
                explanation="VIF 1.13 is very low, meaning this predictor carries mostly independent information relative to the others."/>
            </div>
          </Card>
        </Explainable>
      </div>

      <Card style={{ padding: 24 }}>
        <Explainable
          explanation="These predictors stayed in the HCR model but did not pass the p < 0.05 significance rule. They should not be described as reliable sentiment drivers based on this fitted model."
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <Display size={22} weight={500}>Other Model Inputs</Display>
              <div style={{ marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: C.mid }}>
                Hover each row to read coefficient, odds ratio, p-value, and meaning.
              </div>
            </div>
            <InfoPill/>
          </div>
        </Explainable>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr .75fr .75fr .75fr 1fr',
          gap: 12, padding: '18px 0 8px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 10.5,
          color: C.earth, textTransform: 'uppercase', letterSpacing: '.12em',
        }}>
          <div>Variable</div>
          <div>Coef</div>
          <div>OR</div>
          <div>p-value</div>
          <div>Evidence</div>
        </div>
        {HCR_FINDINGS.diagnostics.map((row) => <DiagnosticsRow key={row.variable} row={row}/>)}
      </Card>
    </div>
  );
};

Object.assign(window, { SentimentPage });
