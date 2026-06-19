/* @ds-bundle: {"format":3,"namespace":"MyPropertyIQDesignSystem_019e19","components":[],"sourceHashes":{"ui_kits/dashboard/Chrome.jsx":"80f3f31303e6","ui_kits/dashboard/Combobox.jsx":"8a89dbca4353","ui_kits/dashboard/CyclicalChart.jsx":"84b1b8a017ab","ui_kits/dashboard/CyclicalData.jsx":"4459512dd2bc","ui_kits/dashboard/Intro.jsx":"1fd28cdeef86","ui_kits/dashboard/LocationPanel.jsx":"1cf2d9adc2c2","ui_kits/dashboard/MalaysiaGeo.jsx":"5cad4286eeb1","ui_kits/dashboard/MalaysiaMap.jsx":"78a947a64435","ui_kits/dashboard/Primitives.jsx":"0c20b3708e48","ui_kits/dashboard/PropertyMapData.jsx":"33dd4cd4190b","ui_kits/dashboard/RiskPage.jsx":"b661a6568b73","ui_kits/dashboard/SentimentPage.jsx":"c26bad77964e","ui_kits/dashboard/TransactionMapPage.jsx":"8a63c7c564c3","ui_kits/dashboard/TxnFullPage.jsx":"b9a565a5e91c","ui_kits/dashboard/TxnTable.jsx":"33fd4c6b8af0","ui_kits/dashboard/ValuationDashboard.jsx":"ae58e7fad3d2","ui_kits/dashboard/ValuationPage.jsx":"83eb2629bc88"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MyPropertyIQDesignSystem_019e19 = window.MyPropertyIQDesignSystem_019e19 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/dashboard/Chrome.jsx
try { (() => {
/* eslint-disable no-undef */
const Icon = {
  Home: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12 L12 4 L21 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10 V20 H19 V10"
  })),
  Trend: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 17 9 11 13 15 21 7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 7 21 7 21 14"
  })),
  Alert: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3 L22 21 L2 21 Z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "10",
    x2: "12",
    y2: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "18",
    r: "0.7",
    fill: "currentColor"
  })),
  Map: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: p.size || 18,
    height: p.size || 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "3",
    x2: "9",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "6",
    x2: "15",
    y2: "21"
  })),
  HouseMark: () => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: C.earth,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 16 L16 4 L29 16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 14 L6 28 L26 28 L26 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 28 L13 19 L19 19 L19 28"
  }))
};
const NAV = [{
  id: 'valuation',
  label: 'Valuation',
  icon: Icon.Home
}, {
  id: 'sentiment',
  label: 'Sentiment Index',
  icon: Icon.Trend
}, {
  id: 'risk',
  label: 'Risk Factor',
  icon: Icon.Alert
}, {
  id: 'txnmap',
  label: 'Transaction Map',
  icon: Icon.Map
}];
const Sidebar = ({
  active,
  onNav
}) => /*#__PURE__*/React.createElement("aside", {
  style: {
    width: 220,
    height: '100%',
    flexShrink: 0,
    background: C.deep,
    color: C.cream,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 20px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  }
}, /*#__PURE__*/React.createElement(Icon.HouseMark, null), /*#__PURE__*/React.createElement(Display, {
  size: 20,
  color: C.cream,
  weight: 500
}, "MyPropertyIQ")), /*#__PURE__*/React.createElement("nav", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0',
    flex: 1
  }
}, NAV.map(n => {
  const isActive = active === n.id;
  const Ico = n.icon;
  return /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => onNav(n.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '12px 20px',
      background: isActive ? C.mid : 'transparent',
      borderLeft: `3px solid ${isActive ? C.earth : 'transparent'}`,
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      color: isActive ? C.cream : 'rgba(220,215,201,.6)',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      fontWeight: 400,
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all .15s'
    },
    onMouseEnter: e => {
      if (!isActive) e.currentTarget.style.color = C.cream;
    },
    onMouseLeave: e => {
      if (!isActive) e.currentTarget.style.color = 'rgba(220,215,201,.6)';
    }
  }, /*#__PURE__*/React.createElement(Ico, null), /*#__PURE__*/React.createElement("span", null, n.label));
})), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: '0 20px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    color: 'rgba(220,215,201,.4)',
    letterSpacing: '.04em'
  }
}, "Data: NAPIC 2021\u20132025"));
const Header = ({
  title
}) => /*#__PURE__*/React.createElement("header", {
  style: {
    height: 56,
    flexShrink: 0,
    background: C.cream,
    borderBottom: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px'
  }
}, /*#__PURE__*/React.createElement(Display, {
  size: 22,
  weight: 500
}, title), /*#__PURE__*/React.createElement("span", {
  style: {
    background: C.deep,
    color: C.cream,
    padding: '6px 14px',
    borderRadius: 9999,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 500
  }
}, "Q1 2025"));
Object.assign(window, {
  Icon,
  Sidebar,
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Combobox.jsx
try { (() => {
/* eslint-disable no-undef */
/* Combobox.jsx — a searchable single-select. Looks like the native styled
   <select> used elsewhere, but opening it reveals a search field that
   type-to-filters the options. The dropdown is rendered position:fixed
   (anchored to the trigger's rect) so it never gets clipped by the
   floating panel's / bottom sheet's overflow. */
const Combobox = ({
  value,
  placeholder,
  options,
  onChange,
  disabled,
  size = 'sm'
}) => {
  const {
    useState,
    useRef,
    useEffect,
    useLayoutEffect
  } = React;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [rect, setRect] = useState(null);
  const [hi, setHi] = useState(0);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const inputRef = useRef(null);
  const lg = size === 'lg';
  const filtered = options.filter(o => o.toLowerCase().includes(q.trim().toLowerCase()));
  const place = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
  };
  const openIt = () => {
    if (disabled) return;
    place();
    setQ('');
    setHi(0);
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return;
    const onDown = e => {
      if (btnRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', place, true);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', place, true);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);
  useLayoutEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  const pick = o => {
    onChange(o);
    setOpen(false);
  };
  const onKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[hi]) pick(filtered[hi]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    ref: btnRef,
    type: "button",
    onClick: () => open ? setOpen(false) : openIt(),
    disabled: disabled,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      background: disabled ? C.cream + '80' : C.cream,
      border: `1px solid ${disabled ? C.border : open ? C.earth : C.earth + '55'}`,
      color: disabled ? C.muted : value ? C.deep : C.muted,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: lg ? 15 : 14,
      borderRadius: lg ? 9 : 8,
      padding: lg ? '13px 15px' : '10px 12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.7 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, value || placeholder), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: C.deep,
    strokeWidth: "1.5",
    style: {
      flexShrink: 0,
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform .15s'
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "4 6 8 10 12 6"
  }))), open && rect && /*#__PURE__*/React.createElement("div", {
    ref: popRef,
    style: {
      position: 'fixed',
      zIndex: 9999,
      top: rect.bottom + 5,
      left: rect.left,
      width: Math.max(rect.width, 230),
      background: C.raised,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      boxShadow: '0 14px 40px rgba(44,57,48,.26)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 320,
      animation: 'tmapPop .14s ease-out'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 9,
      borderBottom: `1px solid ${C.border}`,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: C.muted,
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      position: 'absolute',
      left: 19,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setHi(0);
    },
    onKeyDown: onKey,
    placeholder: "Search\u2026",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '9px 11px 9px 32px',
      border: `1px solid ${C.earth}40`,
      borderRadius: 7,
      background: C.cream,
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14,
      color: C.deep,
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto'
    }
  }, filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 14px',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      color: C.muted,
      textAlign: 'center'
    }
  }, "No matches") : filtered.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o,
    onMouseEnter: () => setHi(i),
    onClick: () => pick(o),
    style: {
      padding: '10px 14px',
      cursor: 'pointer',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14,
      color: o === value ? C.cream : C.deep,
      background: o === value ? C.deep : i === hi ? C.cream : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, o), o === value && /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))));
};
Object.assign(window, {
  Combobox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Combobox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/CyclicalChart.jsx
try { (() => {
/* eslint-disable no-undef */
/* CyclicalChart.jsx — three stacked panels sharing one x-axis (1988–2025):
   Panel 1  Mean House Price vs HP Trend
   Panel 2  Cyclical Component (price − trend), green above / red below
   Panel 3  cycle_pos dependent variable (1 = above trend, 0 = below)
   Recoloured into the dashboard's warm palette. */

function _hex(c, a) {
  const r = parseInt(c.slice(1, 3), 16),
    g = parseInt(c.slice(3, 5), 16),
    b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* small boxed annotation label with an optional connector */
const Callout = ({
  x,
  y,
  text,
  color,
  anchor = 'middle',
  line
}) => {
  const lines = text.split('\n');
  const wBox = Math.max(...lines.map(l => l.length)) * 5.6 + 14;
  const hBox = lines.length * 12 + 8;
  const bx = anchor === 'middle' ? x - wBox / 2 : anchor === 'end' ? x - wBox : x;
  return /*#__PURE__*/React.createElement("g", null, line && /*#__PURE__*/React.createElement("line", {
    x1: line.x1,
    y1: line.y1,
    x2: line.x2,
    y2: line.y2,
    stroke: color,
    strokeWidth: "1.2",
    markerEnd: "",
    opacity: "0.8"
  }), line && /*#__PURE__*/React.createElement("circle", {
    cx: line.x2,
    cy: line.y2,
    r: "2.4",
    fill: color
  }), /*#__PURE__*/React.createElement("rect", {
    x: bx,
    y: y - hBox / 2,
    width: wBox,
    height: hBox,
    rx: "4",
    fill: C.raised,
    stroke: color,
    strokeWidth: "1.2"
  }), lines.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: bx + wBox / 2,
    y: y - hBox / 2 + 13 + i * 12,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "9.5",
    fontWeight: "600",
    fill: color
  }, l)));
};
const CyclicalChart = () => {
  const W = 1000,
    H = 730;
  const xL = 78,
    xR = W - 30;
  const yearMin = 1988,
    yearMax = 2026;
  const sx = yr => xL + (yr - yearMin) / (yearMax - yearMin) * (xR - xL);

  // panel vertical extents
  const P1 = {
      t: 50,
      b: 286
    },
    P2 = {
      t: 350,
      b: 580
    },
    P3 = {
      t: 626,
      b: 668
    };

  // panel 1 scale: price RM '000
  const pMin = 50,
    pMax = 515;
  const syP = v => P1.b - (v - pMin) / (pMax - pMin) * (P1.b - P1.t);
  // panel 2 scale: cyclical RM '000
  const cMin = -15,
    cMax = 17.5;
  const syC = v => P2.b - (v - cMin) / (cMax - cMin) * (P2.b - P2.t);
  const zeroC = syC(0);
  const priceLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syP(p.price).toFixed(1)}`).join(' ');
  const trendLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syP(p.trend).toFixed(1)}`).join(' ');
  const cycFill = `M${sx(DECOMP[0].year).toFixed(1)} ${zeroC.toFixed(1)} ` + DECOMP.map(p => `L${sx(p.year).toFixed(1)} ${syC(p.cyc).toFixed(1)}`).join(' ') + ` L${sx(DECOMP[DECOMP.length - 1].year).toFixed(1)} ${zeroC.toFixed(1)} Z`;
  const cycLine = DECOMP.map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)} ${syC(p.cyc).toFixed(1)}`).join(' ');
  const xTicks = [1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
  const qW = sx(DECOMP[1].year) - sx(DECOMP[0].year);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, EVENT_BANDS.map(b => {
    const bx = sx(b.from),
      bw = sx(b.to) - sx(b.from);
    return /*#__PURE__*/React.createElement("g", {
      key: b.label
    }, /*#__PURE__*/React.createElement("rect", {
      x: bx,
      y: P1.t,
      width: bw,
      height: P1.b - P1.t,
      fill: _hex(b.color, 0.11)
    }), /*#__PURE__*/React.createElement("rect", {
      x: bx,
      y: P2.t,
      width: bw,
      height: P2.b - P2.t,
      fill: _hex(b.color, 0.11)
    }));
  }), /*#__PURE__*/React.createElement("text", {
    x: xL,
    y: P1.t - 18,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "13",
    fontWeight: "700",
    fill: C.deep
  }, "Panel 1 \xB7 Mean House Price vs HP Trend"), [100, 200, 300, 400, 500].map(v => /*#__PURE__*/React.createElement("g", {
    key: 'p1g' + v
  }, /*#__PURE__*/React.createElement("line", {
    x1: xL,
    y1: syP(v),
    x2: xR,
    y2: syP(v),
    stroke: C.border,
    strokeWidth: "1",
    opacity: "0.5",
    strokeDasharray: "2 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: xL - 9,
    y: syP(v) + 3.5,
    textAnchor: "end",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "10",
    fill: C.mid
  }, "RM ", v, "K"))), /*#__PURE__*/React.createElement("path", {
    d: trendLine,
    fill: "none",
    stroke: C.earth,
    strokeWidth: "2.4",
    strokeDasharray: "7 4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: priceLine,
    fill: "none",
    stroke: C.deep,
    strokeWidth: "2.2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(1998.4),
    y: syP(150),
    text: 'Asian\nFinancial Crisis',
    color: "#C2912E"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2008.6),
    y: syP(168),
    text: 'GFC',
    color: "#8A6FA6"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2014.9),
    y: syP(360),
    text: 'Property\nCooling Measures',
    color: "#5E82A0"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2019.5),
    y: syP(430),
    text: 'Pre-COVID\nSlowdown',
    color: "#B0573E"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2020.6),
    y: syP(268),
    text: 'COVID-19',
    color: "#B0573E"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2024.1),
    y: syP(150),
    text: 'Post-COVID\nBoom',
    color: "#4E8A5E"
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${xL + 6}, ${P1.t + 8})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "24",
    y2: "0",
    stroke: C.deep,
    strokeWidth: "2.2"
  }), /*#__PURE__*/React.createElement("text", {
    x: "30",
    y: "3.5",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "10.5",
    fill: C.mid
  }, "Mean House Price"), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "16",
    x2: "24",
    y2: "16",
    stroke: C.earth,
    strokeWidth: "2.2",
    strokeDasharray: "6 3"
  }), /*#__PURE__*/React.createElement("text", {
    x: "30",
    y: "19.5",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "10.5",
    fill: C.mid
  }, "HP Trend (\u03BB = 1600)")), /*#__PURE__*/React.createElement("text", {
    x: xL,
    y: P2.t - 18,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "13",
    fontWeight: "700",
    fill: C.deep
  }, "Panel 2 \xB7 Cyclical Component (Mean Price \u2212 HP Trend)"), [-10, -5, 0, 5, 10, 15].map(v => /*#__PURE__*/React.createElement("g", {
    key: 'p2g' + v
  }, /*#__PURE__*/React.createElement("line", {
    x1: xL,
    y1: syC(v),
    x2: xR,
    y2: syC(v),
    stroke: C.border,
    strokeWidth: "1",
    opacity: v === 0 ? 0 : 0.5,
    strokeDasharray: "2 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: xL - 9,
    y: syC(v) + 3.5,
    textAnchor: "end",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "10",
    fill: C.mid
  }, v > 0 ? '+' : '', v, "K"))), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "cyc-above"
  }, /*#__PURE__*/React.createElement("rect", {
    x: xL,
    y: P2.t,
    width: xR - xL,
    height: zeroC - P2.t
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "cyc-below"
  }, /*#__PURE__*/React.createElement("rect", {
    x: xL,
    y: zeroC,
    width: xR - xL,
    height: P2.b - zeroC
  }))), /*#__PURE__*/React.createElement("path", {
    d: cycFill,
    fill: _hex(C.up, 0.30),
    clipPath: "url(#cyc-above)"
  }), /*#__PURE__*/React.createElement("path", {
    d: cycFill,
    fill: _hex(C.down, 0.28),
    clipPath: "url(#cyc-below)"
  }), /*#__PURE__*/React.createElement("line", {
    x1: xL,
    y1: zeroC,
    x2: xR,
    y2: zeroC,
    stroke: C.deep,
    strokeWidth: "1.25"
  }), /*#__PURE__*/React.createElement("path", {
    d: cycLine,
    fill: "none",
    stroke: C.mid,
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(1996.0),
    y: syC(14.5),
    text: 'Property boom\n1994–96',
    color: C.down,
    line: {
      x1: sx(1996.0),
      y1: syC(13),
      x2: sx(1997.0),
      y2: syC(15.5)
    }
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2001.3),
    y: syC(-11.5),
    text: 'Post-AFC\ntrough',
    color: "#8A6FA6",
    line: {
      x1: sx(2001.3),
      y1: syC(-10),
      x2: sx(1999.6),
      y2: syC(-9.6)
    }
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2011.8),
    y: syC(15),
    text: 'Post-GFC\nrebound 2013',
    color: C.down,
    line: {
      x1: sx(2012.6),
      y1: syC(13.5),
      x2: sx(2013.7),
      y2: syC(3.8)
    }
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2021.0),
    y: syC(-13.5),
    text: 'Pre-COVID /\nCOVID trough',
    color: C.down,
    line: {
      x1: sx(2021.0),
      y1: syC(-12),
      x2: sx(2021.7),
      y2: syC(-12)
    }
  }), /*#__PURE__*/React.createElement(Callout, {
    x: sx(2024.0),
    y: syC(13.5),
    text: 'Post-COVID\nrecovery',
    color: C.up,
    line: {
      x1: sx(2024.0),
      y1: syC(12),
      x2: sx(2024.5),
      y2: syC(7.8)
    }
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${xL + 6}, ${P2.t + 6})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "-4",
    width: "13",
    height: "9",
    rx: "2",
    fill: _hex(C.up, 0.4)
  }), /*#__PURE__*/React.createElement("text", {
    x: "18",
    y: "3.5",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "10",
    fill: C.mid
  }, "Above trend (cycle_pos = 1)"), /*#__PURE__*/React.createElement("rect", {
    x: "160",
    y: "-4",
    width: "13",
    height: "9",
    rx: "2",
    fill: _hex(C.down, 0.4)
  }), /*#__PURE__*/React.createElement("text", {
    x: "178",
    y: "3.5",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "10",
    fill: C.mid
  }, "Below trend (cycle_pos = 0)")), /*#__PURE__*/React.createElement("text", {
    x: xL,
    y: P3.t - 12,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "13",
    fontWeight: "700",
    fill: C.deep
  }, "Panel 3 \xB7 Dependent Variable \u2014 cycle_pos"), /*#__PURE__*/React.createElement("rect", {
    x: xL,
    y: P3.t,
    width: xR - xL,
    height: P3.b - P3.t,
    fill: C.cream
  }), DECOMP.map((p, i) => /*#__PURE__*/React.createElement("rect", {
    key: 'p3' + i,
    x: sx(p.year) - qW / 2,
    y: P3.t,
    width: qW + 0.6,
    height: P3.b - P3.t,
    fill: p.pos ? _hex(C.up, 0.55) : _hex(C.down, 0.5)
  })), /*#__PURE__*/React.createElement("rect", {
    x: xL,
    y: P3.t,
    width: xR - xL,
    height: P3.b - P3.t,
    fill: "none",
    stroke: C.border
  }), /*#__PURE__*/React.createElement("text", {
    x: xL - 9,
    y: P3.t + 9,
    textAnchor: "end",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "9.5",
    fill: C.mid
  }, "1 \u25B2"), /*#__PURE__*/React.createElement("text", {
    x: xL - 9,
    y: P3.b - 3,
    textAnchor: "end",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "9.5",
    fill: C.mid
  }, "0 \u25BC"), xTicks.map(yr => /*#__PURE__*/React.createElement("g", {
    key: yr
  }, /*#__PURE__*/React.createElement("line", {
    x1: sx(yr),
    y1: P3.b,
    x2: sx(yr),
    y2: P3.b + 5,
    stroke: C.mid,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: sx(yr),
    y: P3.b + 18,
    textAnchor: "middle",
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: "10",
    fill: C.mid
  }, yr))));
};
Object.assign(window, {
  CyclicalChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/CyclicalChart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/CyclicalData.jsx
try { (() => {
/* eslint-disable no-undef */
/* CyclicalData.jsx — Malaysia mean house price HP-filter decomposition.
   Produces a quarterly series 1988–2025 with: price level (RM '000),
   a smooth HP-style trend, the cyclical component (price − trend), and the
   binary housing-cycle dependent variable cycle_pos (1 = above trend).
   Built deterministically so it's stable across reloads. */

function _mulb(a) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function _lerp(an, year) {
  if (year <= an[0][0]) return an[0][1];
  const last = an[an.length - 1];
  if (year >= last[0]) return last[1];
  for (let i = 0; i < an.length - 1; i++) {
    const [x0, y0] = an[i],
      [x1, y1] = an[i + 1];
    if (year >= x0 && year <= x1) return y0 + (y1 - y0) * ((year - x0) / (x1 - x0));
  }
  return last[1];
}
function _gsmooth(arr, sigma) {
  const n = arr.length,
    out = new Array(n),
    R = Math.ceil(sigma * 3);
  for (let i = 0; i < n; i++) {
    let s = 0,
      w = 0;
    for (let j = -R; j <= R; j++) {
      const k = i + j;
      if (k < 0 || k >= n) continue;
      const g = Math.exp(-(j * j) / (2 * sigma * sigma));
      s += arr[k] * g;
      w += g;
    }
    out[i] = s / w;
  }
  return out;
}

// long-run trend level (RM '000)
const LEVEL = [[1988, 68], [1990, 80], [1992, 95], [1994, 112], [1996, 134], [1997.5, 150], [1999, 146], [2001, 150], [2003, 158], [2005, 168], [2007, 184], [2008.5, 198], [2010, 206], [2012, 236], [2013, 270], [2014, 320], [2015, 350], [2016, 366], [2017, 386], [2018, 406], [2019, 426], [2020, 433], [2021, 433], [2022, 446], [2023, 463], [2024, 479], [2025, 495], [2025.5, 500]];
// cyclical deviation (RM '000) — shapes the booms/troughs in the figure
const CYCLE = [[1988.0, 6.5], [1989.0, 7.0], [1990.5, -9.0], [1991.5, 3.5], [1993.0, -2.0], [1994.5, -10.5], [1995.5, -3.0], [1997.0, 16.0], [1998.3, -2.0], [1998.9, -10.5], [1999.6, -10.0], [2000.6, -3.0], [2002.0, -1.5], [2003.5, 4.5], [2004.5, 1.0], [2005.5, 4.5], [2006.5, 1.5], [2008.0, 4.7], [2009.3, 0.0], [2010.5, -6.0], [2011.5, -8.5], [2012.3, -9.0], [2013.0, -2.0], [2013.7, 4.0], [2014.5, 2.0], [2015.5, 5.0], [2016.5, 1.5], [2017.5, 9.0], [2018.3, 6.5], [2019.0, 2.5], [2019.7, -1.0], [2020.3, -3.0], [2021.0, -7.0], [2021.7, -12.5], [2022.3, -8.0], [2023.0, -1.0], [2023.7, 3.5], [2024.5, 7.5], [2025.2, 6.0], [2025.5, -9.5]];
function buildDecomp() {
  const rnd = _mulb(20250408);
  const pts = [];
  for (let q = 0; q <= 150; q++) {
    // 1988 Q1 .. 2025 Q3
    const year = 1988 + q / 4;
    const lvl = _lerp(LEVEL, year);
    const cyc = _lerp(CYCLE, year) + Math.sin(q * 1.6) * 0.5 + (rnd() - 0.5) * 0.9;
    const price = +(lvl + cyc).toFixed(2);
    pts.push({
      q,
      year,
      price,
      cyc: +cyc.toFixed(2)
    });
  }
  // HP-style smooth trend on the price level
  const trend = _gsmooth(pts.map(p => p.price), 7);
  pts.forEach((p, i) => {
    p.trend = +trend[i].toFixed(2);
    p.pos = p.cyc >= 0 ? 1 : 0;
  });
  return pts;
}
const DECOMP = buildDecomp();

// shared event bands (muted but distinguishable hues)
const EVENT_BANDS = [{
  from: 1997.4,
  to: 1999.4,
  label: 'Asian Financial Crisis',
  color: '#C2912E'
}, {
  from: 2008.0,
  to: 2009.3,
  label: 'GFC',
  color: '#8A6FA6'
}, {
  from: 2013.4,
  to: 2016.5,
  label: 'Property Cooling Measures',
  color: '#5E82A0'
}, {
  from: 2019.0,
  to: 2021.5,
  label: 'COVID-19',
  color: '#B0573E'
}, {
  from: 2023.0,
  to: 2025.3,
  label: 'Post-COVID Boom',
  color: '#4E8A5E'
}];
Object.assign(window, {
  DECOMP,
  EVENT_BANDS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/CyclicalData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Intro.jsx
try { (() => {
/* eslint-disable no-undef */
const {
  useEffect,
  useRef,
  useState
} = React;
const KL_LAT = 3.14;
const KL_LNG = 101.69;
const LANDMASSES = [{
  lat: 45,
  lng: -100,
  r: 22,
  n: 90
}, {
  lat: 30,
  lng: -95,
  r: 14,
  n: 50
}, {
  lat: 60,
  lng: -100,
  r: 18,
  n: 60
}, {
  lat: 25,
  lng: -80,
  r: 10,
  n: 30
}, {
  lat: -10,
  lng: -55,
  r: 18,
  n: 80
}, {
  lat: -30,
  lng: -65,
  r: 12,
  n: 45
}, {
  lat: 50,
  lng: 10,
  r: 12,
  n: 50
}, {
  lat: 55,
  lng: 30,
  r: 12,
  n: 50
}, {
  lat: 5,
  lng: 20,
  r: 18,
  n: 90
}, {
  lat: -15,
  lng: 25,
  r: 18,
  n: 80
}, {
  lat: 25,
  lng: 15,
  r: 14,
  n: 60
}, {
  lat: 35,
  lng: 90,
  r: 22,
  n: 120
}, {
  lat: 25,
  lng: 78,
  r: 14,
  n: 60
}, {
  lat: 55,
  lng: 90,
  r: 22,
  n: 110
}, {
  lat: 35,
  lng: 130,
  r: 8,
  n: 25
}, {
  lat: 3,
  lng: 110,
  r: 8,
  n: 40
}, {
  lat: -2,
  lng: 115,
  r: 8,
  n: 38
}, {
  lat: -25,
  lng: 135,
  r: 14,
  n: 60
}];
const Intro = ({
  onDone
}) => {
  const stageRef = useRef(null);
  const wipeRef = useRef(null);
  const heroRef = useRef(null);
  const introStartRef = useRef(null);
  const twinkleRef = useRef(null);
  const moonRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | zooming | wiping | reveal
  const phaseRef = useRef('idle');
  const setPhaseBoth = p => {
    phaseRef.current = p;
    setPhase(p);
  };
  const doneFiredRef = useRef(false);

  // Warm the Malaysia geo cache while the intro plays, so the peninsula map
  // is ready the instant the cream wipe hands off to the dashboard.
  useEffect(() => {
    if (window.loadMalaysiaGeo) window.loadMalaysiaGeo().catch(() => {});
  }, []);

  // auto-advance into the dashboard 3s after the reveal screen appears
  // (clicking anywhere / "Enter Dashboard" still enters immediately)
  useEffect(() => {
    if (phase !== 'reveal') return;
    const id = setTimeout(() => {
      onDone && onDone();
    }, 3000);
    return () => clearTimeout(id);
  }, [phase, onDone]);
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) {
      console.error('THREE missing');
      return;
    }
    const stage = stageRef.current;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0e0c, 1);
    stage.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
    camera.position.set(0, 0.5, 4.4);
    function resize() {
      const w = window.innerWidth,
        h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    /* stars — multiple layers for depth */
    {
      // far layer — many small dim stars
      const N1 = 2400,
        geom1 = new THREE.BufferGeometry();
      const pos1 = new Float32Array(N1 * 3);
      for (let i = 0; i < N1; i++) {
        const r = 60 + Math.random() * 40;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos1[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos1[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos1[i * 3 + 2] = r * Math.cos(ph);
      }
      geom1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
      scene.add(new THREE.Points(geom1, new THREE.PointsMaterial({
        color: 0xDCD7C9,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true
      })));

      // mid layer — brighter, fewer
      const N2 = 600,
        geom2 = new THREE.BufferGeometry();
      const pos2 = new Float32Array(N2 * 3);
      for (let i = 0; i < N2; i++) {
        const r = 30 + Math.random() * 30;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos2[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos2[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos2[i * 3 + 2] = r * Math.cos(ph);
      }
      geom2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
      const midStarsMat = new THREE.PointsMaterial({
        color: 0xEDE9E1,
        size: 0.16,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
      });
      const midStars = new THREE.Points(geom2, midStarsMat);
      scene.add(midStars);
      // twinkle hook
      twinkleRef.current = midStarsMat;

      // hero / cinematic stars — a few warm earth-tone glimmers near KL hemisphere
      const N3 = 60,
        geom3 = new THREE.BufferGeometry();
      const pos3 = new Float32Array(N3 * 3);
      for (let i = 0; i < N3; i++) {
        const r = 20 + Math.random() * 15;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos3[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos3[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos3[i * 3 + 2] = r * Math.cos(ph);
      }
      geom3.setAttribute('position', new THREE.BufferAttribute(pos3, 3));
      scene.add(new THREE.Points(geom3, new THREE.PointsMaterial({
        color: 0xC49A7A,
        size: 0.22,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      })));
    }
    const globe = new THREE.Group();
    scene.add(globe);

    /* forest sphere */
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({
      color: 0x2C3930
    })));

    /* graticule */
    {
      const mat = new THREE.LineBasicMaterial({
        color: 0xDCD7C9,
        transparent: true,
        opacity: 0.18
      });
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = (90 - lat) * Math.PI / 180;
        const rr = Math.sin(phi),
          y = Math.cos(phi);
        const pts = [];
        for (let i = 0; i <= 96; i++) {
          const t = i / 96 * Math.PI * 2;
          pts.push(new THREE.Vector3(rr * Math.cos(t) * 1.001, y * 1.001, rr * Math.sin(t) * 1.001));
        }
        globe.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
      }
      for (let lng = 0; lng < 360; lng += 15) {
        const t = lng * Math.PI / 180,
          pts = [];
        for (let i = 0; i <= 96; i++) {
          const phi = i / 96 * Math.PI;
          pts.push(new THREE.Vector3(Math.sin(phi) * Math.cos(t) * 1.001, Math.cos(phi) * 1.001, Math.sin(phi) * Math.sin(t) * 1.001));
        }
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
      }
    }
    const latLngToVec = (lat, lng, r = 1.008) => {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    };

    /* landmass dots — scattered glimmers within continents */
    {
      const positions = [];
      for (const m of LANDMASSES) {
        const n = Math.round(m.n * 0.55); // sparser now that we have outlines
        for (let i = 0; i < n; i++) {
          const dr = Math.sqrt(Math.random()) * m.r;
          const da = Math.random() * Math.PI * 2;
          const lat = m.lat + dr * Math.cos(da);
          const lng = m.lng + dr * Math.sin(da) / Math.cos(m.lat * Math.PI / 180);
          const v = latLngToVec(lat, lng, 1.008);
          positions.push(v.x, v.y, v.z);
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      globe.add(new THREE.Points(geom, new THREE.PointsMaterial({
        color: 0xDCD7C9,
        size: 0.018,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7
      })));
    }

    /* ===== Continent coastlines =====
       Loads a low-res world topology and traces every coastline ring
       onto the sphere in a warm earth tone — gives the globe its
       recognizable "Earth" silhouette without imposter SVG art. */
    {
      const coastGroup = new THREE.Group();
      globe.add(coastGroup);
      const url = 'https://unpkg.com/world-atlas@2/land-110m.json';
      fetch(url).then(r => r.json()).then(topo => {
        if (!window.topojson) return;
        const feat = window.topojson.feature(topo, topo.objects.land);
        const polys = feat.type === 'MultiPolygon' ? feat.coordinates : feat.type === 'Polygon' ? [feat.coordinates] : [];
        // Fallback if it's a FeatureCollection-ish
        const allPolys = polys.length ? polys : (feat.features || []).flatMap(f => f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : []);
        const mat = new THREE.LineBasicMaterial({
          color: 0xC49A7A,
          transparent: true,
          opacity: 0.55
        });
        for (const polygon of allPolys) {
          for (const ring of polygon) {
            // Densify long arcs so they hug the sphere instead of cutting through
            const dense = [];
            for (let i = 0; i < ring.length - 1; i++) {
              const [lng1, lat1] = ring[i];
              const [lng2, lat2] = ring[i + 1];
              const steps = 2; // 2 intermediate samples per segment is plenty at 110m
              for (let s = 0; s < steps; s++) {
                const t = s / steps;
                dense.push([lng1 + (lng2 - lng1) * t, lat1 + (lat2 - lat1) * t]);
              }
            }
            dense.push(ring[ring.length - 1]);
            const pts = dense.map(([lng, lat]) => latLngToVec(lat, lng, 1.006));
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            coastGroup.add(new THREE.LineLoop(geo, mat));
          }
        }
      }).catch(err => console.warn('coastlines failed to load', err));
    }

    /* halo */
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 64), new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        c: {
          value: new THREE.Color(0xDCD7C9)
        }
      },
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `varying vec3 vN; uniform vec3 c; void main(){ float a = pow(0.6 - dot(vN, vec3(0,0,1.)), 2.0); gl_FragColor = vec4(c, a * 0.35); }`
    })));

    /* marker */
    const markerGroup = new THREE.Group();
    const v = latLngToVec(KL_LAT, KL_LNG, 1.012);
    markerGroup.position.copy(v);
    markerGroup.lookAt(v.clone().multiplyScalar(2));
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.022, 32), new THREE.MeshBasicMaterial({
      color: 0xA27B5C,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }));
    markerGroup.add(ring);
    markerGroup.add(new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), new THREE.MeshBasicMaterial({
      color: 0xC49A7A
    })));
    markerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0.08)]), new THREE.LineBasicMaterial({
      color: 0xA27B5C
    })));
    globe.add(markerGroup);
    globe.rotation.y = -KL_LNG * Math.PI / 180 - Math.PI / 2 - 0.1;
    globe.rotation.x = 0.18;

    /* ===== Easter-egg moon =====
       Slowly drifts across the scene on a long arc. Visible for ~12s,
       then hidden for ~28s — repeats indefinitely while in idle phase. */
    {
      // lights only affect the moon (globe uses MeshBasicMaterial,
      // so adding lights here is invisible to it).
      const sun = new THREE.DirectionalLight(0xFFF6E6, 1.6);
      sun.position.set(-8, 6, 4);
      scene.add(sun);
      scene.add(new THREE.AmbientLight(0x2A2F2C, 0.6));
      const moonGroup = new THREE.Group();
      const moon = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), new THREE.MeshStandardMaterial({
        color: 0xE8E0D2,
        roughness: 0.95,
        metalness: 0,
        transparent: true,
        opacity: 1
      }));
      moonGroup.add(moon);

      // soft halo around the moon
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 32), new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          c: {
            value: new THREE.Color(0xE8E0D2)
          }
        },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `varying vec3 vN; uniform vec3 c; void main(){ float a = pow(0.5 - dot(vN, vec3(0,0,1.)), 2.0); gl_FragColor = vec4(c, a * 0.25); }`
      }));
      moonGroup.add(halo);
      moonGroup.visible = false;
      scene.add(moonGroup);
      moonRef.current = {
        group: moonGroup,
        body: moon,
        halo
      };
    }
    let last = performance.now();
    let zoomStart = 0,
      wipeStart = 0;
    const zoomDur = 3200,
      wipeDur = 900;
    let rafId;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const startZoom = () => {
      if (phaseRef.current !== 'idle') return;
      if (heroRef.current) heroRef.current.classList.add('fade-out');
      setPhaseBoth('zooming');
      zoomStart = performance.now();
    };
    introStartRef.current = startZoom;
    const tick = now => {
      const dt = (now - last) / 1000;
      last = now;
      if (phaseRef.current === 'idle') globe.rotation.y += dt * 0.04;

      // twinkle on the mid-layer stars
      if (twinkleRef.current) {
        twinkleRef.current.opacity = 0.7 + 0.25 * Math.sin(now / 700);
      }

      /* Moon easter egg — only orbits during idle phase.
         40-second cycle: 0–12s = traversing the scene, 12–40s = gone. */
      if (moonRef.current) {
        const m = moonRef.current;
        if (phaseRef.current !== 'idle') {
          m.group.visible = false;
        } else {
          const cycle = 40000; // ms per full cycle
          const showFor = 12000; // ms visible
          const phaseT = now % cycle;
          if (phaseT < showFor) {
            const u = phaseT / showFor; // 0..1 across the visible arc
            // path from upper-right far back, sweeping behind the globe to lower-left
            const startX = 4.6,
              endX = -4.6;
            const x = startX + (endX - startX) * u;
            const y = 1.4 - 1.2 * u;
            const z = -1.2 - 1.4 * Math.sin(u * Math.PI); // dips behind the globe
            m.group.position.set(x, y, z);
            // fade in/out at edges
            const fade = Math.min(1, u * 8) * Math.min(1, (1 - u) * 8);
            m.body.material.opacity = fade;
            m.halo.material.opacity = fade; // shader uses its own alpha, this is harmless
            m.group.visible = true;
          } else {
            m.group.visible = false;
          }
        }
      }
      const pulse = 1 + Math.sin(now / 380) * 0.25;
      ring.scale.set(pulse, pulse, pulse);
      ring.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(now / 380));
      if (phaseRef.current === 'zooming') {
        const t = Math.min(1, (now - zoomStart) / zoomDur);
        const e = ease(t);
        camera.position.set(0, 0.5 - 0.5 * e, 4.4 - 2.85 * e);
        camera.lookAt(0, 0.05 + 0.05 * e, 0);
        globe.rotation.y = THREE.MathUtils.lerp(globe.rotation.y, -KL_LNG * Math.PI / 180 - Math.PI / 2, 0.04);
        globe.rotation.x = THREE.MathUtils.lerp(globe.rotation.x, KL_LAT * Math.PI / 180, 0.04);
        if (t >= 1) {
          setPhaseBoth('wiping');
          wipeStart = performance.now();
          if (wipeRef.current) wipeRef.current.classList.add('on');
        }
      }
      if (phaseRef.current === 'wiping') {
        const t = Math.min(1, (now - wipeStart) / wipeDur);
        const r = (t * 120).toFixed(2) + '%';
        if (wipeRef.current) wipeRef.current.style.setProperty('--r', r);
        if (t >= 1 && !doneFiredRef.current) {
          // Cream wipe fully covers the screen — hand straight off to the
          // dashboard's full-page peninsula map (no loading screen).
          doneFiredRef.current = true;
          setPhaseBoth('done');
          onDone && onDone();
        }
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    /* drag spin */
    let drag = null;
    const dom = renderer.domElement;
    const onDown = e => {
      if (phaseRef.current === 'idle') drag = {
        x: e.clientX,
        y: e.clientY,
        ry: globe.rotation.y,
        rx: globe.rotation.x
      };
    };
    const onMove = e => {
      if (!drag) return;
      globe.rotation.y = drag.ry + (e.clientX - drag.x) * 0.005;
      globe.rotation.x = Math.max(-0.6, Math.min(0.6, drag.rx + (e.clientY - drag.y) * 0.004));
    };
    const onUp = () => drag = null;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    /* No auto-start — user clicks Begin to start the zoom. */

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, [onDone]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: '#0a0e0c',
      zIndex: 100,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: stageRef,
    style: {
      position: 'fixed',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "meteors",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "meteor m1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "meteor m2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "meteor m3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "meteor m4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "meteor m5"
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 102,
      background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(10,14,12,0.78) 0%, rgba(10,14,12,0.55) 35%, rgba(10,14,12,0.20) 65%, rgba(10,14,12,0) 90%),' + 'linear-gradient(180deg, rgba(10,14,12,0.55) 0%, rgba(10,14,12,0) 18%, rgba(10,14,12,0) 82%, rgba(10,14,12,0.65) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 28,
      left: 32,
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "#A27B5C",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 16 L16 4 L29 16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 14 L6 28 L26 28 L26 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 28 L13 19 L19 19 L19 28"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      color: C.cream,
      fontSize: 20,
      fontWeight: 500
    }
  }, "MyPropertyIQ")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDone && onDone(),
    style: {
      position: 'fixed',
      top: 28,
      right: 32,
      zIndex: 110,
      background: 'transparent',
      color: 'rgba(220,215,201,.55)',
      border: 0,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12,
      letterSpacing: '.04em',
      cursor: 'pointer',
      padding: '12px 14px',
      animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both'
    },
    onMouseEnter: e => e.currentTarget.style.color = C.cream,
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(220,215,201,.55)'
  }, "Skip intro \u2192"), /*#__PURE__*/React.createElement("div", {
    ref: heroRef,
    className: "intro-hero",
    style: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 105,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24,
      transition: 'opacity .8s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.earth,
      fontSize: 11,
      letterSpacing: '.22em',
      textTransform: 'uppercase',
      marginBottom: 28,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) .4s both'
    }
  }, "Malaysian residential property intelligence"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      color: C.cream,
      fontWeight: 300,
      fontSize: 'clamp(40px, 6vw, 76px)',
      lineHeight: 1.05,
      margin: '0 0 16px',
      letterSpacing: '-0.01em',
      animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) .7s both'
    }
  }, "Reading the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 400,
      color: C.earthLight
    }
  }, "property market"), ", quarter by quarter."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      color: 'rgba(220,215,201,.6)',
      margin: '0 0 56px',
      maxWidth: 460,
      lineHeight: 1.55,
      animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) 1.0s both'
    }
  }, "NAPIC transaction data, sentiment derived from news and search, six housing-cycle indicators \u2014 distilled into three numbers per quarter."), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      animation: 'introFadeUp 1.8s cubic-bezier(.16,1,.3,1) 1.4s both'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => introStartRef.current && introStartRef.current(),
    style: {
      background: C.cream,
      color: C.deep,
      border: 0,
      borderRadius: 9999,
      padding: '14px 28px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '.02em',
      cursor: 'pointer',
      transition: 'background .2s, transform .2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = C.earthLight;
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.cream;
      e.currentTarget.style.transform = 'none';
    }
  }, "Begin \u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDone && onDone(),
    style: {
      background: 'transparent',
      color: 'rgba(220,215,201,.55)',
      border: 0,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12,
      letterSpacing: '.04em',
      cursor: 'pointer',
      padding: '12px 14px'
    }
  }, "Skip intro"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 110,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: 'rgba(220,215,201,.4)',
      textAlign: 'right',
      lineHeight: 1.6,
      animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) 1.6s both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 9,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(220,215,201,.3)'
    }
  }, "Target"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.earth,
      fontWeight: 500
    }
  }, "4.21\xB0\xA0N"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.earth,
      fontWeight: 500
    }
  }, "101.97\xB0\xA0E"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 9,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(220,215,201,.3)',
      marginTop: 8
    }
  }, "Federation of Malaysia")), /*#__PURE__*/React.createElement("div", {
    ref: wipeRef,
    style: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 115,
      background: `radial-gradient(circle at 53% 58%, ${C.cream} 0%, ${C.cream} var(--r,0%), transparent calc(var(--r,0%) + 6%))`,
      opacity: 0,
      transition: 'opacity .2s'
    },
    className: "intro-wipe-target"
  }), phase === 'reveal' && /*#__PURE__*/React.createElement("div", {
    onClick: () => onDone && onDone(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 120,
      background: C.cream,
      color: C.deep,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24,
      cursor: 'pointer',
      animation: 'introFade .6s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.earth,
      fontSize: 11,
      letterSpacing: '.22em',
      textTransform: 'uppercase',
      marginBottom: 20,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500
    }
  }, "Connecting"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 'clamp(28px, 4vw, 44px)',
      color: C.deep,
      margin: '0 0 14px'
    }
  }, "Reading Malaysian property market\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      width: 240,
      height: 1,
      background: C.border,
      position: 'relative',
      overflow: 'hidden',
      margin: '28px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '40%',
      background: C.earth,
      animation: 'introLoad 1.6s cubic-bezier(.65,0,.35,1) infinite'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDone && onDone(),
    style: {
      background: C.deep,
      color: C.cream,
      border: 0,
      borderRadius: 8,
      padding: '14px 28px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      transition: 'background .2s, transform .2s',
      marginTop: 8
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = C.mid;
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.deep;
      e.currentTarget.style.transform = 'none';
    }
  }, "Enter Dashboard \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(44,57,48,.5)'
    }
  }, "entering automatically \u2014 or click anywhere")), /*#__PURE__*/React.createElement("style", null, `
        .intro-wipe-target.on { opacity: 1; }
        @keyframes introFade { from {opacity:0} to {opacity:1} }
        @keyframes introFadeUp { from {opacity:0; transform: translateY(12px)} to {opacity:1; transform:none} }
        @keyframes introLoad { 0%{left:-40%} 100%{left:100%} }
        .intro-hero.fade-out { opacity: 0; }

        /* ===== Meteor shower =====
           Direction: streaks fall from upper-right toward lower-left
           on a 45° diagonal. Bright head at the front (dot), trail
           fades out BEHIND it (back up-right). */
        .meteors { position: fixed; inset: 0; pointer-events: none; z-index: 101; overflow: hidden; }
        .meteor {
          position: absolute;
          width: 2px; height: 2px;
          background: #EDE9E1;
          border-radius: 9999px;
          box-shadow: 0 0 6px 1px #EDE9E1;
          opacity: 0;
        }
        /* Trail extends to the RIGHT of the dot in local space.
           After the parent's -45deg rotation, "right" maps to up-right,
           which is BEHIND the meteor as it moves down-left. */
        .meteor::before {
          content: '';
          position: absolute;
          top: 50%; left: 1px;
          transform: translateY(-50%);
          width: 140px; height: 1px;
          background: linear-gradient(90deg,
            #EDE9E1 0%,
            rgba(237,233,225,0.6) 30%,
            rgba(237,233,225,0) 100%);
        }
        @keyframes meteor {
          0%   { opacity: 0; transform: translate(0, 0) rotate(-45deg); }
          6%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-1400px, 1400px) rotate(-45deg); }
        }
        /* Stagger 5 streaks across the upper-right of the viewport */
        .meteor.m1 { top:  -20px; left: 70%; animation: meteor 4.2s linear  2.0s infinite; }
        .meteor.m2 { top:  -20px; left: 92%; animation: meteor 5.6s linear  6.5s infinite; }
        .meteor.m3 { top:  18%;   left: 99%; animation: meteor 3.8s linear 10.0s infinite; }
        .meteor.m4 { top:  -20px; left: 55%; animation: meteor 6.4s linear 14.0s infinite; }
        .meteor.m5 { top:  -20px; left: 82%; animation: meteor 4.6s linear 18.5s infinite; }

        /* warm-tinted variant */
        .meteor.m3 { background: #C49A7A; box-shadow: 0 0 6px 1px #C49A7A; }
        .meteor.m3::before {
          background: linear-gradient(90deg,
            #C49A7A 0%,
            rgba(196,154,122,0.6) 30%,
            rgba(196,154,122,0) 100%);
        }
      `));
};
Object.assign(window, {
  Intro
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Intro.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/LocationPanel.jsx
try { (() => {
/* eslint-disable no-undef */
const {
  useState
} = React;
const STATES = ['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah'];
const DISTRICTS = {
  Selangor: ['Petaling', 'Hulu Langat', 'Klang', 'Gombak', 'Sepang'],
  'Kuala Lumpur': ['Bukit Bintang', 'Cheras', 'Mont Kiara', 'Setapak'],
  Penang: ['Timur Laut', 'Barat Daya', 'Seberang Perai Tengah'],
  Johor: ['Johor Bahru', 'Iskandar Puteri', 'Kulai'],
  Perak: ['Kinta', 'Manjung', 'Larut Matang'],
  Sabah: ['Kota Kinabalu', 'Penampang', 'Sandakan']
};
const PROPERTY_TYPES = ['Terraced', 'Semi-D', 'Bungalow', 'Condominium', 'Apartment'];
const LocationPanel = ({
  onSubmit
}) => {
  const [state, setState] = useState('Selangor');
  const [district, setDistrict] = useState('Petaling');
  const [type, setType] = useState('Terraced');
  const [tenure, setTenure] = useState('Freehold');
  const [built, setBuilt] = useState('1,450');
  const [land, setLand] = useState('2,000');
  const [age, setAge] = useState(12);
  const [loading, setLoading] = useState(false);
  const submit = () => {
    setLoading(true);
    setTimeout(() => onSubmit({
      state,
      district,
      type,
      tenure,
      built,
      land,
      age
    }), 800);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: C.deep,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(640px, 100%)',
      background: C.raised,
      border: `1px solid ${C.earth}4D`,
      borderRadius: 16,
      padding: 36,
      boxShadow: '0 32px 80px rgba(44,57,48,0.18)',
      animation: 'panelIn .6s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 32,
    weight: 500,
    style: {
      display: 'block'
    }
  }, "Where is your property?"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: C.border,
      margin: '14px 0 24px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "State"
  }, /*#__PURE__*/React.createElement(Select, {
    value: state,
    onChange: v => {
      setState(v);
      setDistrict(DISTRICTS[v][0]);
    },
    options: STATES
  })), /*#__PURE__*/React.createElement(Field, {
    label: "District"
  }, /*#__PURE__*/React.createElement(Select, {
    value: district,
    onChange: setDistrict,
    options: DISTRICTS[state]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Property Type"
  }, /*#__PURE__*/React.createElement(Select, {
    value: type,
    onChange: setType,
    options: PROPERTY_TYPES
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Tenure"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    active: tenure === 'Freehold',
    onClick: () => setTenure('Freehold')
  }, "Freehold"), /*#__PURE__*/React.createElement(Pill, {
    active: tenure === 'Leasehold',
    onClick: () => setTenure('Leasehold')
  }, "Leasehold"))), /*#__PURE__*/React.createElement(Field, {
    label: "Built-Up Area (sq ft)"
  }, /*#__PURE__*/React.createElement("input", {
    value: built,
    onChange: e => setBuilt(e.target.value),
    style: inputStyle
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Land Area (sq ft)"
  }, /*#__PURE__*/React.createElement("input", {
    value: land,
    onChange: e => setLand(e.target.value),
    style: inputStyle
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 8,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Property Age"), /*#__PURE__*/React.createElement(Mono, {
    size: 12,
    color: C.deep
  }, age, " years")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "50",
    value: age,
    onChange: e => setAge(+e.target.value),
    style: {
      width: '100%',
      accentColor: C.earth,
      height: 4
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    disabled: loading,
    style: {
      width: '100%',
      marginTop: 26,
      background: C.deep,
      color: C.cream,
      border: 0,
      borderRadius: 8,
      padding: '14px 22px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer',
      transition: 'background .2s'
    },
    onMouseEnter: e => e.currentTarget.style.background = C.mid,
    onMouseLeave: e => e.currentTarget.style.background = C.deep
  }, loading ? 'Analysing…' : 'Analyse Property →')), /*#__PURE__*/React.createElement("style", null, `@keyframes panelIn { from {opacity:0;transform:translateY(40px)} to {opacity:1;transform:none} }`));
};
const inputStyle = {
  width: '100%',
  background: C.cream,
  border: `1px solid ${C.earth}40`,
  color: C.deep,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  borderRadius: 8,
  padding: '10px 12px',
  boxSizing: 'border-box',
  outline: 'none'
};
Object.assign(window, {
  LocationPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/LocationPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/MalaysiaGeo.jsx
try { (() => {
/* eslint-disable no-undef */
/* MalaysiaGeo.jsx — loads the district-level GeoJSON for all of Malaysia
   (West + East, incl. Sabah, Sarawak, Labuan), projects it to a flat SVG
   coordinate space, and groups districts under their parent state.
   One source drives both the state outlines AND the district boundaries. */

const GEO_URL = 'https://cdn.jsdelivr.net/gh/mptwaktusolat/jakim.geojson@master/malaysia.district.geojson';

// Official Malaysian state/territory codes → display names
const STATE_NAMES = {
  1: 'Johor',
  2: 'Kedah',
  3: 'Kelantan',
  4: 'Melaka',
  5: 'Negeri Sembilan',
  6: 'Pahang',
  7: 'Penang',
  8: 'Perak',
  9: 'Perlis',
  10: 'Selangor',
  11: 'Terengganu',
  12: 'Sabah',
  13: 'Sarawak',
  14: 'Kuala Lumpur',
  15: 'Labuan',
  16: 'Putrajaya'
};
let _cache = null;
let _promise = null;
function loadMalaysiaGeo() {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = fetch(GEO_URL).then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }).then(geo => {
    _cache = buildModel(geo.features);
    return _cache;
  });
  return _promise;
}
function buildModel(features) {
  // global bbox
  let lngMin = 999,
    lngMax = -999,
    latMin = 999,
    latMax = -999;
  const scanBox = c => {
    if (typeof c[0] === 'number') {
      if (c[0] < lngMin) lngMin = c[0];
      if (c[0] > lngMax) lngMax = c[0];
      if (c[1] < latMin) latMin = c[1];
      if (c[1] > latMax) latMax = c[1];
    } else c.forEach(scanBox);
  };
  features.forEach(f => scanBox(f.geometry.coordinates));
  const W = 1000;
  const k = W / (lngMax - lngMin);
  const H = (latMax - latMin) * k;
  const project = (lng, lat) => [+((lng - lngMin) * k).toFixed(1), +((latMax - lat) * k).toFixed(1)];
  const expand = (bbox, x, y) => {
    if (x < bbox[0]) bbox[0] = x;
    if (y < bbox[1]) bbox[1] = y;
    if (x > bbox[2]) bbox[2] = x;
    if (y > bbox[3]) bbox[3] = y;
  };
  const statesMap = {};
  for (const f of features) {
    const code = f.properties.code_state;
    const stateName = STATE_NAMES[code] || 'State ' + code;
    const districtName = f.properties.name;
    const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
    let d = '';
    const dBox = [1e9, 1e9, -1e9, -1e9];
    let cx = 0,
      cy = 0,
      cn = 0;
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = project(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x + ' ' + y;
          expand(dBox, x, y);
          cx += x;
          cy += y;
          cn++;
        }
        d += 'Z';
      }
    }
    const district = {
      name: districtName,
      d,
      bbox: dBox,
      centroid: [cx / cn, cy / cn]
    };
    if (!statesMap[stateName]) {
      statesMap[stateName] = {
        name: stateName,
        code,
        districts: [],
        bbox: [1e9, 1e9, -1e9, -1e9]
      };
    }
    const st = statesMap[stateName];
    st.districts.push(district);
    expand(st.bbox, dBox[0], dBox[1]);
    expand(st.bbox, dBox[2], dBox[3]);
  }
  const states = Object.values(statesMap).sort((a, b) => a.name.localeCompare(b.name));
  for (const st of states) {
    st.districts.sort((a, b) => a.name.localeCompare(b.name));
    st.centroid = [(st.bbox[0] + st.bbox[2]) / 2, (st.bbox[1] + st.bbox[3]) / 2];
  }

  // West (Peninsular) vs East (Borneo) Malaysia
  const WEST = new Set(['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya']);
  const regionOf = name => WEST.has(name) ? 'west' : 'east';
  const regions = {
    west: [1e9, 1e9, -1e9, -1e9],
    east: [1e9, 1e9, -1e9, -1e9]
  };
  for (const st of states) {
    const rb = regions[regionOf(st.name)];
    expand(rb, st.bbox[0], st.bbox[1]);
    expand(rb, st.bbox[2], st.bbox[3]);
  }
  return {
    states,
    byName: Object.fromEntries(states.map(s => [s.name, s])),
    stateNames: states.map(s => s.name),
    regions,
    regionOf,
    W,
    H,
    fullBox: [0, 0, W, H]
  };
}

// pad a [x,y,x2,y2] bbox by a ratio and return {x,y,w,h} for viewBox
function boxToView(bbox, padRatio = 0.16) {
  const w = bbox[2] - bbox[0];
  const h = bbox[3] - bbox[1];
  const px = w * padRatio,
    py = h * padRatio;
  return {
    x: bbox[0] - px,
    y: bbox[1] - py,
    w: w + px * 2,
    h: h + py * 2
  };
}
Object.assign(window, {
  loadMalaysiaGeo,
  boxToView,
  STATE_NAMES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/MalaysiaGeo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/MalaysiaMap.jsx
try { (() => {
/* eslint-disable no-undef */
/* MalaysiaMap.jsx — interactive SVG choropleth of Malaysia.
   Region/state selection animates the viewBox; the user can additionally
   scroll-wheel to zoom (anchored on the cursor) and drag to pan. */
const {
  useEffect,
  useRef,
  useState,
  useCallback
} = React;
const REGION_LABEL = {
  west: 'West Malaysia',
  east: 'East Malaysia'
};

// Federal-territory enclaves and their neighbours sit almost on top of each
// other in the Klang Valley, so their centroid labels collide. Nudge them
// apart (values in label em-units, scaled with the current zoom).
const LABEL_OFFSET = {
  'Selangor': {
    dx: -1.4,
    dy: -1.5
  },
  'Kuala Lumpur': {
    dx: 1.7,
    dy: -0.2
  },
  'Putrajaya': {
    dx: 2.1,
    dy: 1.1
  },
  'Negeri Sembilan': {
    dx: 0.9,
    dy: 2.2
  }
};

// ----- Monsoon wind streaks --------------------------------------------
// Light directional lines drifting across the sea to evoke Malaysia's
// seasonal monsoon: the whole field blows Northeast for 30s, then reverses
// to Southwest for the next 30s, and so on. At each switch the streaks
// collapse to a single dot, then re-grow flowing the opposite way (no
// U-turn). Drawn behind the land so they never cover the islands.
const WIND_PERIOD = 30000; // 30s per monsoon phase
const WIND_COLLAPSE = 1500; // ms each side of a switch for dot collapse
const NE_ANG = -Math.PI / 4; // blows toward upper-right (Northeast)
const SW_ANG = Math.PI * 3 / 4; // blows toward lower-left (Southwest)
const windSmooth = u => u * u * (3 - 2 * u);
// Discrete wind direction for the current 30s phase (flips instantly — the
// flip is hidden because the streaks are collapsed to dots at that instant).
function windAngle(t) {
  return Math.floor(t / WIND_PERIOD) % 2 === 0 ? NE_ANG : SW_ANG;
}
// Length factor 1 → 0 → 1 across each phase boundary: streaks shrink to a
// dot exactly at the switch, then expand again flowing the reverse way.
function windLenFactor(t) {
  const nearest = Math.round(t / WIND_PERIOD) * WIND_PERIOD;
  const d = Math.abs(t - nearest);
  return d >= WIND_COLLAPSE ? 1 : windSmooth(d / WIND_COLLAPSE);
}
// One faint wind streak with its own length, speed, wobble and opacity.
function makeStreak(W, H) {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    len: 30 + Math.random() * 64,
    speed: 16 + Math.random() * 30,
    // px / second
    w: 1.1 + Math.random() * 1.1,
    a: 0.16 + Math.random() * 0.20,
    // bolder, clearly visible
    phase: Math.random() * Math.PI * 2,
    amp: 1.5 + Math.random() * 5
  };
}
// Draws a streak as a gently waving, head-bright / tail-faded line.
// lenScale (0–1) shrinks the streak toward its head; at ~0 it renders as a
// single dot so the field can collapse before reversing direction.
function drawStreak(ctx, s, ang, t, lenScale = 1) {
  const dx = Math.cos(ang),
    dy = Math.sin(ang);
  const L = s.len * lenScale;
  // collapsed → draw a single dot at the head
  if (L < 1.6) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.max(s.w * 0.85, 1.1), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(94,62,38,${s.a})`;
    ctx.fill();
    return;
  }
  const px = -dy,
    py = dx; // perpendicular for the wobble
  const N = 6;
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const along = -L * u; // head (0) back to tail (-L)
    const wob = Math.sin(s.phase + u * 3 + t * 0.0016) * s.amp * u;
    const X = s.x + dx * along + px * wob;
    const Y = s.y + dy * along + py * wob;
    if (i === 0) ctx.moveTo(X, Y);else ctx.lineTo(X, Y);
  }
  const g = ctx.createLinearGradient(s.x, s.y, s.x + dx * -L, s.y + dy * -L);
  g.addColorStop(0, `rgba(94,62,38,${s.a})`); // head — deep earth
  g.addColorStop(1, 'rgba(94,62,38,0)'); // tail dissolves
  ctx.strokeStyle = g;
  ctx.lineWidth = s.w;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// ----- Aerial coastal ocean --------------------------------------------
