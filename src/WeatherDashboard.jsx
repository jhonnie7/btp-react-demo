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
  51: { label: 'Light Drizzle', icon: '🌦️' },
  61: { label: 'Slight Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' }
}

function convertTemp(c, unit) {
  return unit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c)
}

export default function WeatherDashboard({ settings }) {
  const defaultCity = CITIES.find(c => c.name === settings.defaultCity) || CITIES[0]
  const [selectedCity, setSelectedCity] = useState(defaultCity)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => { fetchWeather(selectedCity) }, [selectedCity])

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

  const unit = settings.unit
  const current = weather?.current
  const daily = weather?.daily
  const weatherInfo = current ? getWeatherInfo(current.weathercode) : null

  return (
    <div>
      <div style={styles.pageTitle}>🌤️ Current Weather</div>
      <div style={styles.tabBar}>
        {CITIES.map(city => (
          <button key={city.name}
            style={selectedCity.name === city.name ? styles.tabActive : styles.tab}
            onClick={() => setSelectedCity(city)}>
            {city.name}
          </button>
        ))}
        <button style={styles.refreshBtn} onClick={() => fetchWeather(selectedCity)}>↻ Refresh</button>
      </div>
      {lastUpdated && <div style={styles.updated}>Updated: {lastUpdated}</div>}
      {loading && <div style={styles.loading}>Loading weather data...</div>}
      {error && <div style={styles.error}>{error}</div>}
      {!loading && weather && current && (
        <>
          <div style={styles.card}>
            <div style={styles.cardHeader}>Current Conditions — {selectedCity.name}</div>
            <div style={styles.currentGrid}>
              <div style={styles.bigWeather}>
                <span style={styles.bigIcon}>{weatherInfo.icon}</span>
                <div>
                  <div style={styles.bigTemp}>{convertTemp(current.temperature_2m, unit)}°{unit}</div>
                  <div style={styles.bigLabel}>{weatherInfo.label}</div>
                  <div style={styles.feelsLike}>Feels like {convertTemp(current.apparent_temperature, unit)}°{unit}</div>
                </div>
              </div>
              <div style={styles.statsGrid}>
                <StatTile label="Humidity" value={`${current.relative_humidity_2m}%`} icon="💧" />
                <StatTile label="Wind Speed" value={`${current.wind_speed_10m} km/h`} icon="💨" />
                <StatTile label="Max Today" value={`${convertTemp(daily.temperature_2m_max[0], unit)}°${unit}`} icon="🔺" />
                <StatTile label="Min Today" value={`${convertTemp(daily.temperature_2m_min[0], unit)}°${unit}`} icon="🔻" />
              </div>
            </div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>5-Day Forecast</div>
            <div style={styles.forecastGrid}>
              {daily.time.map((date, i) => {
                const info = getWeatherInfo(daily.weathercode[i])
                return (
                  <div key={date} style={styles.forecastCard}>
                    <div style={styles.forecastDay}>{i === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={styles.forecastIcon}>{info.icon}</div>
                    <div style={styles.forecastLabel}>{info.label}</div>
                    <div style={styles.forecastTemps}>
                      <span style={styles.maxTemp}>{convertTemp(daily.temperature_2m_max[i], unit)}°</span>
                      <span style={styles.minTemp}>{convertTemp(daily.temperature_2m_min[i], unit)}°</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
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
  pageTitle: { fontSize: '20px', fontWeight: '600', color: '#32363a', marginBottom: '1rem' },
  tabBar: { display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' },
  tab: { padding: '8px 16px', border: '1px solid #c9cdd4', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#32363a' },
  tabActive: { padding: '8px 16px', border: '1px solid #0070f2', background: '#0070f2', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: '600' },
  refreshBtn: { padding: '8px 16px', border: '1px solid #c9cdd4', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginLeft: 'auto' },
  updated: { fontSize: '12px', color: '#6a6d70', marginBottom: '1rem' },
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
  loading: { textAlign: 'center', padding: '3rem', color: '#6a6d70' },
  error: { background: '#ffecea', border: '1px solid #e9544a', color: '#bb0000', padding: '12px 16px', borderRadius: '6px' },
}