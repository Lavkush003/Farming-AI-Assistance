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
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-glass fixed-top py-2">
      <div className="container-fluid px-lg-4">

        <Link
          className="navbar-brand d-flex align-items-center fw-bold fs-3 text-warning"
          to="/"
          style={{ letterSpacing: "-0.5px" }}
        >
          <img
            src={logo}
            alt="FarmingHub Logo"
            style={{ width: "38px", height: "38px", marginRight: "10px", filter: "drop-shadow(0 2px 8px rgba(76,175,80,0.3))" }}
          />
          <span style={{ background: "linear-gradient(135deg, #FFD54F, #FFB300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            FarmingHub
          </span>
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
                  <button className="btn btn-warning ms-3 px-4 fw-semibold rounded-pill shadow-sm">
                    {t("login")}
                  </button>
                </Link>
              )}
            </li>

            {/* Language Selector */}
            <li className="nav-item ms-2">
              <select
                className="form-select form-select-sm bg-dark text-warning border-warning rounded-pill px-3"
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
    </nav>

    {/* Floating Chatbot Trigger with Bee Logo */}
    {!showChat && (
      <button
        onClick={() => setShowChat(true)}
        className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center position-fixed p-0 border-0 chatbot-float-btn"
        style={{
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          zIndex: 9998,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          border: "2.5px solid #ffc107",
          backgroundColor: "#2e7d32",
          cursor: "pointer"
        }}
        aria-label="Open FarmingHub AI Assistant"
        title="FarmingHub AI Assistant"
      >
        <img src={chatbotIcon} alt="Chatbot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </button>
    )}

    {/* Render Chatbot */}
    <Chatbot isOpen={showChat} onClose={() => setShowChat(false)} />

    <style>{`
      .chatbot-float-btn {
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
      }
      .chatbot-float-btn:hover {
        transform: scale(1.1) translateY(-2px);
        box-shadow: 0 12px 28px rgba(255, 193, 7, 0.5) !important;
      }
      .chatbot-float-btn:active {
        transform: scale(0.95);
      }

      .nav-btn {
        background: transparent;
        border: none;
        color: rgba(240, 244, 238, 0.9);
        padding: 0.45rem 0.85rem;
        font-weight: 500;
        font-size: 0.95rem;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .nav-btn:hover {
        color: #ffc107;
        background: rgba(46, 125, 50, 0.15);
      }

      .dropdown-menu-dark {
        background-color: #162616 !important;
        border: 1px solid rgba(76, 175, 80, 0.25) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.45) !important;
        border-radius: 12px;
        padding: 8px;
      }

      .dropdown-item {
        border-radius: 8px;
        padding: 8px 14px;
        transition: 0.2s ease;
      }

      .dropdown-item:hover, .dropdown-item.hover-warning:hover {
        background-color: rgba(46, 125, 50, 0.25) !important;
        color: #ffd54f !important;
      }

      body[data-theme="light"] .nav-btn {
        color: #1e2d1e;
      }

      body[data-theme="light"] .nav-btn:hover {
        color: #1b5e20;
        background: rgba(27, 94, 32, 0.08);
      }

      body[data-theme="light"] .dropdown-menu-dark {
        background-color: #ffffff !important;
        border: 1px solid #dee2e6 !important;
      }
      body[data-theme="light"] .dropdown-menu-dark .dropdown-item {
        color: #212529 !important;
      }
      body[data-theme="light"] .dropdown-menu-dark .dropdown-item:hover {
        background-color: #e8f5e9 !important;
        color: #1b5e20 !important;
      }
    `}</style>
  </>
);
}

export default Navbar;