// A calm, top-down aerial sea: a pale cyan-teal wash with clean off-white
// current lines parallel to the coast and organic foam patches that drift
// slowly and press toward the shore, fading into the parchment at the edges.
const OCEAN_WASH_TOP = 'rgba(150,184,178,0.44)';
const OCEAN_WASH_BOT = 'rgba(196,214,206,0.30)';
const FOAM_RGB = '244,241,230'; // warm off-white

function _oceanCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

// geo→device transform matching the SVG's viewBox + xMidYMid meet
function _landTransform(W, H, dpr, vb) {
  const scale = Math.min(W / vb.w, H / vb.h);
  return {
    a: dpr * scale,
    e: dpr * ((W - vb.w * scale) / 2 - vb.x * scale),
    f: dpr * ((H - vb.h * scale) / 2 - vb.y * scale),
    scale
  };
}
// cache one Path2D per district (keyed on the geo object)
function _landPaths(geo) {
  if (geo.__oceanPaths) return geo.__oceanPaths;
  const arr = [];
  for (const st of geo.states) for (const d of st.districts) arr.push(new Path2D(d.d));
  geo.__oceanPaths = arr;
  return arr;
}
// Render the land (fill or stroke) into an offscreen, then blur it → a soft
// white silhouette/ring used as an alpha mask for the water.
function _buildLandMask(W, H, dpr, vb, geo, blurCss, paint) {
  const pw = Math.max(1, Math.round(W * dpr)),
    ph = Math.max(1, Math.round(H * dpr));
  const tmp = _oceanCanvas(pw, ph),
    tx = tmp.getContext('2d');
  const T = _landTransform(W, H, dpr, vb);
  tx.setTransform(T.a, 0, 0, T.a, T.e, T.f);
  paint(tx, T, _landPaths(geo));
  const out = _oceanCanvas(pw, ph),
    ox = out.getContext('2d');
  ox.filter = `blur(${Math.max(0.01, blurCss * dpr)}px)`;
  ox.drawImage(tmp, 0, 0);
  return out;
}
function _smooth(e0, e1, x) {
  let t = (x - e0) / (e1 - e0);
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return t * t * (3 - 2 * t);
}
// compact value noise — used only to break contour lines into organic streaks
function _h2(x, y) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263;
  h = (h ^ h >> 13) * 1274126177;
  return ((h ^ h >> 16) >>> 0) / 4294967295;
}
function _vn(x, y) {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    xf = x - xi,
    yf = y - yi;
  const u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf);
  const a = _h2(xi, yi),
    b = _h2(xi + 1, yi),
    c = _h2(xi, yi + 1),
    d = _h2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
