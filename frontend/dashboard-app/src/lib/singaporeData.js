/* singaporeData.js — Singapore location + property reference data.
   ───────────────────────────────────────────────────────────────────
   Singapore has no NAPIC-equivalent open transaction dataset yet, so there is
   NO mock-transaction generator here (unlike propertyData.js). This module only
   supplies the location taxonomy in Singapore's local format — the 28 postal
   districts (the real-estate standard, e.g. D9/D10/D15) grouped under the 5 URA
   regions, plus localities — and the Singapore property-type list with default
   unit sizes. The actual valuation comes live from the Exa web search. */

export const SG_REGIONS = ['Central', 'East', 'North', 'North-East', 'West'];

/* The 28 postal districts. `region` groups them for the cascade + map highlight;
   `localities` are the recognised neighbourhoods used in listings. */
export const SG_DISTRICTS = [
  { code: 'D01', region: 'Central', localities: ['Raffles Place', 'Cecil', 'Marina', "People's Park"] },
  { code: 'D02', region: 'Central', localities: ['Anson', 'Tanjong Pagar'] },
  { code: 'D03', region: 'Central', localities: ['Tiong Bahru', 'Alexandra', 'Queenstown'] },
  { code: 'D04', region: 'Central', localities: ['Telok Blangah', 'HarbourFront', 'Sentosa', 'Keppel'] },
  { code: 'D05', region: 'West', localities: ['Buona Vista', 'West Coast', 'Clementi New Town', 'Pasir Panjang'] },
  { code: 'D06', region: 'Central', localities: ['City Hall', 'High Street', 'Beach Road'] },
  { code: 'D07', region: 'Central', localities: ['Bugis', 'Rochor', 'Golden Mile', 'Beach Road'] },
  { code: 'D08', region: 'Central', localities: ['Little India', 'Farrer Park', 'Serangoon Road'] },
  { code: 'D09', region: 'Central', localities: ['Orchard', 'Cairnhill', 'River Valley'] },
  { code: 'D10', region: 'Central', localities: ['Tanglin', 'Holland', 'Bukit Timah', 'Ardmore'] },
  { code: 'D11', region: 'Central', localities: ['Newton', 'Novena', 'Thomson', 'Watten Estate'] },
  { code: 'D12', region: 'Central', localities: ['Balestier', 'Toa Payoh', 'Serangoon'] },
  { code: 'D13', region: 'Central', localities: ['Macpherson', 'Braddell', 'Potong Pasir'] },
  { code: 'D14', region: 'Central', localities: ['Geylang', 'Eunos', 'Paya Lebar', 'Kembangan'] },
  { code: 'D15', region: 'Central', localities: ['Katong', 'Joo Chiat', 'Marine Parade', 'Amber Road', 'Tanjong Rhu'] },
  { code: 'D16', region: 'East', localities: ['Bedok', 'Upper East Coast', 'Bayshore', 'Siglap'] },
  { code: 'D17', region: 'East', localities: ['Changi', 'Loyang', 'Flora'] },
  { code: 'D18', region: 'East', localities: ['Tampines', 'Pasir Ris'] },
  { code: 'D19', region: 'North-East', localities: ['Hougang', 'Kovan', 'Sengkang', 'Punggol', 'Serangoon Gardens'] },
  { code: 'D20', region: 'North-East', localities: ['Ang Mo Kio', 'Bishan', 'Thomson'] },
  { code: 'D21', region: 'West', localities: ['Clementi Park', 'Upper Bukit Timah', 'Ulu Pandan', 'Beauty World'] },
  { code: 'D22', region: 'West', localities: ['Jurong East', 'Jurong West', 'Boon Lay', 'Lakeside'] },
  { code: 'D23', region: 'West', localities: ['Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Dairy Farm', 'Hillview'] },
  { code: 'D24', region: 'West', localities: ['Lim Chu Kang', 'Tengah', 'Kranji'] },
  { code: 'D25', region: 'North', localities: ['Woodlands', 'Admiralty', 'Woodgrove'] },
  { code: 'D26', region: 'North', localities: ['Upper Thomson', 'Springleaf', 'Mandai'] },
  { code: 'D27', region: 'North', localities: ['Yishun', 'Sembawang'] },
  { code: 'D28', region: 'North-East', localities: ['Seletar', 'Yio Chu Kang'] },
];

/* Display label for a district, e.g. "D09 · Orchard / River Valley". */
export function sgDistrictLabel(d) {
  const lead = d.localities.slice(0, 2).join(' / ');
  return `${d.code} · ${lead}`;
}

const _byLabel = Object.fromEntries(SG_DISTRICTS.map(d => [sgDistrictLabel(d), d]));
const _byCode = Object.fromEntries(SG_DISTRICTS.map(d => [d.code, d]));

export function getSgDistricts(region) {
  const list = region ? SG_DISTRICTS.filter(d => d.region === region) : SG_DISTRICTS;
  return list.map(sgDistrictLabel);
}
export function sgDistrictByLabel(label) { return _byLabel[label] || null; }
export function sgRegionOfDistrict(label) {
  const d = _byLabel[label]; return d ? d.region : null;
}
export function getSgLocalities(districtLabel) {
  const d = _byLabel[districtLabel];
  return d ? d.localities.slice() : [];
}

/* Full Singapore property-type set (HDB + private + landed). */
export const SG_PROPERTY_TYPES = [
  'HDB 3-Room', 'HDB 4-Room', 'HDB 5-Room', 'HDB Executive',
  'Condominium', 'Executive Condominium (EC)', 'Apartment',
  'Landed — Terrace', 'Landed — Semi-Detached', 'Landed — Bungalow/Detached',
];

/* Typical unit sizes (m²). `land` is null for non-landed (strata) types; the
   web search is anchored on `area` (built-up) for those. Used only to seed the
   valuation request — the live comparables drive the actual estimate. */
const SG_TYPE_DEFAULTS = {
  'HDB 3-Room':                    { area: 68,  land: null, highRise: true },
  'HDB 4-Room':                    { area: 93,  land: null, highRise: true },
  'HDB 5-Room':                    { area: 113, land: null, highRise: true },
  'HDB Executive':                 { area: 130, land: null, highRise: true },
  'Condominium':                   { area: 100, land: null, highRise: true },
  'Executive Condominium (EC)':    { area: 100, land: null, highRise: true },
  'Apartment':                     { area: 85,  land: null, highRise: true },
  'Landed — Terrace':              { area: 200, land: 150,  highRise: false },
  'Landed — Semi-Detached':        { area: 300, land: 330,  highRise: false },
  'Landed — Bungalow/Detached':    { area: 450, land: 600,  highRise: false },
};

export function sgTypeDefaults(type) {
  return SG_TYPE_DEFAULTS[type] || { area: 100, land: null, highRise: true };
}
