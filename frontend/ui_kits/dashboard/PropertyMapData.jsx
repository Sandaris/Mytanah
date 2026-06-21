/* eslint-disable no-undef */
/* PropertyMapData.jsx — the data layer for the transaction explorer.
   ───────────────────────────────────────────────────────────────────
   Districts come straight from the map's GeoJSON, so the dropdown and the
   map can never disagree. Everything below a district (Mukim → Scheme/Area
   → Road → Transactions) is produced by a DETERMINISTIC generator seeded
   by the full location path. That means:
     • the same path always returns the exact same records (never random),
     • a record's columns always echo the path that produced it
       (no fake, unrelated, or cross-location data),
     • changing any level changes the seed, so children are recomputed.
   This mirrors how the rest of this kit uses handcrafted mock data, but
   keeps the State→District→Mukim→Scheme→Road→Txn relationships strict. */

// ---- seeded RNG (FNV-1a hash + mulberry32) ----------------------------
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = (seed) => mulberry32(hashStr(seed));
const intIn = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
function sample(seed, arr, n) {
  const r = rng(seed); const pool = arr.slice(); const out = [];
  n = Math.min(n, pool.length);
  for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return out;
}

// ---- curated real mukim names for well-known districts ----------------
const CURATED_MUKIM = {
  'Selangor>Petaling': ['Petaling', 'Sungai Buloh', 'Damansara', 'Bukit Raja', 'Sungai Buloh (Sg. Buloh)'],
  'Selangor>Klang': ['Klang', 'Kapar', 'Kapar (Meru)'],
  'Selangor>Hulu Langat': ['Kajang', 'Cheras', 'Hulu Langat', 'Semenyih', 'Beranang'],
  'Selangor>Gombak': ['Setapak', 'Batu', 'Rawang', 'Hulu Kelang'],
  'Johor>Johor Bahru': ['Plentong', 'Tebrau', 'Pulai', 'Tanjung Kupang', 'Sungai Tiram'],
  'Penang>Timur Laut': ['Bandar Georgetown', 'Mukim 13', 'Mukim 18', 'Tanjung Tokong'],
  'Penang>Seberang Perai Tengah': ['Mukim 1', 'Mukim 6', 'Mukim 11', 'Mukim 13'],
  'Kuala Lumpur>Kuala Lumpur': ['Bukit Bintang', 'Setapak', 'Kuala Lumpur (Bandar)', 'Batu', 'Petaling (KL)'],
};

const AREA_POOL = [
  'Taman Sri Indah', 'Taman Desa Jaya', 'Bandar Baru Permai', 'Taman Mutiara', 'Taman Bukit Permai',
  'Bandar Botanic', 'Taman Sentosa', 'Taman Melati', 'Taman Cahaya', 'Taman Harmoni',
  'Taman Seri Mawar', 'Taman Damai', 'Bandar Utama Heights', 'Taman Anggerik', 'Taman Cempaka',
  'Taman Kasturi', 'Taman Pelangi', 'Taman Sutera', 'Taman Nusa Indah', 'Taman Sri Gombak',
  'Bandar Puteri', 'Taman Wawasan', 'Taman Impian Emas', 'Taman Permata', 'Taman Sri Muda',
  'Taman Tropika', 'Taman Seroja', 'Taman Teratai', 'Taman Kenanga', 'Bandar Mahkota',
];
const ROAD_WORDS = ['Mawar', 'Melur', 'Cempaka', 'Anggerik', 'Kenanga', 'Teratai', 'Seroja',
  'Dahlia', 'Bakawali', 'Jasmin', 'Kemboja', 'Tanjung', 'Delima', 'Nilam', 'Zamrud',
  'Permata', 'Bahagia', 'Harmoni', 'Damai', 'Setia', 'Suria', 'Bayu'];
const ROAD_TYPES = ['Jalan', 'Persiaran', 'Lorong', 'Lebuh'];

