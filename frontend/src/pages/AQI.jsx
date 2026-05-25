import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './AQI.css';

/* ─── Custom Dropdown (portal-based, never clipped) ──────────── */
const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen]   = useState(false);
  const [coords, setCoords]   = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  const open = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const close = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isOpen]);

  const selected = options.find(o => o.value === value);

  return (
    <div className={`custom-select ${isOpen ? 'active' : ''}`} ref={triggerRef}>
      <div className="select-trigger" onClick={() => isOpen ? setIsOpen(false) : open()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selected?.color && <span className="option-dot" style={{ background: selected.color }} />}
          <span>{selected?.label}</span>
        </div>
        <span className="material-symbols-outlined">expand_more</span>
      </div>

      {isOpen && ReactDOM.createPortal(
        <div
          className="select-options"
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: coords.width, zIndex: 99999 }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              className={`select-option ${value === opt.value ? 'selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setIsOpen(false); }}
            >
              {opt.color && <span className="option-dot" style={{ background: opt.color }} />}
              {opt.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

/* ─── AQI Helpers ─────────────────────────────────────────────── */
const getAQIInfo = (aqi) => {
  const n = parseFloat(aqi);
  if (isNaN(n)) return { color: '#888', status: 'Unknown', bg: '#88888822', grade: 0 };
  if (n <= 50)  return { color: '#00e400', status: 'Good',          bg: '#00e40022', grade: 1 };
  if (n <= 100) return { color: '#2ea043', status: 'Satisfactory',  bg: '#2ea04322', grade: 2 };
  if (n <= 200) return { color: '#f9a602', status: 'Moderate',      bg: '#f9a60222', grade: 3 };
  if (n <= 300) return { color: '#f85149', status: 'Unhealthy',     bg: '#f8514922', grade: 4 };
  return              { color: '#960018', status: 'Very Unhealthy', bg: '#96001822', grade: 5 };
};

const getHealthAdvice = (aqi) => {
  const n = parseFloat(aqi);
  if (n <= 50)  return 'Air quality is excellent. Perfect for outdoor activities!';
  if (n <= 100) return 'Air quality is good. Enjoy your outdoor activities.';
  if (n <= 200) return 'Sensitive groups should limit prolonged outdoor exertion.';
  if (n <= 300) return 'Avoid prolonged outdoor exertion. Wear a mask if going outside.';
  return 'HEALTH ALERT: Everyone should avoid all outdoor physical activities.';
};

const fmt = (v, d = 1) => {
  if (v == null) return 'N/A';
  const n = parseFloat(v);
  return isNaN(n) ? 'N/A' : n.toFixed(d);
};

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    s.async = true; s.defer = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(s);
  });
}

/* ─── Location Detail Modal ──────────────────────────────────── */
const LocationModal = ({ doc, historyData, onClose, isDarkMode }) => {
  if (!doc) return null;
  const aqi = parseFloat(doc.predictions?.aqi);
  const info = getAQIInfo(aqi);
  const traffic = doc.predictions?.traffic_density || 'N/A';

  const trafficColor = { low: '#2ea043', moderate: '#79c0ff', busy: '#f9a602', heavy: '#f85149' }[traffic?.toLowerCase()] || '#888';

  const pollutants = [
    { label: 'PM2.5', value: fmt(doc.pollution_display?.pm2_5), unit: 'μg/m³', icon: 'grain' },
    { label: 'PM10',  value: fmt(doc.pollution_display?.pm10),  unit: 'μg/m³', icon: 'blur_on' },
    { label: 'CO',    value: fmt(doc.pollution_display?.co),    unit: 'mg/m³', icon: 'local_fire_department' },
    { label: 'NO₂',   value: fmt(doc.pollution_display?.no2),   unit: 'μg/m³', icon: 'science' },
    { label: 'SO₂',   value: fmt(doc.pollution_display?.so2),   unit: 'μg/m³', icon: 'volcano' },
    { label: 'Ozone', value: fmt(doc.pollution_display?.ozone), unit: 'μg/m³', icon: 'wb_sunny' },
  ];

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-card glass-panel ${isDarkMode ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: `2px solid ${info.color}` }}>
          <div>
            <h2 className="modal-location-name">{doc.location?.name}</h2>
            <span className="modal-coords">
              {fmt(doc.location?.latitude, 4)}°N, {fmt(doc.location?.longitude, 4)}°E
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          {/* AQI Hero */}
          <div className="modal-aqi-hero" style={{ background: info.bg, border: `1px solid ${info.color}44` }}>
            <div className="modal-aqi-score" style={{ color: info.color }}>{fmt(aqi, 0)}</div>
            <div className="modal-aqi-meta">
              <span className="modal-aqi-badge" style={{ background: info.color }}>{info.status}</span>
              <p className="modal-health-advice">{getHealthAdvice(aqi)}</p>
            </div>
          </div>

          {/* Traffic + Weather row */}
          <div className="modal-stats-row">
            <div className="modal-stat-card">
              <span className="material-symbols-outlined" style={{ color: trafficColor }}>traffic</span>
              <div>
                <p className="msc-label">Traffic</p>
                <p className="msc-value" style={{ color: trafficColor, textTransform: 'capitalize' }}>{traffic}</p>
              </div>
            </div>
            <div className="modal-stat-card">
              <span className="material-symbols-outlined" style={{ color: '#58a6ff' }}>device_thermostat</span>
              <div>
                <p className="msc-label">Temperature</p>
                <p className="msc-value">{fmt(doc.weather?.temperature_max)}°C</p>
              </div>
            </div>
            <div className="modal-stat-card">
              <span className="material-symbols-outlined" style={{ color: '#79c0ff' }}>water_drop</span>
              <div>
                <p className="msc-label">Humidity</p>
                <p className="msc-value">{fmt(doc.weather?.humidity)}%</p>
              </div>
            </div>
            <div className="modal-stat-card">
              <span className="material-symbols-outlined" style={{ color: '#d2a8ff' }}>compress</span>
              <div>
                <p className="msc-label">Pressure</p>
                <p className="msc-value">{fmt(doc.weather?.air_pressure)} hPa</p>
              </div>
            </div>
          </div>

          {/* Pollutants */}
          <div className="modal-section-title">
            <span className="material-symbols-outlined">air</span>
            Pollutant Concentrations
          </div>
          <div className="modal-pollutants-grid">
            {pollutants.map(p => (
              <div className="modal-pol-card" key={p.label}>
                <span className="material-symbols-outlined modal-pol-icon">{p.icon}</span>
                <div className="modal-pol-info">
                  <span className="modal-pol-label">{p.label}</span>
                  <span className="modal-pol-value">{p.value}</span>
                  <span className="modal-pol-unit">{p.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AQI Trend */}
          {historyData.length > 0 && (
            <>
              <div className="modal-section-title">
                <span className="material-symbols-outlined">trending_up</span>
                AQI Trend (Last 24h)
              </div>
              <div className="modal-chart">
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="time" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: info.color }}
                      labelStyle={{ color: '#aaa' }}
                    />
                    <Line type="monotone" dataKey="aqi" stroke={info.color} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─── Main AQI Component ─────────────────────────────────────── */
const AQI = () => {
  const mapRef     = useRef(null);
  const [data,     setData]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [history,  setHistory]  = useState([]);
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [isDark,   setIsDark]   = useState(localStorage.getItem('theme') !== 'light');
  const [filterAqi,     setFilterAqi]     = useState('all');
  const [filterTraffic, setFilterTraffic] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  /* fetch data */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/data', { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data);
      } catch (err) {
        setError(err.response?.status === 401 ? 'Please login to view data.' : 'Failed to load map data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* fetch history for a location */
  const fetchHistory = useCallback(async (name) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/history/${name}`, { headers: { Authorization: `Bearer ${token}` } });
      const formatted = res.data.map(item => ({
        time: new Date(item.createdAt || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: parseFloat(item.predictions?.aqi)
      }));
      setHistory(formatted);
    } catch (e) { console.error('History fetch error:', e); setHistory([]); }
  }, []);

  /* theme sync */
  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* ── FIXED FILTERS ── */
  const filteredData = data.filter(item => {
    const aqi     = parseFloat(item.predictions?.aqi);
    const traffic = (item.predictions?.traffic_density || '').toLowerCase().trim();

    let aqiMatch = true;
    if      (filterAqi === 'good')     aqiMatch = aqi <= 100;
    else if (filterAqi === 'moderate') aqiMatch = aqi > 100 && aqi <= 200;
    else if (filterAqi === 'poor')     aqiMatch = aqi > 200;

    let trafficMatch = true;
    if (filterTraffic !== 'all') trafficMatch = traffic === filterTraffic.toLowerCase();

    return aqiMatch && trafficMatch;
  });

  /* build map */
  useEffect(() => {
    if (!mapRef.current || data.length === 0) return;
    loadGoogleMaps(MAPS_API_KEY).then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 28.6139, lng: 77.2090 },
        styles: isDark ? darkMapStyles : [],
        disableDefaultUI: true,
        zoomControl: true,
      });
      const iw = new window.google.maps.InfoWindow();

      filteredData.forEach(doc => {
        const lat  = doc.location?.latitude;
        const lon  = doc.location?.longitude;
        const name = doc.location?.name;
        const aqi  = parseFloat(doc.predictions?.aqi);
        if (!lat || !lon) return;

        const info = getAQIInfo(aqi);
        const marker = new window.google.maps.Marker({
          position: { lat, lng: lon }, map, title: name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: info.color, fillOpacity: 0.9,
            strokeColor: '#fff', strokeWeight: 1.5, scale: 14,
          },
          label: { text: name ? name.charAt(0).toUpperCase() : '?', color: 'white', fontWeight: 'bold', fontSize: '11px' },
        });

        marker.addListener('click', () => {
          setSelected(doc);
          fetchHistory(name);
          setModalOpen(true);
          iw.setContent(`<div style="font-family:Inter,sans-serif;color:#111;padding:4px 8px">
            <b style="font-size:14px">${name}</b><br/>
            <span style="color:${info.color};font-weight:700">AQI ${fmt(aqi, 0)} — ${info.status}</span>
          </div>`);
          iw.open(map, marker);
        });
      });
    }).catch(e => console.error('Maps error:', e));
  }, [data, filterAqi, filterTraffic, isDark]);

  const openModal = (doc) => {
    setSelected(doc);
    fetchHistory(doc.location?.name);
    setModalOpen(true);
  };

  return (
    <div className={`aqi-container animate-fade-in ${isDark ? 'dark' : 'light'}`}>

      {/* Top Bar */}
      <div className="top-bar glass-panel">
        <div className="top-bar-left">
          <span className="material-symbols-outlined top-bar-icon">air</span>
          <span className="top-bar-title">Delhi AQI Monitor</span>
        </div>
        <div className="top-bar-filters">
          <div className="filter-group">
            <label>AQI Level</label>
            <CustomDropdown value={filterAqi} onChange={setFilterAqi} options={[
              { label: 'All Levels',       value: 'all' },
              { label: 'Good (0–100)',     value: 'good',     color: '#2ea043' },
              { label: 'Moderate (101–200)', value: 'moderate', color: '#f9a602' },
              { label: 'Poor (200+)',      value: 'poor',     color: '#f85149' },
            ]} />
          </div>
          <div className="filter-group">
            <label>Traffic</label>
            <CustomDropdown value={filterTraffic} onChange={setFilterTraffic} options={[
              { label: 'All Traffic', value: 'all' },
              { label: 'Low',        value: 'low',      color: '#2ea043' },
              { label: 'Moderate',   value: 'moderate', color: '#79c0ff' },
              { label: 'Busy',       value: 'busy',     color: '#f9a602' },
              { label: 'Heavy',      value: 'heavy',    color: '#f85149' },
            ]} />
          </div>
        </div>
        <div className="top-bar-right">
          <span className="results-badge">{filteredData.length} locations</span>
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loader-container">
          <div className="loader-ring" />
          <p>Loading Real-time AQI Data…</p>
        </div>
      ) : error && data.length === 0 ? (
        <div className="error-state glass-panel">
          <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#f85149' }}>error_outline</span>
          <h2>Access Restricted</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Login</button>
            <button className="btn btn-outline" onClick={() => window.location.href='/signup'}>Sign Up</button>
          </div>
        </div>
      ) : (
        <>
          {/* Map */}
          <div className="map-container glass-panel">
            <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
          </div>

          {/* Cards */}
          <div className="cards-section">
            <div className="cards-header">
              <h2 className="title">Location <span className="highlight">Overview</span></h2>
              <p className="cards-subtitle">Click any card to view detailed air quality data</p>
            </div>
            <div className="grid-cards">
              {filteredData.length === 0 ? (
                <div className="no-results">
                  <span className="material-symbols-outlined">search_off</span>
                  <p>No locations match your current filters.</p>
                </div>
              ) : filteredData.map((doc, idx) => {
                const aqi  = parseFloat(doc.predictions?.aqi);
                const info = getAQIInfo(aqi);
                const traffic = (doc.predictions?.traffic_density || '').toLowerCase();
                const trafficColor = { low: '#2ea043', moderate: '#79c0ff', busy: '#f9a602', heavy: '#f85149' }[traffic] || '#888';
                const aqiPercent  = Math.min((aqi / 400) * 100, 100);

                return (
                  <div key={idx} className="data-card glass-panel" onClick={() => openModal(doc)}
                    style={{ '--card-accent': info.color }}>
                    <div className="card-top">
                      <div className="card-location">
                        <span className="material-symbols-outlined card-loc-icon">location_on</span>
                        <h4>{doc.location?.name}</h4>
                      </div>
                      <span className="badge" style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}55` }}>
                        {info.status}
                      </span>
                    </div>

                    <div className="card-aqi-display">
                      <span className="card-aqi-number" style={{ color: info.color }}>{fmt(aqi, 0)}</span>
                      <span className="card-aqi-label">AQI</span>
                    </div>

                    <div className="card-aqi-bar">
                      <div className="card-aqi-bar-fill" style={{ width: `${aqiPercent}%`, background: info.color }} />
                    </div>

                    <div className="card-stats">
                      <div className="card-stat-item">
                        <span className="material-symbols-outlined" style={{ color: trafficColor, fontSize: '16px' }}>traffic</span>
                        <span style={{ textTransform: 'capitalize', color: trafficColor }}>{traffic || 'N/A'}</span>
                      </div>
                      <div className="card-stat-item">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#79c0ff' }}>grain</span>
                        <span>PM2.5: {fmt(doc.pollution_display?.pm2_5)}</span>
                      </div>
                      <div className="card-stat-item">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ffa657' }}>device_thermostat</span>
                        <span>{fmt(doc.weather?.temperature_max)}°C</span>
                      </div>
                    </div>

                    <div className="card-cta">
                      View Details <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <LocationModal
          doc={selected}
          historyData={history}
          isDarkMode={isDark}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

const darkMapStyles = [
  { elementType: 'geometry',           stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#8a9bb5' }] },
  { featureType: 'road', elementType: 'geometry',    stylers: [{ color: '#2d3748' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6b7c9e' }] },
  { featureType: 'water', elementType: 'geometry',   stylers: [{ color: '#0d1b2a' }] },
  { featureType: 'poi',  elementType: 'geometry',    stylers: [{ color: '#1e2738' }] },
  { featureType: 'poi',  elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export default AQI;
