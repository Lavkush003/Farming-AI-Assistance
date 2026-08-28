import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Equipment = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment");
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error("Failed to fetch equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">
            <i className="bi bi-tractor me-2"></i>Equipment Rentals
          </h1>
          <p className="lead text-muted">Rent tractors, harvesters, and tools from farmers near you.</p>
        </div>

        {/* Search */}
        <div className={`p-4 rounded-4 shadow-sm mb-5 border ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
          <div className="input-group">
            <span className={`input-group-text ${isDark ? 'bg-black text-light border-secondary' : ''}`}>
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`}
              placeholder="Search by equipment name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-tools" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">No equipment available right now.</h4>
          </div>
        ) : (
          <div className="row g-4">
            {filteredEquipment.map(item => (
              <div className="col-md-6 col-lg-4" key={item._id}>
                <div className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                  <img 
                    src={item.image || "https://via.placeholder.com/400x250?text=No+Image"} 
                    alt={item.name} 
                    className="card-img-top rounded-top-4" 
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-success mb-0">{item.name}</h5>
                      <span className="badge bg-warning text-dark rounded-pill">₹{item.pricePerHour}/hr</span>
                    </div>
                    
                    <p className="text-muted small mb-3">
                      <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{item.location}
                    </p>
                    
                    <p className="small mb-4 flex-grow-1" style={{ color: isDark ? '#ced4da' : '#6c757d' }}>
                      {item.description}
                    </p>
                    
                    <button className="btn btn-success w-100 rounded-pill fw-bold">
                      <i className="bi bi-calendar-check me-2"></i>Request Booking
                    </button>
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