// Build the coastline distance field once, then extract:
//  • contour — concentric off-white current lines parallel to the coast,
//    brightest near the shore and fading outward (clean top-down linework)
//  • field  — a low-res sample (1 at the coast → 0 offshore) to bias/brighten
//    foam toward the shoreline
function buildContour(W, H, dpr, vb, geo) {
  const pw = Math.max(1, Math.round(W * dpr)),
    ph = Math.max(1, Math.round(H * dpr));
  const sil = _oceanCanvas(pw, ph),
    sx = sil.getContext('2d');
  const T = _landTransform(W, H, dpr, vb);
  sx.setTransform(T.a, 0, 0, T.a, T.e, T.f);
  sx.fillStyle = '#fff';
  for (const p of _landPaths(geo)) sx.fill(p);
  // blurred silhouette → smooth field that falls off around the coast
  const fld = _oceanCanvas(pw, ph),
    fx = fld.getContext('2d');
  fx.filter = `blur(${68 * dpr}px)`;
  fx.drawImage(sil, 0, 0);
  const fdata = fx.getImageData(0, 0, pw, ph).data;
  // contour lines from iso-levels of the field (lines parallel to the coast)
  const out = _oceanCanvas(pw, ph),
    ox = out.getContext('2d');
  const oimg = ox.createImageData(pw, ph),
    od = oimg.data;
  const levels = [0.78, 0.62, 0.48, 0.36, 0.26, 0.17, 0.10];
  const hw = 0.05;
  for (let i = 0; i < pw * ph; i++) {
    const a = fdata[i * 4 + 3] / 255;
    if (a >= 0.96 || a <= 0.015) continue; // inside land / far open sea
    let v = 0;
    for (let k = 0; k < levels.length; k++) {
      const d = Math.abs(a - levels[k]);
      if (d < hw) {
        const s = 1 - d / hw;
        if (s > v) v = s;
      }
    }
    if (v <= 0) continue;
    const inten = v * Math.min(1, a * 1.35); // brighter near shore
    const o = i * 4;
    od[o] = 240;
    od[o + 1] = 238;
    od[o + 2] = 226;
    od[o + 3] = Math.round(Math.min(1, inten) * 200);
  }
  ox.putImageData(oimg, 0, 0);
  // low-res field for foam biasing (CSS-px grid)
  const cell = 6;
  const lw = Math.max(1, Math.ceil(W / cell)),
    lh = Math.max(1, Math.ceil(H / cell));
  const field = new Float32Array(lw * lh);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const px = Math.min(pw - 1, Math.round((x * cell + cell / 2) * dpr));
      const py = Math.min(ph - 1, Math.round((y * cell + cell / 2) * dpr));
      field[y * lw + x] = fdata[(py * pw + px) * 4 + 3] / 255;
    }
  }
  return {
    contour: out,
    field,
    lw,
    lh,
    cell
  };
}
// One organic, stretched foam patch (wobbly — never a clean circle).
function makeBlob(W, H) {
  const N = 9,
    pts = [];
  for (let k = 0; k < N; k++) pts.push(0.5 + Math.random() * 0.7);
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: 11 + Math.random() * 30,
    elong: 1.3 + Math.random() * 1.8,
    rot: Math.random() * Math.PI,
    vx: (Math.random() - 0.5) * 5,
    vy: (Math.random() - 0.5) * 4,
    ph: Math.random() * Math.PI * 2,
    a: 0.20 + Math.random() * 0.22,
    pts
  };
}
function drawBlob(ctx, b, t, mult) {
  const a = b.a * mult * (0.6 + 0.4 * Math.sin(t * 0.0005 + b.ph));
  if (a <= 0.01) return;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);
  ctx.scale(b.elong, 1);
  const N = b.pts.length;
  ctx.beginPath();
  for (let k = 0; k <= N; k++) {
    const i = k % N,
      ang = i / N * Math.PI * 2,
      rr = b.r * b.pts[i];
    const x = Math.cos(ang) * rr,
      y = Math.sin(ang) * rr;
    k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r);
  g.addColorStop(0, `rgba(246,243,232,${a})`);
  g.addColorStop(0.6, `rgba(238,233,216,${a * 0.55})`);
  g.addColorStop(1, 'rgba(238,233,216,0)');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}
