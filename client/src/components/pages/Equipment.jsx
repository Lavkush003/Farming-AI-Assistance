import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

const Equipment = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch(`${API_URL}/api/equipment`);
      if (!res.ok) throw new Error("Could not load equipment listings.");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("The equipment response was invalid.");
      setEquipment(data);
    } catch (err) {
      console.error("Failed to fetch equipment:", err);
      setError(err.message || "Could not load equipment listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment
    .filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        String(item.name || "").toLowerCase().includes(query) ||
        String(item.location || "").toLowerCase().includes(query);
      const matchesBudget =
        maxPrice === "" || Number(item.pricePerHour) <= Number(maxPrice);
      return matchesSearch && matchesBudget;
    })
    .sort((a, b) => Number(a.pricePerHour) - Number(b.pricePerHour));

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">
            <i className="bi bi-tractor me-2"></i>Equipment Rentals
          </h1>
          <p className="lead text-muted">Affordable tractors, harvesters, and farm tools shared by farmers near you.</p>
          <p className="text-success fw-semibold mb-3">
            Find equipment that fits your budget, with transparent hourly prices.
          </p>
          <Link to="/seller" className="btn btn-outline-success rounded-pill fw-semibold">
            <i className="bi bi-plus-circle me-2"></i>List equipment for rent
          </Link>
        </div>

        {/* Search and budget filter */}
        <div className={`p-4 rounded-4 shadow-sm mb-5 border ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="equipment-search" className="form-label fw-semibold">Search equipment or location</label>
              <div className="input-group">
                <span className={`input-group-text ${isDark ? 'bg-black text-light border-secondary' : ''}`}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  id="equipment-search"
                  type="search"
                  className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`}
                  placeholder="e.g. tractor or Pune"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="equipment-budget" className="form-label fw-semibold">Maximum price per hour (₹)</label>
              <input
                id="equipment-budget"
                type="number"
                min="0"
                step="1"
                className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`}
                placeholder="Any budget"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">{error}</div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-tools" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">
              {equipment.length === 0 ? "No equipment available right now." : "No equipment matches your search or budget."}
            </h4>
            {equipment.length === 0 && (
              <p>Have machinery to share? List it at a fair hourly rate for nearby farmers.</p>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filteredEquipment.map(item => (
              <div className="col-md-6 col-lg-4" key={item._id || `${item.name}-${item.location}`}>
                <div className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                  <img 
                    src={item.image || "https://placehold.co/400x250?text=Farm+Equipment"} 
                    alt={item.name} 
                    className="card-img-top rounded-top-4" 
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-success mb-0">{item.name}</h5>
                      <span className="badge bg-success-subtle text-success rounded-pill">₹{item.pricePerHour}/hr</span>
                    </div>
                    
                    <p className="text-muted small mb-3">
                      <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{item.location}
                    </p>
                    
                    <p className="small mb-4 flex-grow-1" style={{ color: isDark ? '#ced4da' : '#6c757d' }}>
                      {item.description}
                    </p>
                    
                    <p className="small text-muted mb-0">
                      <i className="bi bi-info-circle me-1"></i>Contact the equipment owner to arrange rental.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Equipment;
