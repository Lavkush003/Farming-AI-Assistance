import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ColdStorage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");

  const facilities = [
    { id: 1, name: "Snowman Logistics", city: "Pune", state: "Maharashtra", capacity: "5,000 MT", pricePerDay: "₹3.5/kg/month", contact: "+91 20 2612 3456", type: "Multi-Chamber" },
    { id: 2, name: "Hind Agro Industries", city: "Delhi", state: "Delhi", capacity: "10,000 MT", pricePerDay: "₹4.0/kg/month", contact: "+91 11 2345 6789", type: "Blast Freezer" },
    { id: 3, name: "Guru Cold Storage", city: "Ludhiana", state: "Punjab", capacity: "8,000 MT", pricePerDay: "₹2.8/kg/month", contact: "+91 161 240 5678", type: "Single Chamber" },
    { id: 4, name: "Agro Fresh Cold Chain", city: "Nagpur", state: "Maharashtra", capacity: "3,500 MT", pricePerDay: "₹3.0/kg/month", contact: "+91 712 256 7890", type: "Multi-Chamber" },
    { id: 5, name: "Allana Cold Storage", city: "Mumbai", state: "Maharashtra", capacity: "15,000 MT", pricePerDay: "₹5.0/kg/month", contact: "+91 22 2345 0000", type: "Blast Freezer" },
    { id: 6, name: "Kisan Cold Store", city: "Jaipur", state: "Rajasthan", capacity: "4,000 MT", pricePerDay: "₹2.5/kg/month", contact: "+91 141 234 5678", type: "Single Chamber" },
    { id: 7, name: "Amul Cold Chain", city: "Anand", state: "Gujarat", capacity: "12,000 MT", pricePerDay: "₹3.2/kg/month", contact: "+91 2692 258 100", type: "Multi-Chamber" },
    { id: 8, name: "Fresho Warehouse", city: "Bengaluru", state: "Karnataka", capacity: "6,500 MT", pricePerDay: "₹4.2/kg/month", contact: "+91 80 2678 1234", type: "Controlled Atmosphere" },
    { id: 9, name: "UP Cold Storage Ltd", city: "Lucknow", state: "Uttar Pradesh", capacity: "7,000 MT", pricePerDay: "₹2.0/kg/month", contact: "+91 522 234 5678", type: "Single Chamber" },
    { id: 10, name: "Haryana Agri Store", city: "Karnal", state: "Haryana", capacity: "5,500 MT", pricePerDay: "₹2.8/kg/month", contact: "+91 184 222 3456", type: "Multi-Chamber" },
    { id: 11, name: "Tamil Cold Chain", city: "Chennai", state: "Tamil Nadu", capacity: "4,200 MT", pricePerDay: "₹3.8/kg/month", contact: "+91 44 2345 6789", type: "Blast Freezer" },
    { id: 12, name: "Bengal Cold Storage", city: "Kolkata", state: "West Bengal", capacity: "9,000 MT", pricePerDay: "₹2.2/kg/month", contact: "+91 33 2456 7890", type: "Single Chamber" },
  ];

  const states = ["All", ...new Set(facilities.map(f => f.state))];

  const filtered = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.city.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === "All" || f.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-info mb-3">
            <i className="bi bi-snow me-2"></i>Cold Storage & Warehouse Finder
          </h1>
          <p className="lead text-muted">Find nearby cold storage facilities to preserve your harvest and reduce wastage.</p>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-4 shadow-sm mb-5 border ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className={`input-group-text ${isDark ? 'bg-black text-light border-secondary' : ''}`}><i className="bi bi-search"></i></span>
                <input type="text" className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`} placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2">
                {states.map(s => (
                  <button key={s} className={`btn btn-sm rounded-pill ${stateFilter === s ? 'btn-info text-white' : (isDark ? 'btn-outline-light' : 'btn-outline-secondary')}`} onClick={() => setStateFilter(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facility Cards */}
        <div className="row g-4">
          {filtered.map(facility => (
            <div className="col-md-6 col-lg-4" key={facility.id}>
              <div className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`} style={{ transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-info rounded-pill px-3 py-2">{facility.type}</span>
                    <span className={`badge rounded-pill px-2 py-1 ${isDark ? 'bg-secondary' : 'bg-light text-dark border'}`}>{facility.state}</span>
                  </div>

                  <h5 className="fw-bold text-info">{facility.name}</h5>
                  <p className="text-muted small mb-2"><i className="bi bi-geo-alt-fill me-1 text-danger"></i>{facility.city}, {facility.state}</p>

                  <div className={`p-3 rounded-3 mb-3 ${isDark ? 'bg-black' : 'bg-info bg-opacity-10'}`}>
                    <div className="row text-center">
                      <div className="col-6 border-end">
                        <small className="d-block text-muted">Capacity</small>
                        <strong>{facility.capacity}</strong>
                      </div>
                      <div className="col-6">
                        <small className="d-block text-muted">Price</small>
                        <strong className="text-info">{facility.pricePerDay}</strong>
                      </div>
                    </div>
                  </div>

                  <a href={`tel:${facility.contact}`} className="btn btn-outline-info rounded-pill mt-auto">
                    <i className="bi bi-telephone me-2"></i>{facility.contact}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-snow" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">No cold storage facilities found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdStorage;
