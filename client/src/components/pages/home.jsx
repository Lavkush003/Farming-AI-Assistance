import React from "react";
import { Link } from "react-router-dom";
import videoBg from "../../assets/front_video.mp4";
import WeatherWidget from "../weather/WeatherWidget";
import { useLanguage } from "../../context/LanguageContext";

function Home() {
  const { t } = useLanguage();
  return (
    <div>

      {/* ======================================
          FULLSCREEN HERO VIDEO (PERFECT FIT)
      ====================================== */}
      <section
        id="home"
        className="hero-section"
        aria-label="Hero"
        style={{
          position: "relative",
          width: "100%",
          height: "92vh",
          overflow: "hidden",
          marginTop: "70px",
        }}
      >

        {/* Background Video */}
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
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
          }}
        />
        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            textAlign: "center",
            color: "white",
            width: "100%",
          }}
        >
          <Link to="/products" className="btn btn-warning btn-lg px-5 fw-semibold " style={{
            position: "absolute", bottom: "-320px", left: "650px"
          }}> {t("shopNow")}</Link>
        </div>
      </section>

      {/* ======================================
          WEATHER & AI ADVISORY
      ====================================== */}
      <section className="container mt-5 mb-3" style={{ zIndex: 10, position: "relative" }}>
        <WeatherWidget />
      </section>

      <section className="container py-5">
        <h2 className="fw-bold text-center mb-4">Who We Are</h2>
        <p
          className="text-center fs-5 text-muted mx-auto"
          style={{ maxWidth: "900px" }}
        >
          FarmingHub is a digital agriculture platform designed to simplify how
          farmers access seeds, fertilizers, tools, irrigation equipment, and
          crop protection solutions. We aim to eliminate inefficiencies in the
          traditional supply chain and replace them with a transparent,
          technology-driven ecosystem.
        </p>
        <p
          className="text-center fs-5 text-muted mx-auto mt-3"
          style={{ maxWidth: "900px" }}
        >
          By combining trusted suppliers, modern technology, and a farmer-first
          mindset, FarmingHub helps agricultural communities grow sustainably and
          profitably.
        </p>
      </section>

      {/* ======================================
          WHY CHOOSE FARMHIVE
      ====================================== */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Why Choose FarmingHub</h2>

          <div className="row text-center g-4">
            {[
              {
                title: "Verified Quality Products",
                desc: "All products available on FarmingHub go through a quality verification process to ensure reliability and effectiveness on the field.",
                icon: "🌾",
              },
              {
                title: "Built for Farmers",
                desc: "Our platform is designed after understanding real-world challenges faced by farmers across different regions.",
                icon: "👨‍🌾",
              },
              {
                title: "Transparent Pricing",
                desc: "We remove unnecessary intermediaries, ensuring fair pricing and better value for every purchase.",
                icon: "💰",
              },
              {
                title: "Technology Enabled",
                desc: "From product discovery to order tracking, technology helps make farming smarter and more efficient.",
                icon: "📊",
              },
            ].map((item, i) => (
              <div className="col-md-3" key={i}>
                <div className="p-4 h-100 shadow-sm card rounded">
                  <div style={{ fontSize: "2.5rem" }} className="mb-3">
                    {item.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          HOW FARMHIVE WORKS
      ====================================== */}
      <section className="container py-5">
        <h2 className="fw-bold text-center mb-5">How FarmingHub Works</h2>

        <div className="row text-center g-4">
          {[
            {
              step: "01",
              title: "Discover Products",
              desc: "Browse a wide range of agriculture products suited to your crop and farming needs.",
            },
            {
              step: "02",
              title: "Compare & Choose",
              desc: "Compare quality, pricing, and categories before making informed decisions.",
            },
            {
              step: "03",
              title: "Place Orders",
              desc: "Order directly from trusted suppliers with transparent pricing.",
            },
            {
              step: "04",
              title: "Grow Better",
              desc: "Use reliable inputs to improve yield, efficiency, and farm productivity.",
            },
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="p-4 h-100 border rounded card shadow-sm">
                <h2 className="text-warning fw-bold">{item.step}</h2>
                <h5 className="fw-bold mt-3">{item.title}</h5>
                <p className="text-muted mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================
          MISSION & VISION
      ====================================== */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <h3 className="fw-bold mb-3">Our Mission</h3>
            <p className="fs-5 text-muted">
              To empower farmers with easy access to quality agricultural inputs
              while enabling informed decision-making through transparency and
              technology.
            </p>
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="fw-bold mb-3">Our Vision</h3>
            <p className="fs-5 text-muted">
              To become India’s most trusted digital agriculture ecosystem,
              supporting sustainable farming and long-term rural prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================
          CTA
      ====================================== */}
      <section
        className="text-center text-light py-5"
        style={{ backgroundColor: "#000" }}
      >
        <h2 className="fw-bold text-warning mb-3">
          Partner with FarmingHub
        </h2>
        <p className="fs-5 mb-4">
          Join a growing community of farmers and agri-partners shaping the
          future of agriculture.
        </p>
        <a href="/contact.html">
          <button className="btn btn-warning btn-lg px-5 fw-semibold">
            Get Started Today
          </button>
        </a>
      </section>

    </div>
  );
}
export default Home;
