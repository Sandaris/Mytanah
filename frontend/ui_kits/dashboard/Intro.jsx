/* eslint-disable no-undef */
/* Intro.jsx — d3 line-art globe that, on "Begin", unrolls from an
   orthographic globe into an equirectangular map (the "globe to map
   transform"), simultaneously diving into peninsular Malaysia while the
   palette crossfades from night sky to parchment. It hands straight off
   to the dashboard's wireframe Malaysia location map, so the line aesthetic
   is continuous from globe → flat map → location search. */
const { useEffect, useRef, useState } = React;

const KL_LAT = 3.14, KL_LNG = 101.69;

/* ---- small math helpers ---------------------------------------------- */
const clamp = (t, a = 0, b = 1) => (t < a ? a : t > b ? b : t);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeInCubic = t => t * t * t;
const smooth = t => t * t * (3 - 2 * t);
function hexLerp(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  return `rgb(${Math.round(lerp(pa[0], pb[0], t))},${Math.round(lerp(pa[1], pb[1], t))},${Math.round(lerp(pa[2], pb[2], t))})`;
}

/* ---- the zip's raw-projection interpolator --------------------------- */
function interpolateProjection(raw0, raw1) {
  const mutate = d3.geoProjectionMutator(t => (x, y) => {
    const [x0, y0] = raw0(x, y);
    const [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign(mutate(t), {
    alpha(_) { return arguments.length ? mutate((t = +_)) : t; },
  });
}

const Intro = ({ onDone }) => {
  const stageRef = useRef(null);   // wraps the svg + stars
  const svgRef = useRef(null);
  const starRef = useRef(null);
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const startFnRef = useRef(null);
  const phaseRef = useRef('idle'); // idle | flying | done
  const [, force] = useState(0);
  const doneFiredRef = useRef(false);

  // warm the Malaysia geo cache so the location map is ready at hand-off
  useEffect(() => { if (window.loadMalaysiaGeo) window.loadMalaysiaGeo().catch(() => {}); }, []);

  useEffect(() => {
    if (!window.d3) { console.error('d3 missing'); return; }
    const svg = d3.select(svgRef.current);
    const stars = starRef.current;
    const sctx = stars.getContext('2d');

    let W = 0, H = 0, R0 = 1;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    /* persistent SVG nodes — one path each, updated every frame */
    const gGrid = svg.append('path').attr('fill', 'none');
    const gLand = svg.append('path').attr('fill', 'none').attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round');
    const gEdge = svg.append('circle').attr('fill', 'none');

    let land = null;             // single MultiPolygon feature
    // graticule split into meridians / parallels so we can drop the meridian
    // that projects dead-straight through the globe's centre (the artefact the
    // brief flagged). Restored to a full grid once the map is flat.
    const _gratLines = d3.geoGraticule().step([10, 10]).lines();
    const meridians = _gratLines.filter(l => l.coordinates[0][0] === l.coordinates[1][0]);
    const parallels = _gratLines.filter(l => l.coordinates[0][1] === l.coordinates[1][1]);
    const angDist = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180);
    function gratFeature(s) {
      // while still a globe, hide the front + back centre meridians
      if (s.alpha < 0.55) {
        const cl = -s.rot[0];
        const keep = meridians.filter(m => {
          const lng = m.coordinates[0][0];
          return angDist(lng, cl) > 7 && angDist(lng, cl + 180) > 7;
        });
        return { type: 'MultiLineString', coordinates: parallels.map(l => l.coordinates).concat(keep.map(m => m.coordinates)) };
      }
      return { type: 'MultiLineString', coordinates: _gratLines.map(l => l.coordinates) };
    };

    /* stars — drawn once per resize, faded out as the sky warms */
    function drawStars() {
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, stars.width, stars.height);
      const n = Math.round((W * H) / 5200);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * stars.width, y = Math.random() * stars.height;
        const r = Math.random() < 0.85 ? Math.random() * 0.9 * dpr : (0.9 + Math.random() * 1.2) * dpr;
        const a = 0.25 + Math.random() * 0.55;
        sctx.beginPath();
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fillStyle = Math.random() < 0.12 ? `rgba(196,154,122,${a})` : `rgba(237,233,225,${a})`;
        sctx.fill();
      }
    }

    function resize() {
      const el = svgRef.current;
      W = el.clientWidth; H = el.clientHeight;
      R0 = Math.min(W, H) * 0.42;
      stars.width = Math.round(W * dpr); stars.height = Math.round(H * dpr);
      drawStars();
      render(stateAt());
    }

    /* idle spin state */
    let spin = -KL_LNG - 12;        // longitude rotation
    const tilt = -8;                // small latitude tilt
    let startRot = [spin, tilt];    // captured when the dive begins
    let p = 0;                      // flight progress 0..1

    function stateAt() {
      if (phaseRef.current === 'idle') {
        return { alpha: 0, scale: R0, rot: [spin, tilt], colorT: 0, starsA: 1 };
      }
      const alpha   = easeInOut(clamp(p / 0.55));
      const rotT    = easeInOut(clamp(p / 0.62));
      const zoomT   = easeInCubic(clamp((p - 0.42) / 0.58));
      const colorT  = smooth(clamp((p - 0.22) / 0.62));
      const scale   = R0 * Math.pow(12, zoomT);
      const rot = [lerp(startRot[0], -KL_LNG, rotT), lerp(startRot[1], -KL_LAT, rotT)];
      return { alpha, scale, rot, colorT, starsA: 1 - smooth(clamp((p - 0.1) / 0.45)) };
    }

    function render(s) {
      if (!W) return;
      const proj = interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
        .scale(s.scale).translate([W / 2, H / 2]).rotate(s.rot).precision(0.4);
      proj.alpha(s.alpha);
      const path = d3.geoPath(proj);

      // palette crossfade: night sky → parchment, cream lines → forest lines
      const t = s.colorT;
      bgRef.current.style.background = hexLerp('#0a0e0c', '#DCD7C9', t);
      stars.style.opacity = String(s.starsA);

      gGrid.attr('d', path(gratFeature(s)) || '')
        .attr('stroke', hexLerp('#DCD7C9', '#2C3930', t))
        .attr('stroke-width', 0.8)
        .attr('opacity', lerp(0.17, 0.10, t));

      if (land) {
        gLand.attr('d', path(land) || '')
          .attr('stroke', hexLerp('#C49A7A', '#3F4F44', t))
          .attr('stroke-width', lerp(1.0, 1.2, t))
          .attr('opacity', lerp(0.6, 0.92, t));
      }

      // globe limb — drawn as a true circle (the mutator projection can't render
      // a clean Sphere outline; it degenerates to a vertical line). Radius = the
      // orthographic scale; it expands and fades out as the globe flattens.
      gEdge.attr('cx', W / 2).attr('cy', H / 2).attr('r', s.scale)
        .attr('stroke', hexLerp('#DCD7C9', '#C8C3B8', t))
        .attr('stroke-width', 1.2)
        .attr('opacity', lerp(0.85, 0, clamp(s.alpha * 2.2)));

    }

    /* load the world silhouette (single land feature → one path node) */
    fetch('https://unpkg.com/world-atlas@2/land-110m.json')
      .then(r => r.json())
      .then(topo => { land = window.topojson.feature(topo, topo.objects.land); render(stateAt()); })
      .catch(err => console.warn('land load failed', err));

    resize();
    window.addEventListener('resize', resize);

    /* ---- idle spin loop ---- */
    let raf, last = performance.now();
    const idle = (now) => {
      const dt = (now - last) / 1000; last = now;
      if (phaseRef.current === 'idle') {
        spin += dt * 4.0;            // gentle eastward drift
        render(stateAt());
        raf = requestAnimationFrame(idle);
      }
    };
    raf = requestAnimationFrame(idle);

    /* ---- the dive: globe unrolls into the Malaysia map ---- */
    function startFlight() {
      if (phaseRef.current !== 'idle') return;
      phaseRef.current = 'flying';
      cancelAnimationFrame(raf);
      startRot = [spin, tilt];
      if (heroRef.current) heroRef.current.classList.add('fade-out');
      const dur = 2900, t0 = performance.now();
      const fly = (now) => {
        p = clamp((now - t0) / dur);
        render(stateAt());
        if (p < 1) { raf = requestAnimationFrame(fly); }
        else if (!doneFiredRef.current) {
          doneFiredRef.current = true;
          phaseRef.current = 'done';
          onDone && onDone();
        }
      };
      raf = requestAnimationFrame(fly);
    }
    startFnRef.current = startFlight;

    /* drag to spin while idle */
    let drag = null;
    const dom = svgRef.current;
    const down = e => { if (phaseRef.current === 'idle') drag = { x: e.clientX, s: spin }; };
    const move = e => { if (drag) { spin = drag.s + (e.clientX - drag.x) * 0.35; render(stateAt()); } };
    const up = () => { drag = null; };
    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      dom.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      svg.selectAll('*').remove();
    };
  }, [onDone]);

  return (
    <div ref={bgRef} style={{ position: 'fixed', inset: 0, background: '#0a0e0c', zIndex: 100, overflow: 'hidden' }}>
      <div ref={stageRef} style={{ position: 'fixed', inset: 0 }}>
        <canvas ref={starRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, transition: 'opacity .2s' }}/>
        <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, cursor: 'grab', display: 'block' }}/>
      </div>

      {/* CSS meteor shower */}
      <div className="meteors" aria-hidden="true">
        <span className="meteor m1"></span><span className="meteor m2"></span>
        <span className="meteor m3"></span><span className="meteor m4"></span>
        <span className="meteor m5"></span>
      </div>

      {/* readability scrim */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 102,
        background:
          'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(10,14,12,0.72) 0%, rgba(10,14,12,0.48) 35%, rgba(10,14,12,0.16) 65%, rgba(10,14,12,0) 90%),' +
          'linear-gradient(180deg, rgba(10,14,12,0.5) 0%, rgba(10,14,12,0) 18%, rgba(10,14,12,0) 82%, rgba(10,14,12,0.6) 100%)',
      }}/>

      {/* wordmark */}
      <div style={{
        position: 'fixed', top: 28, left: 32, zIndex: 110, display: 'flex', alignItems: 'center', gap: 10,
        animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both',
      }}>
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="#A27B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 16 L16 4 L29 16"/><path d="M6 14 L6 28 L26 28 L26 14"/><path d="M13 28 L13 19 L19 19 L19 28"/>
        </svg>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#DCD7C9', fontSize: 20, fontWeight: 500 }}>MyPropertyIQ</span>
      </div>

      {/* skip */}
      <button onClick={() => onDone && onDone()} style={{
        position: 'fixed', top: 28, right: 32, zIndex: 110, background: 'transparent', color: 'rgba(220,215,201,.55)',
        border: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '.04em', cursor: 'pointer', padding: '12px 14px',
        animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#DCD7C9'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,215,201,.55)'}>Skip intro →</button>

      {/* hero */}
      <div ref={heroRef} className="intro-hero" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 105, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24,
        transition: 'opacity .7s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{
          color: '#A27B5C', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 28,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500, animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) .4s both',
        }}>Malaysian residential property intelligence</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", color: '#DCD7C9', fontWeight: 300,
          fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 1.05, margin: '0 0 16px', letterSpacing: '-0.01em',
          animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) .7s both',
        }}>
          Reading the<br/>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#C49A7A' }}>property market</em>, quarter by quarter.
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(220,215,201,.6)', margin: '0 0 56px',
          maxWidth: 460, lineHeight: 1.55, animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) 1.0s both',
        }}>
          NAPIC transaction data, sentiment derived from news and search, six housing-cycle indicators —
          distilled into three numbers per quarter.
        </p>

        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 16, alignItems: 'center', animation: 'introFadeUp 1.8s cubic-bezier(.16,1,.3,1) 1.4s both' }}>
          <button onClick={() => startFnRef.current && startFnRef.current()} style={{
            background: '#DCD7C9', color: '#2C3930', border: 0, borderRadius: 9999, padding: '14px 28px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '.02em', cursor: 'pointer',
            transition: 'background .2s, transform .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C49A7A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#DCD7C9'; e.currentTarget.style.transform = 'none'; }}>
            Begin now →
          </button>
          <button onClick={() => onDone && onDone()} style={{
            background: 'transparent', color: 'rgba(220,215,201,.55)', border: 0, fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, letterSpacing: '.04em', cursor: 'pointer', padding: '12px 14px',
          }}>Skip intro</button>
        </div>
      </div>

      {/* coordinate readout */}
      <div style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 110, fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: 'rgba(220,215,201,.4)', textAlign: 'right', lineHeight: 1.6, animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) 1.6s both',
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(220,215,201,.3)' }}>Target</div>
        <div style={{ color: '#A27B5C', fontWeight: 500 }}>4.21°&nbsp;N</div>
        <div style={{ color: '#A27B5C', fontWeight: 500 }}>101.97°&nbsp;E</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(220,215,201,.3)', marginTop: 8 }}>Federation of Malaysia</div>
      </div>

      <style>{`
        @keyframes introFade { from {opacity:0} to {opacity:1} }
        @keyframes introFadeUp { from {opacity:0; transform: translateY(12px)} to {opacity:1; transform:none} }
        .intro-hero.fade-out { opacity: 0; }

        .meteors { position: fixed; inset: 0; pointer-events: none; z-index: 101; overflow: hidden; }
        .meteor { position: absolute; width: 2px; height: 2px; background: #EDE9E1; border-radius: 9999px; box-shadow: 0 0 6px 1px #EDE9E1; opacity: 0; }
        .meteor::before { content: ''; position: absolute; top: 50%; left: 1px; transform: translateY(-50%); width: 140px; height: 1px;
          background: linear-gradient(90deg, #EDE9E1 0%, rgba(237,233,225,0.6) 30%, rgba(237,233,225,0) 100%); }
        @keyframes meteor { 0% { opacity: 0; transform: translate(0,0) rotate(-45deg); } 6% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(-1400px,1400px) rotate(-45deg); } }
        .meteor.m1 { top: -20px; left: 70%; animation: meteor 4.2s linear 2.0s infinite; }
        .meteor.m2 { top: -20px; left: 92%; animation: meteor 5.6s linear 6.5s infinite; }
        .meteor.m3 { top: 18%; left: 99%; animation: meteor 3.8s linear 10.0s infinite; background: #C49A7A; box-shadow: 0 0 6px 1px #C49A7A; }
        .meteor.m3::before { background: linear-gradient(90deg, #C49A7A 0%, rgba(196,154,122,0.6) 30%, rgba(196,154,122,0) 100%); }
        .meteor.m4 { top: -20px; left: 55%; animation: meteor 6.4s linear 14.0s infinite; }
        .meteor.m5 { top: -20px; left: 82%; animation: meteor 4.6s linear 18.5s infinite; }
      `}</style>
    </div>
  );
};

Object.assign(window, { Intro });
