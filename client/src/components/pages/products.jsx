import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

const CATEGORIES = [
  "All",
  "Seeds",
  "Fertilizers",
  "Tools",
  "Irrigation",
  "Crop Protection",
  "Accessories",
];

const categoryColors = {
  Seeds: { bg: "rgba(46, 125, 50, 0.18)", text: "#81C784", border: "#2E7D32" },
  Fertilizers: { bg: "rgba(249, 168, 37, 0.18)", text: "#FFD54F", border: "#F9A825" },
  Tools: { bg: "rgba(2, 136, 209, 0.18)", text: "#4FC3F7", border: "#0288D1" },
  Irrigation: { bg: "rgba(0, 150, 136, 0.18)", text: "#80CBC4", border: "#009688" },
  "Crop Protection": { bg: "rgba(156, 39, 176, 0.18)", text: "#CE93D8", border: "#9C27B0" },
  Accessories: { bg: "rgba(255, 112, 67, 0.18)", text: "#FFAB91", border: "#FF7043" },
};

const Products = () => {
  const { addToCart, cartItems, removeFromCart, updateQuantity } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dbProducts, setDbProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [staticProducts] = useState([
    { id: 1, name: "Organic Wheat Seeds", category: "Seeds", price: 120, image: "/images/wheat.png" },
    { id: 2, name: "Hybrid Rice Seeds", category: "Seeds", price: 150, image: "/images/rice.png" },
    { id: 3, name: "Maize Seeds Premium", category: "Seeds", price: 110, image: "/images/maize_seeds.png" },
    { id: 4, name: "Organic Compost Fertilizer", category: "Fertilizers", price: 300, image: "/images/organic_compost.png" },
    { id: 5, name: "Vermicompost", category: "Fertilizers", price: 250, image: "/images/vermicompost_fertilizer.png" },
    { id: 6, name: "Urea Fertilizer", category: "Fertilizers", price: 280, image: "/images/urea_fertilizer.png" },
    { id: 7, name: "Hand Sprayer", category: "Tools", price: 850, image: "/images/hand_sprayer.png" },
    { id: 8, name: "Water Hose Pipe", category: "Tools", price: 450, image: "/images/pipe.png" },
    { id: 9, name: "Garden Shovel", category: "Tools", price: 320, image: "/images/shovel.png" },
    { id: 10, name: "Drip Irrigation Kit", category: "Irrigation", price: 2200, image: "/images/drip_irrigation.png" },
    { id: 11, name: "Water Sprinkler", category: "Irrigation", price: 680, image: "/images/sprinkler.png" },
    { id: 12, name: "Organic Neem Oil", category: "Crop Protection", price: 190, image: "/images/oil.png" },
    { id: 13, name: "Pesticide Spray", category: "Crop Protection", price: 410, image: "/images/pesticide_spray.png" },
    { id: 14, name: "Farm Gloves", category: "Accessories", price: 120, image: "/images/gloves.png" },
    { id: 15, name: "Safety Boots", category: "Accessories", price: 950, image: "/images/boots.png" },
    { id: 16, name: "Tomato Hybrid Seeds", category: "Seeds", price: 95, image: "/images/tomato.png" },
    { id: 17, name: "Chilli Seeds Premium", category: "Seeds", price: 105, image: "/images/chilli.png" },
    { id: 18, name: "Bio Potash Fertilizer", category: "Fertilizers", price: 340, image: "/images/potash_fertilizer.png" },
    { id: 19, name: "DAP Fertilizer", category: "Fertilizers", price: 360, image: "/images/DAP_fertilizer.png" },
    { id: 20, name: "Pruning Shears", category: "Tools", price: 520, image: "/images/shears.png" },
    { id: 21, name: "Manual Weeder", category: "Tools", price: 410, image: "/images/weeder.png" },
    { id: 22, name: "Mini Water Pump", category: "Irrigation", price: 1800, image: "/images/water_pump.png" },
    { id: 23, name: "PVC Irrigation Pipes", category: "Irrigation", price: 950, image: "/images/PVC.png" },
    { id: 24, name: "Plant Growth Booster", category: "Crop Protection", price: 260, image: "/images/booster.png" },
    { id: 25, name: "Insect Trap Kit", category: "Crop Protection", price: 330, image: "/images/insect_trap.png" },
    { id: 26, name: "Organic Mustard Seeds", category: "Seeds", price: 115, image: "/images/mustard_seeds.png" },
    { id: 27, name: "Soil Testing Kit", category: "Tools", price: 780, image: "/images/soil_testing_kit.png" },
    { id: 28, name: "Organic Micronutrient Mix", category: "Fertilizers", price: 420, image: "/images/micronutrient_mix.png" },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data = await response.json();
          const formattedDbProducts = data.map((p) => ({ ...p, id: p._id }));
          setDbProducts(formattedDbProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const allProducts = [...dbProducts, ...staticProducts];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      <div className="container py-5" style={{ marginTop: "64px" }}>

        {/* ================= HEADER & SEARCH ================= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="text-warning fw-bold text-uppercase small" style={{ letterSpacing: "2px" }}>
              Verified Marketplace
            </span>
            <h2 className="fw-bold mb-0 text-white display-6">Agricultural Products</h2>
            <p className="text-muted small mb-0">High-yield seeds, certified fertilizers, and farm equipment</p>
          </div>

          <div className="position-relative" style={{ minWidth: "280px" }}>
            <i
              className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-warning"
              style={{ pointerEvents: "none" }}
            ></i>
            <input
              type="text"
              placeholder="Search products, seeds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control rounded-pill ps-5 py-2 search-box"
              style={{
                background: "rgba(22, 38, 22, 0.8)",
                border: "1px solid rgba(76, 175, 80, 0.35)",
                color: "#fff",
              }}
            />
          </div>
        </div>

        {/* ================= CATEGORY FILTER CHIPS ================= */}
        <div className="d-flex gap-2 flex-wrap mb-4 pb-2 border-bottom border-success border-opacity-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all"
              style={{
                background:
                  selectedCategory === cat
                    ? "linear-gradient(135deg, #1B5E20, #2E7D32)"
                    : "rgba(255, 255, 255, 0.05)",
                color: selectedCategory === cat ? "#fff" : "#9EAA9E",
                border:
                  selectedCategory === cat
                    ? "1px solid #4CAF50"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  selectedCategory === cat
                    ? "0 4px 12px rgba(46, 125, 50, 0.35)"
                    : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ================= PRODUCT GRID ================= */}
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const cartItem = cartItems.find((item) => item.id === product.id);
              const colorInfo = categoryColors[product.category] || {
                bg: "rgba(255,255,255,0.08)",
                text: "#ddd",
                border: "#666",
              };

              return (
                <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                  <div
                    className="card h-100 border-0 rounded-4 overflow-hidden product-card position-relative"
                    style={{
                      background: "rgba(22, 38, 22, 0.75)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(76, 175, 80, 0.18)",
                    }}
                  >
                    {/* Image Container with Zoom & Quick View */}
                    <div
                      className="product-img-wrapper position-relative overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                      style={{ height: "190px", background: "rgba(0,0,0,0.25)" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image w-100 h-100"
                        style={{ objectFit: "contain", padding: "12px", transition: "transform 0.4s ease" }}
                      />
                      <span
                        className="badge position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1 small fw-bold"
                        style={{
                          background: colorInfo.bg,
                          color: colorInfo.text,
                          border: `1px solid ${colorInfo.border}`,
                          backdropFilter: "blur(4px)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {product.category}
                      </span>
                      <div className="quick-view-overlay d-flex align-items-center justify-content-center">
                        <span className="btn btn-sm btn-light rounded-pill px-3 shadow">
                          🔍 Quick View
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column p-3">
                      <h6
                        className="card-title fw-bold text-white mb-2"
                        style={{ fontSize: "1rem", lineHeight: "1.3" }}
                      >
                        {product.name}
                      </h6>

                      <div className="d-flex align-items-baseline gap-1 mb-3">
                        <span className="text-warning fw-bold fs-5">₹{product.price}</span>
                        <span className="text-muted small">/ unit</span>
                      </div>

                      {/* Cart Controls */}
                      {cartItem ? (
                        <div
                          className="d-flex align-items-center justify-content-between mt-auto p-1 rounded-pill"
                          style={{
                            background: "rgba(249, 168, 37, 0.12)",
                            border: "1px solid rgba(249, 168, 37, 0.35)",
                          }}
                        >
                          <button
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              background: "#F9A825",
                              color: "#000",
                              fontWeight: "bold",
                            }}
                            onClick={() =>
                              cartItem.quantity > 1
                                ? updateQuantity(product.id, cartItem.quantity - 1)
                                : removeFromCart(product.id)
                            }
                          >
                            -
                          </button>
                          <span className="fw-bold px-2 text-warning">{cartItem.quantity}</span>
                          <button
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              background: "#F9A825",
                              color: "#000",
                              fontWeight: "bold",
                            }}
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-warning mt-auto fw-bold rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                          onClick={() => addToCart(product)}
                        >
                          <span>🛒</span> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5">
              <span className="fs-1">🌾</span>
              <p className="text-muted fs-5 mt-2">No agricultural products match your search or filter.</p>
              <button
                className="btn btn-outline-warning rounded-pill px-4 mt-2"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= PRODUCT ZOOM / QUICK VIEW MODAL ================= */}
      {selectedProduct && (
        <div
          className="position-fixed inset-0 d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="card border-0 rounded-4 shadow-lg overflow-hidden position-relative"
            style={{
              maxWidth: "540px",
              width: "90%",
              background: "#162616",
              border: "1px solid rgba(76, 175, 80, 0.35)",
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle text-white"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                width: "36px",
                height: "36px",
                zIndex: 10,
              }}
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <div style={{ height: "260px", background: "rgba(0, 0, 0, 0.35)" }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-100 h-100"
                style={{ objectFit: "contain", padding: "20px" }}
              />
            </div>

            <div className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span
                    className="badge rounded-pill px-2 py-1 small fw-bold mb-2"
                    style={{
                      background: "rgba(46, 125, 50, 0.2)",
                      color: "#81C784",
                      border: "1px solid #2E7D32",
                    }}
                  >
                    {selectedProduct.category}
                  </span>
                  <h4 className="fw-bold text-white mb-0">{selectedProduct.name}</h4>
                </div>
                <div className="text-end">
                  <h3 className="fw-bold text-warning mb-0">₹{selectedProduct.price}</h3>
                  <small className="text-muted">incl. all taxes</small>
                </div>
              </div>

              <p className="text-muted small mt-3">
                High-grade verified agricultural input packaged under strict quality specifications to ensure optimal germination and soil health.
              </p>

              <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning flex-grow-1 fw-bold rounded-pill py-2"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="btn btn-outline-light rounded-pill px-4"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOCAL STYLES ================= */}
      <style>{`
        .products-page {
          min-height: 100vh;
        }

        .product-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
          border-color: rgba(76, 175, 80, 0.45) !important;
        }

        .product-card:hover .product-image {
          transform: scale(1.06);
        }

        .quick-view-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .product-img-wrapper:hover .quick-view-overlay {
          opacity: 1;
        }

        .search-box:focus {
          border-color: #2E7D32 !important;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default Products;
