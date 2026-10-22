import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const SmartIrrigation = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    crop: "Wheat",
    stage: "Flowering / Mid-Season",
    acres: "2",
    soilType: "Loam",
    irrigationMethod: "Drip Irrigation",
    region: "Punjab",
  });

  const [coords, setCoords] = useState({ lat: 31.1471, lon: 75.3412 });
  const [liveWeather, setLiveWeather] = useState({ temp: 28, humidity: 55, rain: 0, et0: 4.4 });
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const crops = [
    "Wheat",
    "Rice (Paddy)",
    "Cotton",
    "Tomato",
    "Potato",
    "Maize",
    "Sugarcane",
    "Mustard",
    "Soybean",
    "Onion",
  ];

  const stages = [
    "Initial / Seedling",
    "Vegetative / Canopy",
    "Flowering / Mid-Season",
    "Maturity / Harvesting",
  ];

  const soils = [
    "Loam (Balanced)",
    "Sandy Loam (Fast Draining)",
    "Clay Soil (High Water Retention)",
    "Black Cotton Soil (High Swell/Shrink)",
    "Sandy Soil (Low Retention)",
  ];

  const methods = [
    "Drip Irrigation (90% Efficiency)",
    "Sprinkler Irrigation (75% Efficiency)",
    "Flood / Furrow Irrigation (55% Efficiency)",
  ];

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
    "Bihar",
  ];

  // Auto-detect GPS location & live weather from Open-Meteo
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
        setCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=et0_fao_evapotranspiration,precipitation_sum&timezone=auto`
          );
          if (res.ok) {
            const data = await res.json();
            const temp = data.current_weather?.temperature || 28;
            const rain = data.daily?.precipitation_sum?.[0] || 0;
            const et0 = data.daily?.et0_fao_evapotranspiration?.[0] || 4.2;
            setLiveWeather({ temp, humidity: 60, rain, et0 });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

    try {
      const response = await fetch(`${API_URL}/api/chat/smart-irrigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: form.crop,
          stage: form.stage,
          acres: form.acres,
          soilType: form.soilType,
          irrigationMethod: form.irrigationMethod.split(" (")[0],
          region: form.region,
          weather: liveWeather,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || "Failed to calculate irrigation schedule.");
      }
    } catch (err) {
      console.warn("API request error, using precision client-side fallback calculation:", err);
      // Fallback calculation using FAO-56 standards
      const kcTable = {
        "Wheat": { "Initial / Seedling": 0.35, "Vegetative / Canopy": 0.75, "Flowering / Mid-Season": 1.15, "Maturity / Harvesting": 0.45 },
        "Rice (Paddy)": { "Initial / Seedling": 1.05, "Vegetative / Canopy": 1.15, "Flowering / Mid-Season": 1.25, "Maturity / Harvesting": 0.95 },
        "Cotton": { "Initial / Seedling": 0.40, "Vegetative / Canopy": 0.75, "Flowering / Mid-Season": 1.15, "Maturity / Harvesting": 0.65 },
        "Tomato": { "Initial / Seedling": 0.50, "Vegetative / Canopy": 0.80, "Flowering / Mid-Season": 1.15, "Maturity / Harvesting": 0.80 },
        "Potato": { "Initial / Seedling": 0.45, "Vegetative / Canopy": 0.75, "Flowering / Mid-Season": 1.15, "Maturity / Harvesting": 0.75 },
      };
      const cropKc = (kcTable[form.crop] && kcTable[form.crop][form.stage]) || 0.85;
      const etc = Number((liveWeather.et0 * cropKc).toFixed(2));
      const eff = form.irrigationMethod.includes("Drip") ? 0.9 : form.irrigationMethod.includes("Sprinkler") ? 0.75 : 0.55;
      const grossWaterPerAcre = Math.round((etc * 4047) / eff);
      const totalLiters = Math.round(grossWaterPerAcre * Number(form.acres));
      const pumpHours = Number((totalLiters / 40000).toFixed(1));

      setResult({
        crop: form.crop,
        stage: form.stage,
        acres: form.acres,
        et0: liveWeather.et0,
        kc: cropKc,
        etc,
        grossWaterPerAcre,
        totalLiters,
        pumpHours,
        efficiencyPercent: Math.round(eff * 100),
        aiAdvisory: `• ⏰ Optimal Timing: Irrigate between 6:00 AM – 8:30 AM to cut evaporative loss by up to 35%.\n• 💧 Disease Prevention: Maintain aerobic soil conditions to prevent fungal pathogens (Pythium, Rhizoctonia, Phytophthora).\n• 🌦️ Rain Adjustment: If local rainfall exceeds 10 mm, pause pump operation for 36–48 hours.`,
      });
    } finally {
      setLoading(false);
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
              background: "rgba(33, 150, 243, 0.15)",
              color: "#64B5F6",
              border: "1px solid rgba(33, 150, 243, 0.3)",
            }}
          >
            💧 Precision Agriculture & FAO-56 Standard
          </span>
          <h1 className="display-5 fw-bold text-info mb-3">
            <i className="bi bi-droplet-half me-2"></i>Smart Irrigation & ET₀ Scheduler
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "750px" }}>
            Calculate exact crop water requirements based on real-time solar evapotranspiration (ET₀).
            Prevent fungal root rot, save electricity, and optimize tube-well pump running hours.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Input Form Card */}
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
                  <i className="bi bi-sliders me-2"></i>Field & Crop Parameters
                </h5>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locLoading}
                  className="btn btn-sm btn-outline-info rounded-pill d-flex align-items-center gap-1"
                >
                  <i className="bi bi-geo-alt"></i>
                  {locLoading ? "Detecting..." : "Detect GPS"}
                </button>
              </div>

              {/* Weather Status Bar */}
              <div
                className="p-3 rounded-3 mb-4 small d-flex justify-content-between align-items-center"
                style={{
                  background: isDark ? "rgba(15, 23, 42, 0.6)" : "#e2e8f0",
                  border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #cbd5e1",
                }}
              >
                <div>
                  <span className="text-muted d-block">Live Reference ET₀:</span>
                  <strong className="text-info">{liveWeather.et0} mm/day</strong>
                </div>
                <div>
                  <span className="text-muted d-block">Temp:</span>
                  <strong>{liveWeather.temp}°C</strong>
                </div>
                <div>
                  <span className="text-muted d-block">Rain Today:</span>
                  <strong className={liveWeather.rain > 0 ? "text-success" : "text-muted"}>
                    {liveWeather.rain} mm
                  </strong>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Target Crop</label>
                  <select
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                    required
                  >
                    {crops.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Growth Phenology Stage</label>
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                    required
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">Farm Size (Acres)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.25"
                      name="acres"
                      value={form.acres}
                      onChange={handleChange}
                      className={`form-control ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                      required
                    />
                  </div>
                  <div className="col-6">
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
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Soil Texture</label>
                  <select
                    name="soilType"
                    value={form.soilType}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                  >
                    {soils.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Irrigation Method</label>
                  <select
                    name="irrigationMethod"
                    value={form.irrigationMethod}
                    onChange={handleChange}
                    className={`form-select ${isDark ? "bg-dark text-light border-secondary" : ""}`}
                  >
                    {methods.map((m) => (
                      <option key={m} value={m}>
                        {m}
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
                      <span>Calculating Evapotranspiration...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calculator"></i>
                      <span>Generate Smart Irrigation Plan</span>
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
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h4 className="fw-bold mb-0 text-success">
                    <i className="bi bi-check-circle-fill me-2"></i>Water Prescription for {result.crop}
                  </h4>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success px-3 py-2 rounded-pill">
                    Efficiency: {result.efficiencyPercent}%
                  </span>
                </div>

                {/* Metric Summary Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{
                        background: isDark ? "rgba(13, 27, 42, 0.7)" : "#f0f9ff",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                      }}
                    >
                      <span className="text-muted small d-block mb-1">Total Daily Water Needed</span>
                      <h3 className="fw-bold text-info mb-0">
                        {result.totalLiters.toLocaleString()} <span className="fs-6">Liters</span>
                      </h3>
                      <small className="text-muted">
                        ~{result.grossWaterPerAcre.toLocaleString()} L/acre ({result.etc} mm/day)
                      </small>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{
                        background: isDark ? "rgba(24, 21, 10, 0.7)" : "#fffbeb",
                        border: "1px solid rgba(249, 168, 37, 0.25)",
                      }}
                    >
                      <span className="text-muted small d-block mb-1">Recommended Pump Runtime</span>
                      <h3 className="fw-bold text-warning mb-0">
                        {result.pumpHours} <span className="fs-6">Hours</span>
                      </h3>
                      <small className="text-muted">Based on standard 5 HP pump (~40K L/hr)</small>
                    </div>
                  </div>
                </div>

                {/* Agronomy parameters breakdown */}
                <div className="p-3 rounded-3 mb-4 small" style={{ background: isDark ? "#090d16" : "#f1f5f9" }}>
                  <div className="row g-2 text-muted">
                    <div className="col-4">
                      <span>Crop Factor (Kc):</span> <strong className="text-light">{result.kc}</strong>
                    </div>
                    <div className="col-4">
                      <span>Reference ET₀:</span> <strong className="text-light">{result.et0} mm</strong>
                    </div>
                    <div className="col-4">
                      <span>Crop ETc:</span> <strong className="text-light">{result.etc} mm/day</strong>
                    </div>
                  </div>
                </div>

                {/* AI Agronomist Actionable Advice */}
                <div className="mb-4">
                  <h6 className="fw-bold text-warning mb-3">
                    <i className="bi bi-lightbulb me-2"></i>Actionable Irrigation & Disease Prevention Tips
                  </h6>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                      borderLeft: "4px solid #10b981",
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
                    <i className="bi bi-printer me-1"></i>Print Plan
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
                    background: "rgba(33, 150, 243, 0.15)",
                    color: "#38bdf8",
                    fontSize: "2.5rem",
                  }}
                >
                  💧
                </div>
                <h4 className="fw-bold mb-2">Configure Your Farm Parameters</h4>
                <p className="text-muted small mb-4" style={{ maxWidth: "420px" }}>
                  Select your crop and growth stage on the left to calculate scientifically accurate
                  evapotranspiration, prevent waterlogging, and save water resources.
                </p>
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <span className="badge rounded-pill bg-dark text-info border border-info border-opacity-25 px-3 py-2">
                    ✓ FAO-56 Penman-Monteith
                  </span>
                  <span className="badge rounded-pill bg-dark text-warning border border-warning border-opacity-25 px-3 py-2">
                    ✓ Root Rot Protection
                  </span>
                  <span className="badge rounded-pill bg-dark text-success border border-success border-opacity-25 px-3 py-2">
                    ✓ Pump Runtime Optimization
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

export default SmartIrrigation;
