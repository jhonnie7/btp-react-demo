import { useState, useEffect } from 'react'

const CITIES = [
  { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
]

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  61: { label: 'Slight Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Slight Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' }
}

export default function WeatherDashboard() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchWeather(selectedCity)
  }, [selectedCity])

  async function fetchWeather(city) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=5`
      )
      const data = await res.json()
      setWeather(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      setError('Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  const current = weather?.current
  const daily = weather?.daily
  const weatherInfo = current ? getWeatherInfo(current.weathercode) : null

  return (
    <div style={styles.shell}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.sapLogo}>SAP</div>
          <span style={styles.appTitle}>Weather Dashboard</span>
        </div>
        <div style={styles.topBarRight}>
          {lastUpdated && <span style={styles.updated}>Updated: {lastUpdated}</span>}
          <button style={styles.refreshBtn} onClick={() => fetchWeather(selectedCity)}>↻ Refresh</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* City Tabs */}
        <div style={styles.tabBar}>
          {CITIES.map(city => (
            <button
              key={city.name}
              style={selectedCity.name === city.name ? styles.tabActive : styles.tab}
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          ))}
        </div>

        {loading && <div style={styles.loading}>Loading weather data...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && weather && current && (
          <>
            {/* Current Weather Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>Current Conditions — {selectedCity.name}</div>
              <div style={styles.currentGrid}>
                <div style={styles.bigWeather}>
                  <span style={styles.bigIcon}>{weatherInfo.icon}</span>
                  <div>
                    <div style={styles.bigTemp}>{Math.round(current.temperature_2m)}°C</div>
                    <div style={styles.bigLabel}>{weatherInfo.label}</div>
                    <div style={styles.feelsLike}>Feels like {Math.round(current.apparent_temperature)}°C</div>
                  </div>
                </div>
                <div style={styles.statsGrid}>
                  <StatTile label="Humidity" value={`${current.relative_humidity_2m}%`} icon="💧" />
                  <StatTile label="Wind Speed" value={`${current.wind_speed_10m} km/h`} icon="💨" />
                  <StatTile label="Max Today" value={`${Math.round(daily.temperature_2m_max[0])}°C`} icon="🔺" />
                  <StatTile label="Min Today" value={`${Math.round(daily.temperature_2m_min[0])}°C`} icon="🔻" />
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>5-Day Forecast</div>
              <div style={styles.forecastGrid}>
                {daily.time.map((date, i) => {
                  const info = getWeatherInfo(daily.weathercode[i])
                  return (
                    <div key={date} style={styles.forecastCard}>
                      <div style={styles.forecastDay}>
                        {i === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div style={styles.forecastIcon}>{info.icon}</div>
                      <div style={styles.forecastLabel}>{info.label}</div>
                      <div style={styles.forecastTemps}>
                        <span style={styles.maxTemp}>{Math.round(daily.temperature_2m_max[i])}°</span>
                        <span style={styles.minTemp}>{Math.round(daily.temperature_2m_min[i])}°</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Powered by Open-Meteo API · Deployed on SAP BTP Cloud Foundry
      </div>
    </div>
  )
}

function StatTile({ label, value, icon }) {
  return (
    <div style={styles.statTile}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

const styles = {
  shell: { minHeight: '100vh', background: '#f5f6f7', fontFamily: '"72", "72full", Arial, sans-serif', display: 'flex', flexDirection: 'column' },
  topBar: { background: '#0070f2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '48px' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  sapLogo: { background: '#fff', color: '#0070f2', fontWeight: 'bold', fontSize: '14px', padding: '2px 6px', borderRadius: '3px' },
  appTitle: { fontSize: '16px', fontWeight: '600' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  updated: { fontSize: '12px', opacity: 0.85 },
  refreshBtn: { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  content: { flex: 1, maxWidth: '960px', margin: '0 auto', padding: '1.5rem', width: '100%', boxSizing: 'border-box' },
  tabBar: { display: 'flex', gap: '4px', marginBottom: '1.25rem', flexWrap: 'wrap' },
  tab: { padding: '8px 16px', border: '1px solid #c9cdd4', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#32363a' },
  tabActive: { padding: '8px 16px', border: '1px solid #0070f2', background: '#0070f2', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: '600' },
  card: { background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', marginBottom: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardHeader: { background: '#f5f6f7', borderBottom: '1px solid #e5e5e5', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#32363a' },
  currentGrid: { padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' },
  bigWeather: { display: 'flex', alignItems: 'center', gap: '1rem' },
  bigIcon: { fontSize: '64px' },
  bigTemp: { fontSize: '48px', fontWeight: '300', color: '#0070f2', lineHeight: 1 },
  bigLabel: { fontSize: '16px', color: '#32363a', marginTop: '4px' },
  feelsLike: { fontSize: '13px', color: '#6a6d70', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1, minWidth: '240px' },
  statTile: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f6f7', borderRadius: '6px', padding: '10px 14px' },
  statIcon: { fontSize: '22px' },
  statValue: { fontSize: '18px', fontWeight: '600', color: '#32363a' },
  statLabel: { fontSize: '12px', color: '#6a6d70' },
  forecastGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', padding: '1.25rem' },
  forecastCard: { background: '#f5f6f7', borderRadius: '6px', padding: '12px', textAlign: 'center', border: '1px solid #e5e5e5' },
  forecastDay: { fontSize: '13px', fontWeight: '600', color: '#32363a', marginBottom: '8px' },
  forecastIcon: { fontSize: '28px', marginBottom: '6px' },
  forecastLabel: { fontSize: '11px', color: '#6a6d70', marginBottom: '8px' },
  forecastTemps: { display: 'flex', justifyContent: 'center', gap: '8px' },
  maxTemp: { fontSize: '14px', fontWeight: '600', color: '#32363a' },
  minTemp: { fontSize: '14px', color: '#6a6d70' },
  loading: { textAlign: 'center', padding: '3rem', color: '#6a6d70', fontSize: '15px' },
  error: { background: '#ffecea', border: '1px solid #e9544a', color: '#bb0000', padding: '12px 16px', borderRadius: '6px' },
  footer: { textAlign: 'center', padding: '12px', fontSize: '12px', color: '#6a6d70', borderTop: '1px solid #e5e5e5', background: '#fff' },
}