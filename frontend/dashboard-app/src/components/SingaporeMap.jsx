/* SingaporeMap.jsx — interactive SVG choropleth of Singapore's planning areas.
   Mirrors MalaysiaMap's look (line-art on parchment, zoom/pan, hover tips) but
   simpler: there is no sea layer and no west/east split. Picking a region zooms
   to it and highlights its planning areas; clicking an area selects its region.
   The precise postal-district + locality choice happens in the dropdowns — the
   map gives spatial context and a quick region jump. */
import { useEffect, useRef, useState, useCallback } from 'react'
import { C } from '@/lib/colors'
import { boxToView } from '@/lib/malaysiaGeo'

const SingaporeMap = ({ geo, selectedRegion, onSelectRegion }) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [hoverArea, setHoverArea] = useState(null);
  const [tip, setTip] = useState(null);

  const target = selectedRegion && geo.regions[selectedRegion]
    ? boxToView(geo.regions[selectedRegion], 0.22)
    : boxToView(geo.fullBox, 0.06);

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

  useEffect(() => {
    animateTo(target);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.w, target.h]);

  const strokeW = (vb.w / geo.W);

  // zoom (cursor-anchored)
  const Z_MIN = geo.W * 0.05, Z_MAX = geo.W * 2.2;
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
      onMouseLeave={() => { setHoverArea(null); setTip(null); endDrag(); }}>
      <svg ref={svgRef} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} width="100%" height="100%"
        style={{ display: 'block', background: 'transparent' }}
        preserveAspectRatio="xMidYMid meet">
        <g>
          {geo.areas.map(a => {
            const inRegion = selectedRegion && a.region === selectedRegion;
            const isHov = a.name === hoverArea;
            const dim = selectedRegion && !inRegion;
            let fill, stroke;
            if (inRegion) { fill = isHov ? C.earth + '33' : C.earthFaint; stroke = C.earth; }
            else if (dim) { fill = C.cream; stroke = C.border; }
            else { fill = isHov ? C.earthFaint : C.cream; stroke = isHov ? C.earth : C.mid; }
            return (
              <path key={a.name} d={a.d}
                fill={fill} stroke={stroke}
                strokeWidth={(inRegion ? 1.1 : isHov ? 1.3 : 0.8) * strokeW}
                strokeLinejoin="round"
                opacity={dim ? 0.5 : 1}
                style={{ cursor: 'pointer', transition: 'fill .18s, stroke .18s' }}
                onMouseEnter={(e) => { setHoverArea(a.name); move(e, `${a.name} · ${a.region}`); }}
                onMouseMove={(e) => move(e, `${a.name} · ${a.region}`)}
                onMouseLeave={() => { setHoverArea(null); setTip(null); }}
                onClick={() => { if (!suppressClickRef.current) onSelectRegion(a.region); }}/>
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

      {/* region pills */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 4, background: C.cream, padding: 4,
        borderRadius: 9999, border: `1px solid ${C.border}`, maxWidth: 'calc(100% - 32px)',
        flexWrap: 'wrap', justifyContent: 'center',
        boxShadow: '0 3px 12px rgba(44,57,48,.14)', zIndex: 6,
      }}>
        {geo.regionNames.map(r => (
          <button key={r} onClick={() => onSelectRegion(selectedRegion === r ? null : r)} style={{
            border: 0, borderRadius: 9999, padding: '7px 14px',
            background: selectedRegion === r ? C.deep : 'transparent',
            color: selectedRegion === r ? C.cream : C.mid,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600,
            cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
          }}>{r}</button>
        ))}
      </div>

      {selectedRegion && (
        <button onClick={() => onSelectRegion(null)} style={{
          position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6,
          background: C.cream, border: `1px solid ${C.border}`, color: C.deep,
          borderRadius: 9999, padding: '9px 16px', fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 3px 12px rgba(44,57,48,.16)', zIndex: 6,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All of Singapore
        </button>
      )}

      {/* zoom controls */}
      <div style={{ position: 'absolute', right: 16, bottom: 52, zIndex: 6,
        display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ZoomBtn label="Zoom in" onClick={() => centerZoom(1 / 1.3)}>
          <line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/>
        </ZoomBtn>
        <ZoomBtn label="Zoom out" onClick={() => centerZoom(1.3)}>
          <line x1="6" y1="12" x2="18" y2="12"/>
        </ZoomBtn>
        <ZoomBtn label="Reset view" onClick={() => animateTo(target)}>
          <path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 8 7 8"/>
        </ZoomBtn>
      </div>

      <div style={{
        position: 'absolute', bottom: 14, right: 16,
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.mid,
        background: 'rgba(237,233,225,.82)', padding: '5px 11px', borderRadius: 7,
        pointerEvents: 'none', border: `1px solid ${C.border}`,
      }}>
        {selectedRegion
          ? `${selectedRegion} Region · click an area · scroll to zoom · drag to pan`
          : 'Singapore · click a planning area · scroll to zoom · drag to pan'}
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

export default SingaporeMap
