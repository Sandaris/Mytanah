/* eslint-disable no-undef */
/* HeroGlobe.jsx — a contained, ambient line-art globe for the landing hero.
   Idle eastward spin, drag to nudge, cream/earth strokes on a transparent
   backdrop so the hero section controls the background. No dive, no hero
   copy — purely decorative. Degrades silently if d3 is unavailable. */
const { useEffect, useRef } = React;

const HeroGlobe = ({ land = '#C49A7A', grid = 'rgba(220,215,201,0.14)', edge = 'rgba(220,215,201,0.22)' }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!window.d3) return;
    const svg = d3.select(svgRef.current);
    let W = 0, H = 0, R = 1, world = null, raf, last = performance.now();
    let spin = -101.69 - 12;            // start near Malaysia
    const tilt = -8;

    const gGrid = svg.append('path').attr('fill', 'none').attr('stroke', grid).attr('stroke-width', 0.7);
    const gLand = svg.append('path').attr('fill', 'none').attr('stroke', land)
      .attr('stroke-width', 1).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').attr('opacity', 0.85);
    const gEdge = svg.append('circle').attr('fill', 'none').attr('stroke', edge).attr('stroke-width', 1.1);
    const graticule = d3.geoGraticule().step([15, 15])();

    function render() {
      if (!W) return;
      const proj = d3.geoOrthographic().scale(R).translate([W / 2, H / 2]).rotate([spin, tilt]).clipAngle(90).precision(0.4);
      const path = d3.geoPath(proj);
      gGrid.attr('d', path(graticule) || '');
      if (world) gLand.attr('d', path(world) || '');
      gEdge.attr('cx', W / 2).attr('cy', H / 2).attr('r', R);
    }
    function resize() {
      const el = svgRef.current; if (!el) return;
      W = el.clientWidth; H = el.clientHeight; R = Math.min(W, H) * 0.46;
      render();
    }

    fetch('https://unpkg.com/world-atlas@2/land-110m.json')
      .then(r => r.json())
      .then(t => { world = window.topojson.feature(t, t.objects.land); render(); })
      .catch(() => {});

    resize();
    window.addEventListener('resize', resize);

    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      spin += dt * 4.2;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let drag = null;
    const dom = svgRef.current;
    const down = e => { drag = { x: e.clientX, s: spin }; };
    const move = e => { if (drag) { spin = drag.s + (e.clientX - drag.x) * 0.3; } };
    const up = () => { drag = null; };
    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      dom && dom.removeEventListener('pointerdown', down);
      svg.selectAll('*').remove();
    };
  }, []);

  return (
    <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'grab' }}/>
  );
};

Object.assign(window, { HeroGlobe });
