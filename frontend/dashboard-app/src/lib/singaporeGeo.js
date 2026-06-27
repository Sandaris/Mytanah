/* singaporeGeo.js — loads the planning-area GeoJSON for Singapore, projects it
   to a flat SVG coordinate space, and groups the 55 planning areas under their
   URA region. Mirrors malaysiaGeo's model shape so SingaporeMap can render it
   the same way (regions ≈ "states", planning areas ≈ "districts"). */

const GEO_URL = 'https://cdn.jsdelivr.net/gh/yinshanyang/singapore@master/maps/2-planning-area.geojson';

// URA planning area (UPPERCASE, as in the GeoJSON) → region.
const AREA_REGION = {
  // Central
  'BISHAN': 'Central', 'BUKIT MERAH': 'Central', 'BUKIT TIMAH': 'Central',
  'DOWNTOWN CORE': 'Central', 'GEYLANG': 'Central', 'KALLANG': 'Central',
  'MARINA EAST': 'Central', 'MARINA SOUTH': 'Central', 'MARINE PARADE': 'Central',
  'MUSEUM': 'Central', 'NEWTON': 'Central', 'NOVENA': 'Central', 'ORCHARD': 'Central',
  'OUTRAM': 'Central', 'QUEENSTOWN': 'Central', 'RIVER VALLEY': 'Central',
  'ROCHOR': 'Central', 'SINGAPORE RIVER': 'Central', 'SOUTHERN ISLANDS': 'Central',
  'STRAITS VIEW': 'Central', 'TANGLIN': 'Central', 'TOA PAYOH': 'Central',
  // East
  'BEDOK': 'East', 'CHANGI': 'East', 'CHANGI BAY': 'East', 'PASIR RIS': 'East',
  'PAYA LEBAR': 'East', 'TAMPINES': 'East',
  // North
  'CENTRAL WATER CATCHMENT': 'North', 'LIM CHU KANG': 'North', 'MANDAI': 'North',
  'SEMBAWANG': 'North', 'SIMPANG': 'North', 'SUNGEI KADUT': 'North',
  'WOODLANDS': 'North', 'YISHUN': 'North',
  // North-East
  'ANG MO KIO': 'North-East', 'HOUGANG': 'North-East', 'NORTH-EASTERN ISLANDS': 'North-East',
  'PUNGGOL': 'North-East', 'SELETAR': 'North-East', 'SENGKANG': 'North-East',
  'SERANGOON': 'North-East',
  // West
  'BOON LAY': 'West', 'BUKIT BATOK': 'West', 'BUKIT PANJANG': 'West',
  'CHOA CHU KANG': 'West', 'CLEMENTI': 'West', 'JURONG EAST': 'West',
  'JURONG WEST': 'West', 'PIONEER': 'West', 'TENGAH': 'West', 'TUAS': 'West',
  'WESTERN ISLANDS': 'West', 'WESTERN WATER CATCHMENT': 'West',
};

const titleCase = (s) => String(s).toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  .replace(/\bMrt\b/g, 'MRT');

let _cache = null;
let _promise = null;

export function loadSingaporeGeo() {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = fetch(GEO_URL)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(geo => { _cache = buildModel(geo.features); return _cache; });
  return _promise;
}

function buildModel(features) {
  let lngMin = 1e9, lngMax = -1e9, latMin = 1e9, latMax = -1e9;
  const scanBox = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < lngMin) lngMin = c[0]; if (c[0] > lngMax) lngMax = c[0];
      if (c[1] < latMin) latMin = c[1]; if (c[1] > latMax) latMax = c[1];
    } else c.forEach(scanBox);
  };
  features.forEach(f => f.geometry && scanBox(f.geometry.coordinates));

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

  const areas = [];
  for (const f of features) {
    if (!f.geometry) continue;
    const rawName = f.properties && f.properties.name;
    if (!rawName) continue;
    const region = AREA_REGION[rawName] || 'Central';
    const polys = f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates
      : [f.geometry.coordinates];

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
    areas.push({ name: titleCase(rawName), region, d, bbox: box, centroid: [cx / cn, cy / cn] });
  }

  areas.sort((a, b) => a.name.localeCompare(b.name));

  const regionNames = ['Central', 'East', 'North', 'North-East', 'West'];
  const byRegion = Object.fromEntries(regionNames.map(r => [r, []]));
  const regions = Object.fromEntries(regionNames.map(r => [r, [1e9, 1e9, -1e9, -1e9]]));
  for (const a of areas) {
    byRegion[a.region].push(a.name);
    const rb = regions[a.region];
    expand(rb, a.bbox[0], a.bbox[1]);
    expand(rb, a.bbox[2], a.bbox[3]);
  }

  return {
    areas,
    byName: Object.fromEntries(areas.map(a => [a.name, a])),
    byRegion,
    regions,
    regionNames,
    regionOf: (name) => (areas.find(a => a.name === name) || {}).region || null,
    W, H,
    fullBox: [0, 0, W, H],
  };
}
