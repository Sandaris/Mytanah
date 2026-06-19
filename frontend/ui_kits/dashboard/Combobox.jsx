/* eslint-disable no-undef */
/* Combobox.jsx — a searchable single-select. Looks like the native styled
   <select> used elsewhere, but opening it reveals a search field that
   type-to-filters the options. The dropdown is rendered position:fixed
   (anchored to the trigger's rect) so it never gets clipped by the
   floating panel's / bottom sheet's overflow. */
const Combobox = ({ value, placeholder, options, onChange, disabled, size = 'sm' }) => {
  const { useState, useRef, useEffect, useLayoutEffect } = React;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [rect, setRect] = useState(null);
  const [hi, setHi] = useState(0);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const inputRef = useRef(null);

  const lg = size === 'lg';
  const filtered = options.filter(o => o.toLowerCase().includes(q.trim().toLowerCase()));

  const place = () => { if (btnRef.current) setRect(btnRef.current.getBoundingClientRect()); };
  const openIt = () => { if (disabled) return; place(); setQ(''); setHi(0); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
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

  useLayoutEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const pick = (o) => { onChange(o); setOpen(false); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[hi]) pick(filtered[hi]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <React.Fragment>
      <button ref={btnRef} type="button" onClick={() => (open ? setOpen(false) : openIt())}
        disabled={disabled}
        style={{
          width: '100%', boxSizing: 'border-box', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          background: disabled ? C.cream + '80' : C.cream,
          border: `1px solid ${disabled ? C.border : (open ? C.earth : C.earth + '55')}`,
          color: disabled ? C.muted : (value ? C.deep : C.muted),
          fontFamily: "'DM Sans', sans-serif", fontSize: lg ? 15 : 14,
          borderRadius: lg ? 9 : 8, padding: lg ? '13px 15px' : '10px 12px',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1,
        }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.deep}
          strokeWidth="1.5" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <polyline points="4 6 8 10 12 6"/>
        </svg>
      </button>

      {open && rect && (
        <div ref={popRef} style={{
          position: 'fixed', zIndex: 9999,
          top: rect.bottom + 5, left: rect.left,
          width: Math.max(rect.width, 230),
          background: C.raised, border: `1px solid ${C.border}`, borderRadius: 10,
          boxShadow: '0 14px 40px rgba(44,57,48,.26)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', maxHeight: 320,
          animation: 'tmapPop .14s ease-out',
        }}>
          <div style={{ padding: 9, borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.muted}
              strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 19, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setHi(0); }} onKeyDown={onKey}
              placeholder="Search…" style={{
                width: '100%', boxSizing: 'border-box', padding: '9px 11px 9px 32px',
                border: `1px solid ${C.earth}40`, borderRadius: 7, background: C.cream,
                fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.deep, outline: 'none',
              }}/>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '16px 14px', fontFamily: "'DM Sans',sans-serif",
                fontSize: 13, color: C.muted, textAlign: 'center' }}>No matches</div>
            ) : filtered.map((o, i) => (
              <div key={o} onMouseEnter={() => setHi(i)} onClick={() => pick(o)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                  color: o === value ? C.cream : C.deep,
                  background: o === value ? C.deep : (i === hi ? C.cream : 'transparent'),
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o}</span>
                {o === value && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Object.assign(window, { Combobox });
