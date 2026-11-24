
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="fusion-register-page">

      <header className="fusion-register-header">
        <Link to="/" className="fusion-register-brand">
          <span className="fusion-register-mark">F</span>
          FUSION
        </Link>

        <Link to="/" className="fusion-register-back">
          ← Back to Home
        </Link>
      </header>

      <main className="fusion-register-main">

        <section className="fusion-register-intro">
          <span className="fusion-register-label">
            YOUR LEARNING SPACE / 03
          </span>

          <h1>
            Begin your
            <br />
            <span>journey.</span>
          </h1>

          <p>
            Join FUSION to explore programming concepts,
            practise coding and track your learning progress.
          </p>

          <div className="fusion-register-divider"></div>

          <div className="fusion-register-languages">
            <span>C</span>
            <span>C++</span>
            <span>JAVA</span>
            <span>PYTHON</span>
            <span>JAVASCRIPT</span>
          </div>
        </section>

        <section className="fusion-register-options">

          <div className="fusion-register-heading">
            <span>CREATE YOUR ACCOUNT</span>
            <span>02 OPTIONS</span>
          </div>

          <h2>Join FUSION</h2>

          <p className="fusion-register-description">
            Select the account type that describes you.
          </p>

          <button
            className="fusion-register-option"
            onClick={() => navigate("/set-password")}
          >
            <div className="fusion-register-option-content">
              <span className="fusion-register-number">01 / STUDENT</span>
              <h3>Student Account</h3>
              <p>
                Access learning materials, assignments,
                coding practice and performance reports.
              </p>
            </div>

            <span className="fusion-register-arrow">↗</span>
          </button>

          <button
            className="fusion-register-option"
            onClick={() => navigate("/teacher-signup")}
          >
            <div className="fusion-register-option-content">
              <span className="fusion-register-number">02 / FACULTY</span>
              <h3>Teacher Account</h3>
              <p>
                Manage learning resources, create questions,
                prepare assignments and evaluate students.
              </p>
            </div>

            <span className="fusion-register-arrow">↗</span>
          </button>

          <div className="fusion-register-login">
            Already have an account?
            <Link to="/login"> Sign in →</Link>
          </div>

        </section>

      </main>

      <footer className="fusion-register-footer">
        <span>FUSION — PROGRAMMING LEARNING PLATFORM</span>
        <span>LEARN AT YOUR OWN PACE.</span>
      </footer>

    </div>
  );
}
