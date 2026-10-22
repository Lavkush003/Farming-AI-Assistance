import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const PestForecast = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    crop: "Cotton",
    pest: "Pink Bollworm",
    region: "Maharashtra",
  });

  const [liveWeather, setLiveWeather] = useState({
    tempMax: 33,
    tempMin: 22,
    humidity: 72,
    windSpeed: 11,
    rainProb: 15,
  });

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pestsByCrop = {
    "Cotton": ["Pink Bollworm", "Whitefly", "Aphids"],
    "Maize": ["Fall Armyworm", "Stem Borer", "Aphids"],
    "Rice (Paddy)": ["Yellow Stem Borer", "Brown Planthopper", "Armyworm"],
    "Wheat": ["Aphids", "Armyworm", "Termites"],
    "Tomato": ["Whitefly", "Tomato Pinworm", "Aphids"],
    "Mustard": ["Aphids", "Sawfly"],
    "Sugarcane": ["Early Shoot Borer", "Top Borer", "Whitefly"],
    "Soybean": ["Stem Fly", "Tobacco Caterpillar", "Whitefly"],
  };

  const regions = [
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "Maharashtra",
    "Madhya Pradesh",
    "Gujarat",
    "Rajasthan",
    "Karnataka",
    "Andhra Pradesh",
    "Tamil Nadu",
    "West Bengal",
    "Telangana",
  ];

  // Auto-detect GPS & live temperatures from Open-Meteo
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&current_weather=true&timezone=auto`
          );
          if (res.ok) {
            const data = await res.json();
            const tempMax = data.daily?.temperature_2m_max?.[0] || 32;
            const tempMin = data.daily?.temperature_2m_min?.[0] || 22;
            const windSpeed = data.daily?.wind_speed_10m_max?.[0] || 10;
            const rainProb = data.daily?.precipitation_probability_max?.[0] || 10;

            setLiveWeather({
              tempMax,
              tempMin,
              humidity: 70,
              windSpeed,
              rainProb,
            });
          }
        } catch (e) {
          console.warn("Weather fetch failed:", e);
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        console.warn("Location error:", err);
        setLocLoading(false);
      }
    );
  };

  const handleCropChange = (e) => {
    const selectedCrop = e.target.value;
    const availablePests = pestsByCrop[selectedCrop] || ["Aphids"];
    setForm({
      ...form,
      crop: selectedCrop,
      pest: availablePests[0],
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

    try {
      const response = await fetch(`${API_URL}/api/chat/pest-forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: form.crop,
          pest: form.pest,
          region: form.region,
          weather: liveWeather,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || "Failed to generate pest forecast.");
      }
    } catch (err) {
      console.warn("API request error, using precision degree-day fallback calculation:", err);
      // Fallback Degree-Day Biological Math
      const baseTemps = {
        "Pink Bollworm": 12.0,
        "Fall Armyworm": 10.0,
        "Aphids": 8.0,
        "Whitefly": 11.0,
        "Yellow Stem Borer": 10.5,
      };
      const baseTemp = baseTemps[form.pest] || 10.0;
      const avgTemp = (liveWeather.tempMax + liveWeather.tempMin) / 2;
      const dailyGdd = Math.max(0, Number((avgTemp - baseTemp).toFixed(1)));
      const projected7DayGdd = Math.round(dailyGdd * 7);

      let riskLevel = "Moderate";
      let riskScore = 60;
      let alertMessage = "Moderate degree-day progression. Regular field scouting recommended.";

      if (avgTemp < baseTemp) {
        riskLevel = "Low";
        riskScore = 20;
        alertMessage = "Cool temperatures suppress insect emergence. Minimal threat.";
      } else if (dailyGdd >= 12 && liveWeather.humidity >= 65) {
        riskLevel = "High";
        riskScore = 85;
        alertMessage = "🚨 HIGH RISK: Accelerated Heat Units indicate egg hatching and early instar larvae active within 48–72 hours.";
      } else if (dailyGdd >= 15 && liveWeather.humidity >= 75) {
        riskLevel = "Severe Outbreak";
        riskScore = 95;
        alertMessage = "⚠️ CRITICAL ALERT: Epidemic micro-climate conditions. Deploy immediate bio-control deterrents.";
      }

      setResult({
        crop: form.crop,
        pest: form.pest,
        region: form.region,
        dailyGdd,
        projected7DayGdd,
        baseTemp,
        riskLevel,
        riskScore,
        alertMessage,
        aiAdvisory: `• 🔍 Field Scouting: Walk across the field in a 'W' or 'Z' pattern. Inspect the underside of top leaves and terminal buds of 20 plants.\n• 🌿 Preventative Bio-Control: Install 4–5 Pheromone Traps/acre immediately to monitor adult moth activity. Spray 5% Neem Seed Kernel Extract (NSKE) as an anti-feedant.\n• ⚠️ Economic Threshold: If moth catches exceed 8 moths/trap/night for 3 consecutive days, apply approved eco-friendly formulation in early evening.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return "#10B981"; // green
      case "Moderate":
        return "#F59E0B"; // amber
      case "High":
        return "#F97316"; // orange
      case "Severe Outbreak":
        return "#EF4444"; // red
      default:
        return "#F59E0B";
    }
  };

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        backgroundColor: isDark ? "#0b0f17" : "#f8fafc",
        color: isDark ? "#f0f4ee" : "#1c261c",
        marginTop: "70px",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <span
            className="badge rounded-pill px-3 py-2 mb-3 small"
            style={{
              background: "rgba(249, 115, 22, 0.15)",
              color: "#FB923C",
              border: "1px solid rgba(249, 115, 22, 0.3)",
            }}
          >
            🐛 Predictive Agrometeorological Entomology
          </span>
          <h1 className="display-5 fw-bold text-warning mb-3">
            <i className="bi bi-shield-exclamation me-2"></i>Pest & Insect Outbreak Early Warning
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "750px" }}>
            Forecast insect emergence and population spikes 3–7 days before crop damage occurs using
            Growing Degree-Day (GDD) biological threshold modeling.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Form Card */}
          <div className="col-lg-5">
            <div
              className={`p-4 rounded-4 shadow-sm border ${
                isDark ? "border-secondary border-opacity-25" : "border-light"
              }`}
              style={{
                background: isDark ? "rgba(17, 24, 39, 0.75)" : "#ffffff",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-warning">
                  <i className="bi bi-bug me-2"></i>Target Pest & Environment
                </h5>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locLoading}
                  className="btn btn-sm btn-outline-warning rounded-pill d-flex align-items-center gap-1"
                >
                  <i className="bi bi-geo-alt"></i>
                  {locLoading ? "Detecting..." : "Detect GPS"}
                </button>
              </div>

              {/* Weather Context Badge */}
              <div
                className="p-3 rounded-3 mb-4 small d-flex justify-content-between align-items-center"
                style={{
                  background: isDark ? "rgba(15, 23, 42, 0.6)" : "#e2e8f0",
                  border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #cbd5e1",
                }}
              >
                <div>
                  <span className="text-muted d-block">Max / Min Temp:</span>
                  <strong>
                    {liveWeather.tempMax}°C / {liveWeather.tempMin}°C
                  </strong>
                </div>
                <div>
                  <span className="text-muted d-block">Humidity:</span>
                  <strong className={liveWeather.humidity > 70 ? "text-warning" : "text-muted"}>
                    {liveWeather.humidity}%
                  </strong>
                </div>
                <div>
                  <span className="text-muted d-block">Wind:</span>
                  <strong>{liveWeather.windSpeed} km/h</strong>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Target Crop</label>
                  <select
                    name="crop"
                    value={form.crop}
                    onChange={handleCropChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                    required
                  >
                    {Object.keys(pestsByCrop).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Monitored Insect Pest</label>
                  <select
                    name="pest"
                    value={form.pest}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                    required
                  >
                    {(pestsByCrop[form.crop] || ["Aphids"]).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Region / State</label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-dark" role="status"></div>
                      <span>Simulating Thermal Degree-Days...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-radar"></i>
                      <span>Analyze Pest Emergence Risk</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Presentation Card */}
          <div className="col-lg-7">
            {result ? (
              <div
                className={`p-4 p-md-5 rounded-4 shadow-sm border h-100 ${
                  isDark ? "border-secondary border-opacity-25" : "border-light"
                }`}
                style={{
                  background: isDark ? "rgba(17, 24, 39, 0.85)" : "#ffffff",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Outbreak Status Alert Banner */}
                <div
                  className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3"
                  style={{
                    background: `${getRiskColor(result.riskLevel)}18`,
                    border: `1.5px solid ${getRiskColor(result.riskLevel)}60`,
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: getRiskColor(result.riskLevel),
                      color: "#fff",
                      fontSize: "1.4rem",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <div>
                    <span
                      className="badge px-3 py-1 rounded-pill small mb-1"
                      style={{
                        backgroundColor: getRiskColor(result.riskLevel),
                        color: "#fff",
                      }}
                    >
                      {result.riskLevel} Risk ({result.riskScore}/100)
                    </span>
                    <p className="mb-0 small fw-medium text-light">{result.alertMessage}</p>
                  </div>
                </div>

                {/* Thermal GDD Metrics */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{
                        background: isDark ? "rgba(13, 27, 42, 0.7)" : "#f0f9ff",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                      }}
                    >
                      <span className="text-muted small d-block mb-1">Daily Degree-Days (GDD)</span>
                      <h4 className="fw-bold text-info mb-0">+{result.dailyGdd} °C-d</h4>
                      <small className="text-muted">Above {result.baseTemp}°C threshold</small>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{
                        background: isDark ? "rgba(24, 21, 10, 0.7)" : "#fffbeb",
                        border: "1px solid rgba(249, 168, 37, 0.25)",
                      }}
                    >
                      <span className="text-muted small d-block mb-1">7-Day Projected GDD</span>
                      <h4 className="fw-bold text-warning mb-0">~{result.projected7DayGdd} °C-d</h4>
                      <small className="text-muted">Cumulative thermal accumulation</small>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{
                        background: isDark ? "rgba(20, 30, 20, 0.7)" : "#f0fdf4",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <span className="text-muted small d-block mb-1">Spray Safety Window</span>
                      <h4 className="fw-bold text-success mb-0">
                        {liveWeather.windSpeed < 15 && liveWeather.rainProb < 40 ? "Safe Window" : "Wait (Wind/Rain)"}
                      </h4>
                      <small className="text-muted">Wind: {liveWeather.windSpeed} km/h</small>
                    </div>
                  </div>
                </div>

                {/* Integrated Pest Management (IPM) Directive */}
                <div className="mb-4">
                  <h6 className="fw-bold text-warning mb-3">
                    <i className="bi bi-clipboard2-check me-2"></i>Actionable IPM Scouting & Prevention Plan
                  </h6>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                      borderLeft: `4px solid ${getRiskColor(result.riskLevel)}`,
                      whiteSpace: "pre-line",
                      lineHeight: "1.7",
                    }}
                  >
                    {result.aiAdvisory}
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end">
                  <button
                    onClick={() => window.print()}
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  >
                    <i className="bi bi-printer me-1"></i>Print Report
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`p-5 rounded-4 shadow-sm border text-center h-100 d-flex flex-column justify-content-center align-items-center ${
                  isDark ? "border-secondary border-opacity-25" : "border-light"
                }`}
                style={{
                  background: isDark ? "rgba(17, 24, 39, 0.5)" : "#ffffff",
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "rgba(249, 115, 22, 0.15)",
                    color: "#fb923c",
                    fontSize: "2.5rem",
                  }}
                >
                  🐛
                </div>
                <h4 className="fw-bold mb-2">Simulate Pest Outbreak Risks</h4>
                <p className="text-muted small mb-4" style={{ maxWidth: "420px" }}>
                  Select your crop and common regional insect pest on the left to calculate Growing
                  Degree-Days and receive preventative bio-protection instructions before infestation begins.
                </p>
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <span className="badge rounded-pill bg-dark text-warning border border-warning border-opacity-25 px-3 py-2">
                    ✓ Degree-Day (GDD) Math
                  </span>
                  <span className="badge rounded-pill bg-dark text-info border border-info border-opacity-25 px-3 py-2">
                    ✓ 3–7 Day Early Detection
                  </span>
                  <span className="badge rounded-pill bg-dark text-success border border-success border-opacity-25 px-3 py-2">
                    ✓ Organic & IPM Strategies
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestForecast;
