import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Market = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  // Mock data for Live Mandi Prices
  const marketData = [
    { id: 1, crop: "Wheat", price: "₹2,275", unit: "per quintal", trend: "up", region: "Punjab", date: "Today" },
    { id: 2, crop: "Rice (Basmati)", price: "₹4,100", unit: "per quintal", trend: "down", region: "Haryana", date: "Today" },
    { id: 3, crop: "Maize", price: "₹2,090", unit: "per quintal", trend: "stable", region: "Karnataka", date: "Today" },
    { id: 4, crop: "Sugarcane", price: "₹315", unit: "per quintal", trend: "up", region: "Uttar Pradesh", date: "Today" },
    { id: 5, crop: "Cotton", price: "₹7,200", unit: "per quintal", trend: "down", region: "Maharashtra", date: "Today" },
    { id: 6, crop: "Mustard", price: "₹5,450", unit: "per quintal", trend: "up", region: "Rajasthan", date: "Today" },
    { id: 7, crop: "Soybean", price: "₹4,600", unit: "per quintal", trend: "stable", region: "Madhya Pradesh", date: "Today" },
    { id: 8, crop: "Onion", price: "₹1,800", unit: "per quintal", trend: "up", region: "Maharashtra", date: "Today" },
    { id: 9, crop: "Potato", price: "₹1,200", unit: "per quintal", trend: "down", region: "Uttar Pradesh", date: "Today" },
    { id: 10, crop: "Tomato", price: "₹2,500", unit: "per quintal", trend: "up", region: "Karnataka", date: "Today" },
  ];

  const isDark = theme === "dark";
  const containerBg = isDark ? "#121212" : "#f8f9fa";
  const textColor = isDark ? "#ffffff" : "#212529";
  const cardBg = isDark ? "#1e1e1e" : "#ffffff";
  const borderColor = isDark ? "#333333" : "#dee2e6";

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "All" || item.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: containerBg, color: textColor, marginTop: "70px", transition: "all 0.3s ease" }}>
      <div className="container">
        
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">Live Market Prices (Mandi Rates)</h1>
          <p className="lead text-muted">Stay updated with the latest crop prices across India to get the best value for your harvest.</p>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-4 shadow-sm mb-4 border`} style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className={`input-group-text ${isDark ? 'bg-dark text-light border-secondary' : 'bg-light text-dark'}`}>
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  placeholder="Search for a crop..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <label className="fw-semibold text-nowrap">Filter by Region:</label>
                <select 
                  className={`form-select ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="All">All Regions</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className={`rounded-4 shadow-sm overflow-hidden border`} style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <div className="table-responsive">
            <table className={`table table-hover mb-0 ${isDark ? 'table-dark' : 'table-light'}`}>
              <thead className={`${isDark ? 'table-active' : 'table-success'}`}>
                <tr>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Market Price</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4 text-center">Trend</th>
                  <th className="py-3 px-4 text-end">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 fw-bold">{item.crop}</td>
                      <td className="py-3 px-4 fw-bold text-success fs-5">{item.price}</td>
                      <td className="py-3 px-4 text-muted">{item.unit}</td>
                      <td className="py-3 px-4">{item.region}</td>
                      <td className="py-3 px-4 text-center">
                        {item.trend === "up" && <span className="badge bg-success rounded-pill px-3 py-2"><i className="bi bi-arrow-up me-1"></i> Up</span>}
                        {item.trend === "down" && <span className="badge bg-danger rounded-pill px-3 py-2"><i className="bi bi-arrow-down me-1"></i> Down</span>}
                        {item.trend === "stable" && <span className="badge bg-secondary rounded-pill px-3 py-2"><i className="bi bi-dash me-1"></i> Stable</span>}
                      </td>
                      <td className="py-3 px-4 text-end text-muted small">{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No market data found for your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center text-muted small">
          <p><i className="bi bi-info-circle me-1"></i> Prices are indicative and based on average Mandi rates. Actual prices may vary based on quality and exact location.</p>
        </div>

      </div>
    </div>
  );
};

export default Market;
