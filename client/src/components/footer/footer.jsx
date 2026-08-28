import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="app-footer"
      style={{
        width: "100%",
        marginTop: "50px",
      }}
    >
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3 className="fw-bold text-warning">FarmingHub</h3>
            <p className="mt-3">
              Your trusted agriculture marketplace delivering quality seeds,
              tools, and farming essentials.
            </p>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="text-warning fw-bold">Quick Links</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-decoration-none footer-link">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none footer-link">
                  Categories
                </a>
              </li>
              <li>
                <Link to="/About" className="text-decoration-none footer-link">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="text-warning fw-bold">Contact Us</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">📞 +91 7719425010</li>
              <li className="mb-2">📧 support@farmhive.com</li>
              <li>📍 Phagwara, India</li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="text-warning fw-bold">Follow Us</h5>
            <div className="d-flex mt-3">
              <a href="#" className="me-3 text-warning fs-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                  alt="Instagram"
                  style={{ width: "30px", height: "30px" }}
                />
              </a>
              <a href="#" className="me-3 text-warning fs-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Threads_%28app%29_logo.svg"
                  alt="Thread"
                  style={{ width: "30px", height: "30px" }}
                />
              </a>{" "}
              <a href="https://www.linkedin.com/in/lavkush001/" className="me-3 text-warning fs-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
                  alt="LinkedIn"
                  style={{ width: "30px", height: "30px" }}
                />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-warning" />

        <p className="text-center mt-3 mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="text-warning">FarmingHub</span> — All Rights Reserved.
        </p>
      </div>
    </footer >
  );
}
export default Footer;
