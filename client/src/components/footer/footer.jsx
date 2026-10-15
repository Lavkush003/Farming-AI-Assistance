import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/farmhive-logo.png";

function Footer() {
  return (
    <footer
      className="app-footer position-relative mt-5 pt-5 pb-4"
      style={{
        background: "linear-gradient(180deg, #132213 0%, #0a140a 100%)",
        borderTop: "1px solid rgba(76, 175, 80, 0.25)",
      }}
    >
      <div className="container">
        <div className="row g-4 mb-4">
          
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src={logo}
                alt="FarmingHub Logo"
                style={{ width: "36px", height: "36px", filter: "drop-shadow(0 2px 6px rgba(76,175,80,0.4))" }}
              />
              <h3 className="fw-bold text-warning mb-0 fs-4">FarmingHub</h3>
            </div>
            <p className="text-muted small pe-lg-4" style={{ lineHeight: "1.7" }}>
              India's smart digital agricultural portal. Empowering farmers with verified marketplace supplies, affordable machinery rentals, and AI-enabled plant pathology.
            </p>
            <div className="d-flex gap-2 flex-wrap mt-3">
              <span
                className="badge rounded-pill px-3 py-1 small"
                style={{
                  background: "rgba(46, 125, 50, 0.25)",
                  color: "#81C784",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                }}
              >
                🌾 Capstone Project 2026
              </span>
              <span
                className="badge rounded-pill px-3 py-1 small"
                style={{
                  background: "rgba(249, 168, 37, 0.2)",
                  color: "#FFD54F",
                  border: "1px solid rgba(249, 168, 37, 0.3)",
                }}
              >
                🇮🇳 Made for Indian Farmers
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-warning fw-bold text-uppercase small mb-3" style={{ letterSpacing: "1px" }}>
              Navigation
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none footer-link small">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-decoration-none footer-link small">
                  Marketplace
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/equipment" className="text-decoration-none footer-link small">
                  Equipment Rentals
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/disease-detect" className="text-decoration-none footer-link small">
                  AI Plant Doctor
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/About" className="text-decoration-none footer-link small">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Portals */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-warning fw-bold text-uppercase small mb-3" style={{ letterSpacing: "1px" }}>
              Agri Services
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/yield-predictor" className="text-decoration-none footer-link small">
                  📈 Crop Yield Predictor
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cold-storage" className="text-decoration-none footer-link small">
                  ❄️ Cold Storage Finder
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/transport" className="text-decoration-none footer-link small">
                  🚚 Rural Transport
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/schemes" className="text-decoration-none footer-link small">
                  📜 Govt Schemes (Kisan)
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-decoration-none footer-link small">
                  💬 Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-warning fw-bold text-uppercase small mb-3" style={{ letterSpacing: "1px" }}>
              Connect With Us
            </h6>
            <ul className="list-unstyled small mb-3 text-muted">
              <li className="mb-2 d-flex align-items-center gap-2">
                <span>📞</span>
                <span className="text-light">+91 7719425010</span>
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <span>📧</span>
                <span className="text-light">support@farmhive.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span>📍</span>
                <span className="text-light">Phagwara, Punjab, India</span>
              </li>
            </ul>

            <div className="d-flex gap-3 align-items-center mt-3">
              <a
                href="https://www.linkedin.com/in/lavkush001/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-warning rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-warning rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="#"
                className="btn btn-sm btn-outline-warning rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(76, 175, 80, 0.2)" }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 pt-2">
          <p className="text-muted small mb-0">
            © {new Date().getFullYear()} <span className="text-warning fw-semibold">FarmingHub</span> — Final Year Capstone Project. All Rights Reserved.
          </p>
          <div className="d-flex gap-3 small">
            <span className="text-muted">Empowering 100K+ Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
