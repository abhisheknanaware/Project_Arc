const cron = require("node-cron");
const { spawn } = require("child_process");
const AqiTraffic = require("../models/AqiTraffic");

let isRunning = false;

const updateAqiData = async () => {
    if (isRunning) {
        console.log("⏳ Previous job still running, skipping...");
        return;
    }

    isRunning = true;
    console.log("⏱ Fetching fresh AQI data...");

    const pythonCommand = process.platform === "win32" ? "python" : "python3";
    const python = spawn(pythonCommand, ["predict.py"]);
    let buffer = "";

    python.stdout.on("data", data => {
        buffer += data.toString();
    });

    python.stderr.on("data", data => {
        console.error(`🐍 Python Log: ${data.toString().trim()}`);
    });

    python.on("close", async (code) => {
        if (code !== 0) {
            console.error(`❌ Python script exited with code ${code}`);
            isRunning = false;
            return;
        }
        try {
            const apiData = JSON.parse(buffer);
            if (!Array.isArray(apiData) || apiData.length === 0) {
                console.error("❌ Empty data received. Skipping DB update.");
                return;
            }

            const formatted = apiData.map(item => ({
                location: {
                    name: item.NAME,
                    latitude: item.Lattitude,
                    longitude: item.Longitude
                },
                weather: {
                    temperature_max: item.TEMPRATURE_MAX,
                    humidity: item.HUMIDITY,
                    air_pressure: item.AIR_PRESSURE
                },
                pollution_display: {
                    pm2_5: item.Display_PM2_MAX,
                    pm10: item.Display_PM10_MAX,
                    co: item.Display_CO_MAX,
                    no2: item.Display_NO2_MAX,
                    so2: item.Display_SO2_MAX,
                    ozone: item.Display_OZONE_MAX
                },
                pollution_model_input: {
                    pm2_5: item.PM2_MAX,
                    pm10: item.PM10_MAX,
                    co: item.CO_MAX,
                    no2: item.NO2_MAX,
                    so2: item.SO2_MAX,
                    ozone: item.OZONE_MAX
                },
                predictions: {
                    aqi: item.AQI,
                    traffic_density: item.Predicted_Traffic_Density
                }
            }));

            await AqiTraffic.insertMany(formatted);
            console.log("✅ Database updated with fresh data");
        } catch (err) {
            console.error("❌ DB Update failed", err);
        } finally {
            isRunning = false;
        }
    });
};

// Initial run on startup
updateAqiData();

cron.schedule("*/15 * * * *", updateAqiData);
