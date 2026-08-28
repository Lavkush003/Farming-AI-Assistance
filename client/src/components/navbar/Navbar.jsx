import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/farmhive-logo.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

import Chatbot from "../chatbot/Chatbot";

import chatbotIcon from "../../assets/chatbot-icon.jpg";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, languageNames } = useLanguage();
  const [showChat, setShowChat] = React.useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container-fluid">

        <Link
          className="navbar-brand d-flex align-items-center fw-bold fs-3 text-warning"
          to="/"
        >
          <img
            src={logo}
            alt="FarmingHub Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          FarmingHub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">

            <li className="nav-item">
              <Link to="/">
                <button className="btn nav-btn">{t("home")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/products">
                <button className="btn nav-btn">{t("products")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/cart">
                <button className="btn nav-btn">{t("cart")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/market">
                <button className="btn nav-btn">{t("marketPrices")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/disease-detect">
                <button className="btn nav-btn text-success fw-bold border-success">{t("aiDiseaseDetect")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/forum">
                <button className="btn nav-btn">{t("community")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/schemes">
                <button className="btn nav-btn">{t("govSchemes")}</button>
              </Link>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item dropdown">
              <button className="btn nav-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Services
              </button>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link className="dropdown-item" to="/equipment">🚜 Equipment Rentals</Link></li>
                <li><Link className="dropdown-item" to="/yield-predictor">📈 Yield Predictor</Link></li>
                <li><Link className="dropdown-item" to="/cold-storage">❄️ Cold Storage</Link></li>
                <li><Link className="dropdown-item" to="/transport">🚚 Transport</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/about">
                <button className="btn nav-btn">{t("about")}</button>
              </Link>
            </li>

            <li className="nav-item">
              <a href="/contact.html">
                <button className="btn nav-btn">{t("contactUs")}</button>
              </a>
            </li>

            {user && (
              <li className="nav-item">
                <Link to="/seller">
                  <button className="btn nav-btn text-warning border-warning">{t("sellerPanel")}</button>
                </Link>
              </li>
            )}
            {/* Login / Profile */}
            <li className="nav-item">
              {user ? (
                <div className="dropdown ms-3">
                  <button
                    className="btn btn-warning rounded-circle fw-bold d-flex align-items-center justify-content-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end bg-dark border border-warning">
                    <li>
                      <span className="dropdown-item-text text-warning">
                        Hello, {user.name}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider bg-warning" /></li>
                    <li>
                      <button
                        className="dropdown-item text-white hover-warning d-flex align-items-center gap-2"
                        onClick={toggleTheme}
                      >
                        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </li>
                    <li>
                      <Link to="/seller" className="dropdown-item text-white hover-warning">
                        {t("sellerPanel")}
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-white hover-warning" onClick={logout}>
                        {t("logout")}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login">
                  <button className="btn btn-warning ms-3 px-4 fw-semibold">
                    {t("login")}
                  </button>
                </Link>
              )}
            </li>

            {/* Language Selector */}
            <li className="nav-item ms-2">
              <select
                className="form-select form-select-sm bg-dark text-warning border-warning"
                style={{ width: "auto", cursor: "pointer" }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </li>

          </ul>
        </div>
      </div>

      {/* Floating Chatbot Trigger with Bee Logo */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center position-fixed p-0 border-0"
          style={{
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            zIndex: 1050,
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          <img src={chatbotIcon} alt="Chatbot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </button>
      )}

      {/* Render Chatbot */}
      <Chatbot isOpen={showChat} onClose={() => setShowChat(false)} />

      <style>{`
        .nav-btn {
          background: transparent;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          font-weight: 600;
        }

        .nav-btn:hover {
          color: #ffc107;
        }

        .dropdown-item.hover-warning:hover {
            background-color: transparent;
            color: #ffc107 !important;
        }

        .theme-toggle {
          background: transparent;
          border: 1px solid #ffc107;
          color: #ffc107;
        }

        .theme-toggle:hover {
          background: #ffc107;
          color: #000;
        }

        body[data-theme="light"] .navbar {
          background-color: #fff !important;
        }

        body[data-theme="light"] .nav-btn {
          color: #000;
        }

        body[data-theme="light"] .nav-btn:hover {
          color: #ffc107;
        }
      `}</style>
    </nav >
  );
}

export default Navbar;
