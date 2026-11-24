
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import "../styles/login-roles.css";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5001"
).replace(/\/+$/, "");

export default function Login() {
  const [accountType, setAccountType] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          identifier: identifier.trim(),
          password: password.trim(),
        },
        { timeout: 15000 }
      );

      const role = res.data.user.role;

      // ADMIN LOGIN
      if (accountType === "admin" && role !== "admin") {
        setMsg("Please use an administrator account.");
        return;
      }

      // TEACHER LOGIN
      if (accountType === "teacher" && role !== "teacher") {
        setMsg("Please use an approved teacher account.");
        return;
      }

      // STUDENT LOGIN
      if (
        accountType === "student" &&
        !["student", "test_student"].includes(role)
      ) {
        setMsg("Please use a student account to sign in here.");
        return;
      }

      // SAVE LOGIN SESSION
      // Keep one consistent session for both newer and legacy course pages.
      // The token is issued by the same local backend used by coding APIs.
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fusionUser", JSON.stringify({
        token: res.data.token,
        user: res.data.user,
      }));

      // REDIRECT BASED ON ACTUAL BACKEND ROLE
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setMsg(
          err.response.data?.msg ||
          err.response.data?.message ||
          "Login failed. Please try again."
        );
      } else {
        setMsg(
          "Cannot connect to Fusion. Please check whether the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectAccount = (type) => {
    setAccountType(type);
    setMsg("");
  };

  return (
    <div className="fusion-login-page">

      {/* HEADER */}
      <header className="fusion-login-header">
        <Link to="/" className="fusion-login-brand">
          <span className="fusion-login-mark">F</span>
          FUSION
        </Link>

        <Link to="/" className="fusion-login-back">
          Back to Home →
        </Link>
      </header>

      <main className="fusion-login-main">

        {/* LEFT INTRODUCTION */}
        <section className="fusion-login-intro">
          <h1>
            Good to
            <br />
            have you <span>back.</span>
          </h1>

          <p>
            Pick up where you left off. Your learning material,
            coding practice and progress are waiting for you.
          </p>

          <div className="fusion-login-language-list">
            <span>C</span>
            <span>C++</span>
            <span>Java</span>
            <span>Python</span>
            <span>JavaScript</span>
          </div>
        </section>

        {/* LOGIN PANEL */}
        <section className="fusion-login-panel">

          <h2>Sign in</h2>

          <p className="fusion-login-description">
            Choose your account and enter your details.
          </p>

          {/* ACCOUNT TYPE OPTIONS */}
          <div className="fusion-login-account-types">

            {/* STUDENT */}
            <button
              type="button"
              aria-pressed={accountType === "student"}
              className={
                accountType === "student"
                  ? "fusion-login-type active"
                  : "fusion-login-type"
              }
              onClick={() => selectAccount("student")}
            >
              <span className="fusion-login-type-icon">S</span>

              <span>
                <strong>Student</strong>
                <small>Access your learning</small>
              </span>

              <span className="fusion-login-type-arrow">→</span>
            </button>

            {/* TEACHER */}
            <button
              type="button"
              aria-pressed={accountType === "teacher"}
              className={
                accountType === "teacher"
                  ? "fusion-login-type active"
                  : "fusion-login-type"
              }
              onClick={() => selectAccount("teacher")}
            >
              <span className="fusion-login-type-icon">T</span>

              <span>
                <strong>Teacher</strong>
                <small>Manage your classroom</small>
              </span>

              <span className="fusion-login-type-arrow">→</span>
            </button>

            {/* ADMIN */}
            <button
              type="button"
              aria-pressed={accountType === "admin"}
              className={
                accountType === "admin"
                  ? "fusion-login-type fusion-login-type-admin active"
                  : "fusion-login-type fusion-login-type-admin"
              }
              onClick={() => selectAccount("admin")}
            >
              <span className="fusion-login-type-icon">A</span>

              <span>
                <strong>Admin</strong>
                <small>Manage platform access</small>
              </span>

              <span className="fusion-login-type-arrow">→</span>
            </button>

          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="fusion-login-form"
          >

            <label htmlFor="fusion-identifier">
              Email or roll number
            </label>

            <input
              id="fusion-identifier"
              type="text"
              placeholder="Enter your email or roll number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="fusion-password">
              Password
            </label>

            <input
              id="fusion-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              className="fusion-login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              <span>→</span>
            </button>

          </form>

          {/* ERROR MESSAGE */}
          {msg && (
            <p
              className="fusion-login-message error"
              role="alert"
            >
              {msg}
            </p>
          )}

          {/* REGISTER LINK */}
          <div className="fusion-login-register">
            Don't have an account?
            <Link to="/register"> Create an account →</Link>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="fusion-login-footer">
        <span>FUSION</span>
        <span>Programming, made easier to learn.</span>
      </footer>

    </div>
  );
}
