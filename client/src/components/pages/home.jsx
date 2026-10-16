import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import videoBg from "../../assets/front_video.mp4";
import WeatherWidget from "../weather/WeatherWidget";
import { useLanguage } from "../../context/LanguageContext";

function Home() {
  const { t } = useLanguage();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented by browser policy:", err);
        });
      }
    }
  }, []);

  return (
    <div className="home-page">

      {/* ======================================
          FULLSCREEN HERO VIDEO WITH MODERN OVERLAY
      ====================================== */}
      <section
        id="home"
        className="hero-section position-relative"
        aria-label="Hero"
        style={{
          width: "100%",
          minHeight: "92vh",
          overflow: "hidden",
          marginTop: "60px",
        }}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        >
          <source src={videoBg} type="video/mp4" />
          <source src="/front_video.mp4" type="video/mp4" />
          <source src="/assets/front_video.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Gradient Overlay */}
        <div
          className="d-flex flex-column align-items-center justify-content-center h-100 px-3 py-5"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(180deg, rgba(15, 26, 15, 0.45) 0%, rgba(15, 26, 15, 0.6) 50%, rgba(15, 26, 15, 0.95) 100%)",
          }}
        >
          <div className="text-center" style={{ maxWidth: "860px" }}>
            <span
              className="badge rounded-pill px-4 py-2 mb-3 shadow-sm"
              style={{
                background: "rgba(249, 168, 37, 0.2)",
                color: "#FFD54F",
                border: "1px solid rgba(249, 168, 37, 0.4)",
                backdropFilter: "blur(8px)",
                fontSize: "0.95rem",
                letterSpacing: "0.5px",
              }}
            >
              🌱 India's Next-Gen Smart Agriculture Ecosystem
            </span>

            <h1
              className="display-3 fw-bold text-white mb-3"
              style={{
                textShadow: "0 4px 24px rgba(0, 0, 0, 0.75)",
                lineHeight: 1.15,
              }}
            >
              Cultivating Prosperity with Technology
            </h1>

            <p
              className="fs-5 text-light mx-auto mb-4"
              style={{
                maxWidth: "720px",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.8)",
                opacity: 0.92,
              }}
            >
              Direct access to verified seeds, high-grade fertilizers, affordable equipment rentals, and AI-driven crop protection — all in one unified portal.
            </p>

            {/* Responsive Centered CTA Button */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/products"
                className="btn btn-warning btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg d-inline-flex align-items-center gap-2"
                style={{
                  fontSize: "1.1rem",
                  letterSpacing: "0.5px",
                }}
              >
                <span>🛒</span> {t("shopNow")}
              </Link>
              <Link
                to="/disease-detect"
                className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold rounded-pill d-inline-flex align-items-center gap-2"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(6px)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <span>🔬</span> {t("aiDiseaseDetect")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          WEATHER & AI ADVISORY WIDGET
      ====================================== */}
      <section className="container mt-4 mb-4" style={{ zIndex: 10, position: "relative" }}>
        <WeatherWidget />
      </section>

      {/* ======================================
          WHO WE ARE SECTION
      ====================================== */}
      <section className="container py-5">
        <div
          className="p-4 p-md-5 rounded-4 shadow-sm"
          style={{
            background: "rgba(22, 38, 22, 0.6)",
            border: "1px solid rgba(76, 175, 80, 0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="text-center mb-4">
            <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
              Our Roots & Mission
            </span>
            <h2 className="fw-bold mt-2">Who We Are</h2>
            <div
              className="mx-auto mt-2"
              style={{
                width: "60px",
                height: "3px",
                background: "linear-gradient(90deg, #1B5E20, #F9A825)",
                borderRadius: "2px",
              }}
            ></div>
          </div>

          <p className="text-center fs-5 text-muted mx-auto" style={{ maxWidth: "880px" }}>
            <strong className="text-light">FarmingHub</strong> is a digital agriculture platform designed to simplify how farmers access quality seeds, fertilizers, modern tools, irrigation systems, and crop protection. We eliminate middlemen in the traditional supply chain, replacing them with a transparent, farmer-first technological ecosystem.
          </p>

          <p className="text-center fs-5 text-muted mx-auto mt-3" style={{ maxWidth: "880px" }}>
            By uniting trusted agricultural manufacturers, state-of-the-art AI diagnostics, and transparent pricing, FarmingHub empowers agricultural communities to produce healthier yields and prosper sustainably.
          </p>
        </div>
      </section>

      {/* ======================================
          WHY CHOOSE FARMINGHUB
      ====================================== */}
      <section className="py-5" style={{ background: "rgba(10, 18, 10, 0.4)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
              Key Advantages
            </span>
            <h2 className="fw-bold mt-2">Why Choose FarmingHub</h2>
            <div
              className="mx-auto mt-2"
              style={{
                width: "60px",
                height: "3px",
                background: "linear-gradient(90deg, #1B5E20, #F9A825)",
                borderRadius: "2px",
              }}
            ></div>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Verified Quality Inputs",
                desc: "Every product and seed batch is thoroughly vetted for authenticity, purity, and field performance.",
                icon: "🌾",
                accent: "#2E7D32",
              },
              {
                title: "Built for Real Farmers",
                desc: "Intuitive multi-language interface tailored to the daily workflow and practical challenges of Indian farmers.",
                icon: "👨‍🌾",
                accent: "#F9A825",
              },
              {
                title: "Transparent Fair Pricing",
                desc: "Direct supplier connections eliminate middleman markups, ensuring honest rates for every purchase.",
                icon: "💰",
                accent: "#0288D1",
              },
              {
                title: "AI & Tech Enabled",
                desc: "Smart disease diagnostics, yield prediction, and verified rental networks make farming smarter.",
                icon: "📊",
                accent: "#7B1FA2",
              },
            ].map((item, i) => (
              <div className="col-md-3 col-sm-6" key={i}>
                <div
                  className="p-4 h-100 card border-0 rounded-4 shadow-sm card-hover"
                  style={{
                    borderTop: `4px solid ${item.accent}`,
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "rgba(255, 255, 255, 0.05)",
                      fontSize: "2rem",
                    }}
                  >
                    {item.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          HOW FARMINGHUB WORKS
      ====================================== */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
            Step-by-Step Guide
          </span>
          <h2 className="fw-bold mt-2">How FarmingHub Works</h2>
          <div
            className="mx-auto mt-2"
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #1B5E20, #F9A825)",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        <div className="row g-4">
          {[
            {
              step: "01",
              title: "Discover Inputs",
              desc: "Explore high-quality seeds, fertilizers, and tools best matched for your local soil and climate.",
            },
            {
              step: "02",
              title: "Compare & Select",
              desc: "Review verified certifications, transparent prices, and farmer reviews to pick the right products.",
            },
            {
              step: "03",
              title: "Seamless Booking",
              desc: "Place direct orders or reserve nearby tractors, sprayers, and cold storage with upfront rates.",
            },
            {
              step: "04",
              title: "Optimize Yield",
              desc: "Leverage AI diagnostics and expert advisory to protect your crop and maximize seasonal harvest.",
            },
          ].map((item, i) => (
            <div className="col-lg-3 col-md-6" key={i}>
              <div className="p-4 h-100 card border-0 rounded-4 shadow-sm card-hover position-relative overflow-hidden">
                <div
                  className="d-flex align-items-center justify-content-between mb-3"
                >
                  <span
                    className="badge rounded-pill fw-bold px-3 py-2"
                    style={{
                      background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  >
                    STEP {item.step}
                  </span>
                  <span className="text-muted small">Phase {i + 1}</span>
                </div>
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="text-muted small mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================
          MISSION & VISION
      ====================================== */}
      <section className="container py-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div
              className="p-4 p-md-5 h-100 card border-0 rounded-4 shadow-sm"
              style={{
                borderLeft: "6px solid #1B5E20 !important",
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="fs-2">🎯</span>
                <h3 className="fw-bold mb-0">Our Mission</h3>
              </div>
              <p className="fs-5 text-muted mb-0">
                To empower Indian farming families with transparent access to verified agricultural inputs, machine rentals, and cutting-edge artificial intelligence, transforming traditional agriculture into a highly profitable, modern enterprise.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="p-4 p-md-5 h-100 card border-0 rounded-4 shadow-sm"
              style={{
                borderLeft: "6px solid #F9A825 !important",
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="fs-2">🌟</span>
                <h3 className="fw-bold mb-0">Our Vision</h3>
              </div>
              <p className="fs-5 text-muted mb-0">
                To become India's leading digital agricultural infrastructure, driving sustainable farming practices, food security, and rural prosperity through accessible, reliable technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          CTA SECTION (MODERN GRADIENT CARD)
      ====================================== */}
      <section className="container py-5 mb-5">
        <div
          className="text-center p-5 rounded-5 shadow-lg position-relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #132213 0%, #1B5E20 50%, #0F1A0F 100%)",
            border: "1px solid rgba(76, 175, 80, 0.3)",
          }}
        >
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "rgba(249, 168, 37, 0.2)",
              color: "#FFD54F",
              border: "1px solid rgba(249, 168, 37, 0.4)",
            }}
          >
            🌾 Partner with FarmingHub
          </span>
          <h2 className="fw-bold text-white mb-3 display-5">
            Ready to Transform Your Farming Journey?
          </h2>
          <p className="fs-5 text-light opacity-75 mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Join thousands of forward-looking farmers, local suppliers, and agronomists already growing with FarmingHub.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/products"
              className="btn btn-warning btn-lg px-5 py-3 fw-bold rounded-pill shadow"
            >
              Explore Products Now
            </Link>
            <a
              href="/contact.html"
              className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold rounded-pill"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
