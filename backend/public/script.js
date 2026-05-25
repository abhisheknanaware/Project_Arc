// This function is called by the Google Maps script
function initMap() {
  // 1. Initialize the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 18.5204, lng: 73.8567 },
  });
  
  // 2. Call fetchDataAndPlot with just the map
  fetchDataAndPlot(map);
}

/**
 * Helper function to format numbers.
 */
const formatValue = (value, decimalPlaces = 0) => {
  if (value === null || typeof value === "undefined") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return num.toFixed(decimalPlaces);
};

/**
 * Gets a color and status object based on the AQI value
 */
function getAQIInfo(aqi) {
  if (aqi <= 100) return { color: '#00a86b', status: 'Good' }; // Green
  if (aqi <= 200) return { color: '#f9a602', status: 'Moderate' }; // Orange
  if (aqi <= 300) return { color: '#f95738', status: 'Unhealthy' }; // Red
  return { color: '#960018', status: 'Very Unhealthy' }; // Maroon
}

async function fetchDataAndPlot(map) {
  const panel = document.getElementById("details-panel");
  if (!panel) return;

  try {
    const response = await fetch("/api/data");
    const data = await response.json();

    populateDataCards(data);

    const infowindow = new google.maps.InfoWindow();

    data.forEach(doc => {
      const lat = doc.location.latitude;
      const lon = doc.location.longitude;
      const name = doc.location.name;

      const aqi = parseFloat(doc.predictions.aqi);
      const traffic = doc.predictions.traffic_density;

      if (!lat || !lon) return;

      const aqiInfo = getAQIInfo(aqi);

      const marker = new google.maps.Marker({
        position: { lat, lng: lon },
        map,
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: aqiInfo.color,
          fillOpacity: 0.9,
          strokeColor: "#000",
          strokeWeight: 1,
          scale: 12
        },
        label: {
          text: name.charAt(0).toUpperCase(),
          color: "white",
          fontWeight: "bold"
        }
      });

      const sidebarContent = `
        <h3>${name}</h3>
        <hr>
        <p><strong>Predicted AQI:</strong> ${formatValue(aqi)}</p>
        <p><strong>Traffic:</strong> ${traffic}</p>
        <hr>
        <p><strong>PM2.5:</strong> ${formatValue(doc.pollution_display.pm2_5, 1)} µg/m³</p>
        <p><strong>PM10:</strong> ${formatValue(doc.pollution_display.pm10, 1)} µg/m³</p>
        <p><strong>CO:</strong> ${formatValue(doc.pollution_display.co, 1)} µg/m³</p>
        <hr>
        <p><strong>Temperature:</strong> ${formatValue(doc.weather.temperature_max, 1)} °C</p>
        <p><strong>Humidity:</strong> ${formatValue(doc.weather.humidity, 0)} %</p>
      `;

      const popupContent = `
        <div style="font-family: Arial;">
          <h4>${name}</h4>
          <p><strong>AQI:</strong> ${formatValue(aqi)}</p>
          <p><strong>Traffic:</strong> ${traffic}</p>
        </div>
      `;

      marker.addListener("click", () => {
        panel.innerHTML = sidebarContent;
        infowindow.setContent(popupContent);
        infowindow.open(map, marker);
      });
    });

  } catch (err) {
    panel.innerHTML = `<p style="color:red">Failed to load data</p>`;
    console.error(err);
  }
}


/**
 * ✅ Populates a card grid (USING "Display_" fields)
 */
function populateDataCards(data) {
  const container = document.getElementById("card-grid");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(doc => {
    const name = doc.location.name;
    const aqi = parseFloat(doc.predictions.aqi);
    const traffic = doc.predictions.traffic_density;

    const aqiInfo = getAQIInfo(aqi);
    const aqiPercent = Math.min((aqi / 300) * 100, 100);

    const card = document.createElement("div");
    card.className = "data-card";

    card.innerHTML = `
      <div class="card-header">
        <h3>${name}</h3>
        <div>${traffic}</div>
      </div>

      <div class="card-body">
        <div class="aqi-gauge"
          style="background: conic-gradient(${aqiInfo.color} ${aqiPercent}%, #eee 0)">
          <div class="aqi-gauge-inner">
            <div class="aqi-value" style="color:${aqiInfo.color}">
              ${formatValue(aqi)}
            </div>
            <div class="aqi-label">AQI</div>
          </div>
        </div>

        <div class="card-stats">
          <div class="stat-item">
            <span>PM2.5</span>
            <strong>${formatValue(doc.pollution_display.pm2_5, 1)}</strong>
          </div>
          <div class="stat-item">
            <span>CO</span>
            <strong>${formatValue(doc.pollution_display.co, 1)}</strong>
          </div>
          <div class="stat-item">
            <span>Temp</span>
            <strong>${formatValue(doc.weather.temperature_max, 1)} °C</strong>
          </div>
          <div class="stat-item">
            <span>Status</span>
            <strong style="color:${aqiInfo.color}">
              ${aqiInfo.status}
            </strong>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


// Manually attach the initMap function to the window
window.initMap = initMap;