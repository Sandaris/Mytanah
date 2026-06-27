/* CombinedMap.jsx — the "All" map scope: Malaysia + Singapore on one canvas in
   their true relative positions. It's a launcher — clicking a country drills the
   page into that country's cascade. Singapore is tinted so it reads as its own
   cluster at the southern tip of the peninsula. Same line-art-on-parchment look,
   zoom/pan, and hover tooltips as the single-country maps. */
import { useEffect, useRef, useState, useCallback } from 'react'
import { C } from '@/lib/colors'
import { boxToView } from '@/lib/malaysiaGeo'

const CombinedMap = ({ geo, onPick }) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // feature index
  const [hoverCountry, setHoverCountry] = useState(null); // 'MY' | 'SG' (whole-country highlight)
  const [tip, setTip] = useState(null);

  // Default frame: West Malaysia + Singapore (East Malaysia visible on zoom-out).
  const target = boxToView(geo.primaryBox, 0.08);

  const [vb, setVbState] = useState(target);
  const vbRef = useRef(vb);
  const rafRef = useRef(null);
  const setVb = useCallback((upd) => {
    const next = typeof upd === 'function' ? upd(vbRef.current) : upd;
    vbRef.current = next; setVbState(next);
  }, []);

  const animateTo = useCallback((to) => {
    cancelAnimationFrame(rafRef.current);
    const from = vbRef.current;
    const start = performance.now();
    const dur = 680;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const e = ease(t);
      setVb({
        x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e,
        w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e,
      });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [setVb]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setVb(target); }, []);

  const strokeW = (vb.w / geo.W);

  // zoom
  const Z_MIN = geo.W * 0.02, Z_MAX = geo.W * 2.2;
  const fitScale = (rect, w, h) => Math.min(rect.width / w, rect.height / h);
  const zoomAt = useCallback((cx, cy, factor) => {
    cancelAnimationFrame(rafRef.current);
    const rect = svgRef.current.getBoundingClientRect();
    setVb(v => {
      const nw = Math.max(Z_MIN, Math.min(Z_MAX, v.w * factor));
      const nh = nw * (v.h / v.w);
      const s = fitScale(rect, v.w, v.h);
      const offX = (rect.width - v.w * s) / 2, offY = (rect.height - v.h * s) / 2;
      const wx = v.x + (cx - offX) / s, wy = v.y + (cy - offY) / s;
      const ns = fitScale(rect, nw, nh);
      const noffX = (rect.width - nw * ns) / 2, noffY = (rect.height - nh * ns) / 2;
      return { x: wx - (cx - noffX) / ns, y: wy - (cy - noffY) / ns, w: nw, h: nh };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVb]);
  const centerZoom = (factor) => {
    const rect = svgRef.current.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, factor);
  };

  useEffect(() => {
    const el = svgRef.current; if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 1.12 : 1 / 1.12);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt]);

  // drag to pan
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x, dy = e.clientY - dragRef.current.y;
    if (!movedRef.current && Math.hypot(dx, dy) < 4) return;
    movedRef.current = true;
    dragRef.current = { x: e.clientX, y: e.clientY };
    cancelAnimationFrame(rafRef.current);
    const rect = svgRef.current.getBoundingClientRect();
    setVb(v => {
      const s = fitScale(rect, v.w, v.h);
      return { ...v, x: v.x - dx / s, y: v.y - dy / s };
    });
  };
  const endDrag = () => {
    if (movedRef.current) {
      suppressClickRef.current = true;
      setTimeout(() => { suppressClickRef.current = false; }, 60);
    }
    dragRef.current = null;
  };

  const move = useCallback((e, label) => {
    const rect = wrapRef.current.getBoundingClientRect();
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label });
  }, []);

  const fitCountry = (country) => animateTo(boxToView(geo.byCountry[country], 0.12));

  return (
    <div ref={wrapRef} style={{
      position: 'relative', width: '100%', height: '100%',
      cursor: dragRef.current ? 'grabbing' : 'grab', touchAction: 'none',
      backgroundColor: C.cream,
      backgroundImage: [
        `linear-gradient(to right, ${C.deep}12 1px, transparent 1px)`,
        `linear-gradient(to bottom, ${C.deep}12 1px, transparent 1px)`,
        `radial-gradient(120% 90% at 50% 44%, ${C.raised} 0%, rgba(237,233,225,0) 60%)`,
      ].join(', '),
      backgroundSize: '64px 64px, 64px 64px, 100% 100%',
      backgroundPosition: 'center, center, center',
    }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onMouseLeave={() => { setHover(null); setHoverCountry(null); setTip(null); endDrag(); }}>
      <svg ref={svgRef} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} width="100%" height="100%"
        style={{ display: 'block', background: 'transparent' }}
        preserveAspectRatio="xMidYMid meet">
        <g>
          {geo.features.map((f, i) => {
            const isSG = f.country === 'SG';
            const hot = hover === i || hoverCountry === f.country;
            // Singapore tinted by default so it reads as its own cluster.
            const baseFill = isSG ? C.earthFaint : C.cream;
            const fill = hot ? C.earth + (isSG ? '44' : '22') : baseFill;
            const stroke = hot ? C.earth : (isSG ? C.earth + '99' : C.mid);
            return (
              <path key={f.country + i} d={f.d}
                fill={fill} stroke={stroke}
                strokeWidth={(hot ? 1.3 : isSG ? 0.9 : 0.7) * strokeW}
                strokeLinejoin="round"
                style={{ cursor: 'pointer', transition: 'fill .15s, stroke .15s' }}
                onMouseEnter={(e) => { setHover(i); move(e, `${f.name} · ${isSG ? 'Singapore' : 'Malaysia'}`); }}
                onMouseMove={(e) => move(e, `${f.name} · ${isSG ? 'Singapore' : 'Malaysia'}`)}
                onMouseLeave={() => { setHover(null); setTip(null); }}
                onClick={() => {
                  if (suppressClickRef.current) return;
                  onPick(isSG ? { country: 'SG' } : { country: 'MY', state: f.group });
                }}/>
            );
          })}
        </g>
      </svg>

      {tip && (
        <div style={{
          position: 'absolute', left: tip.x + 14, top: tip.y + 12,
          background: C.deep, color: C.cream, padding: '5px 10px',
          borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          fontWeight: 500, pointerEvents: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(44,57,48,.28)', zIndex: 5,
        }}>{tip.label}</div>
      )}

      {/* country launcher chips */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center',
        background: C.cream, padding: '7px 10px', borderRadius: 9999,
        border: `1px solid ${C.border}`, boxShadow: '0 3px 12px rgba(44,57,48,.14)', zIndex: 6,
        maxWidth: 'calc(100% - 32px)',
      }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.mid, paddingLeft: 4 }}>
          Click a country:
        </span>
        {[['MY', '🇲🇾 Malaysia'], ['SG', '🇸🇬 Singapore']].map(([code, label]) => (
          <button key={code}
            onMouseEnter={() => setHoverCountry(code)}
            onMouseLeave={() => setHoverCountry(null)}
            onClick={() => onPick(code === 'SG' ? { country: 'SG' } : { country: 'MY' })}
            style={{
              border: `1px solid ${C.border}`, borderRadius: 9999, padding: '6px 13px',
              background: C.raised, color: C.deep,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', transition: 'background .18s',
            }}>{label}</button>
        ))}
      </div>

      {/* zoom controls */}
      <div style={{ position: 'absolute', right: 16, bottom: 52, zIndex: 6,
        display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ZoomBtn label="Zoom in" onClick={() => centerZoom(1 / 1.3)}>
          <line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/>
        </ZoomBtn>
        <ZoomBtn label="Zoom out" onClick={() => centerZoom(1.3)}>
          <line x1="6" y1="12" x2="18" y2="12"/>
        </ZoomBtn>
        <ZoomBtn label="Fit Malaysia + Singapore" onClick={() => animateTo(target)}>
          <path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 8 7 8"/>
        </ZoomBtn>
      </div>

      <div style={{
        position: 'absolute', bottom: 14, right: 16,
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.mid,
        background: 'rgba(237,233,225,.82)', padding: '5px 11px', borderRadius: 7,
        pointerEvents: 'none', border: `1px solid ${C.border}`,
      }}>
        Malaysia + Singapore · click a country to start · scroll to zoom · drag to pan
      </div>
    </div>
  );
};

const ZoomBtn = ({ children, onClick, label }) => (
  <button onClick={onClick} title={label} aria-label={label} style={{
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: C.cream, border: `1px solid ${C.border}`, borderRadius: 9,
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,57,48,.14)', color: C.deep,
  }}
    onMouseEnter={e => e.currentTarget.style.background = C.raised}
    onMouseLeave={e => e.currentTarget.style.background = C.cream}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </button>
);

export default CombinedMap
