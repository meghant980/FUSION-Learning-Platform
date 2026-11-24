
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/c-learning.css";

const units = [
  {
    number: "01",
    title: "Introduction to C Programming",
    description: "Learn the fundamentals, structure, data types and basic input/output.",
    topics: ["C basics", "Variables & data types", "Operators", "Input & output"],
    route: "/learn-c/unit1",
  },
  {
    number: "02",
    title: "Control Statements and Loops",
    description: "Understand decision-making, conditions and repetition in C.",
    topics: ["if-else", "switch", "for loop", "while & do-while"],
    route: "/learn-c/unit2",
  },
  {
    number: "03",
    title: "Functions and Arrays",
    description: "Build modular programs and work with collections of data.",
    topics: ["Functions", "Recursion", "1D arrays", "2D arrays"],
    route: "/learn-c/unit3",
  },
  {
    number: "04",
    title: "Pointers and File Handling",
    description: "Explore memory addresses, pointers and working with files.",
    topics: ["Pointers", "Pointer arithmetic", "File operations", "Structures"],
    route: "/learn-c/unit4",
  },
];

export default function LearnC() {
  const navigate = useNavigate();

  return (
    <main className="clearn-page">
      <header className="clearn-topbar">
        <button
          className="clearn-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="clearn-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <button
          className="clearn-back"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span> Dashboard
        </button>
      </header>

      <section className="clearn-hero">
        <div className="clearn-hero-copy">
          <div className="clearn-eyebrow">
            <span className="clearn-live-dot" />
            PROGRAMMING LANGUAGE
          </div>

          <h1>Learn <span>C</span>.</h1>

          <p className="clearn-hero-description">
            Build a strong programming foundation. Explore concepts,
            understand logic, and practise one step at a time.
          </p>

          <div className="clearn-hero-actions">
            <button
              className="clearn-primary-btn"
              onClick={() => navigate("/learn-c/unit1")}
            >
              Start learning <span>↗</span>
            </button>
            <span className="clearn-hero-note">4 learning units · Beginner friendly</span>
          </div>
        </div>

        <div className="clearn-code-art" aria-label="C programming code illustration">
          <div className="clearn-code-window">
            <div className="clearn-window-top">
              <div className="clearn-window-dots">
                <i /><i /><i />
              </div>
              <span>hello_world.c</span>
            </div>
            <div className="clearn-code-content">
              <div><span className="clearn-line">01</span><span className="clearn-purple">#include</span> <span className="clearn-green">&lt;stdio.h&gt;</span></div>
              <div><span className="clearn-line">02</span></div>
              <div><span className="clearn-line">03</span><span className="clearn-purple">int</span> main() {"{"}</div>
              <div><span className="clearn-line">04</span>  printf(<span className="clearn-yellow">"Hello, world!"</span>);</div>
              <div><span className="clearn-line">05</span>  <span className="clearn-purple">return</span> <span className="clearn-yellow">0</span>;</div>
              <div><span className="clearn-line">06</span>{"}"}</div>
            </div>
            <div className="clearn-code-footer">
              <span><i /> C PROGRAMMING</span>
              <span>READY TO RUN</span>
            </div>
          </div>
          <div className="clearn-art-orbit clearn-orbit-one" />
          <div className="clearn-art-orbit clearn-orbit-two" />
          <div className="clearn-floating-tag">#include &lt;stdio.h&gt;</div>
        </div>
      </section>

      <div style={{ maxWidth: 1180, margin: "0 auto 22px", padding: "0 22px" }}>
        <button type="button" onClick={() => navigate("/practice/all-languages")} style={{ border: 0, borderRadius: 10, padding: "12px 18px", background: "#242b42", color: "white", fontWeight: 700, cursor: "pointer" }}>
          Practise questions across the full syllabus · All languages ↗
        </button>
      </div>

      <section className="clearn-overview">
        <div className="clearn-overview-item">
          <span className="clearn-overview-number">04</span>
          <span className="clearn-overview-label">Learning units</span>
        </div>
        <div className="clearn-overview-divider" />
        <div className="clearn-overview-item">
          <span className="clearn-overview-number">C</span>
          <span className="clearn-overview-label">Programming language</span>
        </div>
        <div className="clearn-overview-divider" />
        <div className="clearn-overview-item">
          <span className="clearn-overview-number">01</span>
          <span className="clearn-overview-label">Start from the basics</span>
        </div>
      </section>

      <section className="clearn-units-section">
        <div className="clearn-section-heading">
          <div>
            <div className="clearn-section-kicker">YOUR LEARNING PATH</div>
            <h2>Explore the units<span>.</span></h2>
            <p>Choose a unit to open its lessons and learning material.</p>
          </div>
          <div className="clearn-unit-count">01 — 04</div>
        </div>

        <div className="clearn-unit-grid">
          {units.map((unit) => (
            <button
              className="clearn-unit-card"
              key={unit.number}
              onClick={() => navigate(unit.route)}
            >
              <div className="clearn-unit-card-top">
                <span className="clearn-unit-number">{unit.number}</span>
                <span className="clearn-unit-arrow">↗</span>
              </div>

              <div className="clearn-unit-card-body">
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>
              </div>

              <div className="clearn-topic-list">
                {unit.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>

              <div className="clearn-card-bottom">
                <span>Explore unit</span>
                <span className="clearn-card-line" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="clearn-footer">
        <span>FUSION <span className="clearn-footer-dot">•</span> LEARN BY DOING</span>
        <span>Keep learning. Keep building.</span>
      </footer>
    </main>
  );
}
