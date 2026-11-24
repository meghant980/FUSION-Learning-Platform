
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cpp-learning.css";

const units = [
  {
    number: "01",
    title: "JavaScript Fundamentals",
    description:
      "Get started with JavaScript syntax, variables, data types and operators.",
    topics: [
      "Introduction to JavaScript",
      "Variables & data types",
      "Operators",
      "Input & output",
    ],
    route: "/learn/javascript/unit1",
  },
  {
    number: "02",
    title: "Conditions and Loops",
    description:
      "Control JavaScript program execution using conditions, switch statements and loops.",
    topics: [
      "Conditional statements",
      "Switch statement",
      "For and while loops",
      "Break & continue",
    ],
    route: "/learn/javascript/unit2",
  },
  {
    number: "03",
    title: "Functions, Arrays and Objects",
    description:
      "Create reusable functions and organise information using arrays and objects.",
    topics: [
      "Functions",
      "Arrow functions",
      "Arrays & methods",
      "Objects",
    ],
    route: "/learn/javascript/unit3",
  },
  {
    number: "04",
    title: "Modern JavaScript and Web Development",
    description:
      "Explore DOM manipulation, events, asynchronous programming and modern JavaScript features.",
    topics: [
      "DOM manipulation",
      "Events",
      "Promises & async/await",
      "Modern JavaScript",
    ],
    route: "/learn/javascript/unit4",
  },
];

export default function LearnJavaScript() {
  const navigate = useNavigate();

  return (
    <main className="cpplearn-page">
      <header className="cpplearn-topbar">
        <button
          className="cpplearn-brand"
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="cpplearn-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <button
          className="cpplearn-back"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span> Dashboard
        </button>
      </header>

      <section className="cpplearn-hero">
        <div className="cpplearn-hero-copy">
          <div className="cpplearn-eyebrow">
            <span className="cpplearn-live-dot" />
            PROGRAMMING LANGUAGE
          </div>

          <h1>
            Learn <span>JavaScript</span>.
          </h1>

          <p className="cpplearn-hero-description">
            Build your JavaScript programming foundation. Learn
            programming fundamentals, create interactive web experiences
            and understand modern JavaScript concepts step by step.
          </p>

          <div className="cpplearn-hero-actions">
            <button
              className="cpplearn-primary-btn"
              type="button"
              onClick={() => navigate("/learn/javascript/unit1")}
            >
              Start learning <span>↗</span>
            </button>

            <span className="cpplearn-hero-note">
              4 learning units · Structured learning
            </span>
          </div>
        </div>

        <div className="cpplearn-code-art">
          <div className="cpplearn-code-window">
            <div className="cpplearn-window-top">
              <div className="cpplearn-window-dots">
                <i />
                <i />
                <i />
              </div>
              <span>main.js</span>
            </div>

            <div className="cpplearn-code-content">
              <div>
                <span className="cpplearn-line">01</span>
                <span className="cpplearn-purple">const</span>{" "}
                name = <span className="cpplearn-yellow">"Fusion"</span>;
              </div>

              <div>
                <span className="cpplearn-line">02</span>
                <span className="cpplearn-purple">function</span>{" "}
                greet() {"{"}
              </div>

              <div>
                <span className="cpplearn-line">03</span>
                &nbsp;&nbsp;console.log(
                <span className="cpplearn-yellow">"Hello, "</span> + name);
              </div>

              <div>
                <span className="cpplearn-line">04</span>
                {"}"}
              </div>

              <div>
                <span className="cpplearn-line">05</span>
                greet();
              </div>
            </div>

            <div className="cpplearn-code-footer">
              <span><i /> JAVASCRIPT PROGRAMMING</span>
              <span>READY TO RUN</span>
            </div>
          </div>

          <div className="cpplearn-art-orbit cpplearn-orbit-one" />
          <div className="cpplearn-art-orbit cpplearn-orbit-two" />
          <div className="cpplearn-floating-tag">const name = "Fusion"</div>
        </div>
      </section>

      <div style={{ maxWidth: 1180, margin: "0 auto 22px", padding: "0 22px" }}>
        <button type="button" onClick={() => navigate("/practice/all-languages")} style={{ border: 0, borderRadius: 10, padding: "12px 18px", background: "#242b42", color: "white", fontWeight: 700, cursor: "pointer" }}>
          Practise questions across the full syllabus · All languages ↗
        </button>
      </div>

      <section className="cpplearn-overview">
        <div className="cpplearn-overview-item">
          <span className="cpplearn-overview-number">04</span>
          <span className="cpplearn-overview-label">Learning units</span>
        </div>

        <div className="cpplearn-overview-divider" />

        <div className="cpplearn-overview-item">
          <span className="cpplearn-overview-number">JS</span>
          <span className="cpplearn-overview-label">Programming language</span>
        </div>

        <div className="cpplearn-overview-divider" />

        <div className="cpplearn-overview-item">
          <span className="cpplearn-overview-number">01</span>
          <span className="cpplearn-overview-label">
            Start from the basics
          </span>
        </div>
      </section>

      <section className="cpplearn-units-section">
        <div className="cpplearn-section-heading">
          <div>
            <div className="cpplearn-section-kicker">
              YOUR LEARNING PATH
            </div>

            <h2>
              Explore the units<span>.</span>
            </h2>

            <p>
              Choose a unit to open its study material and learning options.
            </p>
          </div>

          <div className="cpplearn-unit-count">01 — 04</div>
        </div>

        <div className="cpplearn-unit-grid">
          {units.map((unit) => (
            <button
              type="button"
              className="cpplearn-unit-card"
              key={unit.number}
              onClick={() => navigate(unit.route)}
            >
              <div className="cpplearn-unit-card-top">
                <span className="cpplearn-unit-number">
                  {unit.number}
                </span>

                <span className="cpplearn-unit-arrow">↗</span>
              </div>

              <div className="cpplearn-unit-card-body">
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>
              </div>

              <div className="cpplearn-topic-list">
                {unit.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>

              <div className="cpplearn-card-bottom">
                <span>Explore unit</span>
                <span className="cpplearn-card-line" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="cpplearn-footer">
        <span>
          FUSION <span className="cpplearn-footer-dot">•</span> LEARN BY DOING
        </span>

        <span>Keep learning. Keep building.</span>
      </footer>
    </main>
  );
}
