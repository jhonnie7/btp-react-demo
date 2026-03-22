import { useState } from 'react'
import WeatherDashboard from './WeatherDashboard'
import CityMap from './CityMap'
import Charts from './Charts'
import WorldClock from './WorldClock'
import Settings from './Settings'

const NAV = [
  { key: 'weather', label: 'Weather', icon: '🌤️' },
  { key: 'map', label: 'City Map', icon: '🗺️' },
  { key: 'charts', label: 'Charts', icon: '📊' },
  { key: 'clock', label: 'World Clock', icon: '🌍' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const [page, setPage] = useState('weather')
  const [settings, setSettings] = useState({
    unit: localStorage.getItem('unit') || 'C',
    defaultCity: localStorage.getItem('defaultCity') || 'Tel Aviv',
  })

  function updateSettings(newSettings) {
    setSettings(newSettings)
    localStorage.setItem('unit', newSettings.unit)
    localStorage.setItem('defaultCity', newSettings.defaultCity)
  }

  return (
    <div style={styles.shell}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.sapLogo}>SAP</div>
          <span style={styles.appTitle}>Weather Dashboard</span>
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {NAV.map(n => (
            <button
              key={n.key}
              style={page === n.key ? styles.navItemActive : styles.navItem}
              onClick={() => setPage(n.key)}
            >
              <span style={styles.navIcon}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {page === 'weather' && <WeatherDashboard settings={settings} />}
          {page === 'map' && <CityMap settings={settings} />}
          {page === 'charts' && <Charts settings={settings} />}
          {page === 'clock' && <WorldClock />}
          {page === 'settings' && <Settings settings={settings} onSave={updateSettings} />}
        </div>
      </div>

      <div style={styles.footer}>
        Powered by Open-Meteo · OpenStreetMap · Deployed on SAP BTP Cloud Foundry
      </div>
    </div>
  )
}

const styles = {
  shell: { minHeight: '100vh', background: '#f5f6f7', fontFamily: '"72", Arial, sans-serif', display: 'flex', flexDirection: 'column' },
  topBar: { background: '#0070f2', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 1.5rem', height: '48px' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  sapLogo: { background: '#fff', color: '#0070f2', fontWeight: 'bold', fontSize: '14px', padding: '2px 6px', borderRadius: '3px' },
  appTitle: { fontSize: '16px', fontWeight: '600' },
  body: { display: 'flex', flex: 1 },
  sidebar: { width: '200px', background: '#fff', borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', paddingTop: '8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#32363a', textAlign: 'left', width: '100%' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#e8f1fd', border: 'none', borderLeft: '3px solid #0070f2', cursor: 'pointer', fontSize: '14px', color: '#0070f2', fontWeight: '600', textAlign: 'left', width: '100%' },
  navIcon: { fontSize: '18px' },
  main: { flex: 1, padding: '1.5rem', overflowY: 'auto' },
  footer: { textAlign: 'center', padding: '10px', fontSize: '12px', color: '#6a6d70', borderTop: '1px solid #e5e5e5', background: '#fff' },
}