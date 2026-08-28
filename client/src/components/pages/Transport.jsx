import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Transport = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All");

  const vehicles = [
    { id: 1, driver: "Ramesh Kumar", vehicle: "Tata 407", capacity: "2.5 Tons", route: "Pune → Mumbai", price: "₹3,500", contact: "+91 98765 43210", available: true },
    { id: 2, driver: "Sunil Yadav", vehicle: "Eicher Pro", capacity: "5 Tons", route: "Nagpur → Pune", price: "₹7,000", contact: "+91 87654 32109", available: true },
    { id: 3, driver: "Ajay Singh", vehicle: "Ashok Leyland", capacity: "10 Tons", route: "Lucknow → Delhi", price: "₹12,000", contact: "+91 76543 21098", available: true },
    { id: 4, driver: "Prakash Patil", vehicle: "Mahindra Bolero Pickup", capacity: "1.5 Tons", route: "Nashik → Mumbai", price: "₹2,500", contact: "+91 65432 10987", available: false },
    { id: 5, driver: "Manoj Sharma", vehicle: "Tata LPT", capacity: "16 Tons", route: "Jaipur → Delhi", price: "₹18,000", contact: "+91 54321 09876", available: true },
    { id: 6, driver: "Vijay Reddy", vehicle: "BharatBenz Truck", capacity: "10 Tons", route: "Bengaluru → Chennai", price: "₹10,000", contact: "+91 43210 98765", available: true },
    { id: 7, driver: "Rohit Jat", vehicle: "Tata Ace", capacity: "1 Ton", route: "Karnal → Delhi", price: "₹1,800", contact: "+91 32109 87654", available: true },
    { id: 8, driver: "Deepak Meena", vehicle: "Eicher 1110", capacity: "5 Tons", route: "Indore → Bhopal", price: "₹5,500", contact: "+91 21098 76543", available: true },
    { id: 9, driver: "Sanjay Gawli", vehicle: "Tata 1512", capacity: "10 Tons", route: "Kolhapur → Pune", price: "₹8,000", contact: "+91 10987 65432", available: false },
    { id: 10, driver: "Arjun Nair", vehicle: "Force Traveller (Goods)", capacity: "2.5 Tons", route: "Kochi → Coimbatore", price: "₹4,200", contact: "+91 09876 54321", available: true },
    { id: 11, driver: "Harpreet Singh", vehicle: "Tata Prima", capacity: "16 Tons", route: "Amritsar → Ludhiana", price: "₹15,000", contact: "+91 98123 45678", available: true },
    { id: 12, driver: "Ganesh Pawar", vehicle: "Mahindra Furio", capacity: "5 Tons", route: "Aurangabad → Mumbai", price: "₹6,500", contact: "+91 87012 34567", available: true },
  ];

  const capacities = ["All", "1 Ton", "1.5 Tons", "2.5 Tons", "5 Tons", "10 Tons", "16 Tons"];

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.driver.toLowerCase().includes(search.toLowerCase()) || v.route.toLowerCase().includes(search.toLowerCase()) || v.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesCapacity = capacityFilter === "All" || v.capacity === capacityFilter;
    return matchesSearch && matchesCapacity;
  });

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-warning mb-3">
            <i className="bi bi-truck me-2"></i>Logistics & Transport Board
          </h1>
          <p className="lead text-muted">Find trucks and transport vehicles to move your harvest from farm to market.</p>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-4 shadow-sm mb-5 border ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className={`input-group-text ${isDark ? 'bg-black text-light border-secondary' : ''}`}><i className="bi bi-search"></i></span>
                <input type="text" className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`} placeholder="Search by driver, vehicle, or route..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-7">
              <div className="d-flex flex-wrap gap-2">
                {capacities.map(c => (
                  <button key={c} className={`btn btn-sm rounded-pill ${capacityFilter === c ? 'btn-warning text-dark' : (isDark ? 'btn-outline-light' : 'btn-outline-secondary')}`} onClick={() => setCapacityFilter(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="row g-4">
          {filtered.map(v => (
            <div className="col-md-6 col-lg-4" key={v.id}>
              <div className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'} ${!v.available ? 'opacity-50' : ''}`} style={{ transition: "transform 0.2s" }} onMouseEnter={e => { if (v.available) e.currentTarget.style.transform = "translateY(-5px)"; }} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2">{v.capacity}</span>
                    <span className={`badge rounded-pill px-2 py-1 ${v.available ? 'bg-success' : 'bg-danger'}`}>
                      {v.available ? 'Available' : 'Booked'}
                    </span>
                  </div>

                  <h5 className="fw-bold">{v.vehicle}</h5>
                  <p className="text-muted small mb-1"><i className="bi bi-person-fill me-1"></i>{v.driver}</p>
                  <p className="small mb-3"><i className="bi bi-signpost-split-fill me-1 text-warning"></i><strong>{v.route}</strong></p>

                  <div className={`p-3 rounded-3 mb-3 text-center ${isDark ? 'bg-black' : 'bg-warning bg-opacity-10'}`}>
                    <small className="d-block text-muted">Estimated Price</small>
                    <h4 className="fw-bold text-warning mb-0">{v.price}</h4>
                  </div>

                  <a href={v.available ? `tel:${v.contact}` : "#"} className={`btn rounded-pill mt-auto ${v.available ? 'btn-outline-warning' : 'btn-secondary disabled'}`}>
                    <i className="bi bi-telephone me-2"></i>{v.available ? v.contact : 'Not Available'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-truck" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">No transport vehicles found matching your search.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transport;
