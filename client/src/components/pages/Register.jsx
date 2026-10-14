// 



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

// Backend API URL
// Local development: http://localhost:5000
// Production: VITE_API_URL from Vercel
// const API_URL =
//     import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
//     "http://localhost:5000";

const API_URL =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
    (import.meta.env.DEV ? "http://localhost:5000" : "");

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { name, email, password, address, phone } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const responseText = await res.text();

            let data = {};

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch {
                data = {
                    error: responseText || "Invalid server response",
                };
            }

            if (!res.ok) {
                throw new Error(
                    data.errors?.[0]?.msg ||
                    data.error ||
                    data.message ||
                    "Registration failed"
                );
            }

            alert("Registration Successful! Please login.");

            navigate("/login");

        } catch (err) {
            console.error("Registration error:", err);

            setError(
                err.message ||
                "Unable to connect to the server. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">

                <h2 className="auth-title">
                    Register
                </h2>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>

                    {/* Name */}
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="Full Name"
                            required
                            className="auth-input"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Email Address"
                            required
                            className="auth-input"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password (min 6 chars)"
                            minLength={6}
                            required
                            className="auth-input"
                        />
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <input
                            type="text"
                            name="address"
                            value={address}
                            onChange={onChange}
                            placeholder="Address"
                            required
                            className="auth-input"
                        />
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <input
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={onChange}
                            placeholder="Phone Number (Optional)"
                            className="auth-input"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <div className="mt-4 p-3 rounded-3 bg-success bg-opacity-10 text-center">
                    <p className="mb-2">
                        Need affordable farm equipment, or have machinery to rent out?
                    </p>
                    <Link to="/equipment" className="text-success fw-semibold">
                        Explore Equipment Rentals
                    </Link>
                    <p className="small text-muted mb-0 mt-2">
                        After creating an account, list your equipment from the Seller Dashboard.
                    </p>
                </div>

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;