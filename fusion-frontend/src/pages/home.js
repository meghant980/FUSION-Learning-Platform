
import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">

      <header className="home-header">
        <div className="home-brand">
          <span className="brand-mark">F</span>
          <span>FUSION</span>
        </div>

        <div className="header-right">
          LEARN <span>·</span> PRACTICE <span>·</span> GROW
        </div>
      </header>

      <main className="home-main">

        <section className="home-intro">
          <div className="home-eyebrow">
            YOUR LEARNING SPACE <span>— 01</span>
          </div>

          <h1>
            Learn. Build.
            <br />
            <span>Grow.</span>
          </h1>

          <p>
            An integrated platform for programming education,
            practical learning and performance evaluation.
          </p>

          <div className="home-languages">
            <span>C</span>
            <span>C++</span>
            <span>JAVA</span>
            <span>PYTHON</span>
            <span>JAVASCRIPT</span>
          </div>
        </section>

        <section className="home-access">
          <div className="access-heading">
            <span>GET STARTED</span>
            <span>01 / 02</span>
          </div>

          <Link to="/login" className="home-option">
            <div>
              <small>01 — EXISTING USER</small>
              <h2>Login</h2>
              <p>Continue your learning journey.</p>
            </div>
            <span className="option-arrow">↗</span>
          </Link>

          <Link to="/register" className="home-option">
            <div>
              <small>02 — NEW USER</small>
              <h2>Register</h2>
              <p>Create your FUSION account.</p>
            </div>
            <span className="option-arrow">↗</span>
          </Link>
        </section>

      </main>

      <footer className="home-footer">
        <span>FUSION — PROGRAMMING LEARNING PLATFORM</span>
        <span>LEARN AT YOUR OWN PACE.</span>
      </footer>

    </div>
  );
}