// ── Real NAPIC categories & calibration (2026 open transaction dataset) ──
const PROPERTY_TYPES = [
  '1 - 1 1/2 Storey Terraced', '2 - 2 1/2 Storey Terraced', 'Condominium/Apartment',
  '1 - 1 1/2 Storey Semi-Detached', 'Low-Cost House', 'Detached',
  '2 - 2 1/2 Storey Semi-Detached', 'Flat', 'Low-Cost Flat', 'Cluster House', 'Town House',
];
const TENURES = ['Freehold', 'Leasehold'];
const LOT_TYPES = ['Intermediate', 'Corner', 'End Lot'];

// National median across all types (RM) — converts a district's overall
// median into a per-type estimate.
const OVERALL_MED = 380000;

// Per-type calibration from the real data:
//   factor = (type median price ÷ OVERALL_MED), median main-floor & land area
//   in sq.m, freehold share %, and relative transaction frequency (weight).
const TYPE_META = {
  '1 - 1 1/2 Storey Terraced':      { factor: 0.80, floor: 81,  land: 143,  fh: 71, w: 1460 },
  '2 - 2 1/2 Storey Terraced':      { factor: 1.47, floor: 145, land: 143,  fh: 74, w: 1319 },
  'Condominium/Apartment':          { factor: 1.05, floor: 95,  land: null, fh: 72, w: 776, highRise: true },
  '1 - 1 1/2 Storey Semi-Detached': { factor: 1.05, floor: 104, land: 297,  fh: 84, w: 443 },
  'Low-Cost House':                 { factor: 0.57, floor: 60,  land: 104,  fh: 68, w: 439 },
  'Detached':                       { factor: 1.21, floor: 132, land: 519,  fh: 70, w: 390 },
  '2 - 2 1/2 Storey Semi-Detached': { factor: 2.18, floor: 204, land: 316,  fh: 76, w: 270 },
  'Flat':                           { factor: 0.66, floor: 75,  land: null, fh: 71, w: 226, highRise: true },
  'Low-Cost Flat':                  { factor: 0.42, floor: 55,  land: null, fh: 66, w: 223, highRise: true },
  'Cluster House':                  { factor: 1.39, floor: 130, land: 208,  fh: 65, w: 75 },
  'Town House':                     { factor: 0.98, floor: 110, land: null, fh: 74, w: 42,  highRise: true },
};
const HIGH_RISE = new Set(Object.keys(TYPE_META).filter(t => TYPE_META[t].highRise));

// state median baseline (RM '000) — fallback when a district has no real figure
const STATE_BASE = {
  'Kuala Lumpur': 640, 'Putrajaya': 600, 'Selangor': 500, 'Sabah': 470, 'Penang': 380,
  'Sarawak': 410, 'Johor': 400, 'Melaka': 308, 'Negeri Sembilan': 300, 'Labuan': 350,
  'Perak': 300, 'Pahang': 300, 'Kedah': 300, 'Terengganu': 350, 'Kelantan': 330, 'Perlis': 260,
};

// Real district median transaction price (RM), 2026 dataset. District names
// match the map's GeoJSON, so the dashboard agrees with the map selection.
const DISTRICT_MED = { 'Kota Kinabalu':740000, 'Kuala Lumpur':640000, 'Petaling':628000, 'Johor Bahru':550000, 'Sepang':540000, 'Muar':500000, 'Gombak':500000, 'Hulu Langat':500000, 'Klang':498000, 'Bahagian Samarahan':460000, 'Kulai':460000, 'Langkawi':458000, 'Pontian':454500, 'Sandakan':452500, 'Kuala Langat':450000, 'Bahagian Sibu':450000, 'Tawau':450000, 'Kuala Selangor':445000, 'Bahagian Miri':420000, 'Bahagian Kuching':410000, 'Tangkak':401500, 'Seberang Perai Tengah':400000, 'Pasir Mas':395000, 'Batu Pahat':380000, 'Marang':371000, 'Kota Tinggi':370000, 'Seberang Perai Selatan':368000, 'Seberang Perai Utara':365000, 'Barat Daya':362500, 'Bachok':360000, 'Dungun':360000, 'Kuala Nerus':360000, 'Muallim':360000, 'Besut':350000, 'Kota Bahru':345000, 'Kuantan':345000, 'Tanah Merah':342000, 'Hulu Terengganu':340000, 'Kota Setar':340000, 'Kuala Terengganu':340000, 'Kulim':340000, 'Timur Laut':340000, 'Seremban':338000, 'Kinta':320000, 'Segamat':315000, 'Jasin':314500, 'Hulu Selangor':312500, 'Melaka Tengah':308000, 'Manjung':302000, 'Alor Gajah':300000, 'Machang':300000, 'Pasir Puteh':300000, 'Pekan':300000, 'Kubang Pasu':297500, 'Temerloh':282500, 'Larut Matang':280000, 'Hilir Perak':270000, 'Kampar':265000, 'Kuala Muda':264000, 'Kluang':263000, 'Perlis':260000, 'Kemaman':250000, 'Port Dickson':250000, 'Rembau':250000, 'Kuala Kangsar':247500, 'Perak Tengah':242500, 'Batang Padang':236000, 'Tampin':200000, 'Rompin':90000 };

