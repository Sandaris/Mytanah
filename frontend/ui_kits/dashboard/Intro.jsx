/* eslint-disable no-undef */
const { useEffect, useRef, useState } = React;

const KL_LAT = 3.14;
const KL_LNG = 101.69;

const LANDMASSES = [
  { lat: 45, lng:-100, r: 22, n: 90 }, { lat: 30, lng: -95, r: 14, n: 50 },
  { lat: 60, lng:-100, r: 18, n: 60 }, { lat: 25, lng: -80, r: 10, n: 30 },
  { lat: -10, lng: -55, r: 18, n: 80 }, { lat: -30, lng: -65, r: 12, n: 45 },
  { lat: 50, lng: 10, r: 12, n: 50 }, { lat: 55, lng: 30, r: 12, n: 50 },
  { lat: 5, lng: 20, r: 18, n: 90 }, { lat: -15, lng: 25, r: 18, n: 80 },
  { lat: 25, lng: 15, r: 14, n: 60 },
  { lat: 35, lng: 90, r: 22, n: 120 }, { lat: 25, lng: 78, r: 14, n: 60 },
  { lat: 55, lng: 90, r: 22, n: 110 }, { lat: 35, lng: 130, r: 8, n: 25 },
  { lat: 3, lng: 110, r: 8, n: 40 }, { lat: -2, lng: 115, r: 8, n: 38 },
  { lat: -25, lng: 135, r: 14, n: 60 },
];

