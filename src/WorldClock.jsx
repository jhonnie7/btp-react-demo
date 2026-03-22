import { useState, useEffect } from 'react'

const CITIES = [
  { name: 'Tel Aviv', timezone: 'Asia/Jerusalem', flag: '🇮🇱' },
  { name: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
  { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪' },
]

function getTime(timezone) {
  return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getDate(timezone) {
  return new Date().toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', month: 'long', day: 'numeric' })
}

function getHour(timezone) {
  return parseInt(new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }))
}

function getBg(timezone) {
  const h = getHour(timezone)
  if (h >= 6 && h < 12) return { bg: '#fff8e8', label: 'Morning', icon: '🌅' }
  if (h >= 12 && h < 18) return { bg: '#e8f4ff', label: 'Afternoon', icon: '☀️' }
  if (h >= 18 && h < 21) return { bg: '#fff0e8', label: 'Evening', icon: '🌆' }
  return { bg: '#1a1a2e', label: 'Night', icon: '🌙', dark: true }
}

export default function WorldClock() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <div style={styles.pageTitle}>🌍 World Clock</div>
      <div style={styles.grid}>
        {CITIES.map(city => {
          const { bg, label, icon, dark } = getBg(city.timezone)
          return (
            <div key={city.name} style={{ ...styles.clockCard, background: bg }}>
              <div style={styles.flag}>{city.flag}</div>
              <div style={{ ...styles.cityName, color: dark ? '#fff' : '#32363a' }}>{city.name}</div>
              <div style={{ ...styles.time, color: dark ? '#fff' : '#0070f2' }}>{getTime(city.timezone)}</div>
              <div style={{ ...styles.date, color: dark ? '#ccc' : '#6a6d70' }}>{getDate(city.timezone)}</div>
              <div style={styles.timeOfDay}>{icon} {label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  pageTitle: { fontSize: '20px', fontWeight: '600', color: '#32363a', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  clockCard: { borderRadius: '12px', padding: '1.5rem', textAlign: 'center', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', transition: 'transform 0.2s' },
  flag: { fontSize: '40px', marginBottom: '8px' },
  cityName: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' },
  time: { fontSize: '28px', fontWeight: '300', fontVariantNumeric: 'tabular-nums', marginBottom: '6px' },
  date: { fontSize: '12px', marginBottom: '10px' },
  timeOfDay: { fontSize: '13px', color: '#6a6d70' },
}