// Soft radial vignette (device res) → fades the whole sea at container edges.
function buildEdgeMask(W, H, dpr) {
  const c = _oceanCanvas(Math.max(1, Math.round(W * dpr)), Math.max(1, Math.round(H * dpr)));
  const x = c.getContext('2d');
  const cx = c.width / 2,
    cy = c.height / 2;
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(c.width, c.height) * 0.66);
  g.addColorStop(0, '#fff');
  g.addColorStop(0.58, '#fff');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}
const MalaysiaMap = ({
  geo,
  selectedState,
  selectedDistrict,
  region = 'west',
  onSelectState,
  onSelectDistrict,
  onRegionChange
}) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const windRef = useRef(null);
  const oceanRef = useRef(null);
  const [hoverState, setHoverState] = useState(null);
  const [hoverDistrict, setHoverDistrict] = useState(null);
  const [tip, setTip] = useState(null); // {x,y,label}

  const stateObj = selectedState ? geo.byName[selectedState] : null;
  const target = stateObj ? boxToView(stateObj.bbox, 0.24) : boxToView(geo.regions[region], 0.10);

  // ----- controllable viewBox (state + ref mirror so handlers read live value) -----
  const [vb, setVbState] = useState(target);
  const vbRef = useRef(vb);
  const rafRef = useRef(null);
  const setVb = useCallback(upd => {
    const next = typeof upd === 'function' ? upd(vbRef.current) : upd;
    vbRef.current = next;
    setVbState(next);
  }, []);
  const animateTo = useCallback(to => {
    cancelAnimationFrame(rafRef.current);
    const from = vbRef.current;
    const start = performance.now();
    const dur = 720;
    const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const tick = now => {
      const t = Math.min(1, (now - start) / dur);
      const e = ease(t);
      setVb({
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
        w: from.w + (to.w - from.w) * e,
        h: from.h + (to.h - from.h) * e
      });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [setVb]);

  // re-fit whenever the target (region / selected state) changes
  useEffect(() => {
    animateTo(target);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.w, target.h]);
  const strokeW = vb.w / geo.W; // keep strokes/labels visually scaled while zoomed

  // ----- monsoon wind streaks: removed (kept disabled for a clean ocean) -----
  useEffect(() => {
    const canvas = windRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return undefined;
  }, []);

  // ----- (legacy wind animation, no longer mounted) -----
  const _windDisabled = () => {
    const canvas = windRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf,
      running = true,
      W = 0,
      H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const M = 70; // wrap margin
    const streaks = [];
    const target = () => Math.round(W * H / 17000); // density scales with area
    const sync = () => {
      const n = Math.max(40, Math.min(150, target()));
      while (streaks.length < n) streaks.push(makeStreak(W, H));
      if (streaks.length > n) streaks.length = n;
    };
    // Paint one frame at angle for time t (no position advance).
    const paint = t => {
      const ang = reduce ? NE_ANG : windAngle(t);
      const lf = reduce ? 1 : windLenFactor(t);
      ctx.clearRect(0, 0, W, H);
      for (const s of streaks) drawStreak(ctx, s, ang, t, lf);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
      paint(performance.now()); // always leave a visible frame after layout
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) {
      return () => {
        running = false;
        ro.disconnect();
      };
    }
    let prev = performance.now();
    const tick = t => {
      if (!running) return;
      const dt = Math.min(0.05, (t - prev) / 1000);
      prev = t;
      const ang = windAngle(t);
      const lf = windLenFactor(t);
      const dx = Math.cos(ang),
        dy = Math.sin(ang);
      sync();
      ctx.clearRect(0, 0, W, H);
      // monsoon wind streaks
      for (const s of streaks) {
        s.x += dx * s.speed * dt;
        s.y += dy * s.speed * dt;
        if (s.x < -M) s.x = W + M;else if (s.x > W + M) s.x = -M;
        if (s.y < -M) s.y = H + M;else if (s.y > H + M) s.y = -M;
        drawStreak(ctx, s, ang, t, lf);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  };

  // ----- aerial ocean (current lines + drifting foam patches around the coast) -----
  useEffect(() => {
    const canvas = oceanRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let raf,
      running = true,
      W = 0,
      H = 0;
    const scratch = document.createElement('canvas'),
      sctx = scratch.getContext('2d');
    let contour = null,
      field = null,
      lw = 0,
      lh = 0,
      cell = 6,
      edgeMask = null;
    let bakedSig = '',
      pendingSig = '',
      pendingT = 0;
    let blobs = [];
    const sig = vb => `${W}x${H}|${vb.x.toFixed(1)},${vb.y.toFixed(1)},${vb.w.toFixed(1)},${vb.h.toFixed(1)}`;
    const bake = vb => {
      const r = buildContour(W, H, dpr, vb, geo);
      contour = r.contour;
      field = r.field;
      lw = r.lw;
      lh = r.lh;
      cell = r.cell;
      bakedSig = sig(vb);
    };
    const fieldAt = (x, y) => {
      if (!field) return 0;
      const ix = Math.max(0, Math.min(lw - 1, x / cell | 0));
      const iy = Math.max(0, Math.min(lh - 1, y / cell | 0));
      return field[iy * lw + ix];
    };
    const buildBlobs = () => {
      const n = Math.max(44, Math.min(120, Math.round(W * H / 9000)));
      blobs = [];
      let guard = 0;
      while (blobs.length < n && guard < n * 14) {
        guard++;
        const b = makeBlob(W, H);
        // bias toward the coast: keep with probability rising near shore
        if (Math.random() < 0.22 + 0.78 * fieldAt(b.x, b.y)) blobs.push(b);
      }
    };
    const render = t => {
      const vb = vbRef.current;
      // debounce the re-bake so zoom/pan stays smooth (rebake once settled)
      const cs = sig(vb);
      if (cs !== bakedSig) {
        if (cs !== pendingSig) {
          pendingSig = cs;
          pendingT = t;
        } else if (t - pendingT > 170) {
          bake(vb);
          buildBlobs();
        }
      }
      if (!contour || !edgeMask) return;
      const pw = canvas.width,
        ph = canvas.height;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      sctx.globalAlpha = 1;
      sctx.filter = 'none';
      sctx.clearRect(0, 0, W, H);

      // 1 — pale cyan water wash
      const g = sctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, OCEAN_WASH_TOP);
      g.addColorStop(1, OCEAN_WASH_BOT);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, W, H);

      // 2 — aerial current lines, breathing gently in/out around the island
      const s = 1 + 0.010 * Math.sin(t * 0.00016);
      const cx = W / 2,
        cy = H / 2;
      sctx.save();
      sctx.translate(cx, cy);
      sctx.scale(s, s);
      sctx.translate(-cx, -cy);
      sctx.globalAlpha = 0.80 + 0.16 * Math.sin(t * 0.00035);
      sctx.drawImage(contour, 0, 0, W, H);
      sctx.restore();
      sctx.globalAlpha = 1;

      // 3 — organic foam patches, brighter near the coast (light softening blur)
      sctx.filter = 'blur(0.7px)';
      for (const b of blobs) drawBlob(sctx, b, t, 0.5 + 1.2 * fieldAt(b.x, b.y));
      sctx.filter = 'none';

      // fade the whole sea softly toward the container edges
      sctx.globalCompositeOperation = 'destination-in';
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.drawImage(edgeMask, 0, 0);
      sctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      ctx.drawImage(scratch, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const pw = Math.max(1, Math.round(W * dpr)),
        ph = Math.max(1, Math.round(H * dpr));
      canvas.width = pw;
      canvas.height = ph;
      scratch.width = pw;
      scratch.height = ph;
      edgeMask = buildEdgeMask(W, H, dpr);
      bake(vbRef.current);
      buildBlobs();
      render(performance.now()); // leave a visible frame after layout
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) {
      render(performance.now());
      return () => {
        running = false;
        ro.disconnect();
      };
    }
    let prev = performance.now();
    const tick = t => {
      if (!running) return;
      const dt = Math.min(0.05, (t - prev) / 1000);
      prev = t;
      // drift foam slowly + a gentle shoreward push (up the field gradient)
      for (const b of blobs) {
        const gx = fieldAt(b.x + cell, b.y) - fieldAt(b.x - cell, b.y);
        const gy = fieldAt(b.x, b.y + cell) - fieldAt(b.x, b.y - cell);
        const gl = Math.hypot(gx, gy) || 1;
        b.x += (b.vx + 7 * gx / gl) * dt;
        b.y += (b.vy + 7 * gy / gl) * dt;
        if (b.x < -40) b.x = W + 40;else if (b.x > W + 40) b.x = -40;
        if (b.y < -40) b.y = H + 40;else if (b.y > H + 40) b.y = -40;
      }
      render(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  // ----- zoom (cursor-anchored, accounts for preserveAspectRatio="meet" letterboxing) -----
  const Z_MIN = geo.W * 0.035,
    Z_MAX = geo.W * 1.9;
  const fitScale = (rect, w, h) => Math.min(rect.width / w, rect.height / h);
  const zoomAt = useCallback((cx, cy, factor) => {
    cancelAnimationFrame(rafRef.current);
    const rect = svgRef.current.getBoundingClientRect();
    setVb(v => {
      let nw = Math.max(Z_MIN, Math.min(Z_MAX, v.w * factor));
      const nh = nw * (v.h / v.w);
      const s = fitScale(rect, v.w, v.h);
      const offX = (rect.width - v.w * s) / 2,
        offY = (rect.height - v.h * s) / 2;
      const wx = v.x + (cx - offX) / s,
        wy = v.y + (cy - offY) / s;
      const ns = fitScale(rect, nw, nh);
      const noffX = (rect.width - nw * ns) / 2,
        noffY = (rect.height - nh * ns) / 2;
      return {
        x: wx - (cx - noffX) / ns,
        y: wy - (cy - noffY) / ns,
        w: nw,
        h: nh
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVb]);
  const centerZoom = factor => {
    const rect = svgRef.current.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, factor);
  };

  // non-passive wheel listener so we can preventDefault the page scroll
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = e => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 1.12 : 1 / 1.12);
    };
    el.addEventListener('wheel', handler, {
      passive: false
    });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt]);

  // ----- drag to pan (with click suppression so a drag never mis-selects) -----
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const onPointerDown = e => {
    if (e.button !== 0) return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    movedRef.current = false;
  };
  const onPointerMove = e => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x,
      dy = e.clientY - dragRef.current.y;
    if (!movedRef.current && Math.hypot(dx, dy) < 4) return;
    movedRef.current = true;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    cancelAnimationFrame(rafRef.current);
    const rect = svgRef.current.getBoundingClientRect();
    setVb(v => {
      const s = fitScale(rect, v.w, v.h);
      return {
        ...v,
        x: v.x - dx / s,
        y: v.y - dy / s
      };
    });
  };
  const endDrag = () => {
    if (movedRef.current) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);
    }
    dragRef.current = null;
  };
  const move = useCallback((e, label) => {
    const rect = wrapRef.current.getBoundingClientRect();
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      cursor: dragRef.current ? 'grabbing' : 'grab',
      touchAction: 'none',
      backgroundColor: C.raised,
      backgroundImage: selectedState ? 'none' : 'url(./water-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: endDrag,
    onMouseLeave: () => {
      setHoverState(null);
      setHoverDistrict(null);
      setTip(null);
      endDrag();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`,
    width: "100%",
    height: "100%",
    style: {
      display: 'block',
      background: 'transparent',
      position: 'relative'
    },
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "landShadow",
    x: "-25%",
    y: "-25%",
    width: "150%",
    height: "150%"
  }, /*#__PURE__*/React.createElement("feDropShadow", {
    dx: "0",
    dy: "0",
    stdDeviation: 5 * strokeW,
    floodColor: "#FFFFFF",
    floodOpacity: "0.6"
  }), /*#__PURE__*/React.createElement("feDropShadow", {
    dx: "0",
    dy: 2.5 * strokeW,
    stdDeviation: 3.5 * strokeW,
    floodColor: "#2C3930",
    floodOpacity: "0.25"
  }))), /*#__PURE__*/React.createElement("g", {
    filter: selectedState ? undefined : 'url(#landShadow)'
  }, geo.states.map(st => {
    const isSel = st.name === selectedState;
    const isHov = st.name === hoverState;
    const dim = selectedState && !isSel;
    return /*#__PURE__*/React.createElement("g", {
      key: st.name
    }, st.districts.map(d => {
      const distSel = isSel && d.name === selectedDistrict;
      const distHov = isSel && d.name === hoverDistrict;
      let fill, stroke;
      if (isSel) {
        // state view — districts are the units
        fill = distSel ? C.deep : distHov ? C.earth : C.earthLight;
        stroke = C.cream;
      } else if (dim) {
        fill = C.muted;
        stroke = C.cream;
      } else {
        // country view — whole state reads as one shape
        fill = isHov ? C.earth : C.light;
        stroke = isHov ? C.earth : C.mid;
      }
      return /*#__PURE__*/React.createElement("path", {
        key: d.name,
        d: d.d,
        "data-state": st.name,
        "data-district": d.name,
        fill: fill,
        stroke: stroke,
        strokeWidth: (isSel ? 1.1 : 0.6) * strokeW,
        strokeLinejoin: "round",
        opacity: dim ? 0.45 : 1,
        style: {
          cursor: 'pointer',
          transition: 'fill .18s'
        },
        onMouseEnter: e => {
          if (isSel) {
            setHoverDistrict(d.name);
            move(e, d.name);
          } else {
            setHoverState(st.name);
            move(e, st.name);
          }
        },
        onMouseMove: e => move(e, isSel ? d.name : st.name),
        onMouseLeave: () => {
          setHoverDistrict(null);
          if (!isSel) setHoverState(null);
          setTip(null);
        },
        onClick: () => {
          if (suppressClickRef.current) return;
          if (isSel) onSelectDistrict(d.name);else onSelectState(st.name);
        }
      });
    }));
  })), !selectedState && geo.states.map(st => {
    const off = LABEL_OFFSET[st.name];
    const em = Math.max(7, 9 * strokeW); // label font size in view units
    const cx = st.centroid[0] + (off ? off.dx * em : 0);
    const cy = st.centroid[1] + (off ? off.dy * em : 0);
    return /*#__PURE__*/React.createElement("g", {
      key: 'lbl' + st.name,
      style: {
        pointerEvents: 'none'
      }
    }, off && /*#__PURE__*/React.createElement("line", {
      x1: st.centroid[0],
      y1: st.centroid[1],
      x2: cx,
      y2: cy,
      stroke: C.deep,
      strokeWidth: 0.5 * strokeW,
      opacity: 0.35
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy,
      textAnchor: "middle",
      dominantBaseline: "middle",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: em,
      fontWeight: "700",
      fill: hoverState === st.name ? C.cream : C.deep,
      opacity: 1
    }, st.name));
  })), tip && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: tip.x + 14,
      top: tip.y + 12,
      background: C.deep,
      color: C.cream,
      padding: '5px 10px',
      borderRadius: 6,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12,
      fontWeight: 500,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 14px rgba(44,57,48,.28)',
      zIndex: 5
    }
  }, tip.label), selectedState ? /*#__PURE__*/React.createElement("button", {
    onClick: () => onSelectState(null),
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: C.cream,
      border: `1px solid ${C.border}`,
      color: C.deep,
      borderRadius: 9999,
      padding: '9px 16px',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 3px 12px rgba(44,57,48,.16)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  })), "Back to ", REGION_LABEL[region]) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 4,
      background: C.cream,
      padding: 4,
      borderRadius: 9999,
      border: `1px solid ${C.border}`,
      boxShadow: '0 3px 12px rgba(44,57,48,.14)'
    }
  }, ['west', 'east'].map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => onRegionChange(r),
    style: {
      border: 0,
      borderRadius: 9999,
      padding: '7px 16px',
      background: region === r ? C.deep : 'transparent',
      color: region === r ? C.cream : C.mid,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all .2s',
      whiteSpace: 'nowrap'
    }
  }, REGION_LABEL[r]))), region === 'west' ? /*#__PURE__*/React.createElement(EdgeArrow, {
    side: "right",
    label: "East Malaysia",
    onClick: () => onRegionChange('east')
  }) : /*#__PURE__*/React.createElement(EdgeArrow, {
    side: "left",
    label: "West Malaysia",
    onClick: () => onRegionChange('west')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 16,
      bottom: 52,
      zIndex: 6,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(ZoomBtn, {
    label: "Zoom in",
    onClick: () => centerZoom(1 / 1.3)
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "6",
    x2: "12",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "12",
    x2: "18",
    y2: "12"
  })), /*#__PURE__*/React.createElement(ZoomBtn, {
    label: "Zoom out",
    onClick: () => centerZoom(1.3)
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "12",
    x2: "18",
    y2: "12"
  })), /*#__PURE__*/React.createElement(ZoomBtn, {
    label: "Reset view",
    onClick: () => animateTo(target)
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 1 0 3-6.7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "3 4 3 8 7 8"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      right: 16,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11,
      color: C.mid,
      background: 'rgba(237,233,225,.82)',
      padding: '5px 11px',
      borderRadius: 7,
      pointerEvents: 'none',
      border: `1px solid ${C.border}`
    }
  }, selectedState ? `${selectedState} — ${stateObj.districts.length} districts · scroll to zoom · drag to pan` : `${REGION_LABEL[region]} · click a state · scroll to zoom · drag to pan`));
};
const ZoomBtn = ({
  children,
  onClick,
  label
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  title: label,
  "aria-label": label,
  style: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: C.cream,
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(44,57,48,.14)',
    color: C.deep
  },
  onMouseEnter: e => e.currentTarget.style.background = C.raised,
  onMouseLeave: e => e.currentTarget.style.background = C.cream
}, /*#__PURE__*/React.createElement("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, children));
const EdgeArrow = ({
  side,
  label,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  title: `Go to ${label}`,
  style: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: 18,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 7,
    background: C.cream,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: '16px 12px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(44,57,48,.16)',
    transition: 'transform .18s, box-shadow .18s'
  },
  onMouseEnter: e => {
    e.currentTarget.style.transform = `translateY(-50%) translateX(${side === 'right' ? 4 : -4}px)`;
    e.currentTarget.style.boxShadow = '0 6px 22px rgba(44,57,48,.24)';
  },
  onMouseLeave: e => {
    e.currentTarget.style.transform = 'translateY(-50%)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,57,48,.16)';
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "22",
  height: "22",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: C.deep,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, side === 'right' ? /*#__PURE__*/React.createElement("polyline", {
  points: "9 6 15 12 9 18"
}) : /*#__PURE__*/React.createElement("polyline", {
  points: "15 6 9 12 15 18"
})), /*#__PURE__*/React.createElement("span", {
  style: {
    writingMode: 'vertical-rl',
    transform: side === 'left' ? 'rotate(180deg)' : 'none',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '.06em',
    color: C.deep,
    textTransform: 'uppercase'
  }
}, label));
Object.assign(window, {
  MalaysiaMap
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/MalaysiaMap.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Primitives.jsx
try { (() => {
/* eslint-disable no-undef */
const C = {
  cream: '#DCD7C9',
  raised: '#EDE9E1',
  border: '#C8C3B8',
  muted: '#B0AA9E',
  deep: '#2C3930',
  mid: '#3F4F44',
  light: '#5C7065',
  earth: '#A27B5C',
  earthLight: '#C49A7A',
  earthFaint: '#A27B5C20',
  up: '#2D7A4F',
  stable: '#8B6914',
  down: '#A63228'
};
const Eyebrow = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: C.earth,
    ...style
  }
}, children);
const Card = ({
  children,
  style,
  borderTop
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: C.raised,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 6px rgba(44,57,48,.08)',
    borderTop: borderTop ? `3px solid ${borderTop}` : undefined,
    transition: 'box-shadow .2s, transform .2s',
    ...style
  }
}, children);
const Button = ({
  children,
  onClick,
  variant = 'primary',
  style
}) => {
  const styles = {
    primary: {
      background: C.deep,
      color: C.cream
    },
    cta: {
      background: C.earth,
      color: C.cream
    },
    ghost: {
      background: 'transparent',
      color: C.deep,
      border: `1px solid ${C.border}`
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      border: 0,
      borderRadius: 8,
      padding: '12px 22px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      letterSpacing: '.01em',
      transition: 'background .2s',
      ...styles,
      ...style
    }
  }, children);
};
const Field = ({
  label,
  children
}) => /*#__PURE__*/React.createElement("label", {
  style: {
    display: 'block'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    marginBottom: 6
  }
}, label), children);
const Select = ({
  value,
  onChange,
  options
}) => /*#__PURE__*/React.createElement("select", {
  value: value,
  onChange: e => onChange(e.target.value),
  style: {
    width: '100%',
    background: C.cream,
    border: `1px solid ${C.earth}40`,
    color: C.deep,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    padding: '10px 12px',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23${C.deep.slice(1)}' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center'
  }
}, options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o,
  value: o
}, o)));
const Pill = ({
  active,
  onClick,
  children
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    border: `1px solid ${active ? C.deep : C.border}`,
    background: active ? C.deep : C.cream,
    color: active ? C.cream : C.deep,
    borderRadius: 9999,
    padding: '8px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .15s'
  }
}, children);
const Mono = ({
  children,
  size = 18,
  color = C.deep,
  weight = 500,
  style
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: size,
    color,
    fontWeight: weight,
    fontFeatureSettings: "'tnum'",
    ...style
  }
}, children);
const Display = ({
  children,
  size = 28,
  weight = 500,
  color = C.deep,
  style
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: size,
    fontWeight: weight,
    color,
    lineHeight: 1.05,
    letterSpacing: '-0.01em',
    ...style
  }
}, children);
Object.assign(window, {
  C,
  Eyebrow,
  Card,
  Button,
  Field,
  Select,
  Pill,
  Mono,
  Display
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/PropertyMapData.jsx
try { (() => {
/* eslint-disable no-undef */
/* PropertyMapData.jsx — the data layer for the transaction explorer.
   ───────────────────────────────────────────────────────────────────
   Districts come straight from the map's GeoJSON, so the dropdown and the
   map can never disagree. Everything below a district (Mukim → Scheme/Area
   → Road → Transactions) is produced by a DETERMINISTIC generator seeded
   by the full location path. That means:
     • the same path always returns the exact same records (never random),
     • a record's columns always echo the path that produced it
       (no fake, unrelated, or cross-location data),
     • changing any level changes the seed, so children are recomputed.
   This mirrors how the rest of this kit uses handcrafted mock data, but
   keeps the State→District→Mukim→Scheme→Road→Txn relationships strict. */

// ---- seeded RNG (FNV-1a hash + mulberry32) ----------------------------
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = seed => mulberry32(hashStr(seed));
const intIn = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
function sample(seed, arr, n) {
  const r = rng(seed);
  const pool = arr.slice();
  const out = [];
  n = Math.min(n, pool.length);
  for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return out;
}

// ---- curated real mukim names for well-known districts ----------------
const CURATED_MUKIM = {
  'Selangor>Petaling': ['Petaling', 'Sungai Buloh', 'Damansara', 'Bukit Raja', 'Sungai Buloh (Sg. Buloh)'],
  'Selangor>Klang': ['Klang', 'Kapar', 'Kapar (Meru)'],
  'Selangor>Hulu Langat': ['Kajang', 'Cheras', 'Hulu Langat', 'Semenyih', 'Beranang'],
  'Selangor>Gombak': ['Setapak', 'Batu', 'Rawang', 'Hulu Kelang'],
  'Johor>Johor Bahru': ['Plentong', 'Tebrau', 'Pulai', 'Tanjung Kupang', 'Sungai Tiram'],
  'Penang>Timur Laut': ['Bandar Georgetown', 'Mukim 13', 'Mukim 18', 'Tanjung Tokong'],
  'Penang>Seberang Perai Tengah': ['Mukim 1', 'Mukim 6', 'Mukim 11', 'Mukim 13'],
  'Kuala Lumpur>Kuala Lumpur': ['Bukit Bintang', 'Setapak', 'Kuala Lumpur (Bandar)', 'Batu', 'Petaling (KL)']
};
const AREA_POOL = ['Taman Sri Indah', 'Taman Desa Jaya', 'Bandar Baru Permai', 'Taman Mutiara', 'Taman Bukit Permai', 'Bandar Botanic', 'Taman Sentosa', 'Taman Melati', 'Taman Cahaya', 'Taman Harmoni', 'Taman Seri Mawar', 'Taman Damai', 'Bandar Utama Heights', 'Taman Anggerik', 'Taman Cempaka', 'Taman Kasturi', 'Taman Pelangi', 'Taman Sutera', 'Taman Nusa Indah', 'Taman Sri Gombak', 'Bandar Puteri', 'Taman Wawasan', 'Taman Impian Emas', 'Taman Permata', 'Taman Sri Muda', 'Taman Tropika', 'Taman Seroja', 'Taman Teratai', 'Taman Kenanga', 'Bandar Mahkota'];
const ROAD_WORDS = ['Mawar', 'Melur', 'Cempaka', 'Anggerik', 'Kenanga', 'Teratai', 'Seroja', 'Dahlia', 'Bakawali', 'Jasmin', 'Kemboja', 'Tanjung', 'Delima', 'Nilam', 'Zamrud', 'Permata', 'Bahagia', 'Harmoni', 'Damai', 'Setia', 'Suria', 'Bayu'];
const ROAD_TYPES = ['Jalan', 'Persiaran', 'Lorong', 'Lebuh'];

// ── Real NAPIC categories & calibration (2026 open transaction dataset) ──
const PROPERTY_TYPES = ['1 - 1 1/2 Storey Terraced', '2 - 2 1/2 Storey Terraced', 'Condominium/Apartment', '1 - 1 1/2 Storey Semi-Detached', 'Low-Cost House', 'Detached', '2 - 2 1/2 Storey Semi-Detached', 'Flat', 'Low-Cost Flat', 'Cluster House', 'Town House'];
const TENURES = ['Freehold', 'Leasehold'];
const LOT_TYPES = ['Intermediate', 'Corner', 'End Lot'];

// National median across all types (RM) — converts a district's overall
// median into a per-type estimate.
const OVERALL_MED = 380000;

// Per-type calibration from the real data:
//   factor = (type median price ÷ OVERALL_MED), median main-floor & land area
//   in sq.m, freehold share %, and relative transaction frequency (weight).
const TYPE_META = {
  '1 - 1 1/2 Storey Terraced': {
    factor: 0.80,
    floor: 81,
    land: 143,
    fh: 71,
    w: 1460
  },
  '2 - 2 1/2 Storey Terraced': {
    factor: 1.47,
    floor: 145,
    land: 143,
    fh: 74,
    w: 1319
  },
  'Condominium/Apartment': {
    factor: 1.05,
    floor: 95,
    land: null,
    fh: 72,
    w: 776,
    highRise: true
  },
  '1 - 1 1/2 Storey Semi-Detached': {
    factor: 1.05,
    floor: 104,
    land: 297,
    fh: 84,
    w: 443
  },
  'Low-Cost House': {
    factor: 0.57,
    floor: 60,
    land: 104,
    fh: 68,
    w: 439
  },
  'Detached': {
    factor: 1.21,
    floor: 132,
    land: 519,
    fh: 70,
    w: 390
  },
  '2 - 2 1/2 Storey Semi-Detached': {
    factor: 2.18,
    floor: 204,
    land: 316,
    fh: 76,
    w: 270
  },
  'Flat': {
    factor: 0.66,
    floor: 75,
    land: null,
    fh: 71,
    w: 226,
    highRise: true
  },
  'Low-Cost Flat': {
    factor: 0.42,
    floor: 55,
    land: null,
    fh: 66,
    w: 223,
    highRise: true
  },
  'Cluster House': {
    factor: 1.39,
    floor: 130,
    land: 208,
    fh: 65,
    w: 75
  },
  'Town House': {
    factor: 0.98,
    floor: 110,
    land: null,
    fh: 74,
    w: 42,
    highRise: true
  }
};
const HIGH_RISE = new Set(Object.keys(TYPE_META).filter(t => TYPE_META[t].highRise));

// state median baseline (RM '000) — fallback when a district has no real figure
const STATE_BASE = {
  'Kuala Lumpur': 640,
  'Putrajaya': 600,
  'Selangor': 500,
  'Sabah': 470,
  'Penang': 380,
  'Sarawak': 410,
  'Johor': 400,
  'Melaka': 308,
  'Negeri Sembilan': 300,
  'Labuan': 350,
  'Perak': 300,
  'Pahang': 300,
  'Kedah': 300,
  'Terengganu': 350,
  'Kelantan': 330,
  'Perlis': 260
};

// Real district median transaction price (RM), 2026 dataset. District names
// match the map's GeoJSON, so the dashboard agrees with the map selection.
const DISTRICT_MED = {
  'Kota Kinabalu': 740000,
  'Kuala Lumpur': 640000,
  'Petaling': 628000,
  'Johor Bahru': 550000,
  'Sepang': 540000,
  'Muar': 500000,
  'Gombak': 500000,
  'Hulu Langat': 500000,
  'Klang': 498000,
  'Bahagian Samarahan': 460000,
  'Kulai': 460000,
  'Langkawi': 458000,
  'Pontian': 454500,
  'Sandakan': 452500,
  'Kuala Langat': 450000,
  'Bahagian Sibu': 450000,
  'Tawau': 450000,
  'Kuala Selangor': 445000,
  'Bahagian Miri': 420000,
  'Bahagian Kuching': 410000,
  'Tangkak': 401500,
  'Seberang Perai Tengah': 400000,
  'Pasir Mas': 395000,
  'Batu Pahat': 380000,
  'Marang': 371000,
  'Kota Tinggi': 370000,
  'Seberang Perai Selatan': 368000,
  'Seberang Perai Utara': 365000,
  'Barat Daya': 362500,
  'Bachok': 360000,
  'Dungun': 360000,
  'Kuala Nerus': 360000,
  'Muallim': 360000,
  'Besut': 350000,
  'Kota Bahru': 345000,
  'Kuantan': 345000,
  'Tanah Merah': 342000,
  'Hulu Terengganu': 340000,
  'Kota Setar': 340000,
  'Kuala Terengganu': 340000,
  'Kulim': 340000,
  'Timur Laut': 340000,
  'Seremban': 338000,
  'Kinta': 320000,
  'Segamat': 315000,
  'Jasin': 314500,
  'Hulu Selangor': 312500,
  'Melaka Tengah': 308000,
  'Manjung': 302000,
  'Alor Gajah': 300000,
  'Machang': 300000,
  'Pasir Puteh': 300000,
  'Pekan': 300000,
  'Kubang Pasu': 297500,
  'Temerloh': 282500,
  'Larut Matang': 280000,
  'Hilir Perak': 270000,
  'Kampar': 265000,
  'Kuala Muda': 264000,
  'Kluang': 263000,
  'Perlis': 260000,
  'Kemaman': 250000,
  'Port Dickson': 250000,
  'Rembau': 250000,
  'Kuala Kangsar': 247500,
  'Perak Tengah': 242500,
  'Batang Padang': 236000,
  'Tampin': 200000,
  'Rompin': 90000
};

// weighted property-type picker (mirrors real transaction frequency)
const TYPE_W = PROPERTY_TYPES.map(t => ({
  t,
  w: TYPE_META[t].w
}));
const TOTAL_W = TYPE_W.reduce((s, x) => s + x.w, 0);
function pickType(r) {
  let x = r() * TOTAL_W;
  for (const o of TYPE_W) {
    if ((x -= o.w) <= 0) return o.t;
  }
  return TYPE_W[0].t;
}

// ---- hierarchy queries -------------------------------------------------
function getMukims(state, district) {
  const curated = CURATED_MUKIM[`${state}>${district}`];
  if (curated) return curated.slice();
  const r = rng(`mukim|${state}|${district}`);
  const n = intIn(r, 4, 7);
  const out = [];
  for (let i = 1; i <= n; i++) out.push('Mukim ' + String(i).padStart(2, '0'));
  return out;
}
function getAreas(state, district, mukim) {
  return sample(`area|${state}|${district}|${mukim}`, AREA_POOL, intIn(rng(`an|${mukim}|${district}`), 4, 7));
}

/* District-level scheme/area index — lets the user skip Mukim and pick a
   Scheme / Area directly under a District. Aggregates every mukim's areas,
   deduping each area to the FIRST mukim that owns it, so an area always maps
   back to exactly one mukim (keeping the hierarchy consistent for the table). */
function districtAreaIndex(state, district) {
  const mukims = getMukims(state, district);
  const areaToMukim = {};
  for (const m of mukims) {
    for (const a of getAreas(state, district, m)) {
      if (!(a in areaToMukim)) areaToMukim[a] = m;
    }
  }
  const areas = Object.keys(areaToMukim).sort();
  return {
    areas,
    areaToMukim
  };
}
function getDistrictAreas(state, district) {
  return districtAreaIndex(state, district).areas;
}
function getAreaMukim(state, district, area) {
  return districtAreaIndex(state, district).areaToMukim[area] || null;
}
function getRoads(state, district, mukim, area) {
  const seed = `road|${state}|${district}|${mukim}|${area}`;
  const r = rng(seed);
  const n = intIn(r, 3, 6);
  const out = new Set();
  let guard = 0;
  while (out.size < n && guard++ < 40) {
    const type = ROAD_TYPES[Math.floor(r() * ROAD_TYPES.length)];
    const word = ROAD_WORDS[Math.floor(r() * ROAD_WORDS.length)];
    const num = intIn(r, 1, 14);
    const useSlash = r() < 0.4;
    out.add(`${type} ${word} ${num}${useSlash ? '/' + intIn(r, 1, 9) : ''}`);
  }
  return [...out];
}
function formatRM(n) {
  return 'RM ' + Math.round(n).toLocaleString('en-MY');
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getTransactions(path) {
  const {
    state,
    district,
    mukim,
    area,
    road
  } = path;
  const seed = `txn|${state}|${district}|${mukim}|${area}|${road}`;
  const r = rng(seed);
  const n = intIn(r, 5, 13);
  // real district median (RM) anchors the area; fall back to the state baseline
  const base = DISTRICT_MED[district] || (STATE_BASE[state] || 320) * 1000;
  // each road skews toward a dominant property type for realism
  const dominant = pickType(rng(seed + '|dom'));
  const rows = [];
  for (let i = 0; i < n; i++) {
    const type = r() < 0.5 ? dominant : pickType(r);
    const meta = TYPE_META[type];
    const highRise = !!meta.highRise;
    const year = intIn(r, 2021, 2026);
    // 2026 is the dataset's anchor year; older years discount ~3%/yr
    const yearFactor = 1 + (year - 2026) * 0.030;
    const noise = 0.82 + r() * 0.42;
    const price = Math.round(base * meta.factor * yearFactor * noise / 1000) * 1000;
    const built = Math.max(33, Math.round(meta.floor * (0.78 + r() * 0.5))); // main floor area, sq.m
    const land = meta.land ? Math.round(meta.land * (0.80 + r() * 0.55)) : null; // parcel area, sq.m
    const tenure = r() * 100 < meta.fh ? 'Freehold' : 'Leasehold';
    const ppsm = built ? Math.round(price / built) : null;
    const month = intIn(r, 0, 11);
    rows.push({
      state,
      district,
      mukim,
      area,
      road,
      type,
      year,
      monthYear: `${MONTHS[month]} ${year}`,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(intIn(r, 1, 28)).padStart(2, '0')}`,
      price,
      land,
      // land / parcel area (sq.m) — null for strata high-rise
      built,
      // main floor area (sq.m)
      tenure,
      lot: highRise ? '—' : LOT_TYPES[Math.floor(r() * LOT_TYPES.length)],
      level: highRise ? intIn(r, 1, 24) : null,
      // unit level for high-rise
      ppsf: ppsm,
      // RM per sq.m (name kept for table compatibility)
      ppsm
    });
  }
  // newest first
  rows.sort((a, b) => b.date.localeCompare(a.date));
  return rows;
}

// Gather transactions for whatever level the user has filled in — road,
// scheme/area, mukim, or whole district — so a search needn't reach road level.
function getTransactionsForScope(path) {
  const {
    state,
    district,
    mukim,
    area,
    road
  } = path || {};
  if (!state || !district) return [];
  if (road) return getTransactions(path);
  const out = [];
  const CAP = 600;
  const pushRoads = (mk, a) => {
    for (const rd of getRoads(state, district, mk, a)) {
      const rows = getTransactions({
        state,
        district,
        mukim: mk,
        area: a,
        road: rd
      });
      for (const row of rows) {
        out.push(row);
        if (out.length >= CAP) return true;
      }
    }
    return false;
  };
  if (area) {
    pushRoads(mukim || getAreaMukim(state, district, area) || '', area);
  } else if (mukim) {
    for (const a of getAreas(state, district, mukim)) {
      if (pushRoads(mukim, a)) break;
    }
  } else {
    for (const mk of getMukims(state, district)) {
      let stop = false;
      for (const a of getAreas(state, district, mk)) {
        if (pushRoads(mk, a)) {
          stop = true;
          break;
        }
      }
      if (stop) break;
    }
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out;
}
Object.assign(window, {
  getMukims,
  getAreas,
  getDistrictAreas,
  getAreaMukim,
  getRoads,
  getTransactions,
  getTransactionsForScope,
  formatRM,
  PROPERTY_TYPES_ALL: PROPERTY_TYPES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/PropertyMapData.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/RiskPage.jsx
try { (() => {
/* eslint-disable no-undef */

const INDICATORS = [{
  name: 'House Price Index YoY',
  value: '+5.8%',
  score: 0.72,
  signal: 'up'
}, {
  name: 'Loan-to-Value ratio',
  value: '78.2%',
  score: 0.61,
  signal: 'up'
}, {
  name: 'Transaction Volume',
  value: '24,180',
  score: 0.55,
  signal: 'stable'
}, {
  name: 'Overhang (units)',
  value: '27,940',
  score: 0.34,
  signal: 'down'
}, {
  name: 'Interest rate (OPR)',
  value: '3.00%',
  score: 0.48,
  signal: 'stable'
}, {
  name: 'Affordability (P/I)',
  value: '5.4×',
  score: 0.39,
  signal: 'down'
}];
const SIG = {
  up: C.up,
  stable: C.stable,
  down: C.down
};
const SIG_LBL = {
  up: 'Supportive',
  stable: 'Neutral',
  down: 'Pressuring'
};
const IndicatorCard = ({
  d
}) => /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Eyebrow, null, d.name), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 6
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 22
}, d.value), /*#__PURE__*/React.createElement("span", {
  style: {
    background: SIG[d.signal] + '1F',
    color: SIG[d.signal],
    padding: '3px 10px',
    borderRadius: 9999,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '.1em'
  }
}, SIG_LBL[d.signal])), /*#__PURE__*/React.createElement("div", {
  style: {
    height: 6,
    background: C.cream,
    borderRadius: 3,
    marginTop: 14,
    overflow: 'hidden'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: `${d.score * 100}%`,
    height: '100%',
    background: SIG[d.signal],
    transition: 'width 1s'
  }
})));
const RiskPage = () => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: C.deep,
    color: C.cream,
    borderRadius: 14,
    padding: '28px 32px',
    borderBottom: `4px solid ${C.up}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    color: C.earthLight
  }
}, "HCR Composite \u2014 Q1 2025"), /*#__PURE__*/React.createElement(Display, {
  size: 46,
  color: C.cream,
  weight: 400,
  style: {
    marginTop: 6,
    display: 'block'
  }
}, "Upward Pressure")), /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    color: C.earthLight
  }
}, "Composite Score"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 28,
  color: C.earthLight
}, "+0.42")))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 14
  }
}, INDICATORS.map(d => /*#__PURE__*/React.createElement(IndicatorCard, {
  key: d.name,
  d: d
}))), /*#__PURE__*/React.createElement(Card, {
  style: {
    padding: 24
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
  size: 20,
  weight: 500,
  style: {
    display: 'block'
  }
}, "HP-Filter Decomposition & Housing Cycle"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12.5,
    color: C.mid,
    marginTop: 3
  }
}, "Malaysia mean house price \xB7 HP filter (\u03BB = 1600, quarterly) \xB7 1988\u20132025")), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: C.mid
  }
}, "cycle_pos = 1 when price sits above its long-run trend")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18
  }
}, /*#__PURE__*/React.createElement(CyclicalChart, null))));
Object.assign(window, {
  RiskPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/RiskPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/SentimentPage.jsx
try { (() => {
/* eslint-disable no-undef */

/* --- Custom semicircle gauge (no library) ---
   Geometry: half-circle that opens DOWNWARD; the dial sweeps the
   top half from 9 o'clock (score 0) through 12 (50) to 3 (100).
   Score text + zone labels live below the arc — never on it. */
const Gauge = ({
  score = 61.4
}) => {
  const r = 100,
    cx = 140,
    cy = 110;
  const angleFor = s => -Math.PI + s / 100 * Math.PI; // -π → 0
  const ptFor = (s, rr = r) => {
    const a = angleFor(s);
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };
  const arc = (a, b, color, w = 14) => {
    const [x1, y1] = ptFor(a);
    const [x2, y2] = ptFor(b);
    return /*#__PURE__*/React.createElement("path", {
      d: `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`,
      stroke: color,
      strokeWidth: w,
      fill: "none",
      strokeLinecap: "butt"
    });
  };
  const [nx, ny] = ptFor(score, r - 8);
  // Zone label tick positions (just below each band's centre)
  const labelY = cy + 36;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 280 240",
    width: "100%",
    style: {
      maxWidth: 320,
      overflow: 'visible'
    }
  }, arc(0, 100, C.border, 14), arc(0, 35, C.down, 14), arc(35, 65, C.stable, 14), arc(65, 100, C.up, 14), [0, 35, 65, 100].map(s => {
    const [x1, y1] = ptFor(s, r - 12);
    const [x2, y2] = ptFor(s, r + 12);
    return /*#__PURE__*/React.createElement("line", {
      key: s,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: C.raised,
      strokeWidth: "2"
    });
  }), /*#__PURE__*/React.createElement("line", {
    x1: cx,
    y1: cy,
    x2: nx,
    y2: ny,
    stroke: C.deep,
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "6",
    fill: C.deep
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "2.5",
    fill: C.earth
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: labelY,
    textAnchor: "middle",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "28",
    fill: C.deep,
    fontWeight: "500"
  }, score.toFixed(1)), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: labelY + 16,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10",
    letterSpacing: "0.14em",
    fill: C.earth,
    style: {
      textTransform: 'uppercase'
    }
  }, "out of 100"), /*#__PURE__*/React.createElement("text", {
    x: cx - r + 14,
    y: labelY + 70,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12",
    fill: C.mid
  }, "Bearish"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: labelY + 70,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12",
    fill: C.mid
  }, "Neutral"), /*#__PURE__*/React.createElement("text", {
    x: cx + r - 14,
    y: labelY + 70,
    textAnchor: "middle",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12",
    fill: C.mid
  }, "Bullish"));
};

/* --- Simple SVG time-series chart --- */
const MHSI_SERIES = [42, 38, 41, 45, 48, 51, 49, 52, 55, 53, 56, 58, 60, 59, 62, 61, 63, 60, 62, 61.4];
const NLP_SERIES = MHSI_SERIES.map((v, i) => v + Math.sin(i / 2) * 4 - 2);
const GT_SERIES = MHSI_SERIES.map((v, i) => v + Math.cos(i / 1.5) * 5 + 1);
const QLABELS = Array.from({
  length: 20
}, (_, i) => {
  const y = 2020 + Math.floor(i / 4);
  const q = i % 4 + 1;
  return `${y} Q${q}`;
});
const TimeSeries = () => {
  const w = 720,
    h = 240,
    pad = 36;
  const yMin = 20,
    yMax = 80;
  const sx = i => pad + i / (MHSI_SERIES.length - 1) * (w - pad * 2);
  const sy = v => h - pad - (v - yMin) / (yMax - yMin) * (h - pad * 2);
  const path = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${sx(i)} ${sy(v)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: pad,
    y: sy(35),
    width: w - pad * 2,
    height: sy(yMin) - sy(35),
    fill: C.down,
    opacity: "0.05"
  }), /*#__PURE__*/React.createElement("rect", {
    x: pad,
    y: sy(yMax),
    width: w - pad * 2,
    height: sy(65) - sy(yMax),
    fill: C.up,
    opacity: "0.05"
  }), [35, 50, 65].map(v => /*#__PURE__*/React.createElement("line", {
    key: v,
    x1: pad,
    y1: sy(v),
    x2: w - pad,
    y2: sy(v),
    stroke: C.border,
    strokeWidth: "1",
    strokeDasharray: "2 3"
  })), [20, 35, 50, 65, 80].map(v => /*#__PURE__*/React.createElement("text", {
    key: v,
    x: pad - 6,
    y: sy(v) + 3,
    textAnchor: "end",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10",
    fill: C.mid
  }, v)), /*#__PURE__*/React.createElement("path", {
    d: path(GT_SERIES),
    fill: "none",
    stroke: C.mid,
    strokeWidth: "1.5",
    strokeDasharray: "2 4",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: path(NLP_SERIES),
    fill: "none",
    stroke: C.earth,
    strokeWidth: "1.5",
    strokeDasharray: "6 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: path(MHSI_SERIES),
    fill: "none",
    stroke: C.deep,
    strokeWidth: "2.5"
  }), [0, 4, 8, 12, 16, 19].map(i => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: sx(i),
    y: h - 12,
    textAnchor: "middle",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10",
    fill: C.mid
  }, QLABELS[i])));
};
const Legend = () => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 18,
    marginTop: 8
  }
}, [{
  lbl: 'MHSI (smoothed)',
  stroke: C.deep,
  style: 'solid'
}, {
  lbl: 'NLP score',
  stroke: C.earth,
  style: 'dashed'
}, {
  lbl: 'Google Trends',
  stroke: C.mid,
  style: 'dotted'
}].map(l => /*#__PURE__*/React.createElement("div", {
  key: l.lbl,
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: C.mid
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "2"
}, /*#__PURE__*/React.createElement("line", {
  x1: "0",
  y1: "1",
  x2: "20",
  y2: "1",
  stroke: l.stroke,
  strokeWidth: "2",
  strokeDasharray: l.style === 'dashed' ? '6 3' : l.style === 'dotted' ? '2 3' : '0'
})), l.lbl)));
const SentimentPage = () => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 14
  }
}, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Eyebrow, null, "MHSI Score"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 26
}, "61.4"), /*#__PURE__*/React.createElement(Mono, {
  size: 12,
  color: C.up,
  style: {
    marginLeft: 8
  }
}, "\u25B2 2.4")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4,
    fontSize: 11,
    color: C.mid
  }
}, "vs. last quarter")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Eyebrow, null, "Sentiment Zone"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Display, {
  size: 22,
  weight: 400
}, "Bullish")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4,
    fontSize: 11,
    color: C.mid
  }
}, "\u2265 65 = Bullish")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Eyebrow, null, "News volume"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 26
}, "1,284"), /*#__PURE__*/React.createElement(Mono, {
  size: 12,
  color: C.up,
  style: {
    marginLeft: 8
  }
}, "\u25B2 11.2%")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4,
    fontSize: 11,
    color: C.mid
  }
}, "articles, Q1 2025"))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: 20
  }
}, /*#__PURE__*/React.createElement(Card, {
  style: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    alignSelf: 'flex-start'
  }
}, "Composite Reading"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Gauge, {
  score: 61.4
}))), /*#__PURE__*/React.createElement(Card, {
  style: {
    borderLeft: `4px solid ${C.earth}`,
    padding: 24
  }
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Market Commentary"), /*#__PURE__*/React.createElement("p", {
  className: "editorial",
  style: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 18,
    color: C.deep,
    marginTop: 10,
    lineHeight: 1.5
  }
}, "Sentiment edged into bullish territory this quarter as NLP coverage of new launches softened and Google search interest for \"rumah lelong\" eased. The MHSI smoothed line crosses 60 for the first time since 2022, supported by stable transaction velocity in Petaling and a modest uptick in primary-market enquiries."))), /*#__PURE__*/React.createElement(Card, {
  style: {
    padding: 24
  }
}, /*#__PURE__*/React.createElement(Display, {
  size: 20,
  weight: 500
}, "MHSI \u2014 2020 Q1 to 2025 Q1"), /*#__PURE__*/React.createElement(Legend, null), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 12
  }
}, /*#__PURE__*/React.createElement(TimeSeries, null))));
Object.assign(window, {
  SentimentPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/SentimentPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TransactionMapPage.jsx
try { (() => {
/* eslint-disable no-undef */
/* TransactionMapPage.jsx — "Malaysia Property Transaction Map" tab.
   Layout: interactive map + cascading location search panel on top,
   filtered transaction table below. The search is a strict cascade:
   State → District → Mukim → Scheme/Area → Road → Transactions, and the
   map's state selection stays two-way synced with the State dropdown. */
const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

/* ---- small shared bits ------------------------------------------------ */
const Spinner = ({
  label
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '10px 2px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: C.mid
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "tmap-spin",
  style: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    border: `2px solid ${C.border}`,
    borderTopColor: C.earth,
    display: 'inline-block'
  }
}), label);
const StepSelect = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  loading,
  loadingLabel,
  onClear
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    color: disabled ? C.muted : C.earth
  }
}, label), onClear && value && !loading && /*#__PURE__*/React.createElement("button", {
  onClick: () => onClear(),
  style: clearLink
}, /*#__PURE__*/React.createElement("svg", {
  width: "11",
  height: "11",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.4",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}), /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
})), "Clear")), loading ? /*#__PURE__*/React.createElement(Spinner, {
  label: loadingLabel
}) : /*#__PURE__*/React.createElement("select", {
  value: value,
  disabled: disabled,
  onChange: e => onChange(e.target.value),
  style: {
    width: '100%',
    background: disabled ? C.cream : C.cream,
    border: `1px solid ${disabled ? C.border : C.earth + '55'}`,
    color: disabled ? C.muted : C.deep,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    borderRadius: 8,
    padding: '10px 12px',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center'
  }
}, /*#__PURE__*/React.createElement("option", {
  value: ""
}, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o,
  value: o
}, o))));

/* ---- main page -------------------------------------------------------- */
const TransactionMapPage = ({
  onEngage,
  navOpen,
  variant
}) => {
  const isVal = variant === 'valuation'; // Valuation tab swaps the table for the AVM dashboard
  const [geo, setGeo] = useState(null);
  const [geoErr, setGeoErr] = useState(false);
  const [sel, setSel] = useState({
    state: '',
    district: '',
    propertyType: '',
    mukim: '',
    area: '',
    road: ''
  });
  const [load, setLoad] = useState({
    d: false,
    m: false,
    a: false,
    r: false,
    t: false
  });
  const [txns, setTxns] = useState(null); // null = not loaded yet
  const [region, setRegion] = useState('west');
  const [panelOpen, setPanelOpen] = useState(false); // starts minimized; auto-expands after State + District
  const [sheetOpen, setSheetOpen] = useState(true);
  const [sheetMax, setSheetMax] = useState(false); // table expanded to full page
  const [searched, setSearched] = useState(null); // snapshot of the selection when Search was pressed

  // filters
  const [types, setTypes] = useState([]); // selected property types
  const [yearMode, setYearMode] = useState('range');
  const [yr, setYr] = useState({
    single: '',
    from: '',
    to: ''
  });
  const [price, setPrice] = useState({
    min: '',
    max: ''
  });
  const timers = useRef([]);
  const bodyRef = useRef(null);
  const delay = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // when a new cascade step is revealed, scroll the panel body to show it
  useEffect(() => {
    const el = bodyRef.current;
    if (el) requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [sel.district, sel.mukim, sel.area, sel.road, load.m, load.a, load.r]);
  useEffect(() => {
    loadMalaysiaGeo().then(setGeo).catch(() => setGeoErr(true));
  }, []);

  // option lists (derived strictly from the current selection)
  const districts = geo && sel.state ? geo.byName[sel.state].districts.map(d => d.name) : [];
  const mukims = sel.district ? getMukims(sel.state, sel.district) : [];
  // Scheme/Area can be browsed at the mukim level (if a mukim is chosen) OR
  // directly at the district level (Mukim is optional).
  const areas = sel.mukim ? getAreas(sel.state, sel.district, sel.mukim) : sel.district ? getDistrictAreas(sel.state, sel.district) : [];
  const roads = sel.area ? getRoads(sel.state, sel.district, sel.mukim, sel.area) : [];

  /* cascade handlers — each resets every level below it and clears prior results.
     Selecting the blank option (or pressing Clear) deselects that level. */
  const selectState = state => {
    setSel({
      state: state || '',
      district: '',
      propertyType: '',
      mukim: '',
      area: '',
      road: ''
    });
    setSearched(null);
    setTxns(null);
    if (state) {
      if (onEngage) onEngage(); // reveal the dashboard chrome on first engagement
      if (geo) setRegion(geo.regionOf(state));
      setLoad(l => ({
        ...l,
        d: true
      }));
      delay(() => setLoad(l => ({
        ...l,
        d: false
      })), 450);
    }
  };
  const selectDistrict = district => {
    setSel(s => ({
      ...s,
      district: district || '',
      propertyType: '',
      mukim: '',
      area: '',
      road: ''
    }));
    setSearched(null);
    setTxns(null);
    if (district) {
      setPanelOpen(true); // surface the panel so the user can refine
      setLoad(l => ({
        ...l,
        m: true,
        a: true
      }));
      delay(() => setLoad(l => ({
        ...l,
        m: false,
        a: false
      })), 450);
    }
  };
  const selectMukim = mukim => {
    setSel(s => ({
      ...s,
      mukim: mukim || '',
      area: '',
      road: ''
    }));
    setSearched(null);
    setTxns(null);
    if (mukim) {
      setLoad(l => ({
        ...l,
        a: true
      }));
      delay(() => setLoad(l => ({
        ...l,
        a: false
      })), 450);
    }
  };
  const selectArea = area => {
    setSel(s => {
      // if no mukim was picked, infer the one that owns this scheme/area so the
      // hierarchy stays consistent
      const mukim = s.mukim || (area ? getAreaMukim(s.state, s.district, area) || '' : '');
      return {
        ...s,
        mukim,
        area: area || '',
        road: ''
      };
    });
    setSearched(null);
    setTxns(null);
    if (area) {
      setLoad(l => ({
        ...l,
        r: true
      }));
      delay(() => setLoad(l => ({
        ...l,
        r: false
      })), 450);
    }
  };
  const selectRoad = road => {
    setSel(s => ({
      ...s,
      road: road || ''
    }));
    setSearched(null);
    setTxns(null);
  };
  const selectPropertyType = propertyType => {
    setSel(s => ({
      ...s,
      propertyType: propertyType || ''
    }));
    setSearched(null);
    setTxns(null);
  };

  /* explicit Search — gathers results for whatever level is filled. Road is
     optional; a mukim- or district-level search is allowed. */
  const canSearch = !!sel.district && !!sel.propertyType;
  const runSearch = () => {
    if (!sel.district) return;
    const snap = {
      ...sel
    };
    setSearched(snap);
    setSheetOpen(true);
    if (onEngage) onEngage();
    if (isVal) setPanelOpen(false); // minimise Location Search so it doesn't cover the dashboard
    setLoad(l => ({
      ...l,
      t: true
    }));
    delay(() => {
      if (!isVal) {
        const rows = getTransactionsForScope(snap);
        setTxns(rows);
        setTypes(snap.propertyType ? [snap.propertyType] : [...new Set(rows.map(r => r.type))]);
        setYearMode('range');
        setYr({
          single: '',
          from: '',
          to: ''
        });
        setPrice({
          min: '',
          max: ''
        });
      }
      setLoad(l => ({
        ...l,
        t: false
      }));
    }, 600);
  };
  const availTypes = useMemo(() => txns ? [...new Set(txns.map(r => r.type))].sort() : [], [txns]);
  const filtered = useMemo(() => {
    if (!txns) return [];
    return txns.filter(r => {
      if (types.length && !types.includes(r.type)) return false;
      if (yearMode === 'single' && yr.single && r.year !== +yr.single) return false;
      if (yearMode === 'range') {
        if (yr.from && r.year < +yr.from) return false;
        if (yr.to && r.year > +yr.to) return false;
      }
      if (price.min && r.price < +price.min) return false;
      if (price.max && r.price > +price.max) return false;
      return true;
    });
  }, [txns, types, yearMode, yr, price]);
  const medianPrice = useMemo(() => {
    if (!filtered.length) return null;
    const s = filtered.map(r => r.price).sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  }, [filtered]);

  /* status hint */
  let hint;
  if (!sel.state) hint = isVal ? 'Select a state to begin a valuation.' : 'Select a state to explore property transactions.';else if (!sel.district) hint = `${sel.state}. Choose a district to continue.`;else if (!sel.propertyType) hint = `${sel.district}, ${sel.state}. Select a property type to continue.`;else if (searched) hint = isVal ? `Valuation ready for ${searched.area || searched.mukim || searched.district}.` : `Showing ${searched.road || searched.area || searched.mukim || searched.district}.`;else hint = `${sel.district}, ${sel.state}. Refine by mukim / scheme / road (all optional), then press Search.`;
  if (geoErr) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      color: C.down
    }
  }, "Unable to load the Malaysia map data. Please check your connection and reload.")));
  const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
  const sheetVisible = !!searched || sheetMax; // results appear once Search runs (kept while maximized)
  // Slide the Location Search clear of the floating nav while it's open.
  const searchLeft = navOpen ? 252 : 16;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'linear-gradient(165deg, #E7E3DA 0%, #DCD7C9 55%, #CFC9BA 100%)'
    }
  }, geo ? /*#__PURE__*/React.createElement(MalaysiaMap, {
    geo: geo,
    selectedState: sel.state || null,
    selectedDistrict: sel.district || null,
    region: region,
    onRegionChange: r => {
      if (!sel.state) setRegion(r);
    },
    onSelectState: selectState,
    onSelectDistrict: selectDistrict
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tmap-spin",
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      border: `3px solid ${C.border}`,
      borderTopColor: C.earth
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      color: C.mid,
      fontSize: 13
    }
  }, "Loading Malaysia map\u2026")), !sheetMax && (panelOpen ? /*#__PURE__*/React.createElement("div", {
    className: "tmap-panel",
    style: {
      position: 'absolute',
      top: 16,
      left: searchLeft,
      width: 366,
      maxWidth: 'calc(100% - 32px)',
      maxHeight: sheetVisible && sheetOpen ? isVal ? 'calc(38% - 36px)' : 'calc(46% - 40px)' : 'calc(100% - 32px)',
      display: 'flex',
      flexDirection: 'column',
      background: C.raised,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      boxShadow: '0 12px 36px rgba(44,57,48,.20)',
      zIndex: 20,
      transition: 'left .5s cubic-bezier(.16,1,.3,1)',
      animation: 'tmapPanelIn .35s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Explore"), /*#__PURE__*/React.createElement(Display, {
    size: 20,
    weight: 500,
    style: {
      display: 'block',
      marginTop: 2
    }
  }, "Location Search")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPanelOpen(false),
    title: "Collapse",
    style: iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "4 14 10 14 10 20"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "20 10 14 10 14 4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "10",
    x2: "21",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "21",
    x2: "10",
    y2: "14"
  })))), /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      padding: '0 18px',
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      borderRadius: 8,
      background: searched ? C.deep : C.earthFaint,
      border: `1px solid ${searched ? C.deep : C.earth + '40'}`,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12.5,
      lineHeight: 1.45,
      color: searched ? C.cream : C.mid
    }
  }, hint), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 0 18px',
      display: 'grid',
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(StepSelect, {
    label: "\u2460 Property Type \xB7 required",
    value: sel.propertyType,
    placeholder: "Select a property type",
    options: PROPERTY_TYPES_ALL,
    onChange: selectPropertyType,
    onClear: () => selectPropertyType('')
  }), /*#__PURE__*/React.createElement(StepSelect, {
    label: "\u2461 State",
    value: sel.state,
    placeholder: "Select state",
    options: geo ? geo.stateNames : [],
    onChange: selectState,
    onClear: () => selectState('')
  }), /*#__PURE__*/React.createElement(StepSelect, {
    label: "\u2462 District",
    value: sel.district,
    placeholder: sel.state ? 'Select district' : 'Select a state first',
    options: districts,
    onChange: selectDistrict,
    disabled: !sel.state,
    loading: load.d,
    loadingLabel: "Loading districts\u2026",
    onClear: () => selectDistrict('')
  }), sel.district && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 11.5,
      color: C.mid
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: C.earth
    }
  }, "\u2463 Narrow down"), /*#__PURE__*/React.createElement("span", null, " \u2014 select a mukim and / or a scheme / area (optional)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(StepSelect, {
    label: "Mukim",
    value: sel.mukim,
    placeholder: "Any mukim",
    options: mukims,
    onChange: selectMukim,
    loading: load.m,
    loadingLabel: "Loading\u2026",
    onClear: () => selectMukim('')
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      color: C.earth
    }
  }, "Scheme / Area"), sel.area && !load.a && /*#__PURE__*/React.createElement("button", {
    onClick: () => selectArea(''),
    style: clearLink
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  })), "Clear")), load.a ? /*#__PURE__*/React.createElement(Spinner, {
    label: "Loading\u2026"
  }) : /*#__PURE__*/React.createElement(Combobox, {
    value: sel.area,
    placeholder: "Search scheme",
    options: areas,
    onChange: selectArea
  })))), sel.area && /*#__PURE__*/React.createElement(StepSelect, {
    label: "\u2464 Road Name (optional)",
    value: sel.road,
    placeholder: "Any road",
    options: roads,
    onChange: selectRoad,
    loading: load.r,
    loadingLabel: "Loading road names\u2026",
    onClear: () => selectRoad('')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 9,
      alignItems: 'center',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: runSearch,
    disabled: !canSearch,
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      background: canSearch ? C.deep : C.border,
      color: canSearch ? C.cream : C.muted,
      border: 0,
      borderRadius: 9,
      padding: '12px 16px',
      cursor: canSearch ? 'pointer' : 'not-allowed',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14,
      fontWeight: 600,
      transition: 'background .2s'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), searched ? 'Update search' : isVal ? 'Value this area' : 'Search'), (sel.state || sel.district) && /*#__PURE__*/React.createElement("button", {
    onClick: () => selectState(''),
    style: {
      background: 'transparent',
      border: `1px solid ${C.border}`,
      color: C.mid,
      borderRadius: 9,
      padding: '12px 14px',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Clear"))))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setPanelOpen(true),
    style: {
      position: 'absolute',
      top: 16,
      left: searchLeft,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      background: C.deep,
      color: C.cream,
      border: 0,
      borderRadius: 9999,
      padding: '11px 18px',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(44,57,48,.24)',
      transition: 'left .5s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), "Location Search", searched && !isVal && txns && /*#__PURE__*/React.createElement("span", {
    style: {
      background: C.earth,
      borderRadius: 9999,
      padding: '1px 8px',
      fontSize: 11
    }
  }, filtered.length))), sheetVisible && /*#__PURE__*/React.createElement("div", {
    className: "tmap-sheet",
    style: {
      position: 'absolute',
      zIndex: 15,
      left: sheetMax ? 0 : 16,
      right: sheetMax ? 0 : 16,
      bottom: sheetMax ? 0 : 16,
      top: sheetMax ? 0 : 'auto',
      height: sheetMax ? 'auto' : sheetOpen ? isVal ? 'min(62%, 580px)' : 'min(48%, 460px)' : 52,
      display: 'flex',
      flexDirection: 'column',
      background: C.raised,
      border: sheetMax ? 'none' : `1px solid ${C.border}`,
      borderRadius: sheetMax ? 0 : 14,
      boxShadow: sheetMax ? 'none' : '0 -8px 36px rgba(44,57,48,.18)',
      overflow: 'hidden',
      transition: 'height .34s cubic-bezier(.16,1,.3,1), left .3s, right .3s, bottom .3s, border-radius .3s',
      animation: 'tmapSheetIn .4s cubic-bezier(.16,1,.3,1)'
    }
  }, !sheetOpen && !sheetMax && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSheetOpen(true),
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: 'transparent',
      border: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: C.deep
    }
  }, isVal ? `Estimated Valuation · ${searched && (searched.area || searched.mukim || searched.district) || sel.area || sel.district}` : `Property Transactions${txns ? ` · ${filtered.length} of ${txns.length}` : ''}`), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: C.mid,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  }))), (sheetOpen || sheetMax) && /*#__PURE__*/React.createElement(React.Fragment, null, !sheetMax && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 18,
      zIndex: 4,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setYearMode('range');
      setSheetMax(true);
    },
    title: "Expand to full page",
    style: iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 3 21 3 21 9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 21 3 21 3 15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "3",
    x2: "14",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "21",
    x2: "10",
    y2: "14"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSheetOpen(false),
    title: "Collapse",
    style: iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })))), isVal ? sheetMax ? /*#__PURE__*/React.createElement(TxnFullPage, {
    variant: "valuation",
    sel: sel,
    geo: geo,
    searched: searched,
    onSearch: runSearch,
    canSearch: canSearch,
    onExit: () => {
      setSheetMax(false);
      setPanelOpen(false);
    },
    districts: districts,
    mukims: mukims,
    areas: areas,
    roads: roads,
    selectState: selectState,
    stateNames: geo ? geo.stateNames : [],
    selectDistrict: selectDistrict,
    selectMukim: selectMukim,
    selectArea: selectArea,
    selectRoad: selectRoad,
    clearAll: () => {
      selectState('');
      setSheetMax(false);
      setPanelOpen(true);
    },
    load: load,
    txns: txns,
    filtered: filtered,
    availTypes: availTypes,
    types: types,
    setTypes: setTypes,
    yr: yr,
    setYr: setYr,
    price: price,
    setPrice: setPrice,
    years: YEARS
  }) : /*#__PURE__*/React.createElement(ValuationDashboard, {
    sel: searched || sel,
    loading: load.t
  }) : sheetMax ? /*#__PURE__*/React.createElement(TxnFullPage, {
    sel: sel,
    geo: geo,
    searched: searched,
    onSearch: runSearch,
    canSearch: canSearch,
    onExit: () => {
      setSheetMax(false);
      setPanelOpen(true);
    },
    districts: districts,
    mukims: mukims,
    areas: areas,
    roads: roads,
    selectState: selectState,
    stateNames: geo ? geo.stateNames : [],
    selectDistrict: selectDistrict,
    selectMukim: selectMukim,
    selectArea: selectArea,
    selectRoad: selectRoad,
    clearAll: () => {
      selectState('');
      setSheetMax(false);
      setPanelOpen(true);
    },
    load: load,
    txns: txns,
    filtered: filtered,
    availTypes: availTypes,
    types: types,
    setTypes: setTypes,
    yr: yr,
    setYr: setYr,
    price: price,
    setPrice: setPrice,
    years: YEARS
  }) : /*#__PURE__*/React.createElement(TxnTable, {
    fill: true,
    sel: searched || sel,
    loading: load.t,
    txns: txns,
    filtered: filtered,
    availTypes: availTypes,
    types: types,
    setTypes: setTypes,
    yearMode: yearMode,
    setYearMode: setYearMode,
    yr: yr,
    setYr: setYr,
    price: price,
    setPrice: setPrice,
    years: YEARS,
    median: medianPrice
  }))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes tmapspin { to { transform: rotate(360deg); } }
        .tmap-spin { animation: tmapspin .8s linear infinite; }
        @keyframes tmapPanelIn { from {opacity:0; transform:translateX(-16px)} to {opacity:1; transform:none} }
        @keyframes tmapSheetIn { from {opacity:0; transform:translateY(24px)} to {opacity:1; transform:none} }
        @keyframes tmapPop { from {opacity:0; transform:translateY(-6px)} to {opacity:1; transform:none} }
        @media (max-width: 720px) {
          .tmap-panel { width: calc(100% - 32px) !important; }
        }
      `));
};
const iconBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  background: C.cream,
  border: `1px solid ${C.border}`,
  color: C.mid,
  cursor: 'pointer',
  flexShrink: 0
};
const clearLink = {
  border: 0,
  background: 'transparent',
  color: C.muted,
  cursor: 'pointer',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 11,
  fontWeight: 600,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 3
};
Object.assign(window, {
  TransactionMapPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TransactionMapPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TxnFullPage.jsx
try { (() => {
/* eslint-disable no-undef */
/* TxnFullPage.jsx — the maximized ("full page") presentation of the
   transaction explorer. Same underlying state/handlers as the docked
   bottom-sheet, re-laid-out as a spreadsheet-style workspace:
   a horizontal Location Search stepper, an expanded filter bar
   (property type + year-from/to pills + min/max price), a summary
   stats strip, and an airy light-header table. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SQM = sqft => sqft ? +(sqft / 10.7639).toFixed(1) : null;
const num1 = n => n == null ? '—' : n.toLocaleString('en-MY', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

/* horizontal numbered cascade step */
const StepDrop = ({
  n,
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  loading,
  onClear,
  searchable
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 200
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    marginBottom: 9
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    flexShrink: 0,
    background: disabled ? C.muted : C.earth,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 12,
    fontWeight: 700
  }
}, n), /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    color: disabled ? C.muted : C.earth,
    letterSpacing: '.12em'
  }
}, label), onClear && value && /*#__PURE__*/React.createElement("button", {
  onClick: onClear,
  title: `Clear ${label}`,
  style: {
    marginLeft: 'auto',
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    color: C.muted,
    display: 'flex',
    padding: 2
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "15",
  height: "15",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}), /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
})))), /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'relative'
  }
}, searchable ? /*#__PURE__*/React.createElement(Combobox, {
  value: value,
  placeholder: placeholder,
  options: options,
  onChange: onChange,
  disabled: disabled || loading,
  size: "lg"
}) : /*#__PURE__*/React.createElement("select", {
  value: value,
  disabled: disabled || loading,
  onChange: e => onChange(e.target.value),
  style: {
    width: '100%',
    boxSizing: 'border-box',
    background: disabled ? C.cream + '80' : C.cream,
    border: `1px solid ${disabled ? C.border : C.earth + '50'}`,
    color: disabled ? C.muted : value ? C.deep : C.muted,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    borderRadius: 9,
    padding: '13px 15px',
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center'
  }
}, /*#__PURE__*/React.createElement("option", {
  value: ""
}, loading ? 'Loading…' : placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o,
  value: o
}, o)))));
const StatCard = ({
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 150,
    background: C.cream,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '14px 18px'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    fontSize: 10.5
  }
}, label), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 6
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 20
}, value)));
const YearPills = ({
  label,
  value,
  onPick,
  years
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    marginBottom: 8
  }
}, label), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 6
  }
}, years.map(y => /*#__PURE__*/React.createElement("button", {
  key: y,
  onClick: () => onPick(value === String(y) ? '' : String(y)),
  style: {
    border: `1px solid ${value === String(y) ? C.deep : C.border}`,
    background: value === String(y) ? C.deep : C.cream,
    color: value === String(y) ? C.cream : C.deep,
    borderRadius: 9999,
    padding: '8px 13px',
    cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 13,
    fontWeight: 500,
    transition: 'all .15s',
    fontFeatureSettings: "'tnum'"
  }
}, y))));
const FullHeadCell = ({
  children,
  right
}) => /*#__PURE__*/React.createElement("th", {
  style: {
    textAlign: right ? 'right' : 'left',
    padding: '13px 18px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    color: C.earth,
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    background: C.raised,
    borderBottom: `1.5px solid ${C.border}`,
    zIndex: 1
  }
}, children);
const FullCell = ({
  children,
  right,
  mono,
  strong,
  muted
}) => /*#__PURE__*/React.createElement("td", {
  style: {
    textAlign: right ? 'right' : 'left',
    padding: '14px 18px',
    fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
    fontSize: 13.5,
    color: muted ? C.muted : strong ? C.deep : C.mid,
    fontWeight: strong ? 600 : 400,
    whiteSpace: 'nowrap'
  }
}, children);
const TxnFullPage = p => {
  const {
    sel,
    geo,
    districts,
    mukims,
    areas,
    roads,
    stateNames,
    selectState,
    selectDistrict,
    selectMukim,
    selectArea,
    selectRoad,
    clearAll,
    onExit,
    load,
    txns,
    filtered,
    availTypes,
    types,
    setTypes,
    yr,
    setYr,
    price,
    setPrice,
    years
  } = p;
  const isVal = p.variant === 'valuation';
  const prices = filtered.map(r => r.price);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const sorted = prices.slice().sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  const min = sorted.length ? sorted[0] : null;
  const max = sorted.length ? sorted[sorted.length - 1] : null;
  const typeValue = types.length === availTypes.length || types.length === 0 ? 'all' : types[0];
  const onTypeChange = v => setTypes(v === 'all' ? availTypes : [v]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      overflowY: 'auto',
      padding: 24,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1640,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '22px 26px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: 24,
    weight: 500,
    style: {
      display: 'block'
    }
  }, "Location Search"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13.5,
      color: C.mid,
      marginTop: 4
    }
  }, isVal ? sel.area ? `${sel.area} — automated valuation & area market data` : 'Drill down to a specific area to value the property' : sel.state ? `${sel.state} — drill down to a specific area to view transactions` : 'Drill down to a specific area to view transactions')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => p.onSearch && p.onSearch(),
    disabled: !p.canSearch,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      border: 0,
      background: p.canSearch ? C.deep : C.border,
      color: p.canSearch ? C.cream : C.muted,
      borderRadius: 9,
      padding: '9px 16px',
      cursor: p.canSearch ? 'pointer' : 'not-allowed',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), p.searched ? 'Update' : isVal ? 'Value area' : 'Search'), /*#__PURE__*/React.createElement("button", {
    onClick: clearAll,
    style: {
      border: 0,
      background: 'transparent',
      color: C.earth,
      cursor: 'pointer',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13.5,
      fontWeight: 600,
      padding: '4px 2px'
    }
  }, "Clear all"), /*#__PURE__*/React.createElement("button", {
    onClick: onExit,
    title: "Exit full page",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      border: `1px solid ${C.border}`,
      background: C.cream,
      color: C.deep,
      borderRadius: 9,
      padding: '9px 15px',
      cursor: 'pointer',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "4 14 10 14 10 20"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "20 10 14 10 14 4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "10",
    x2: "21",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "21",
    x2: "10",
    y2: "14"
  })), "Exit full page"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StepDrop, {
    n: 1,
    label: "State",
    value: sel.state,
    placeholder: "Select state\u2026",
    options: stateNames,
    onChange: selectState,
    onClear: () => selectState('')
  }), /*#__PURE__*/React.createElement(StepDrop, {
    n: 2,
    label: "District",
    value: sel.district,
    placeholder: "Select district\u2026",
    options: districts,
    onChange: selectDistrict,
    disabled: !sel.state,
    loading: load.d,
    onClear: () => selectDistrict('')
  }), /*#__PURE__*/React.createElement(StepDrop, {
    n: 3,
    label: "Mukim (optional)",
    value: sel.mukim,
    placeholder: "Any mukim\u2026",
    options: mukims,
    onChange: selectMukim,
    disabled: !sel.district,
    loading: load.m,
    onClear: () => selectMukim('')
  }), /*#__PURE__*/React.createElement(StepDrop, {
    n: 4,
    label: "Scheme / Area",
    value: sel.area,
    placeholder: "Search scheme\u2026",
    options: areas,
    onChange: selectArea,
    disabled: !sel.district,
    loading: load.a,
    onClear: () => selectArea(''),
    searchable: true
  }), /*#__PURE__*/React.createElement(StepDrop, {
    n: 5,
    label: "Road Name",
    value: sel.road,
    placeholder: "Select road\u2026",
    options: roads,
    onChange: selectRoad,
    disabled: !sel.area,
    loading: load.r,
    onClear: () => selectRoad('')
  }))), isVal && /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, p.searched ? /*#__PURE__*/React.createElement(ValuationDashboard, {
    sel: p.searched,
    loading: load.t,
    fullpage: true
  }) : /*#__PURE__*/React.createElement(FullEmpty, {
    title: "Choose a location and press Search to value the area.",
    sub: "Pick at least a district \u2014 mukim, scheme/area and road are optional."
  })), !isVal && /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 26px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      gap: 30,
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 240,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 8
    }
  }, "Property Type"), /*#__PURE__*/React.createElement("select", {
    value: typeValue,
    onChange: e => onTypeChange(e.target.value),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      background: C.cream,
      border: `1px solid ${C.earth}50`,
      color: C.deep,
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14.5,
      borderRadius: 9,
      padding: '12px 15px',
      appearance: 'none',
      cursor: 'pointer',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All property types"), availTypes.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement(YearPills, {
    label: "Year From",
    value: yr.from,
    years: years,
    onPick: v => setYr({
      ...yr,
      single: '',
      from: v
    })
  }), /*#__PURE__*/React.createElement(YearPills, {
    label: "Year To",
    value: yr.to,
    years: years,
    onPick: v => setYr({
      ...yr,
      single: '',
      to: v
    })
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 8
    }
  }, "Min Price (RM)"), /*#__PURE__*/React.createElement("input", {
    value: price.min ? (+price.min).toLocaleString('en-MY') : '',
    onChange: e => setPrice({
      ...price,
      min: e.target.value.replace(/[^0-9]/g, '')
    }),
    placeholder: "e.g. 200,000",
    inputMode: "numeric",
    style: priceBox
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 8
    }
  }, "Max Price (RM)"), /*#__PURE__*/React.createElement("input", {
    value: price.max ? (+price.max).toLocaleString('en-MY') : '',
    onChange: e => setPrice({
      ...price,
      max: e.target.value.replace(/[^0-9]/g, '')
    }),
    placeholder: "e.g. 1,000,000",
    inputMode: "numeric",
    style: priceBox
  }))), txns && txns.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 26px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      background: C.cream + '60'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Transactions",
    value: filtered.length
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Avg Price",
    value: avg != null ? formatRM(avg) : '—'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Median Price",
    value: median != null ? formatRM(median) : '—'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Min Price",
    value: min != null ? formatRM(min) : '—'
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Max Price",
    value: max != null ? formatRM(max) : '—'
  })), load.t ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: C.mid,
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tmap-spin",
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: `2px solid ${C.border}`,
      borderTopColor: C.earth
    }
  }), "Loading property transactions\u2026")) : !txns ? /*#__PURE__*/React.createElement(FullEmpty, {
    title: "Choose a location and press Search.",
    sub: "Pick at least a district to load transactions."
  }) : txns && txns.length === 0 ? /*#__PURE__*/React.createElement(FullEmpty, {
    title: "No property transaction records found for this location.",
    sub: "Try a different road, scheme, or district."
  }) : filtered.length === 0 ? /*#__PURE__*/React.createElement(FullEmpty, {
    title: "No transactions match the selected filters.",
    sub: "Adjust the property type, year, or price filters above."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      minWidth: 980
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(FullHeadCell, null, "Year"), /*#__PURE__*/React.createElement(FullHeadCell, null, "Mo"), /*#__PURE__*/React.createElement(FullHeadCell, null, "Property Type"), /*#__PURE__*/React.createElement(FullHeadCell, null, "Scheme / Area"), /*#__PURE__*/React.createElement(FullHeadCell, null, "Road"), /*#__PURE__*/React.createElement(FullHeadCell, null, "Tenure"), /*#__PURE__*/React.createElement(FullHeadCell, {
    right: true
  }, "Floor (sqm)"), /*#__PURE__*/React.createElement(FullHeadCell, {
    right: true
  }, "Land (sqm)"), /*#__PURE__*/React.createElement(FullHeadCell, {
    right: true
  }, "Price (RM)"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((r, i) => {
    const mo = +r.date.slice(5, 7) - 1;
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderBottom: `1px solid ${C.border}80`,
        background: i % 2 ? C.cream + '40' : 'transparent',
        transition: 'background .12s'
      },
      onMouseEnter: e => e.currentTarget.style.background = C.cream,
      onMouseLeave: e => e.currentTarget.style.background = i % 2 ? C.cream + '40' : 'transparent'
    }, /*#__PURE__*/React.createElement(FullCell, {
      mono: true,
      strong: true
    }, r.year), /*#__PURE__*/React.createElement(FullCell, {
      muted: true
    }, MONTHS[mo]), /*#__PURE__*/React.createElement(FullCell, null, r.type), /*#__PURE__*/React.createElement(FullCell, {
      strong: true
    }, r.area), /*#__PURE__*/React.createElement(FullCell, {
      muted: true
    }, r.road), /*#__PURE__*/React.createElement(FullCell, null, r.tenure), /*#__PURE__*/React.createElement(FullCell, {
      right: true,
      mono: true
    }, r.built == null ? '—' : r.built.toLocaleString('en-MY')), /*#__PURE__*/React.createElement(FullCell, {
      right: true,
      mono: true
    }, r.land == null ? '—' : r.land.toLocaleString('en-MY')), /*#__PURE__*/React.createElement(FullCell, {
      right: true,
      mono: true,
      strong: true
    }, formatRM(r.price)));
  })))))));
};
const priceBox = {
  width: 170,
  boxSizing: 'border-box',
  background: C.cream,
  border: `1px solid ${C.earth}50`,
  color: C.deep,
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: 14,
  borderRadius: 9,
  padding: '12px 14px',
  outline: 'none'
};
const FullEmpty = ({
  title,
  sub
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: '70px 24px',
    textAlign: 'center'
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "44",
  height: "44",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: C.muted,
  strokeWidth: "1.4",
  style: {
    margin: '0 auto 16px',
    display: 'block'
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 13h6l1.5 2h3l1.5-2h6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 13V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"
})), /*#__PURE__*/React.createElement(Display, {
  size: 24,
  weight: 500,
  style: {
    display: 'block'
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    color: C.muted,
    marginTop: 7
  }
}, sub));
Object.assign(window, {
  TxnFullPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TxnFullPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TxnTable.jsx
try { (() => {
/* eslint-disable no-undef */
/* TxnTable.jsx — filter bar + property transaction table for the
   Malaysia Property Transaction Map tab. Only renders once a Road is
   selected; handles loading, empty (no records) and filtered-empty states.
   Filters: Year (single or range), Transaction Price (RM min/max),
   Property Type (values sourced from the loaded data, not hardcoded). */
const {
  useState: useStateTT
} = React;
const numFmt = n => n == null ? '—' : n.toLocaleString('en-MY');
const TH = ({
  children,
  right
}) => /*#__PURE__*/React.createElement("th", {
  style: {
    textAlign: right ? 'right' : 'left',
    padding: '11px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    color: C.cream,
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    background: C.deep,
    zIndex: 1
  }
}, children);
const TD = ({
  children,
  right,
  mono,
  strong
}) => /*#__PURE__*/React.createElement("td", {
  style: {
    textAlign: right ? 'right' : 'left',
    padding: '11px 14px',
    fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
    fontSize: 13,
    color: strong ? C.deep : C.mid,
    fontWeight: strong ? 600 : 400,
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${C.border}`
  }
}, children);
const PriceInput = ({
  value,
  onChange,
  placeholder
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: C.cream,
    border: `1px solid ${C.earth}40`,
    borderRadius: 8,
    padding: '8px 10px'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 12,
    color: C.muted
  }
}, "RM"), /*#__PURE__*/React.createElement("input", {
  value: value ? (+value).toLocaleString('en-MY') : '',
  onChange: e => onChange(e.target.value.replace(/[^0-9]/g, '')),
  placeholder: placeholder,
  inputMode: "numeric",
  style: {
    border: 0,
    background: 'transparent',
    outline: 'none',
    width: '100%',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 13,
    color: C.deep
  }
}));
const TxnTable = ({
  sel,
  loading,
  txns,
  filtered,
  availTypes,
  types,
  setTypes,
  yearMode,
  setYearMode,
  yr,
  setYr,
  price,
  setPrice,
  years,
  median,
  fill
}) => {
  // before any road is chosen → table is hidden entirely
  if (!sel.road && !loading) return null;
  const toggleType = t => setTypes(types.includes(t) ? types.filter(x => x !== t) : [...types, t]);
  const filtersActive = types.length !== availTypes.length || yr.single || yr.from || yr.to || price.min || price.max;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: 'hidden',
      ...(fill ? {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        border: 0,
        borderRadius: 0
      } : {})
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 12,
      flexShrink: 0,
      paddingRight: fill ? 104 : 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Display, {
    size: 20,
    weight: 500
  }, "Property Transactions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 12,
      color: C.mid,
      marginTop: 3
    }
  }, sel.road ? `${sel.road} · ${sel.area} · ${sel.mukim} · ${sel.district} · ${sel.state}` : '')), txns && txns.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Records"), /*#__PURE__*/React.createElement(Mono, {
    size: 20
  }, filtered.length, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.muted
    }
  }, " / ", txns.length))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Median Price"), /*#__PURE__*/React.createElement(Mono, {
    size: 20
  }, median != null ? formatRM(median) : '—')))), txns && txns.length > 0 && !loading && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 22px',
      borderBottom: `1px solid ${C.border}`,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 18,
      background: C.cream + '80',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 7,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Year"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['single', 'range'].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setYearMode(m),
    style: {
      border: 0,
      background: yearMode === m ? C.deep : 'transparent',
      color: yearMode === m ? C.cream : C.mid,
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: 10,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'DM Sans',sans-serif",
      textTransform: 'capitalize'
    }
  }, m)))), yearMode === 'single' ? /*#__PURE__*/React.createElement(MiniSelect, {
    value: yr.single,
    onChange: v => setYr({
      ...yr,
      single: v
    }),
    placeholder: "Any year",
    options: years
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(MiniSelect, {
    value: yr.from,
    onChange: v => setYr({
      ...yr,
      from: v
    }),
    placeholder: "From",
    options: years
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted
    }
  }, "\u2013"), /*#__PURE__*/React.createElement(MiniSelect, {
    value: yr.to,
    onChange: v => setYr({
      ...yr,
      to: v
    }),
    placeholder: "To",
    options: years
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 7
    }
  }, "Transaction Price"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(PriceInput, {
    value: price.min,
    onChange: v => setPrice({
      ...price,
      min: v
    }),
    placeholder: "Min"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted
    }
  }, "\u2013"), /*#__PURE__*/React.createElement(PriceInput, {
    value: price.max,
    onChange: v => setPrice({
      ...price,
      max: v
    }),
    placeholder: "Max"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 7
    }
  }, "Property Type"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 7
    }
  }, availTypes.map(t => /*#__PURE__*/React.createElement(Pill, {
    key: t,
    active: types.includes(t),
    onClick: () => toggleType(t)
  }, t)), filtersActive && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTypes(availTypes);
      setYr({
        single: '',
        from: '',
        to: ''
      });
      setPrice({
        min: '',
        max: ''
      });
    },
    style: {
      border: `1px dashed ${C.muted}`,
      background: 'transparent',
      color: C.mid,
      borderRadius: 9999,
      padding: '8px 14px',
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, "Clear filters")))), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '50px 0',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: C.mid,
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tmap-spin",
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: `2px solid ${C.border}`,
      borderTopColor: C.earth
    }
  }), "Loading property transactions\u2026")) : txns && txns.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    title: "No property transaction records found for this location.",
    sub: "Try a different road, scheme, or district."
  }) : filtered.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    title: "No transactions match the selected filters.",
    sub: "Adjust the year, price, or property-type filters above."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      ...(fill ? {
        flex: 1,
        minHeight: 0
      } : {})
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      minWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, null, "State"), /*#__PURE__*/React.createElement(TH, null, "District"), /*#__PURE__*/React.createElement(TH, null, "Mukim"), /*#__PURE__*/React.createElement(TH, null, "Scheme / Area"), /*#__PURE__*/React.createElement(TH, null, "Road Name"), /*#__PURE__*/React.createElement(TH, null, "Property Type"), /*#__PURE__*/React.createElement(TH, null, "Tenure"), /*#__PURE__*/React.createElement(TH, {
    right: true
  }, "Year"), /*#__PURE__*/React.createElement(TH, {
    right: true
  }, "Land (m\xB2)"), /*#__PURE__*/React.createElement(TH, {
    right: true
  }, "Built-up (m\xB2)"), /*#__PURE__*/React.createElement(TH, {
    right: true
  }, "Price/m\xB2"), /*#__PURE__*/React.createElement(TH, {
    right: true
  }, "Transaction Price (RM)"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      transition: 'background .12s'
    },
    onMouseEnter: e => e.currentTarget.style.background = C.cream,
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(TD, null, r.state), /*#__PURE__*/React.createElement(TD, null, r.district), /*#__PURE__*/React.createElement(TD, null, r.mukim), /*#__PURE__*/React.createElement(TD, {
    strong: true
  }, r.area), /*#__PURE__*/React.createElement(TD, null, r.road), /*#__PURE__*/React.createElement(TD, null, r.type), /*#__PURE__*/React.createElement(TD, null, r.tenure), /*#__PURE__*/React.createElement(TD, {
    right: true,
    mono: true
  }, r.year), /*#__PURE__*/React.createElement(TD, {
    right: true,
    mono: true
  }, numFmt(r.land)), /*#__PURE__*/React.createElement(TD, {
    right: true,
    mono: true
  }, numFmt(r.built)), /*#__PURE__*/React.createElement(TD, {
    right: true,
    mono: true
  }, r.ppsf ? 'RM ' + numFmt(r.ppsf) : '—'), /*#__PURE__*/React.createElement(TD, {
    right: true,
    mono: true,
    strong: true
  }, formatRM(r.price))))))));
};
const MiniSelect = ({
  value,
  onChange,
  options,
  placeholder
}) => /*#__PURE__*/React.createElement("select", {
  value: value,
  onChange: e => onChange(e.target.value),
  style: {
    background: C.cream,
    border: `1px solid ${C.earth}40`,
    color: C.deep,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 13,
    borderRadius: 8,
    padding: '8px 10px',
    appearance: 'none',
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%232C3930' stroke-width='1.5'><polyline points='3 5 7 9 11 5'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 9px center'
  }
}, /*#__PURE__*/React.createElement("option", {
  value: ""
}, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o,
  value: o
}, o)));
const EmptyState = ({
  title,
  sub
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: '54px 24px',
    textAlign: 'center'
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "40",
  height: "40",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: C.muted,
  strokeWidth: "1.4",
  style: {
    margin: '0 auto 14px',
    display: 'block'
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 13h6l1.5 2h3l1.5-2h6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 13V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"
})), /*#__PURE__*/React.createElement(Display, {
  size: 20,
  weight: 500,
  style: {
    display: 'block'
  }
}, title), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 13,
    color: C.muted,
    marginTop: 6
  }
}, sub));
Object.assign(window, {
  TxnTable
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TxnTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ValuationDashboard.jsx
try { (() => {
/* eslint-disable no-undef */
/* ValuationDashboard.jsx — the Valuation tab's result panel.
   Shown inside the map's bottom sheet once the user has chosen a Scheme/Area.
   Estimates the property's market value (switchable between three models —
   Linear Regression, Random Forest, Neural Network) and surfaces the
   essential market data for the chosen region, mirroring the real NAPIC
   Open Transaction schema: average price by property type, median price,
   price per m² (built-up), median built-up / land area (sq.m), tenure mix,
   and the price + volume trend across 2021–2026. All figures derive from the
   same calibrated transaction layer the map uses, so the dashboard always
   agrees with the underlying records. */
const {
  useState,
  useMemo
} = React;

/* ---- stats helpers ---------------------------------------------------- */
const valMean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const valMedian = a => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const rmCompact = n => {
  if (!n) return '—';
  if (n >= 1e6) return 'RM ' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return 'RM ' + Math.round(n / 1e3) + 'k';
  return formatRM(n);
};
const SHORT_TYPE = {
  '1 - 1 1/2 Storey Terraced': '1–1½ Terraced',
  '2 - 2 1/2 Storey Terraced': '2–2½ Terraced',
  'Condominium/Apartment': 'Condo / Apt',
  '1 - 1 1/2 Storey Semi-Detached': '1–1½ Semi-D',
  'Low-Cost House': 'Low-Cost House',
  'Detached': 'Detached',
  '2 - 2 1/2 Storey Semi-Detached': '2–2½ Semi-D',
  'Flat': 'Flat',
  'Low-Cost Flat': 'Low-Cost Flat',
  'Cluster House': 'Cluster House',
  'Town House': 'Town House'
};
const shortType = t => SHORT_TYPE[t] || t;

/* ---- region aggregation (area-level sample) --------------------------- */
function valComputeRegion(sel) {
  const {
    state,
    district,
    mukim,
    area
  } = sel || {};
  let rows = [];
  try {
    rows = getTransactionsForScope({
      state,
      district,
      mukim,
      area
    }) || [];
  } catch (e) {}
  if (rows.length < 6) {
    try {
      rows = rows.concat(getTransactions({
        state,
        district,
        mukim,
        area,
        road: ''
      }) || []);
    } catch (e) {}
  }
  const median = valMedian(rows.map(r => r.price));
  const ppsmArr = rows.map(r => r.ppsm).filter(Boolean);
  const ppsm = ppsmArr.length ? Math.round(valMedian(ppsmArr)) : null;
  const floorArr = rows.map(r => r.built).filter(Boolean);
  const medFloor = floorArr.length ? Math.round(valMedian(floorArr)) : null;
  const landArr = rows.map(r => r.land).filter(Boolean);
  const medLand = landArr.length ? Math.round(valMedian(landArr)) : null;
  const fhPct = Math.round(100 * rows.filter(r => r.tenure === 'Freehold').length / (rows.length || 1));
  const map = {};
  rows.forEach(r => {
    (map[r.type] = map[r.type] || []).push(r);
  });
  const byType = Object.entries(map).map(([type, arr]) => ({
    type,
    avg: valMean(arr.map(r => r.price)),
    n: arr.length
  })).sort((a, b) => b.avg - a.avg);
  const dominant = byType.reduce((a, b) => a && a.n >= b.n ? a : b, null);
  const byYear = {};
  rows.forEach(r => {
    (byYear[r.year] = byYear[r.year] || []).push(r.price);
  });
  const yearAvg = Object.keys(byYear).map(Number).sort().map(y => ({
    y,
    avg: valMean(byYear[y]),
    n: byYear[y].length
  }));
  let trendTotal = null;
  if (yearAvg.length >= 2) {
    const f = yearAvg[0],
      l = yearAvg[yearAvg.length - 1];
    trendTotal = (l.avg / f.avg - 1) * 100;
  }
  return {
    rows,
    count: rows.length,
    median,
    ppsm,
    medFloor,
    medLand,
    fhPct,
    byType,
    dominant,
    yearAvg,
    trendTotal,
    baseVal: median || 400000
  };
}
function valModels(base) {
  return [{
    label: 'Linear Regression',
    short: 'Linear',
    point: base * 0.965,
    band: 0.15,
    conf: 81,
    mae: '8.4%',
    note: 'Transparent baseline — assumes linear price drivers.'
  }, {
    label: 'Random Forest',
    short: 'Forest',
    point: base * 1.005,
    band: 0.10,
    conf: 90,
    mae: '5.2%',
    note: 'Ensemble of decision trees, robust to outliers.'
  }, {
    label: 'Neural Network',
    short: 'Neural',
    point: base * 1.035,
    band: 0.07,
    conf: 93,
    mae: '4.1%',
    note: 'Deep model capturing non-linear interactions.'
  }];
}

/* ---- small presentational bits --------------------------------------- */
const StatTile = ({
  label,
  value,
  sub,
  accent
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: C.cream,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }
}, /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    fontSize: 10
  }
}, label), /*#__PURE__*/React.createElement(Mono, {
  size: 17,
  color: accent || C.deep
}, value), sub && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 11,
    color: C.mid
  }
}, sub));
const ValuationDashboard = ({
  sel,
  loading,
  fullpage
}) => {
  const [modelIdx, setModelIdx] = useState(1); // Random Forest default
  const data = useMemo(() => valComputeRegion(sel), [sel.state, sel.district, sel.mukim, sel.area]);
  const models = useMemo(() => valModels(data.baseVal), [data.baseVal]);
  const m = models[modelIdx];
  const low = m.point * (1 - m.band);
  const high = m.point * (1 + m.band);
  const dLow = Math.min(...models.map(x => x.point * (1 - x.band)));
  const dHigh = Math.max(...models.map(x => x.point * (1 + x.band)));
  const pct = v => Math.max(0, Math.min(100, (v - dLow) / (dHigh - dLow) * 100));
  const valPerSqm = data.medFloor ? Math.round(m.point / data.medFloor) : null;
  const maxTypeAvg = Math.max(...data.byType.map(t => t.avg), 1);
  const maxYear = Math.max(...data.yearAvg.map(y => y.avg), 1);
  const minYear = Math.min(...data.yearAvg.map(y => y.avg), maxYear);
  const maxVol = Math.max(...data.yearAvg.map(y => y.n), 1);
  const trendUp = (data.trendTotal || 0) >= 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: fullpage ? 'auto' : '100%',
      display: 'flex',
      flexDirection: 'column',
      background: C.raised,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '15px 20px 12px',
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Automated Valuation"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      marginTop: 2,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 21,
    weight: 500
  }, sel.area || sel.district), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 12.5,
      color: C.mid
    }
  }, [sel.district, sel.state].filter(Boolean).join(', '), " \xB7 ", data.count, " comparable transactions \xB7 NAPIC 2021\u20132026"))), /*#__PURE__*/React.createElement("div", {
    className: "val-grid",
    style: {
      flex: fullpage ? 'none' : 1,
      overflowY: fullpage ? 'visible' : 'auto',
      padding: fullpage ? 24 : 18,
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 350px) 1fr',
      gap: 18,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 7
    }
  }, "Valuation model"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 6
    }
  }, models.map((x, i) => {
    const on = i === modelIdx;
    return /*#__PURE__*/React.createElement("button", {
      key: x.label,
      onClick: () => setModelIdx(i),
      style: {
        padding: '9px 4px',
        borderRadius: 8,
        cursor: 'pointer',
        border: `1px solid ${on ? C.deep : C.border}`,
        background: on ? C.deep : C.cream,
        color: on ? C.cream : C.mid,
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        transition: 'all .18s'
      }
    }, x.short);
  }))), /*#__PURE__*/React.createElement(Card, {
    borderTop: C.earth,
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Estimated Market Value \xB7 ", m.label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Mono, {
    size: 34,
    color: C.deep
  }, formatRM(Math.round(m.point / 1000) * 1000))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 12.5,
      color: C.mid
    }
  }, "Likely range ", rmCompact(low), " \u2013 ", rmCompact(high)), valPerSqm && /*#__PURE__*/React.createElement(Mono, {
    size: 12,
    color: C.earth
  }, "\u2248 RM ", valPerSqm.toLocaleString(), "/m\xB2")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 46,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 0,
      right: 0,
      height: 4,
      background: C.cream,
      borderRadius: 2,
      border: `1px solid ${C.border}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 19,
      height: 6,
      borderRadius: 3,
      left: pct(low) + '%',
      width: pct(high) - pct(low) + '%',
      background: C.earth + '55',
      border: `1px solid ${C.earth}`,
      transition: 'left .35s, width .35s'
    }
  }), models.map((x, i) => i !== modelIdx && /*#__PURE__*/React.createElement("div", {
    key: x.label,
    style: {
      position: 'absolute',
      top: 16,
      width: 2,
      height: 12,
      left: pct(x.point) + '%',
      background: C.muted,
      transform: 'translateX(-50%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: pct(m.point) + '%',
      transform: 'translateX(-50%)',
      transition: 'left .35s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: C.earth,
      border: `2px solid ${C.raised}`,
      boxShadow: '0 2px 6px rgba(44,57,48,.3)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      color: C.muted
    }
  }, rmCompact(dLow)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10,
      color: C.muted
    }
  }, rmCompact(dHigh))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: `1px solid ${C.border}`,
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      fontSize: 9.5,
      whiteSpace: 'nowrap'
    }
  }, "Confidence"), /*#__PURE__*/React.createElement(Mono, {
    size: 15,
    color: C.up
  }, m.conf, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      fontSize: 9.5,
      whiteSpace: 'nowrap'
    }
  }, "MAE"), /*#__PURE__*/React.createElement(Mono, {
    size: 15
  }, m.mae)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      fontSize: 9.5,
      whiteSpace: 'nowrap'
    }
  }, "vs median"), /*#__PURE__*/React.createElement(Mono, {
    size: 15,
    color: m.point >= data.median ? C.up : C.down
  }, (m.point >= data.median ? '+' : '') + ((m.point / data.median - 1) * 100).toFixed(1), "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 11.5,
      color: C.mid,
      lineHeight: 1.45,
      fontStyle: 'italic'
    }
  }, m.note))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "val-stats",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Median price",
    value: rmCompact(data.median),
    sub: `${data.count} sales`
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Median RM/m\xB2",
    value: data.ppsm ? 'RM ' + data.ppsm.toLocaleString() : '—',
    sub: "built-up"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Median built-up",
    value: data.medFloor ? data.medFloor + ' m²' : '—',
    sub: data.medLand ? data.medLand + ' m² land' : 'strata'
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Trend \u201921\u2192\u201926",
    value: (trendUp ? '+' : '') + (data.trendTotal || 0).toFixed(1) + '%',
    accent: trendUp ? C.up : C.down,
    sub: data.fhPct + '% freehold'
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 16,
    weight: 500
  }, "Average price by property type"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'grid',
      gap: 9
    }
  }, data.byType.map(t => {
    const dom = data.dominant && t.type === data.dominant.type;
    return /*#__PURE__*/React.createElement("div", {
      key: t.type,
      style: {
        display: 'grid',
        gridTemplateColumns: '128px 1fr 118px',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 12.5,
        color: dom ? C.earth : C.deep,
        fontWeight: dom ? 600 : 400,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, shortType(t.type)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 14,
        background: C.cream,
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${C.border}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: t.avg / maxTypeAvg * 100 + '%',
        height: '100%',
        background: dom ? C.earth : C.light,
        transition: 'width .8s cubic-bezier(.16,1,.3,1)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Mono, {
      size: 12
    }, rmCompact(t.avg)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 10.5,
        color: C.muted
      }
    }, " \xB7 ", t.n)));
  }))), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 16,
    weight: 500
  }, "Average transacted price by year"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 11.5,
      color: C.mid
    }
  }, "bar = avg price \xB7 \u25CF = volume")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 14,
      height: 118
    }
  }, data.yearAvg.map(y => {
    const h = 18 + (y.avg - minYear) / (maxYear - minYear || 1) * 74;
    return /*#__PURE__*/React.createElement("div", {
      key: y.y,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Mono, {
      size: 10,
      color: C.mid
    }, rmCompact(y.avg)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 46,
        height: h,
        background: `linear-gradient(180deg, ${C.light}, ${C.deep})`,
        borderRadius: '5px 5px 0 0',
        transition: 'height .8s cubic-bezier(.16,1,.3,1)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: C.earth,
        opacity: 0.35 + 0.65 * (y.n / maxVol),
        display: 'inline-block'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 10,
        color: C.muted
      }
    }, y.n)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 11,
        color: C.mid
      }
    }, y.y));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 11,
      color: C.muted,
      fontStyle: 'italic'
    }
  }, "Indicative AVM estimate based on NAPIC 2021\u20132026 comparable transactions. Areas in sq.m. Not a formal valuation."))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(237,233,225,.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tmap-spin",
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: `2px solid ${C.border}`,
      borderTopColor: C.earth,
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 13,
      color: C.mid
    }
  }, "Computing valuation\u2026")), /*#__PURE__*/React.createElement("style", null, `
        @media (max-width: 880px) {
          .val-grid { grid-template-columns: 1fr !important; }
          .val-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `));
};
Object.assign(window, {
  ValuationDashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ValuationDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ValuationPage.jsx
try { (() => {
/* eslint-disable no-undef */
const DISTRICT_PRICES = [{
  name: 'Petaling',
  price: 620
}, {
  name: 'Hulu Langat',
  price: 470
}, {
  name: 'Klang',
  price: 380
}, {
  name: 'Gombak',
  price: 540
}, {
  name: 'Sepang',
  price: 420
}, {
  name: 'Kuala Selangor',
  price: 310
}];
const MAX = 700;
const FACTORS = [{
  name: 'Built-up area',
  weight: 0.34
}, {
  name: 'District median',
  weight: 0.27
}, {
  name: 'Property type',
  weight: 0.18
}, {
  name: 'Tenure',
  weight: 0.12
}, {
  name: 'Age of property',
  weight: 0.09
}];
const ValuationPage = ({
  ctx
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    gap: 20
  }
}, /*#__PURE__*/React.createElement(Card, {
  style: {
    padding: 28
  }
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Property Details"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    display: 'grid',
    gap: 12
  }
}, Object.entries({
  State: ctx.state,
  District: ctx.district,
  'Property Type': ctx.type,
  Tenure: ctx.tenure,
  'Built-Up': `${ctx.built} sq ft`,
  'Land Area': `${ctx.land} sq ft`,
  'Age': `${ctx.age} years`
}).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
  key: k,
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.mid
  }
}, k), /*#__PURE__*/React.createElement("span", {
  style: {
    color: C.deep,
    fontWeight: 500
  }
}, v)))), /*#__PURE__*/React.createElement(Eyebrow, {
  style: {
    marginTop: 26
  }
}, "Model"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 6,
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Pill, {
  active: true
}, "Hedonic"), /*#__PURE__*/React.createElement(Pill, null, "Gradient Boost"), /*#__PURE__*/React.createElement(Pill, null, "Ensemble")), /*#__PURE__*/React.createElement(Button, {
  style: {
    marginTop: 24,
    width: '100%'
  }
}, "Re-estimate")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 14
  }
}, /*#__PURE__*/React.createElement(Card, {
  borderTop: C.down
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Lower Bound"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 24
}, "RM 380,000")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 11,
  color: C.mid
}, "\u221215.6%"))), /*#__PURE__*/React.createElement(Card, {
  borderTop: C.earth
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Central Estimate"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 24
}, "RM 450,000")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 11,
  color: C.mid
}, "\xB10.0%"))), /*#__PURE__*/React.createElement(Card, {
  borderTop: C.up
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Upper Bound"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 8
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 24
}, "RM 540,000")), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement(Mono, {
  size: 11,
  color: C.mid
}, "+20.0%")))), /*#__PURE__*/React.createElement(Card, {
  style: {
    padding: 24
  }
}, /*#__PURE__*/React.createElement(Display, {
  size: 20,
  weight: 500
}, "Median Prices by District \u2014 ", ctx.state), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 18,
    display: 'grid',
    gap: 10
  }
}, DISTRICT_PRICES.map(d => {
  const isActive = d.name === ctx.district;
  return /*#__PURE__*/React.createElement("div", {
    key: d.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 80px',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13,
      color: isActive ? C.earth : C.mid,
      fontWeight: isActive ? 600 : 400
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18,
      background: C.cream,
      borderRadius: 4,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${d.price / MAX * 100}%`,
      height: '100%',
      background: isActive ? C.earth : C.mid,
      transition: 'width 1s'
    }
  })), /*#__PURE__*/React.createElement(Mono, {
    size: 13,
    style: {
      textAlign: 'right'
    }
  }, "RM ", d.price, "k"));
})), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: `1px dashed ${C.earth}80`,
    display: 'flex',
    justifyContent: 'space-between'
  }
}, /*#__PURE__*/React.createElement(Eyebrow, null, "Your central estimate"), /*#__PURE__*/React.createElement(Mono, {
  size: 14,
  color: C.earth
}, "RM 450k"))), /*#__PURE__*/React.createElement(Card, {
  style: {
    padding: 24
  }
}, /*#__PURE__*/React.createElement(Display, {
  size: 20,
  weight: 500
}, "Contributing Factors"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 16,
    display: 'grid',
    gap: 8
  }
}, FACTORS.map(f => /*#__PURE__*/React.createElement("div", {
  key: f.name,
  style: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr 50px',
    alignItems: 'center',
    gap: 12
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: C.deep
  }
}, f.name), /*#__PURE__*/React.createElement("div", {
  style: {
    height: 6,
    background: C.cream,
    borderRadius: 3,
    overflow: 'hidden'
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: `${f.weight * 100}%`,
    height: '100%',
    background: C.earth
  }
})), /*#__PURE__*/React.createElement(Mono, {
  size: 12,
  color: C.mid,
  style: {
    textAlign: 'right'
  }
}, (f.weight * 100).toFixed(0), "%")))), /*#__PURE__*/React.createElement("div", {
  className: "fineprint",
  style: {
    marginTop: 18,
    fontSize: 11,
    color: C.muted,
    fontStyle: 'italic'
  }
}, "Estimates are indicative and based on NAPIC 2021\u20132025 transaction data. Not a formal valuation."))));
Object.assign(window, {
  ValuationPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ValuationPage.jsx", error: String((e && e.message) || e) }); }

})();
