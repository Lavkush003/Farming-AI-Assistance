import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    
    // Steps: 'cart', 'payment', 'success'
    const [step, setStep] = useState('cart');
    const [paymentMethod, setPaymentMethod] = useState('');
    
    const handleCheckoutClick = () => {
        if (cartItems.length > 0) {
            setStep('payment');
        }
    };

    const handleConfirmPayment = () => {
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }
        setStep('success');
        clearCart();
    };

    if (step === 'success') {
        return (
            <div className="cart-page d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow-lg border-success p-5 text-center" style={{ maxWidth: "500px" }}>
                    <div className="mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "5rem" }}></i>
                    </div>
                    <h2 className="fw-bold text-success mb-3">Order Successful!</h2>
                    <p className="text-muted fs-5 mb-4">
                        Thank you for shopping at FarmingHub. Your items will be shipped soon!
                    </p>
                    <Link to="/products" className="btn btn-success btn-lg px-5 rounded-pill">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'payment') {
        return (
            <div className="cart-page container py-5" style={{ marginTop: "70px" }}>
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-warning p-4">
                            <h3 className="fw-bold text-warning mb-4">Select Payment Method</h3>
                            
                            <div className="mb-4">
                                <h5 className="mb-3">Order Total: <span className="text-success fw-bold">₹ {totalPrice}</span></h5>
                                
                                <div className="form-check p-3 border rounded mb-2 custom-radio">
                                    <input className="form-check-input ms-1 me-3" type="radio" name="paymentMethod" id="cod" value="cod" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <label className="form-check-label w-100 fw-bold cursor-pointer" htmlFor="cod">
                                        <i className="bi bi-cash-stack me-2 text-success"></i> Cash on Delivery
                                    </label>
                                </div>
                                <div className="form-check p-3 border rounded mb-2 custom-radio">
                                    <input className="form-check-input ms-1 me-3" type="radio" name="paymentMethod" id="upi" value="upi" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <label className="form-check-label w-100 fw-bold cursor-pointer" htmlFor="upi">
                                        <i className="bi bi-phone me-2 text-primary"></i> UPI / Net Banking
                                    </label>
                                </div>
                                <div className="form-check p-3 border rounded mb-2 custom-radio">
                                    <input className="form-check-input ms-1 me-3" type="radio" name="paymentMethod" id="card" value="card" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <label className="form-check-label w-100 fw-bold cursor-pointer" htmlFor="card">
                                        <i className="bi bi-credit-card me-2 text-warning"></i> Credit / Debit Card
                                    </label>
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-outline-secondary px-4" onClick={() => setStep('cart')}>Back</button>
                                <button className="btn btn-warning px-5 fw-bold text-dark" onClick={handleConfirmPayment}>Confirm Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    .custom-radio:hover { background-color: #f8f9fa; border-color: #ffc107 !important; }
                    .cursor-pointer { cursor: pointer; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container py-5" style={{ marginTop: "70px" }}>
                <h2 className="text-warning fw-bold mb-4">Your Cart</h2>

                {cartItems.length === 0 ? (
                    <div className="text-center mt-5">
                        <i className="bi bi-cart-x text-muted mb-3" style={{ fontSize: "4rem" }}></i>
                        <h3>Your cart is empty</h3>
                        <Link to="/products" className="btn btn-warning mt-3 px-4 rounded-pill">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="card mb-3 border-warning shadow-sm"
                                >
                                    <div className="row g-0 align-items-center">
                                        <div className="col-md-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="img-fluid rounded-start"
                                                style={{ height: "100px", objectFit: "cover", width: "100%" }}
                                            />
                                        </div>
                                        <div className="col-md-10">
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="card-title text-warning mb-1">
                                                        {item.name}
                                                    </h5>
                                                    <p className="card-text mb-0">
                                                        Unit Price: ₹{item.price}
                                                    </p>
                                                </div>

                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-2"
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="fs-5 fw-bold mx-2">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-warning ms-2"
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-end">
                                                    <p className="fw-bold fs-5 mb-0">
                                                        ₹ {item.price * item.quantity}
                                                    </p>
                                                    <button
                                                        className="btn btn-danger btn-sm mt-2"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-warning shadow-sm sticky-top" style={{ top: "100px" }}>
                                <div className="card-body">
                                    <h4 className="card-title text-warning mb-4">Order Summary</h4>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Total Items:</span>
                                        <span>
                                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    </div>
                                    <hr className="border-secondary" />
                                    <div className="d-flex justify-content-between fs-4 fw-bold mb-4">
                                        <span>Total Amount:</span>
                                        <span className="text-warning">₹ {totalPrice}</span>
                                    </div>
                                    <button 
                                        className="btn btn-warning w-100 fw-bold fs-5 text-dark"
                                        onClick={handleCheckoutClick}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .cart-page {
          min-height: 100vh;
        }
      `}</style>
        </div>
    );
};

export default Cart;
