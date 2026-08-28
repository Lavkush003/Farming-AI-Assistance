import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

const Products = () => {
  const { addToCart, cartItems, removeFromCart, updateQuantity } = useCart();
  const [search, setSearch] = useState("");
  const [dbProducts, setDbProducts] = useState([]);

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
          // Map backend _id to id so it matches existing component logic
          const formattedDbProducts = data.map(p => ({ ...p, id: p._id }));
          setDbProducts(formattedDbProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const allProducts = [...dbProducts, ...staticProducts];

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="container py-5" style={{ marginTop: "70px" }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-warning fw-bold">FarmingHub Products</h2>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control search-box"
          />
        </div>

        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const cartItem = cartItems.find((item) => item.id === product.id);
              return (
                <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                  <div className="card h-100 shadow-sm border-warning product-card">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-warning">{product.name}</h5>
                      <p className="card-text mb-1">
                        Category: <span className="text-secondary">{product.category}</span>
                      </p>
                      <p className="card-text fw-bold">₹ {product.price}</p>

                      {cartItem ? (
                        <div className="d-flex align-items-center justify-content-between mt-auto">
                          <button
                            className="btn btn-warning btn-sm fw-bold px-3"
                            onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, cartItem.quantity - 1) : removeFromCart(product.id)}
                          >
                            -
                          </button>
                          <span className="fw-bold fs-5">{cartItem.quantity}</span>
                          <button
                            className="btn btn-warning btn-sm fw-bold px-3"
                            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-warning mt-auto fw-semibold"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-secondary">No products found</p>
          )}
        </div>
      </div>

      <style>{`
        .products-page {
          min-height: 100vh;
        }

        .product-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-bottom: 1px solid #ffc107;
        }

        .product-card {
          transition: 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-6px);
        }

        .search-box {
          max-width: 260px;
          border: 1px solid #ffc107;
        }

        .search-box::placeholder {
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

export default Products;
