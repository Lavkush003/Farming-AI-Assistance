import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

/* ------------------------------------------------------------------ */
/*  Inline styles for the detail modal (no external CSS dependency)    */
/* ------------------------------------------------------------------ */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  animation: "eqFadeIn .25s ease",
};

const modalCardBase = {
  position: "relative",
  width: "92vw",
  maxWidth: "720px",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "1.25rem",
  boxShadow: "0 24px 80px rgba(0,0,0,.55)",
  animation: "eqSlideUp .3s ease",
};

const closeBtnStyle = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  zIndex: 10,
  background: "rgba(0,0,0,0.55)",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "1.15rem",
  cursor: "pointer",
  transition: "transform .2s",
};

/* Keyframes injected once */
const KEYFRAMES_ID = "equipment-modal-keyframes";
function ensureKeyframes() {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes eqFadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes eqSlideUp { from { opacity: 0; transform: translateY(40px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes eqCardPop { from { transform: scale(1); } to { transform: scale(1.03); } }
  `;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Equipment Detail Modal Component                                   */
/* ------------------------------------------------------------------ */
const EquipmentDetailModal = ({ item, isDark, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    ensureKeyframes();
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      style={overlayStyle}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        style={{
          ...modalCardBase,
          background: isDark
            ? "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
            : "linear-gradient(160deg, #ffffff 0%, #f0f4f8 100%)",
          color: isDark ? "#f0f0f0" : "#212529",
        }}
      >
        {/* Close button */}
        <button
          style={closeBtnStyle}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Close detail view"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Large image */}
        <img
          src={item.image || "https://placehold.co/720x400?text=Farm+Equipment"}
          alt={item.name}
          style={{
            width: "100%",
            height: "340px",
            objectFit: "cover",
            borderRadius: "1.25rem 1.25rem 0 0",
          }}
        />

        {/* Content */}
        <div style={{ padding: "1.75rem 2rem 2rem" }}>
          {/* Title row */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
              {item.name}
            </h3>
            <div className="d-flex gap-2 flex-wrap">
              <span
                className="badge rounded-pill"
                style={{
                  background: "linear-gradient(135deg, #198754, #28a745)",
                  color: "#fff",
                  fontSize: "1rem",
                  padding: "0.5em 1em",
                }}
              >
                ₹{item.pricePerHour}/hr
              </span>
              {item.pricePerDay > 0 && (
                <span
                  className="badge rounded-pill"
                  style={{
                    background: "linear-gradient(135deg, #0dcaf0, #0d6efd)",
                    color: "#fff",
                    fontSize: "1rem",
                    padding: "0.5em 1em",
                  }}
                >
                  ₹{item.pricePerDay}/day
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <p className="mb-3" style={{ fontSize: "1rem", opacity: 0.85 }}>
            <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
            {item.location}
          </p>

          {/* Divider */}
          <hr style={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "#dee2e6" }} />

          {/* Description */}
          <h6 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "0.05em", fontSize: "0.8rem", opacity: 0.6 }}>
            Description
          </h6>
          <p style={{ lineHeight: 1.7, fontSize: "0.95rem", opacity: 0.9 }}>
            {item.description || "No description provided."}
          </p>

          {/* Pricing breakdown */}
          <h6 className="text-uppercase fw-bold mb-2 mt-4" style={{ letterSpacing: "0.05em", fontSize: "0.8rem", opacity: 0.6 }}>
            Pricing
          </h6>
          <div className="row g-3">
            <div className="col-6">
              <div
                className="p-3 rounded-3 text-center"
                style={{
                  background: isDark ? "rgba(25,135,84,0.15)" : "rgba(25,135,84,0.08)",
                  border: "1px solid rgba(25,135,84,0.3)",
                }}
              >
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.7, marginBottom: 4 }}>
                  Per Hour
                </div>
                <div className="fw-bold" style={{ fontSize: "1.4rem", color: "#198754" }}>
                  ₹{item.pricePerHour}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div
                className="p-3 rounded-3 text-center"
                style={{
                  background: isDark ? "rgba(13,202,240,0.12)" : "rgba(13,110,253,0.06)",
                  border: `1px solid ${item.pricePerDay > 0 ? "rgba(13,110,253,0.3)" : "rgba(128,128,128,0.2)"}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.7, marginBottom: 4 }}>
                  Per Day
                </div>
                <div className="fw-bold" style={{ fontSize: "1.4rem", color: item.pricePerDay > 0 ? "#0d6efd" : (isDark ? "#666" : "#aaa") }}>
                  {item.pricePerDay > 0 ? `₹${item.pricePerDay}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Availability badge */}
          <div className="mt-4 d-flex align-items-center gap-2">
            <span
              className="badge rounded-pill"
              style={{
                background: item.isAvailable !== false ? "#198754" : "#dc3545",
                padding: "0.45em 1em",
              }}
            >
              <i className={`bi ${item.isAvailable !== false ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
              {item.isAvailable !== false ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Contact note */}
          <div
            className="mt-4 p-3 rounded-3"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              fontSize: "0.88rem",
              opacity: 0.85,
            }}
          >
            <i className="bi bi-info-circle me-2 text-info"></i>
            Contact the equipment owner to arrange a rental. Prices may vary based on duration and availability.
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Equipment Page                                                */
/* ------------------------------------------------------------------ */
const Equipment = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

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
            Find equipment that fits your budget, with transparent hourly & daily prices.
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
                <div
                  className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`}
                  style={{
                    cursor: "pointer",
                    transition: "transform .25s ease, box-shadow .25s ease",
                  }}
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                    e.currentTarget.style.boxShadow = isDark
                      ? "0 12px 40px rgba(25,135,84,0.25)"
                      : "0 12px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelectedItem(item); }}
                  aria-label={`View details for ${item.name}`}
                >
                  {/* Image */}
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "1rem 1rem 0 0" }}>
                    <img 
                      src={item.image || "https://placehold.co/400x250?text=Farm+Equipment"} 
                      alt={item.name} 
                      className="card-img-top" 
                      style={{ height: "200px", objectFit: "cover", transition: "transform .35s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* Zoom hint */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
                        padding: "1.5rem 1rem 0.6rem",
                        color: "#fff",
                        fontSize: "0.78rem",
                        textAlign: "center",
                        opacity: 0.9,
                      }}
                    >
                      <i className="bi bi-zoom-in me-1"></i>Click to view details
                    </div>
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-success mb-0">{item.name}</h5>
                      <div className="d-flex flex-column gap-1 align-items-end">
                        <span className="badge bg-success-subtle text-success rounded-pill">₹{item.pricePerHour}/hr</span>
                        {item.pricePerDay > 0 && (
                          <span className="badge rounded-pill" style={{ background: "rgba(13,110,253,0.12)", color: "#0d6efd" }}>₹{item.pricePerDay}/day</span>
                        )}
                      </div>
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

      {/* Detail Modal */}
      {selectedItem && (
        <EquipmentDetailModal
          item={selectedItem}
          isDark={isDark}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Equipment;
