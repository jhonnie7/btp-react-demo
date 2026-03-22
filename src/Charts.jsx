import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CITIES = [
  { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
]

function convertTemp(c, unit) {
  return unit === 'F' ? Math.round((c * 9) / 5 + 32) : Math.round(c)
}

export default function Charts({ settings }) {
  const defaultCity = CITIES.find(c => c.name === settings.defaultCity) || CITIES[0]
  const [selectedCity, setSelectedCity] = useState(defaultCity)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const unit = settings.unit

  useEffect(() => { fetchData(selectedCity) }, [selectedCity])

  async function fetchData(city) {
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
      )
      const data = await res.json()
      const formatted = data.daily.time.map((date, i) => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        Max: convertTemp(data.daily.temperature_2m_max[i], unit),
        Min: convertTemp(data.daily.temperature_2m_min[i], unit),
      }))
      setChartData(formatted)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={styles.pageTitle}>📊 Temperature Charts</div>
      <div style={styles.tabBar}>
        {CITIES.map(city => (
          <button key={city.name}
            style={selectedCity.name === city.name ? styles.tabActive : styles.tab}
            onClick={() => setSelectedCity(city)}>
            {city.name}
          </button>
        ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>7-Day Temperature Forecast — {selectedCity.name} (°{unit})</div>
        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={styles.loading}>Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit={`°${unit}`} />
                <Tooltip formatter={(val) => `${val}°${unit}`} />
                <Legend />
                <Line type="monotone" dataKey="Max" stroke="#e9544a" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Min" stroke="#0070f2" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageTitle: { fontSize: '20px', fontWeight: '600', color: '#32363a', marginBottom: '1rem' },
  tabBar: { display: 'flex', gap: '4px', marginBottom: '1rem', flexWrap: 'wrap' },
  tab: { padding: '8px 16px', border: '1px solid #c9cdd4', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#32363a' },
  tabActive: { padding: '8px 16px', border: '1px solid #0070f2', background: '#0070f2', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: '600' },
  card: { background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardHeader: { background: '#f5f6f7', borderBottom: '1px solid #e5e5e5', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#32363a' },
  loading: { textAlign: 'center', padding: '3rem', color: '#6a6d70' },
}