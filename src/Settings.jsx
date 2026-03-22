import { useState } from 'react'

const CITIES = ['Tel Aviv', 'London', 'New York', 'Tokyo', 'Berlin']

export default function Settings({ settings, onSave }) {
  const [unit, setUnit] = useState(settings.unit)
  const [defaultCity, setDefaultCity] = useState(settings.defaultCity)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    onSave({ unit, defaultCity })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={styles.pageTitle}>⚙️ Settings</div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Preferences</div>
        <div style={styles.body}>

          <div style={styles.field}>
            <label style={styles.label}>Temperature Unit</label>
            <div style={styles.btnGroup}>
              <button style={unit === 'C' ? styles.btnActive : styles.btn} onClick={() => setUnit('C')}>°C Celsius</button>
              <button style={unit === 'F' ? styles.btnActive : styles.btn} onClick={() => setUnit('F')}>°F Fahrenheit</button>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.field}>
            <label style={styles.label}>Default City</label>
            <div style={styles.btnGroup}>
              {CITIES.map(city => (
                <button key={city}
                  style={defaultCity === city ? styles.btnActive : styles.btn}
                  onClick={() => setDefaultCity(city)}>
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.actions}>
            <button style={styles.saveBtn} onClick={handleSave}>Save Settings</button>
            {saved && <span style={styles.savedMsg}>✅ Settings saved!</span>}
          </div>

        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>About</div>
        <div style={styles.body}>
          <p style={styles.about}>Weather Dashboard · Built with React + Vite</p>
          <p style={styles.about}>Deployed via GitHub Actions → SAP BTP Cloud Foundry</p>
          <p style={styles.about}>Data: Open-Meteo API · Maps: OpenStreetMap + Leaflet · Charts: Recharts</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageTitle: { fontSize: '20px', fontWeight: '600', color: '#32363a', marginBottom: '1rem' },
  card: { background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', marginBottom: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardHeader: { background: '#f5f6f7', borderBottom: '1px solid #e5e5e5', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#32363a' },
  body: { padding: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#32363a', marginBottom: '10px' },
  btnGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  btn: { padding: '8px 20px', border: '1px solid #c9cdd4', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#32363a' },
  btnActive: { padding: '8px 20px', border: '1px solid #0070f2', background: '#0070f2', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: '600' },
  divider: { height: '1px', background: '#e5e5e5', margin: '1.25rem 0' },
  actions: { display: 'flex', alignItems: 'center', gap: '1rem' },
  saveBtn: { padding: '10px 24px', background: '#0070f2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  savedMsg: { fontSize: '14px', color: '#107e3e' },
  about: { fontSize: '13px', color: '#6a6d70', margin: '4px 0' },
}