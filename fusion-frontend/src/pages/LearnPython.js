
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cpp-learning.css";

const units = [
  {
    number: "01",
    title: "Python Fundamentals",
    description:
      "Get started with Python syntax, variables, data types, operators and basic input and output.",
    topics: [
      "Introduction to Python",
      "Variables & data types",
      "Operators",
      "Input & output",
    ],
    route: "/learn/python/unit1",
  },
  {
    number: "02",
    title: "Decision Making and Loops",
    description:
      "Control program execution using conditional statements, loops and flow-control statements.",
    topics: [
      "Conditional statements",
      "For and while loops",
      "Break and continue",
      "Nested loops",
    ],
    route: "/learn/python/unit2",
  },
  {
    number: "03",
    title: "Functions and Data Structures",
    description:
      "Write reusable functions and organise information using Python's built-in data structures.",
    topics: [
      "Functions",
      "Lists & tuples",
      "Sets & dictionaries",
      "String handling",
    ],
    route: "/learn/python/unit3",
  },
  {
    number: "04",
    title: "Object-Oriented and Practical Python",
    description:
      "Explore object-oriented programming, exception handling, file handling and Python modules.",
    topics: [
      "Classes & objects",
      "Inheritance",
      "Exception handling",
      "File handling & modules",
    ],
    route: "/learn/python/unit4",
  },
];

export default function LearnPython() {
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
            Learn <span>Python</span>.
          </h1>

          <p className="cpplearn-hero-description">
            Build a strong foundation in Python. Learn programming
            fundamentals, work with data structures and explore
            object-oriented programming through structured lessons.
          </p>

          <div className="cpplearn-hero-actions">
            <button
              className="cpplearn-primary-btn"
              type="button"
              onClick={() => navigate("/learn/python/unit1")}
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
              <span>main.py</span>
            </div>

            <div className="cpplearn-code-content">
              <div>
                <span className="cpplearn-line">01</span>
                <span className="cpplearn-purple">def</span>{" "}
                greet(name):
              </div>
              <div>
                <span className="cpplearn-line">02</span>
                &nbsp;&nbsp;
                <span className="cpplearn-purple">print</span>(
                <span className="cpplearn-yellow">
                  f"Hello, {"{name}"}!"
                </span>
                )
              </div>
              <div>
                <span className="cpplearn-line">03</span>
              </div>
              <div>
                <span className="cpplearn-line">04</span>
                greet(
                <span className="cpplearn-yellow">"Python"</span>
                )
              </div>
            </div>

            <div className="cpplearn-code-footer">
              <span><i /> PYTHON PROGRAMMING</span>
              <span>READY TO RUN</span>
            </div>
          </div>

          <div className="cpplearn-art-orbit cpplearn-orbit-one" />
          <div className="cpplearn-art-orbit cpplearn-orbit-two" />
          <div className="cpplearn-floating-tag">def greet(name)</div>
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
          <span className="cpplearn-overview-number">Python</span>
          <span className="cpplearn-overview-label">
            Programming language
          </span>
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
