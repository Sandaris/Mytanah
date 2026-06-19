/* eslint-disable no-undef */
const { useState } = React;

const STATES = ['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah'];
const DISTRICTS = {
  Selangor: ['Petaling', 'Hulu Langat', 'Klang', 'Gombak', 'Sepang'],
  'Kuala Lumpur': ['Bukit Bintang', 'Cheras', 'Mont Kiara', 'Setapak'],
  Penang: ['Timur Laut', 'Barat Daya', 'Seberang Perai Tengah'],
  Johor: ['Johor Bahru', 'Iskandar Puteri', 'Kulai'],
  Perak: ['Kinta', 'Manjung', 'Larut Matang'],
  Sabah: ['Kota Kinabalu', 'Penampang', 'Sandakan'],
};
const PROPERTY_TYPES = ['Terraced', 'Semi-D', 'Bungalow', 'Condominium', 'Apartment'];

const LocationPanel = ({ onSubmit }) => {
  const [state, setState] = useState('Selangor');
  const [district, setDistrict] = useState('Petaling');
  const [type, setType] = useState('Terraced');
  const [tenure, setTenure] = useState('Freehold');
  const [built, setBuilt] = useState('1,450');
  const [land, setLand] = useState('2,000');
  const [age, setAge] = useState(12);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => onSubmit({ state, district, type, tenure, built, land, age }), 800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: C.deep,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 24,
    }}>
      <div style={{
        width: 'min(640px, 100%)', background: C.raised,
        border: `1px solid ${C.earth}4D`, borderRadius: 16,
        padding: 36, boxShadow: '0 32px 80px rgba(44,57,48,0.18)',
        animation: 'panelIn .6s cubic-bezier(.16,1,.3,1)',
      }}>
        <Display size={32} weight={500} style={{ display: 'block' }}>
          Where is your property?
        </Display>
        <div style={{
          height: 1, background: C.border, margin: '14px 0 24px',
        }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="State">
            <Select value={state} onChange={v => { setState(v); setDistrict(DISTRICTS[v][0]); }} options={STATES}/>
          </Field>
          <Field label="District">
            <Select value={district} onChange={setDistrict} options={DISTRICTS[state]}/>
          </Field>
          <Field label="Property Type">
            <Select value={type} onChange={setType} options={PROPERTY_TYPES}/>
          </Field>
          <Field label="Tenure">
            <div style={{ display: 'flex', gap: 6, marginTop: 0 }}>
              <Pill active={tenure==='Freehold'} onClick={() => setTenure('Freehold')}>Freehold</Pill>
              <Pill active={tenure==='Leasehold'} onClick={() => setTenure('Leasehold')}>Leasehold</Pill>
            </div>
          </Field>
          <Field label="Built-Up Area (sq ft)">
            <input value={built} onChange={e => setBuilt(e.target.value)} style={inputStyle}/>
          </Field>
          <Field label="Land Area (sq ft)">
            <input value={land} onChange={e => setLand(e.target.value)} style={inputStyle}/>
          </Field>
        </div>

        <div style={{ marginTop: 18 }}>
          <Eyebrow style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Property Age</span>
            <Mono size={12} color={C.deep}>{age} years</Mono>
          </Eyebrow>
          <input type="range" min="0" max="50" value={age}
            onChange={e => setAge(+e.target.value)}
            style={{
              width: '100%', accentColor: C.earth, height: 4,
            }}/>
        </div>

        <button onClick={submit} disabled={loading} style={{
          width: '100%', marginTop: 26, background: C.deep, color: C.cream,
          border: 0, borderRadius: 8, padding: '14px 22px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
          cursor: 'pointer', transition: 'background .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.mid}
        onMouseLeave={e => e.currentTarget.style.background = C.deep}>
          {loading ? 'Analysing…' : 'Analyse Property →'}
        </button>
      </div>
      <style>{`@keyframes panelIn { from {opacity:0;transform:translateY(40px)} to {opacity:1;transform:none} }`}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%', background: C.cream, border: `1px solid ${C.earth}40`,
  color: C.deep, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box', outline: 'none',
};

Object.assign(window, { LocationPanel });
