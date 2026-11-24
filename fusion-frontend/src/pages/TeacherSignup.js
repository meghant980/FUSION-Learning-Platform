
import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import "../styles/signup-forms.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sections, setSections] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    if (
      !name.trim() ||
      !email.trim() ||
      !sections.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMsg("All fields are required.");
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

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: "teacher",
          password,
          sections: sections
            .split(",")
            .map((section) => section.trim())
            .filter(Boolean),
        },
        { timeout: 15000 }
      );

      setMsg(
        response.data?.msg ||
        response.data?.message ||
        "Signup request submitted successfully."
      );

      setName("");
      setEmail("");
      setSections("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Teacher signup error:", error);

      if (error.response) {
        setMsg(
          error.response.data?.msg ||
          error.response.data?.message ||
          `Signup failed. Server returned ${error.response.status}.`
        );
      } else if (error.code === "ECONNABORTED") {
        setMsg("Request timed out. Please try again.");
      } else {
        setMsg(
          "Cannot connect to Fusion. Please check whether the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <header className="register-header">
        <span>🎓 FUSION</span>
        <span>Teacher Registration</span>
      </header>

      <main className="auth-center-wrapper">

        <section className="auth-center-card">

          <div className="user-circle">👨‍🏫</div>

          <h2>Teacher Signup</h2>

          <p className="auth-sub-text">
            Create your teacher account and request access
            to the FUSION learning platform.
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
              type="text"
              placeholder="Sections (e.g. A, B, C)"
              value={sections}
              onChange={(e) => setSections(e.target.value)}
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
              {loading ? "Submitting Request..." : "Submit Registration Request"}
            </button>

          </form>

          {msg && (
            <p className="auth-message" role="alert">
              {msg}
            </p>
          )}

        </section>

      </main>
    </div>
  );
}
