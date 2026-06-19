/* eslint-disable no-undef */
const C = {
  cream: '#DCD7C9', raised: '#EDE9E1', border: '#C8C3B8', muted: '#B0AA9E',
  deep: '#2C3930', mid: '#3F4F44', light: '#5C7065',
  earth: '#A27B5C', earthLight: '#C49A7A', earthFaint: '#A27B5C20',
  up: '#2D7A4F', stable: '#8B6914', down: '#A63228',
};

const Eyebrow = ({ children, style }) => (
  <div style={{
    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.14em', color: C.earth,
    ...style,
  }}>{children}</div>
);

const Card = ({ children, style, borderTop }) => (
  <div style={{
    background: C.raised, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 20, boxShadow: '0 2px 6px rgba(44,57,48,.08)',
    borderTop: borderTop ? `3px solid ${borderTop}` : undefined,
    transition: 'box-shadow .2s, transform .2s',
    ...style,
  }}>{children}</div>
);

const Button = ({ children, onClick, variant = 'primary', style }) => {
  const styles = {
    primary: { background: C.deep, color: C.cream },
    cta:     { background: C.earth, color: C.cream },
    ghost:   { background: 'transparent', color: C.deep, border: `1px solid ${C.border}` },
  }[variant];
  return (
    <button onClick={onClick} style={{
      border: 0, borderRadius: 8, padding: '12px 22px',
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
      cursor: 'pointer', letterSpacing: '.01em', transition: 'background .2s',
      ...styles, ...style,
    }}>{children}</button>
  );
};

const Field = ({ label, children }) => (
  <label style={{ display: 'block' }}>
    <Eyebrow style={{ marginBottom: 6 }}>{label}</Eyebrow>
    {children}
  </label>
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{
    width: '100%', background: C.cream, border: `1px solid ${C.earth}40`,
    color: C.deep, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23${C.deep.slice(1)}' stroke-width='1.5'><polyline points='4 6 8 10 12 6'/></svg>")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Pill = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    border: `1px solid ${active ? C.deep : C.border}`,
    background: active ? C.deep : C.cream,
    color: active ? C.cream : C.deep,
    borderRadius: 9999, padding: '8px 14px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
    cursor: 'pointer', transition: 'all .15s',
  }}>{children}</button>
);

const Mono = ({ children, size = 18, color = C.deep, weight = 500, style }) => (
  <span style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: size,
    color, fontWeight: weight, fontFeatureSettings: "'tnum'", ...style,
  }}>{children}</span>
);

const Display = ({ children, size = 28, weight = 500, color = C.deep, style }) => (
  <span style={{
    fontFamily: "'Cormorant Garamond', serif", fontSize: size,
    fontWeight: weight, color, lineHeight: 1.05, letterSpacing: '-0.01em',
    ...style,
  }}>{children}</span>
);

Object.assign(window, { C, Eyebrow, Card, Button, Field, Select, Pill, Mono, Display });
