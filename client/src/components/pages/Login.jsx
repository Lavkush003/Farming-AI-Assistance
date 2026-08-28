import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import "../../index.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { login } = useAuth(); // Get login function from context

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
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
                throw new Error(data.errors?.[0]?.msg || data.error || "Login failed");
            }

            // Login success
            login(data.user); // Save user to context
            alert("✅ Login Successful");
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // For Google login, we might want to adapt the user object to match our schema
            // For now, we'll just use what Firebase gives us, plus a mock address if needed
            const googleUser = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                // Add other fields if necessary
            };

            login(googleUser);
            alert(`✅ Google Login Successful: ${user.email}`);
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Login</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={onSubmit}>
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
                            placeholder="Password"
                            required
                            className="auth-input"
                        />
                    </div>
                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>

                <button onClick={handleGoogleLogin} className="auth-btn auth-btn-google">
                    Continue with Google
                </button>

                <div className="auth-link">
                    <p><Link to="/forgot-password">Forgot Password?</Link></p>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>

                <div className="auth-link" style={{ marginTop: '25px' }}>
                    <Link to="/" style={{ border: '1px solid #ffc107', padding: '8px 16px', borderRadius: '6px' }}>⬅ Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
