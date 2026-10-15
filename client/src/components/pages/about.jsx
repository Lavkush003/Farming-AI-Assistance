import React from "react";
import { Link } from "react-router-dom";
import founderImg from "../../assets/founder.jpg";

const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section
        className="about-hero text-center text-white d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(15, 26, 15, 0.6) 0%, rgba(15, 26, 15, 0.85) 100%), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          marginTop: "60px",
        }}
      >
        <div className="container px-3 py-5">
          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "rgba(249, 168, 37, 0.2)",
              color: "#FFD54F",
              border: "1px solid rgba(249, 168, 37, 0.4)",
              backdropFilter: "blur(6px)",
            }}
          >
            🌾 Our Journey & Vision
          </span>
          <h1 className="display-3 fw-bold mb-3 slide-up text-warning">
            Cultivating the Future
          </h1>
          <p className="lead fs-4 slide-up-delay mx-auto text-light opacity-90" style={{ maxWidth: "750px" }}>
            Where agricultural tradition meets modern artificial intelligence to empower the next generation of farmers.
          </p>
        </div>
      </section>

      <div className="container py-4">

        {/* ================= OUR STORY ================= */}
        <section className="row align-items-center py-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2670&auto=format&fit=crop"
                alt="Indian Farmer in Field"
                className="img-fluid rounded-4 shadow-lg hover-scale w-100"
                style={{
                  objectFit: "cover",
                  maxHeight: "440px",
                  border: "1px solid rgba(76, 175, 80, 0.25)",
                }}
              />
              <div
                className="position-absolute bottom-0 start-0 m-3 p-3 rounded-3 shadow-lg d-none d-sm-block"
                style={{
                  background: "rgba(15, 26, 15, 0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(249, 168, 37, 0.35)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-3">🌾</span>
                  <div>
                    <h6 className="fw-bold mb-0 text-warning">100% Verified</h6>
                    <small className="text-light opacity-75">Farmer First Platform</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 ps-lg-5">
            <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
              Our Story
            </span>
            <h2 className="fw-bold mb-4 display-6">
              From Intermediaries to One Smart Platform
            </h2>
            <p className="text-muted fs-5">
              FarmingHub was born out of a critical observation: farmers often face inflated input costs, uncertain product authenticity, and lack of accessible farm machinery.
            </p>
            <p className="text-muted">
              Founded in 2023 as an advanced capstone initiative, we directly connect farmers with verified agricultural producers and nearby equipment owners, delivering transparency, fair prices, and AI-enabled diagnostics.
            </p>

            {/* Glowing Metric Cards */}
            <div className="row g-3 mt-2">
              <div className="col-6">
                <div
                  className="p-3 rounded-4 card border-0 text-center"
                  style={{
                    background: "rgba(27, 94, 32, 0.15)",
                    border: "1px solid rgba(76, 175, 80, 0.3) !important",
                  }}
                >
                  <h2 className="fw-bold text-warning mb-0" style={{ textShadow: "0 0 16px rgba(249,168,37,0.35)" }}>
                    2023
                  </h2>
                  <p className="small text-muted mb-0 mt-1">Initiative Founded</p>
                </div>
              </div>

              <div className="col-6">
                <div
                  className="p-3 rounded-4 card border-0 text-center"
                  style={{
                    background: "rgba(27, 94, 32, 0.15)",
                    border: "1px solid rgba(76, 175, 80, 0.3) !important",
                  }}
                >
                  <h2 className="fw-bold text-warning mb-0" style={{ textShadow: "0 0 16px rgba(249,168,37,0.35)" }}>
                    50+
                  </h2>
                  <p className="small text-muted mb-0 mt-1">Verified Brands & Inputs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY FARMINGHUB ================= */}
        <section className="py-5 text-center">
          <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
            Platform Pillars
          </span>
          <h2 className="fw-bold mb-5 mt-2">Core Values Driving FarmingHub</h2>

          <div className="row g-4">
            {[
              {
                title: "Quality First",
                desc: "Every product, fertilizer, and seed batch undergoes strict authenticity checks.",
                icon: "bi-patch-check-fill",
                color: "#2E7D32",
              },
              {
                title: "Farmer Centric",
                desc: "Designed around the authentic workflow, languages, and budgets of Indian growers.",
                icon: "bi-heart-fill",
                color: "#E53935",
              },
              {
                title: "Tech Driven",
                desc: "Real-time weather tracking, computer vision disease identification, and yield analytics.",
                icon: "bi-cpu-fill",
                color: "#0288D1",
              },
              {
                title: "Sustainable Future",
                desc: "Promoting organic practices, water conservation, and soil vitality for long-term health.",
                icon: "bi-tree-fill",
                color: "#43A047",
              },
            ].map((item, i) => (
              <div className="col-md-3 col-sm-6" key={i}>
                <div className="card h-100 border-0 shadow-sm p-4 feature-card rounded-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "64px",
                      height: "64px",
                      background: `rgba(255, 255, 255, 0.05)`,
                      color: item.color,
                    }}
                  >
                    <i className={`bi ${item.icon} fs-2`}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TEAM SECTION ================= */}
        <section className="team-section py-5 rounded-5 p-4 p-md-5 mb-5 shadow-lg position-relative overflow-hidden">
          <div className="text-center mb-5">
            <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
              Creators & Leadership
            </span>
            <h2 className="fw-bold text-white mt-2">The Mind Behind FarmingHub</h2>
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

          <div className="row g-4 justify-content-center">
            {[
              {
                name: "Lavkush Nishad",
                role: "Lead Software Architect & Developer",
                tag: "Final Year Capstone Creator",
                img: founderImg,
              },
            ].map((member, i) => (
              <div className="col-md-5 col-sm-8 text-center" key={i}>
                <div
                  className="p-4 rounded-4"
                  style={{
                    background: "rgba(15, 26, 15, 0.7)",
                    border: "1px solid rgba(249, 168, 37, 0.3)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="position-relative d-inline-block mb-3">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="rounded-circle shadow-lg"
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "cover",
                        border: "4px solid #F9A825",
                        boxShadow: "0 0 24px rgba(249, 168, 37, 0.35)",
                      }}
                    />
                  </div>
                  <h4 className="fw-bold text-warning mb-1">{member.name}</h4>
                  <p className="text-light fw-medium small mb-2">{member.role}</p>
                  <span
                    className="badge rounded-pill px-3 py-1 text-light small"
                    style={{
                      background: "rgba(46, 125, 50, 0.4)",
                      border: "1px solid rgba(76, 175, 80, 0.4)",
                    }}
                  >
                    {member.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section
          className="text-center py-5 text-white rounded-5 mb-5 shadow-lg position-relative overflow-hidden p-4 p-md-5"
          style={{
            background: "linear-gradient(135deg, #162616 0%, #1B5E20 50%, #0F1A0F 100%)",
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
            🌾 Grow Smarter Today
          </span>
          <h2 className="fw-bold mb-3 display-6">
            Ready to Upgrade Your Agricultural Productivity?
          </h2>
          <p className="fs-5 mb-4 text-light opacity-80 mx-auto" style={{ maxWidth: "650px" }}>
            Join thousands of progressive farmers leveraging verified marketplace inputs and smart machine rentals.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/products"
              className="btn btn-warning btn-lg fw-bold px-5 py-3 rounded-pill shadow"
            >
              Explore Products
            </Link>
            <Link
              to="/equipment"
              className="btn btn-outline-light btn-lg fw-semibold px-4 py-3 rounded-pill"
            >
              Rent Equipment
            </Link>
          </div>
        </section>
      </div>

      {/* ================= LOCAL STYLES ================= */}
      <style>{`
        .team-section {
          background: linear-gradient(145deg, #162616 0%, #101c10 100%);
          border: 1px solid rgba(76, 175, 80, 0.25);
        }

        .hover-scale {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .hover-scale:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4) !important;
        }

        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3) !important;
          border-color: rgba(76, 175, 80, 0.4) !important;
        }

        .slide-up {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(24px);
        }

        .slide-up-delay {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
          transform: translateY(24px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default About;
