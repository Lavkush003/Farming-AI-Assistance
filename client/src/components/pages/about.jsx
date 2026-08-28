import React from "react";
import { Link } from "react-router-dom";
import founderImg from "../../assets/founder.jpg";

const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section
        className="about-hero text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          height: "60vh",
          marginTop: "56px",
        }}
      >
        <div className="px-3">
          <h1 className="display-3 fw-bold mb-3 slide-up text-warning">
            Cultivating the Future
          </h1>
          <p className="lead fs-4 slide-up-delay">
            Technology meets tradition to power the next generation of farming
          </p>
        </div>
      </section>

      <div className="container">

        {/* ================= OUR STORY ================= */}
        <section className="row align-items-center py-5">
          <div className="col-lg-6 mb-4">
            <img
              src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2670&auto=format&fit=crop"
              alt="Farmer"
              className="img-fluid rounded-4 shadow-lg hover-scale"
            />
          </div>

          <div className="col-lg-6 ps-lg-5">
            <h5 className="text-warning fw-bold text-uppercase ls-2">
              Our Story
            </h5>
            <h2 className="fw-bold mb-4">
              From Intermediaries to One Platform
            </h2>
            <p className="text-muted fs-5">
              FarmingHub was created to eliminate inefficiencies in agricultural
              supply chains and empower farmers with direct access to quality
              products.
            </p>
            <p className="text-muted">
              Founded in 2023, we connect farmers with verified suppliers,
              ensuring affordability, transparency, and trust.
            </p>

            <div className="d-flex gap-4 mt-3">
              <div>
                <h3 className="fw-bold text-warning mb-0">2023</h3>
                <p className="small text-muted">Founded</p>
              </div>
              <div>
                <h3 className="fw-bold text-warning mb-0">50+</h3>
                <p className="small text-muted">Partner Brands</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY FARMHIVE ================= */}
        <section className="py-5 text-center">
          <h5 className="text-warning fw-bold text-uppercase ls-2">Benefits</h5>
          <h2 className="fw-bold mb-5">Why FarmingHub?</h2>

          <div className="row g-4">
            {[
              {
                title: "Quality First",
                desc: "Every product is verified for authenticity.",
                icon: "bi-patch-check-fill",
              },
              {
                title: "Farmer Centric",
                desc: "Designed with farmers at the core.",
                icon: "bi-heart-fill",
              },
              {
                title: "Tech Driven",
                desc: "Data-powered smart farming solutions.",
                icon: "bi-cpu-fill",
              },
              {
                title: "Sustainable",
                desc: "Eco-friendly farming for the future.",
                icon: "bi-tree-fill",
              },
            ].map((item, i) => (
              <div className="col-md-3" key={i}>
                <div className="card h-100 border-0 shadow-sm p-4 feature-card">
                  <div className="text-warning mb-3">
                    <i className={`bi ${item.icon} fs-1`}></i>
                  </div>
                  <h4 className="fw-bold">{item.title}</h4>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TEAM (BLACK SECTION) ================= */}
        <section className="team-section py-5 rounded-5 p-5 mb-5">
          <div className="text-center mb-5">
            <h5 className="text-warning fw-bold text-uppercase ls-2">Team</h5>
            <h2 className="fw-bold text-warning">
              The Minds Behind FarmingHub
            </h2>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                name: "Lavkush Nishad",
                role: "Founder & CEO",
                img: founderImg,
              },
              // {
              //   name: "Rajesh Kumar",
              //   role: "Head of Supply Chain",
              //   img: "https://randomuser.me/api/portraits/men/32.jpg",
              // },
              // {
              //   name: "Vikram Singh",
              //   role: "Tech Lead",
              //   img: "https://randomuser.me/api/portraits/men/85.jpg",
              // },
            ].map((member, i) => (
              <div className="col-md-3 col-6 text-center" key={i}>
                <img
                  src={member.img}
                  alt={member.name}
                  className="rounded-circle shadow border border-4 border-warning mb-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h5 className="fw-bold text-warning mb-1">
                  {member.name}
                </h5>
                <p className="text-secondary small text-uppercase">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="text-center py-5 bg-dark text-white rounded-5 mb-5">
          <h2 className="fw-bold text-warning mb-3">
            Ready to Upgrade Your Farm?
          </h2>
          <p className="fs-5 mb-4">
            Join thousands of farmers using FarmingHub today.
          </p>
          <Link
            to="/products"
            className="btn btn-warning btn-lg fw-bold px-5 rounded-pill"
          >
            Explore Products
          </Link>
        </section>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .team-section {
          background-color: #000;
        }

        .ls-2 {
          letter-spacing: 2px;
        }

        .hover-scale {
          transition: transform 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }

        .feature-card {
          transition: 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .slide-up-delay {
          animation: slideUp 0.8s ease-out 0.2s forwards;
          opacity: 0;
          transform: translateY(30px);
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
