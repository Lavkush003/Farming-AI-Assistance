import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const YieldPredictor = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({ crop: "", acres: "", region: "", soilType: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/chat/yield-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to get prediction.");
      }
    } catch (err) {
      setError("Network error. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">
            <i className="bi bi-graph-up-arrow me-2"></i>AI Crop Yield & Revenue Predictor
          </h1>
          <p className="lead text-muted">Enter your farm details and our AI will estimate your yield, revenue, and provide tips.</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className={`card shadow-lg border-0 rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Crop Name</label>
                      <select name="crop" value={form.crop} onChange={handleChange} className={`form-select ${isDark ? 'bg-black text-light border-secondary' : ''}`} required>
                        <option value="">Select Crop</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Rice">Rice</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Soybean">Soybean</option>
                        <option value="Maize">Maize</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Onion">Onion</option>
                        <option value="Potato">Potato</option>
                        <option value="Chilli">Chilli</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Farm Size (Acres)</label>
                      <input type="number" name="acres" value={form.acres} onChange={handleChange} className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`} placeholder="e.g. 5" min="0.1" step="0.1" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Region / State</label>
                      <select name="region" value={form.region} onChange={handleChange} className={`form-select ${isDark ? 'bg-black text-light border-secondary' : ''}`} required>
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Soil Type (Optional)</label>
                      <select name="soilType" value={form.soilType} onChange={handleChange} className={`form-select ${isDark ? 'bg-black text-light border-secondary' : ''}`}>
                        <option value="">Select Soil Type</option>
                        <option value="Black Soil">Black Soil</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                        <option value="Sandy Soil">Sandy Soil</option>
                        <option value="Clay Soil">Clay Soil</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-success btn-lg px-5 rounded-pill fw-bold shadow" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Analyzing...</>
                      ) : (
                        <><i className="bi bi-magic me-2"></i>Predict Yield & Revenue</>
                      )}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="alert alert-danger mt-4 rounded-3 border-0 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                  </div>
                )}

                {result && (
                  <div className={`p-4 mt-4 rounded-4 shadow-sm border ${isDark ? 'bg-black border-success' : 'bg-success bg-opacity-10 border-success'}`}>
                    <h4 className="fw-bold text-success mb-3">
                      <i className="bi bi-bar-chart-fill me-2"></i>AI Prediction Report
                    </h4>
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>{result}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPredictor;