// weighted property-type picker (mirrors real transaction frequency)
const TYPE_W = PROPERTY_TYPES.map(t => ({ t, w: TYPE_META[t].w }));
const TOTAL_W = TYPE_W.reduce((s, x) => s + x.w, 0);
function pickType(r) {
  let x = r() * TOTAL_W;
  for (const o of TYPE_W) { if ((x -= o.w) <= 0) return o.t; }
  return TYPE_W[0].t;
}

// ---- hierarchy queries -------------------------------------------------
function getMukims(state, district) {
  const curated = CURATED_MUKIM[`${state}>${district}`];
  if (curated) return curated.slice();
  const r = rng(`mukim|${state}|${district}`);
  const n = intIn(r, 4, 7);
  const out = [];
  for (let i = 1; i <= n; i++) out.push('Mukim ' + String(i).padStart(2, '0'));
  return out;
}
function getAreas(state, district, mukim) {
  return sample(`area|${state}|${district}|${mukim}`, AREA_POOL, intIn(rng(`an|${mukim}|${district}`), 4, 7));
}

/* District-level scheme/area index — lets the user skip Mukim and pick a
   Scheme / Area directly under a District. Aggregates every mukim's areas,
   deduping each area to the FIRST mukim that owns it, so an area always maps
   back to exactly one mukim (keeping the hierarchy consistent for the table). */
function districtAreaIndex(state, district) {
  const mukims = getMukims(state, district);
  const areaToMukim = {};
  for (const m of mukims) {
    for (const a of getAreas(state, district, m)) {
      if (!(a in areaToMukim)) areaToMukim[a] = m;
    }
  }
  const areas = Object.keys(areaToMukim).sort();
  return { areas, areaToMukim };
}
function getDistrictAreas(state, district) {
  return districtAreaIndex(state, district).areas;
}
function getAreaMukim(state, district, area) {
  return districtAreaIndex(state, district).areaToMukim[area] || null;
}
function getRoads(state, district, mukim, area) {
  const seed = `road|${state}|${district}|${mukim}|${area}`;
  const r = rng(seed);
  const n = intIn(r, 3, 6);
  const out = new Set();
  let guard = 0;
  while (out.size < n && guard++ < 40) {
    const type = ROAD_TYPES[Math.floor(r() * ROAD_TYPES.length)];
    const word = ROAD_WORDS[Math.floor(r() * ROAD_WORDS.length)];
    const num = intIn(r, 1, 14);
    const useSlash = r() < 0.4;
    out.add(`${type} ${word} ${num}${useSlash ? '/' + intIn(r, 1, 9) : ''}`);
  }
  return [...out];
}

/* District-level road index — lets the user skip Mukim AND Scheme/Area and
   search a Road directly under a District (for when they can't find their
   mukim/scheme). Walks every scheme's roads, deduping each road to the FIRST
   (mukim, scheme) that owns it, so picking a road maps back to exactly one
   path and the cascade above it can be auto-filled. */
