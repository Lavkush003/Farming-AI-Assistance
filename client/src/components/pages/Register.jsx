import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css"; // Ensure global styles are applied

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { name, email, password, address, phone } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const responseText = await res.text();
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch {
                data = { error: responseText };
            }

            if (!res.ok) {
                throw new Error(data.errors?.[0]?.msg || data.error || "Registration failed");
            }

            alert("Registration Successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Register</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={onSubmit}>
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
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password (min 6 chars)"
                            required
                            className="auth-input"
                        />
                    </div>
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
                    <button type="submit" className="auth-btn">
                        Register
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
