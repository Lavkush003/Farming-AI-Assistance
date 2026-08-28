import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const Schemes = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const schemes = [
    {
      id: 1,
      name: "PM-KISAN",
      fullName: "Pradhan Mantri Kisan Samman Nidhi",
      category: "Income Support",
      benefit: "₹6,000/year in 3 installments directly to bank account",
      eligibility: "All landholding farmer families",
      link: "https://pmkisan.gov.in",
      status: "Active",
    },
    {
      id: 2,
      name: "PM Fasal Bima Yojana",
      fullName: "Pradhan Mantri Fasal Bima Yojana",
      category: "Crop Insurance",
      benefit: "Crop insurance at 2% premium (Kharif), 1.5% (Rabi)",
      eligibility: "All farmers growing notified crops",
      link: "https://pmfby.gov.in",
      status: "Active",
    },
    {
      id: 3,
      name: "Kisan Credit Card",
      fullName: "Kisan Credit Card (KCC)",
      category: "Credit",
      benefit: "Short-term crop loans at 4% interest rate",
      eligibility: "All farmers, fishermen, and animal husbandry farmers",
      link: "https://www.nabard.org",
      status: "Active",
    },
    {
      id: 4,
      name: "Soil Health Card",
      fullName: "Soil Health Card Scheme",
      category: "Soil & Fertilizer",
      benefit: "Free soil testing and nutrient management recommendations",
      eligibility: "All farmers across India",
      link: "https://soilhealth.dac.gov.in",
      status: "Active",
    },
    {
      id: 5,
      name: "e-NAM",
      fullName: "National Agriculture Market",
      category: "Market Access",
      benefit: "Online platform to sell produce at best prices across mandis",
      eligibility: "All farmers with Aadhaar-linked bank account",
      link: "https://enam.gov.in",
      status: "Active",
    },
    {
      id: 6,
      name: "PM Krishi Sinchai Yojana",
      fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
      category: "Irrigation",
      benefit: "Subsidy on micro-irrigation (drip & sprinkler) systems",
      eligibility: "All farmers, priority to small & marginal",
      link: "https://pmksy.gov.in",
      status: "Active",
    },
    {
      id: 7,
      name: "SMAM",
      fullName: "Sub-Mission on Agricultural Mechanization",
      category: "Equipment",
      benefit: "40-80% subsidy on farm machinery and equipment",
      eligibility: "Individual farmers, FPOs, cooperatives",
      link: "https://agrimachinery.nic.in",
      status: "Active",
    },
    {
      id: 8,
      name: "Paramparagat Krishi Vikas Yojana",
      fullName: "Paramparagat Krishi Vikas Yojana (PKVY)",
      category: "Organic Farming",
      benefit: "₹50,000/ha for 3 years for organic farming adoption",
      eligibility: "Farmer groups of 50+ in a cluster of 20 hectares",
      link: "https://pgsindia-ncof.gov.in",
      status: "Active",
    },
  ];

  const categories = ["All", ...new Set(schemes.map(s => s.category))];

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa", color: isDark ? "#fff" : "#212529", marginTop: "70px" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success mb-3">
            <i className="bi bi-bank me-2"></i>Government Schemes & Subsidies
          </h1>
          <p className="lead text-muted">Explore government programs designed to support Indian farmers with financial aid, insurance, and resources.</p>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-4 shadow-sm mb-4 border ${isDark ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className={`input-group-text ${isDark ? 'bg-black text-light border-secondary' : ''}`}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-black text-light border-secondary' : ''}`}
                  placeholder="Search schemes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`btn btn-sm rounded-pill ${filter === cat ? 'btn-success' : (isDark ? 'btn-outline-light' : 'btn-outline-secondary')}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="row g-4">
          {filteredSchemes.map(scheme => (
            <div className="col-md-6 col-lg-4" key={scheme.id}>
              <div className={`card h-100 border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : 'bg-white'}`} style={{ transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-success rounded-pill px-3 py-2">{scheme.category}</span>
                    <span className="badge bg-info rounded-pill px-2 py-1"><i className="bi bi-check-circle me-1"></i>{scheme.status}</span>
                  </div>

                  <h5 className="fw-bold text-success">{scheme.name}</h5>
                  <p className="text-muted small mb-2">{scheme.fullName}</p>

                  <div className={`p-3 rounded-3 mb-3 ${isDark ? 'bg-black' : 'bg-success bg-opacity-10'}`}>
                    <small className="fw-bold text-success d-block mb-1">Benefit:</small>
                    <span className="fw-semibold">{scheme.benefit}</span>
                  </div>

                  <p className="small text-muted mb-3">
                    <i className="bi bi-person-check me-1"></i>
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </p>

                  <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success rounded-pill mt-auto">
                    <i className="bi bi-box-arrow-up-right me-1"></i> Visit Official Site
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">No schemes found matching your search.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
