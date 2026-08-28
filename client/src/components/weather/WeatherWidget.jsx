import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [advisory, setAdvisory] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Fetching location...");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWeatherAndAdvisory = async (lat, lon, name = "Your Location") => {
      try {
        setLocationName(name);
        
        // 1. Fetch weather from Open-Meteo (free, no key needed)
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
        const weatherData = await weatherRes.json();
        setWeatherData(weatherData);

        // 2. Fetch AI Advisory from our backend
        const advisoryRes = await fetch("http://localhost:5000/api/weather-advisory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weatherData })
        });
        
        if (advisoryRes.ok) {
          const advisoryData = await advisoryRes.json();
          setAdvisory(advisoryData.advisory);
        } else {
          setAdvisory("Unable to generate AI advisory at this time.");
        }
      } catch (err) {
        console.error("Error fetching weather/advisory:", err);
        setAdvisory("Unable to load weather data.");
      } finally {
        setLoading(false);
      }
    };

    // Try geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherAndAdvisory(position.coords.latitude, position.coords.longitude, "Local Region");
        },
        (error) => {
          console.warn("Geolocation blocked/failed, defaulting to New Delhi", error);
          fetchWeatherAndAdvisory(28.6139, 77.2090, "New Delhi (Default)");
        }
      );
    } else {
      fetchWeatherAndAdvisory(28.6139, 77.2090, "New Delhi (Default)");
    }
  }, []);

  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className={`p-4 rounded-4 shadow-sm border ${isDark ? 'border-secondary bg-dark text-white' : 'border-light bg-white text-dark'}`}>
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border text-warning me-3" role="status"></div>
          <span>Loading Weather & AI Advisory...</span>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const current = weatherData.current_weather;

  return (
    <div className={`p-4 rounded-4 shadow border ${isDark ? 'border-warning bg-black text-white' : 'border-warning bg-white text-dark'}`} style={{ backdropFilter: "blur(10px)" }}>
      <h3 className="fw-bold mb-4 text-warning">
        <i className="bi bi-cloud-sun me-2"></i> Weather & AI Crop Advisory
      </h3>
      
      <div className="row g-4 align-items-center">
        {/* Weather Info */}
        <div className="col-md-5 border-end border-warning border-opacity-25">
          <div className="d-flex align-items-center justify-content-center gap-4">
            <h1 className="display-1 fw-bold text-success m-0">{Math.round(current.temperature)}°C</h1>
            <div>
              <p className="fs-5 text-muted mb-0">{locationName}</p>
              <p className="mb-0 fw-semibold">Wind: {current.windspeed} km/h</p>
            </div>
          </div>
        </div>

        {/* AI Advisory */}
        <div className="col-md-7">
          <div className={`p-3 rounded-3 border ${isDark ? 'bg-dark border-secondary' : 'bg-light border-warning'} position-relative`}>
            <span className="position-absolute top-0 start-0 translate-middle p-2 bg-success border border-light rounded-circle shadow">
              <span className="visually-hidden">New alerts</span>
            </span>
            <h5 className="text-success fw-bold mb-2">
              <i className="bi bi-robot me-2"></i> Gemini AI Advisory
            </h5>
            <p className="mb-0 fs-6" style={{ lineHeight: "1.6" }}>
              {advisory || "Loading intelligent advisory..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
