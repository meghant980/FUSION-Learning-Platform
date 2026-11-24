
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import "../styles/signup-forms.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5001";

export default function SetPassword() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMsg("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setMsg("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: "student",
        },
        { timeout: 20000 }
      );

      setMsg(
        res.data.msg ||
          "Student account created successfully. You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      console.error("Student signup error:", err);

      setMsg(
        err.response?.data?.msg ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="register-header">
        <span>🎓 FUSION</span>
        <span>Student Registration</span>
      </header>

      <main className="auth-center-wrapper">
        <section className="auth-center-card">
          <div className="user-circle">🎓</div>

          <h2>Create Your Student Account</h2>

          <p className="auth-sub-text">
            Enter your details to register and access the FUSION
            learning platform.
          </p>

          <form onSubmit={handleSignup} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Create Password (minimum 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Student Account"}
            </button>
          </form>

          {msg && (
            <p className="auth-message" role="alert">
              {msg}
            </p>
          )}

          <p
            style={{
              marginTop: "22px",
              textAlign: "center",
              fontSize: "12px",
              color: "#7b867e",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#315c48",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