const Intro = ({ onDone }) => {
  const stageRef = useRef(null);
  const wipeRef = useRef(null);
  const heroRef = useRef(null);
  const introStartRef = useRef(null);
  const twinkleRef = useRef(null);
  const moonRef = useRef(null);
  const [phase, setPhase] = useState('idle');     // idle | zooming | wiping | reveal
  const phaseRef = useRef('idle');
  const setPhaseBoth = p => { phaseRef.current = p; setPhase(p); };
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
    const id = setTimeout(() => { onDone && onDone(); }, 3000);
    return () => clearTimeout(id);
  }, [phase, onDone]);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) { console.error('THREE missing'); return; }

    const stage = stageRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0e0c, 1);
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
    camera.position.set(0, 0.5, 4.4);

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    /* stars — multiple layers for depth */
    {
      // far layer — many small dim stars
      const N1 = 2400, geom1 = new THREE.BufferGeometry();
      const pos1 = new Float32Array(N1 * 3);
      for (let i = 0; i < N1; i++) {
        const r = 60 + Math.random() * 40;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos1[i*3] = r * Math.sin(ph) * Math.cos(th);
        pos1[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos1[i*3+2] = r * Math.cos(ph);
      }
      geom1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
      scene.add(new THREE.Points(geom1, new THREE.PointsMaterial({
        color: 0xDCD7C9, size: 0.06, transparent: true, opacity: 0.5, sizeAttenuation: true,
      })));

      // mid layer — brighter, fewer
      const N2 = 600, geom2 = new THREE.BufferGeometry();
      const pos2 = new Float32Array(N2 * 3);
      for (let i = 0; i < N2; i++) {
        const r = 30 + Math.random() * 30;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos2[i*3] = r * Math.sin(ph) * Math.cos(th);
        pos2[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos2[i*3+2] = r * Math.cos(ph);
      }
      geom2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
      const midStarsMat = new THREE.PointsMaterial({
        color: 0xEDE9E1, size: 0.16, transparent: true, opacity: 0.85, sizeAttenuation: true,
      });
      const midStars = new THREE.Points(geom2, midStarsMat);
      scene.add(midStars);
      // twinkle hook
      twinkleRef.current = midStarsMat;

      // hero / cinematic stars — a few warm earth-tone glimmers near KL hemisphere
      const N3 = 60, geom3 = new THREE.BufferGeometry();
      const pos3 = new Float32Array(N3 * 3);
      for (let i = 0; i < N3; i++) {
        const r = 20 + Math.random() * 15;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos3[i*3] = r * Math.sin(ph) * Math.cos(th);
        pos3[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos3[i*3+2] = r * Math.cos(ph);
      }
      geom3.setAttribute('position', new THREE.BufferAttribute(pos3, 3));
      scene.add(new THREE.Points(geom3, new THREE.PointsMaterial({
        color: 0xC49A7A, size: 0.22, transparent: true, opacity: 0.9, sizeAttenuation: true,
      })));
    }

    const globe = new THREE.Group();
    scene.add(globe);

    /* forest sphere */
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x2C3930 }),
    ));

    /* graticule */
    {
      const mat = new THREE.LineBasicMaterial({ color: 0xDCD7C9, transparent: true, opacity: 0.18 });
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = (90 - lat) * Math.PI / 180;
        const rr = Math.sin(phi), y = Math.cos(phi);
        const pts = [];
        for (let i = 0; i <= 96; i++) {
          const t = (i / 96) * Math.PI * 2;
          pts.push(new THREE.Vector3(rr * Math.cos(t) * 1.001, y * 1.001, rr * Math.sin(t) * 1.001));
        }
        globe.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
      }
      for (let lng = 0; lng < 360; lng += 15) {
        const t = lng * Math.PI / 180, pts = [];
        for (let i = 0; i <= 96; i++) {
          const phi = (i / 96) * Math.PI;
          pts.push(new THREE.Vector3(
            Math.sin(phi) * Math.cos(t) * 1.001,
            Math.cos(phi) * 1.001,
            Math.sin(phi) * Math.sin(t) * 1.001,
          ));
        }
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
      }
    }

    const latLngToVec = (lat, lng, r = 1.008) => {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta),
      );
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
          const lng = m.lng + (dr * Math.sin(da)) / Math.cos(m.lat * Math.PI/180);
          const v = latLngToVec(lat, lng, 1.008);
          positions.push(v.x, v.y, v.z);
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      globe.add(new THREE.Points(geom, new THREE.PointsMaterial({
        color: 0xDCD7C9, size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.7,
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
        const polys = feat.type === 'MultiPolygon'
          ? feat.coordinates
          : (feat.type === 'Polygon' ? [feat.coordinates] : []);
        // Fallback if it's a FeatureCollection-ish
        const allPolys = polys.length ? polys
          : (feat.features || []).flatMap(f =>
              f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates
              : f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : []);

        const mat = new THREE.LineBasicMaterial({
          color: 0xC49A7A, transparent: true, opacity: 0.55,
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
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide,
        uniforms: { c: { value: new THREE.Color(0xDCD7C9) } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `varying vec3 vN; uniform vec3 c; void main(){ float a = pow(0.6 - dot(vN, vec3(0,0,1.)), 2.0); gl_FragColor = vec4(c, a * 0.35); }`,
      }),
    ));

    /* marker */
    const markerGroup = new THREE.Group();
    const v = latLngToVec(KL_LAT, KL_LNG, 1.012);
    markerGroup.position.copy(v);
    markerGroup.lookAt(v.clone().multiplyScalar(2));
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.018, 0.022, 32),
      new THREE.MeshBasicMaterial({ color: 0xA27B5C, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
    );
    markerGroup.add(ring);
    markerGroup.add(new THREE.Mesh(
      new THREE.CircleGeometry(0.012, 24),
      new THREE.MeshBasicMaterial({ color: 0xC49A7A }),
    ));
    markerGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0.08)]),
      new THREE.LineBasicMaterial({ color: 0xA27B5C }),
    ));
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
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 48, 48),
        new THREE.MeshStandardMaterial({
          color: 0xE8E0D2, roughness: 0.95, metalness: 0,
          transparent: true, opacity: 1,
        }),
      );
      moonGroup.add(moon);

      // soft halo around the moon
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 32, 32),
        new THREE.ShaderMaterial({
          transparent: true, side: THREE.BackSide, depthWrite: false,
          uniforms: { c: { value: new THREE.Color(0xE8E0D2) } },
          vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
          fragmentShader: `varying vec3 vN; uniform vec3 c; void main(){ float a = pow(0.5 - dot(vN, vec3(0,0,1.)), 2.0); gl_FragColor = vec4(c, a * 0.25); }`,
        }),
      );
      moonGroup.add(halo);

      moonGroup.visible = false;
      scene.add(moonGroup);
      moonRef.current = { group: moonGroup, body: moon, halo };
    }

    let last = performance.now();
    let zoomStart = 0, wipeStart = 0;
    const zoomDur = 3200, wipeDur = 900;
    let rafId;

    const ease = t => 1 - Math.pow(1 - t, 3);

    const startZoom = () => {
      if (phaseRef.current !== 'idle') return;
      if (heroRef.current) heroRef.current.classList.add('fade-out');
      setPhaseBoth('zooming');
      zoomStart = performance.now();
    };
    introStartRef.current = startZoom;

    const tick = (now) => {
      const dt = (now - last) / 1000; last = now;
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
          const cycle = 40000;          // ms per full cycle
          const showFor = 12000;        // ms visible
          const phaseT = now % cycle;
          if (phaseT < showFor) {
            const u = phaseT / showFor; // 0..1 across the visible arc
            // path from upper-right far back, sweeping behind the globe to lower-left
            const startX = 4.6, endX = -4.6;
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
    const onDown = e => { if (phaseRef.current === 'idle') drag = { x: e.clientX, y: e.clientY, ry: globe.rotation.y, rx: globe.rotation.x }; };
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

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0e0c', zIndex: 100, overflow: 'hidden' }}>
      <div ref={stageRef} style={{ position: 'fixed', inset: 0 }}/>

      {/* CSS meteor shower — 5 streaks, staggered */}
      <div className="meteors" aria-hidden="true">
        <span className="meteor m1"></span>
        <span className="meteor m2"></span>
        <span className="meteor m3"></span>
        <span className="meteor m4"></span>
        <span className="meteor m5"></span>
      </div>

      {/* Hero readability scrim — vignette + soft radial behind text */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 102,
        background:
          'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(10,14,12,0.78) 0%, rgba(10,14,12,0.55) 35%, rgba(10,14,12,0.20) 65%, rgba(10,14,12,0) 90%),' +
          'linear-gradient(180deg, rgba(10,14,12,0.55) 0%, rgba(10,14,12,0) 18%, rgba(10,14,12,0) 82%, rgba(10,14,12,0.65) 100%)',
      }}/>

      {/* top-left wordmark */}
      <div style={{
        position: 'fixed', top: 28, left: 32, zIndex: 110,
        display: 'flex', alignItems: 'center', gap: 10,
        animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both',
      }}>
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="#A27B5C"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 16 L16 4 L29 16"/><path d="M6 14 L6 28 L26 28 L26 14"/>
          <path d="M13 28 L13 19 L19 19 L19 28"/>
        </svg>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontSize: 20, fontWeight: 500 }}>
          MyPropertyIQ
        </span>
      </div>

      {/* top-right skip */}
      <button onClick={() => onDone && onDone()} style={{
        position: 'fixed', top: 28, right: 32, zIndex: 110,
        background: 'transparent', color: 'rgba(220,215,201,.55)',
        border: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        letterSpacing: '.04em', cursor: 'pointer', padding: '12px 14px',
        animation: 'introFade 1.2s cubic-bezier(.16,1,.3,1) .2s both',
      }}
      onMouseEnter={e => e.currentTarget.style.color = C.cream}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(220,215,201,.55)'}>
        Skip intro →
      </button>

      {/* hero */}
      <div ref={heroRef} className="intro-hero" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 105,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: 24,
        transition: 'opacity .8s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{
          color: C.earth, fontSize: 11, letterSpacing: '.22em',
          textTransform: 'uppercase', marginBottom: 28,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) .4s both',
        }}>Malaysian residential property intelligence</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", color: C.cream,
          fontWeight: 300, fontSize: 'clamp(40px, 6vw, 76px)',
          lineHeight: 1.05, margin: '0 0 16px', letterSpacing: '-0.01em',
          animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) .7s both',
        }}>
          Reading the<br/>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: C.earthLight }}>property market</em>, quarter by quarter.
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: 'rgba(220,215,201,.6)', margin: '0 0 56px',
          maxWidth: 460, lineHeight: 1.55,
          animation: 'introFadeUp 1.6s cubic-bezier(.16,1,.3,1) 1.0s both',
        }}>
          NAPIC transaction data, sentiment derived from news and search,
          six housing-cycle indicators — distilled into three numbers per quarter.
        </p>

        <div style={{
          pointerEvents: 'auto', display: 'flex', gap: 16, alignItems: 'center',
          animation: 'introFadeUp 1.8s cubic-bezier(.16,1,.3,1) 1.4s both',
        }}>
          <button onClick={() => introStartRef.current && introStartRef.current()} style={{
            background: C.cream, color: C.deep, border: 0, borderRadius: 9999,
            padding: '14px 28px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 14, letterSpacing: '.02em', cursor: 'pointer',
            transition: 'background .2s, transform .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.earthLight; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.transform = 'none'; }}>
            Begin →
          </button>
          <button onClick={() => onDone && onDone()} style={{
            background: 'transparent', color: 'rgba(220,215,201,.55)', border: 0,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            letterSpacing: '.04em', cursor: 'pointer', padding: '12px 14px',
          }}>Skip intro</button>
        </div>
      </div>

      {/* coordinate readout */}
      <div style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 110,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: 'rgba(220,215,201,.4)', textAlign: 'right', lineHeight: 1.6,
        animation: 'introFadeUp 1.4s cubic-bezier(.16,1,.3,1) 1.6s both',
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(220,215,201,.3)' }}>Target</div>
        <div style={{ color: C.earth, fontWeight: 500 }}>4.21°&nbsp;N</div>
        <div style={{ color: C.earth, fontWeight: 500 }}>101.97°&nbsp;E</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(220,215,201,.3)', marginTop: 8 }}>Federation of Malaysia</div>
      </div>

      {/* radial cream wipe */}
      <div ref={wipeRef} style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 115,
        background: `radial-gradient(circle at 53% 58%, ${C.cream} 0%, ${C.cream} var(--r,0%), transparent calc(var(--r,0%) + 6%))`,
        opacity: 0, transition: 'opacity .2s',
      }} className="intro-wipe-target"/>

      {/* reveal screen — click anywhere to enter dashboard */}
      {phase === 'reveal' && (
        <div onClick={() => onDone && onDone()} style={{
          position: 'fixed', inset: 0, zIndex: 120, background: C.cream,
          color: C.deep, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: 24, cursor: 'pointer',
          animation: 'introFade .6s cubic-bezier(.16,1,.3,1)',
        }}>
          <div style={{
            color: C.earth, fontSize: 11, letterSpacing: '.22em',
            textTransform: 'uppercase', marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>Connecting</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
            fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 44px)',
            color: C.deep, margin: '0 0 14px',
          }}>Reading Malaysian property market…</h2>
          <div style={{
            display: 'inline-block', width: 240, height: 1,
            background: C.border, position: 'relative', overflow: 'hidden',
            margin: '28px 0',
          }}>
            <div style={{
              position: 'absolute', top: 0, height: '100%', width: '40%',
              background: C.earth, animation: 'introLoad 1.6s cubic-bezier(.65,0,.35,1) infinite',
            }}/>
          </div>
          <button onClick={() => onDone && onDone()} style={{
            background: C.deep, color: C.cream, border: 0, borderRadius: 8,
            padding: '14px 28px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            transition: 'background .2s, transform .2s',
            marginTop: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.mid; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.deep; e.currentTarget.style.transform = 'none'; }}>
            Enter Dashboard →
          </button>
          <div style={{
            marginTop: 24, fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'rgba(44,57,48,.5)',
          }}>
            entering automatically — or click anywhere
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
};

Object.assign(window, { Intro });