function districtRoadIndex(state, district) {
  const { areas, areaToMukim } = districtAreaIndex(state, district);
  const roadToPath = {};
  for (const area of areas) {
    const mukim = areaToMukim[area];
    for (const road of getRoads(state, district, mukim, area)) {
      if (!(road in roadToPath)) roadToPath[road] = { mukim, area };
    }
  }
  const roads = Object.keys(roadToPath).sort();
  return { roads, roadToPath };
}
function getDistrictRoads(state, district) {
  return districtRoadIndex(state, district).roads;
}
function getRoadPath(state, district, road) {
  return districtRoadIndex(state, district).roadToPath[road] || null;
}

function formatRM(n) {
  return 'RM ' + Math.round(n).toLocaleString('en-MY');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getTransactions(path) {
  const { state, district, mukim, area, road } = path;
  const seed = `txn|${state}|${district}|${mukim}|${area}|${road}`;
  const r = rng(seed);
  const n = intIn(r, 5, 13);
  // real district median (RM) anchors the area; fall back to the state baseline
  const base = DISTRICT_MED[district] || (STATE_BASE[state] || 320) * 1000;
  // each road skews toward a dominant property type for realism
  const dominant = pickType(rng(seed + '|dom'));
  const rows = [];
  for (let i = 0; i < n; i++) {
    const type = r() < 0.5 ? dominant : pickType(r);
    const meta = TYPE_META[type];
    const highRise = !!meta.highRise;
    const year = intIn(r, 2021, 2026);
    // 2026 is the dataset's anchor year; older years discount ~3%/yr
    const yearFactor = 1 + (year - 2026) * 0.030;
    const noise = 0.82 + r() * 0.42;
    const price = Math.round((base * meta.factor * yearFactor * noise) / 1000) * 1000;
    const built = Math.max(33, Math.round(meta.floor * (0.78 + r() * 0.5)));   // main floor area, sq.m
    const land = meta.land ? Math.round(meta.land * (0.80 + r() * 0.55)) : null; // parcel area, sq.m
    const tenure = r() * 100 < meta.fh ? 'Freehold' : 'Leasehold';
    const ppsm = built ? Math.round(price / built) : null;
    const month = intIn(r, 0, 11);
    rows.push({
      state, district, mukim, area, road,
      type, year,
      monthYear: `${MONTHS[month]} ${year}`,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(intIn(r, 1, 28)).padStart(2, '0')}`,
      price,
      land,          // land / parcel area (sq.m) — null for strata high-rise
      built,         // main floor area (sq.m)
      tenure,
      lot: highRise ? '—' : LOT_TYPES[Math.floor(r() * LOT_TYPES.length)],
      level: highRise ? intIn(r, 1, 24) : null, // unit level for high-rise
      ppsf: ppsm,    // RM per sq.m (name kept for table compatibility)
      ppsm,
    });
  }
  // newest first
  rows.sort((a, b) => b.date.localeCompare(a.date));
  return rows;
}

// Gather transactions for whatever level the user has filled in — road,
// scheme/area, mukim, or whole district — so a search needn't reach road level.
function getTransactionsForScope(path) {
  const { state, district, mukim, area, road } = path || {};
  if (!state || !district) return [];
  if (road) return getTransactions(path);
  const out = [];
  const CAP = 600;
  const pushRoads = (mk, a) => {
    for (const rd of getRoads(state, district, mk, a)) {
      const rows = getTransactions({ state, district, mukim: mk, area: a, road: rd });
      for (const row of rows) { out.push(row); if (out.length >= CAP) return true; }
    }
    return false;
  };
  if (area) {
    pushRoads(mukim || getAreaMukim(state, district, area) || '', area);
  } else if (mukim) {
    for (const a of getAreas(state, district, mukim)) { if (pushRoads(mukim, a)) break; }
  } else {
    for (const mk of getMukims(state, district)) {
      let stop = false;
      for (const a of getAreas(state, district, mk)) { if (pushRoads(mk, a)) { stop = true; break; } }
      if (stop) break;
    }
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out;
}

Object.assign(window, {
  getMukims, getAreas, getDistrictAreas, getAreaMukim, getRoads, getTransactions,
  getDistrictRoads, getRoadPath,
  getTransactionsForScope, formatRM, PROPERTY_TYPES_ALL: PROPERTY_TYPES,
});
