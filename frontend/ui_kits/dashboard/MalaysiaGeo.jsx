/* eslint-disable no-undef */
/* MalaysiaGeo.jsx — loads the district-level GeoJSON for all of Malaysia
   (West + East, incl. Sabah, Sarawak, Labuan), projects it to a flat SVG
   coordinate space, and groups districts under their parent state.
   One source drives both the state outlines AND the district boundaries. */

const GEO_URL = 'https://cdn.jsdelivr.net/gh/mptwaktusolat/jakim.geojson@master/malaysia.district.geojson';

// Official Malaysian state/territory codes → display names
const STATE_NAMES = {
  1: 'Johor', 2: 'Kedah', 3: 'Kelantan', 4: 'Melaka', 5: 'Negeri Sembilan',
  6: 'Pahang', 7: 'Penang', 8: 'Perak', 9: 'Perlis', 10: 'Selangor',
  11: 'Terengganu', 12: 'Sabah', 13: 'Sarawak', 14: 'Kuala Lumpur',
  15: 'Labuan', 16: 'Putrajaya',
};

let _cache = null;
let _promise = null;

function loadMalaysiaGeo() {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = fetch(GEO_URL)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(geo => { _cache = buildModel(geo.features); return _cache; });
  return _promise;
}

function buildModel(features) {
  // global bbox
  let lngMin = 999, lngMax = -999, latMin = 999, latMax = -999;
  const scanBox = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < lngMin) lngMin = c[0]; if (c[0] > lngMax) lngMax = c[0];
      if (c[1] < latMin) latMin = c[1]; if (c[1] > latMax) latMax = c[1];
    } else c.forEach(scanBox);
  };
  features.forEach(f => scanBox(f.geometry.coordinates));

  const W = 1000;
  const k = W / (lngMax - lngMin);
  const H = (latMax - latMin) * k;
  const project = (lng, lat) => [
    +((lng - lngMin) * k).toFixed(1),
    +((latMax - lat) * k).toFixed(1),
  ];

  const expand = (bbox, x, y) => {
    if (x < bbox[0]) bbox[0] = x; if (y < bbox[1]) bbox[1] = y;
    if (x > bbox[2]) bbox[2] = x; if (y > bbox[3]) bbox[3] = y;
  };

  const statesMap = {};

  for (const f of features) {
    const code = f.properties.code_state;
    const stateName = STATE_NAMES[code] || ('State ' + code);
    const districtName = f.properties.name;

    const polys = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates
      : [f.geometry.coordinates];

    let d = '';
    const dBox = [1e9, 1e9, -1e9, -1e9];
    let cx = 0, cy = 0, cn = 0;
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = project(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x + ' ' + y;
          expand(dBox, x, y);
          cx += x; cy += y; cn++;
        }
        d += 'Z';
      }
    }

    const district = {
      name: districtName, d, bbox: dBox,
      centroid: [cx / cn, cy / cn],
    };

    if (!statesMap[stateName]) {
      statesMap[stateName] = {
        name: stateName, code, districts: [],
        bbox: [1e9, 1e9, -1e9, -1e9],
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
  const WEST = new Set(['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Selangor', 'Terengganu',
    'Kuala Lumpur', 'Putrajaya']);
  const regionOf = (name) => WEST.has(name) ? 'west' : 'east';
  const regions = { west: [1e9, 1e9, -1e9, -1e9], east: [1e9, 1e9, -1e9, -1e9] };
  for (const st of states) {
    const rb = regions[regionOf(st.name)];
    expand(rb, st.bbox[0], st.bbox[1]);
    expand(rb, st.bbox[2], st.bbox[3]);
  }

  return {
    states,
    byName: Object.fromEntries(states.map(s => [s.name, s])),
    stateNames: states.map(s => s.name),
    regions, regionOf,
    W, H,
    fullBox: [0, 0, W, H],
  };
}

// pad a [x,y,x2,y2] bbox by a ratio and return {x,y,w,h} for viewBox
function boxToView(bbox, padRatio = 0.16) {
  const w = bbox[2] - bbox[0];
  const h = bbox[3] - bbox[1];
  const px = w * padRatio, py = h * padRatio;
  return { x: bbox[0] - px, y: bbox[1] - py, w: w + px * 2, h: h + py * 2 };
}

Object.assign(window, { loadMalaysiaGeo, boxToView, STATE_NAMES });
