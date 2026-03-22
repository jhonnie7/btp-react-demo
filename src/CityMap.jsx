import { useEffect, useRef, useState } from 'react'

const CITIES = [
  { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
]

export default function CityMap({ settings }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const defaultCity = CITIES.find(c => c.name === settings.defaultCity) || CITIES[0]
  const [selectedCity, setSelectedCity] = useState(defaultCity)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap(selectedCity)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  function initMap(city) {
    if (!window.L || !mapRef.current) return
    if (mapInstance.current) { mapInstance.current.remove() }
    const map = window.L.map(mapRef.current).setView([city.lat, city.lon], 11)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    markerRef.current = window.L.marker([city.lat, city.lon])
      .addTo(map)
      .bindPopup(`<b>${city.name}</b>`)
      .openPopup()
    mapInstance.current = map
  }

  function flyTo(city) {
    setSelectedCity(city)
    if (mapInstance.current && window.L) {
      mapInstance.current.flyTo([city.lat, city.lon], 11, { duration: 1.2 })
      if (markerRef.current) markerRef.current.remove()
      markerRef.current = window.L.marker([city.lat, city.lon])
        .addTo(mapInstance.current)
        .bindPopup(`<b>${city.name}</b>`)
        .openPopup()
    }
  }

  return (
    <div>
      <div style={styles.pageTitle}>🗺️ City Map</div>
      <div style={styles.tabBar}>
        {CITIES.map(city => (
          <button key={city.name}
            style={selectedCity.name === city.name ? styles.tabActive : styles.tab}
            onClick={() => flyTo(city)}>
            {city.name}
          </button>
        ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Map — {selectedCity.name}</div>
        <div ref={mapRef} style={styles.map} />
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
  map: { height: '500px', width: '100%' },
}