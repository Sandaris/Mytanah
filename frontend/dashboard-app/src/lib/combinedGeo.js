/* combinedGeo.js — a single map model holding BOTH Malaysia (districts) and
   Singapore (planning areas), projected through ONE shared lng/lat bbox so the
   two countries sit in their true relative positions (Singapore at the southern
   tip of Peninsular Malaysia). Used by the "All" map scope. Clicking a feature
   tells the page which country (and, for Malaysia, which state) was picked so it
   can drill into that country's cascade. */

import { STATE_NAMES } from '@/lib/malaysiaGeo'

const MY_URL = 'https://cdn.jsdelivr.net/gh/mptwaktusolat/jakim.geojson@master/malaysia.district.geojson';
const SG_URL = 'https://cdn.jsdelivr.net/gh/yinshanyang/singapore@master/maps/2-planning-area.geojson';

// Peninsular (West) states + KL/Putrajaya — used to frame the default combined
// view on the Malaysia-peninsula-plus-Singapore cluster (East Malaysia is far
// east and would shrink Singapore to a speck if it drove the initial fit).
const WEST = new Set(['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Penang', 'Perak', 'Perlis', 'Selangor', 'Terengganu',
  'Kuala Lumpur', 'Putrajaya']);

const titleCase = (s) => String(s).toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

let _cache = null;
let _promise = null;

export function loadCombinedGeo() {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = Promise.all([
    fetch(MY_URL).then(r => { if (!r.ok) throw new Error('MY HTTP ' + r.status); return r.json(); }),
    fetch(SG_URL).then(r => { if (!r.ok) throw new Error('SG HTTP ' + r.status); return r.json(); }),
  ]).then(([my, sg]) => { _cache = buildModel(my.features, sg.features); return _cache; });
  return _promise;
}

function buildModel(myFeatures, sgFeatures) {
  let lngMin = 1e9, lngMax = -1e9, latMin = 1e9, latMax = -1e9;
  const scanBox = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < lngMin) lngMin = c[0]; if (c[0] > lngMax) lngMax = c[0];
      if (c[1] < latMin) latMin = c[1]; if (c[1] > latMax) latMax = c[1];
    } else c.forEach(scanBox);
  };
  myFeatures.forEach(f => f.geometry && scanBox(f.geometry.coordinates));
  sgFeatures.forEach(f => f.geometry && scanBox(f.geometry.coordinates));

  const W = 1400;
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

  const features = [];
  const byCountry = { MY: [1e9, 1e9, -1e9, -1e9], SG: [1e9, 1e9, -1e9, -1e9] };
  const primaryBox = [1e9, 1e9, -1e9, -1e9]; // West Malaysia + Singapore

  const add = (rawPolys, geomType, { country, name, group, inPrimary }) => {
    const polys = geomType === 'MultiPolygon' ? rawPolys : [rawPolys];
    let d = '';
    const box = [1e9, 1e9, -1e9, -1e9];
    let cx = 0, cy = 0, cn = 0;
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = project(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x + ' ' + y;
          expand(box, x, y);
          cx += x; cy += y; cn++;
        }
        d += 'Z';
      }
    }
    features.push({ country, name, group, d, bbox: box, centroid: [cx / cn, cy / cn] });
    const cb = byCountry[country];
    expand(cb, box[0], box[1]); expand(cb, box[2], box[3]);
    if (inPrimary) { expand(primaryBox, box[0], box[1]); expand(primaryBox, box[2], box[3]); }
  };

  for (const f of myFeatures) {
    if (!f.geometry) continue;
    const state = STATE_NAMES[f.properties.code_state] || ('State ' + f.properties.code_state);
    add(f.geometry.coordinates, f.geometry.type, {
      country: 'MY', name: f.properties.name, group: state, inPrimary: WEST.has(state),
    });
  }
  for (const f of sgFeatures) {
    if (!f.geometry || !(f.properties && f.properties.name)) continue;
    add(f.geometry.coordinates, f.geometry.type, {
      country: 'SG', name: titleCase(f.properties.name), group: 'Singapore', inPrimary: true,
    });
  }

  return {
    features,
    byCountry,
    primaryBox,
    W, H,
    fullBox: [0, 0, W, H],
  };
}
