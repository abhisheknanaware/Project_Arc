import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Home.css';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
}

const Home = () => {
  const mapRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load map data.");
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (!mapRef.current || data.length === 0) return;

    loadGoogleMaps(MAPS_API_KEY).then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: { lat: 28.6139, lng: 77.2090 },
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    });

    const infowindow = new window.google.maps.InfoWindow();

    data.forEach((doc) => {
      const lat = doc.location?.latitude;
      const lon = doc.location?.longitude;
      const name = doc.location?.name;
      const aqi = parseFloat(doc.predictions?.aqi);

      if (!lat || !lon) return;

      const marker = new window.google.maps.Marker({
        position: { lat, lng: lon },
        map,
        title: name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getAQIInfo(aqi).color,
          fillOpacity: 0.9,
          strokeColor: "#000",
          strokeWeight: 1,
          scale: 14,
        },
        label: {
          text: name ? name.charAt(0).toUpperCase() : "?",
          color: "white",
          fontWeight: "bold",
        },
      });

      marker.addListener("click", () => {
        setSelectedLocation(doc);
        infowindow.setContent(`
          <div style="font-family: Inter, sans-serif; color: #333;">
            <h4 style="margin: 0 0 5px 0;">${name}</h4>
            <p style="margin: 0;"><strong>AQI:</strong> ${formatValue(aqi)}</p>
          </div>
        `);
        infowindow.open(map, marker);
      });
    });
    }).catch(err => console.error('Google Maps load error:', err));
  }, [data]);

  const getAQIInfo = (aqi) => {
    if (aqi <= 100) return { color: "#2ea043", status: "Good" };
    if (aqi <= 200) return { color: "#f9a602", status: "Moderate" };
    if (aqi <= 300) return { color: "#f85149", status: "Unhealthy" };
    return { color: "#960018", status: "Very Unhealthy" };
  };

  const formatValue = (value, decimals = 0) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    return isNaN(num) ? "N/A" : num.toFixed(decimals);
  };

  return (
    <div className="home-container animate-fade-in">
      <div className="map-view-wrapper">
        <div className="details-panel glass-panel">
          {selectedLocation ? (
            <div>
              <h3>{selectedLocation.location?.name}</h3>
              <div className="divider"></div>
              <div className="detail-item">
                <span>Predicted AQI:</span>
                <strong style={{ color: getAQIInfo(selectedLocation.predictions?.aqi).color }}>
                  {formatValue(selectedLocation.predictions?.aqi)} - {getAQIInfo(selectedLocation.predictions?.aqi).status}
                </strong>
              </div>
              <div className="detail-item">
                <span>Traffic Density:</span>
                <strong>{selectedLocation.predictions?.traffic_density}</strong>
              </div>
              <div className="divider"></div>
              
              <p className="section-title">Pollutants</p>
              <div className="detail-item"><span>PM2.5:</span> <strong>{formatValue(selectedLocation.pollution_display?.pm2_5, 1)} µg/m³</strong></div>
              <div className="detail-item"><span>PM10:</span> <strong>{formatValue(selectedLocation.pollution_display?.pm10, 1)} µg/m³</strong></div>
              <div className="detail-item"><span>CO:</span> <strong>{formatValue(selectedLocation.pollution_display?.co, 1)} µg/m³</strong></div>

              <div className="divider"></div>
              <p className="section-title">Weather</p>
              <div className="detail-item"><span>Temperature:</span> <strong>{formatValue(selectedLocation.weather?.temperature_max, 1)}°C</strong></div>
              <div className="detail-item"><span>Humidity:</span> <strong>{formatValue(selectedLocation.weather?.humidity, 0)}%</strong></div>
            </div>
          ) : (
            <div className="empty-panel">
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-secondary)' }}>manage_search</span>
              <h3>No Location Selected</h3>
              <p>Click a marker on the map to view detailed AQI, traffic, and weather data for a location.</p>
              {error && <p style={{ color: "var(--error)", marginTop: "1rem" }}>{error}</p>}
            </div>
          )}
        </div>
        
        <div className="map-container glass-panel">
          <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "12px" }}></div>
        </div>
      </div>
      
      <div className="cards-section">
        <h2 className="title text-center">Data <span className="highlight">Cards</span></h2>
        <div className="grid-cards">
          {data.map((doc, idx) => {
            const aqi = parseFloat(doc.predictions?.aqi);
            const info = getAQIInfo(aqi);
            return (
              <div key={idx} className="data-card glass-panel">
                 <div className="card-header">
                    <h4>{doc.location?.name}</h4>
                    <span className="badge" style={{ backgroundColor: info.color }}>{info.status}</span>
                 </div>
                 <div className="card-body">
                    <div className="card-stat">
                       <span>Traffic:</span>
                       <strong style={{textTransform: 'capitalize'}}>{doc.predictions?.traffic_density}</strong>
                    </div>
                    <div className="card-stat">
                       <span>AQI Score:</span>
                       <strong style={{ color: info.color }}>{formatValue(aqi)}</strong>
                    </div>
                    <div className="card-stat">
                       <span>PM2.5:</span>
                       <strong>{formatValue(doc.pollution_display?.pm2_5, 1)}</strong>
                    </div>
                    <div className="card-stat">
                       <span>Temp:</span>
                       <strong>{formatValue(doc.weather?.temperature_max, 1)}°C</strong>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
