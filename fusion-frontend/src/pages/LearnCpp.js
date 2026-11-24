
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cpp-learning.css";

const units = [
  {
    number: "01",
    title: "C++ Basics",
    description: "Get started with C++, its syntax, data types and fundamental concepts.",
    topics: ["C++ introduction", "Variables & data types", "Operators", "Input & output"],
    route: "/learn-cpp/unit1",
  },
  {
    number: "02",
    title: "Object-Oriented Programming",
    description: "Understand the principles of object-oriented programming in C++.",
    topics: ["Classes & objects", "Constructors", "Inheritance", "Polymorphism"],
    route: "/learn-cpp/unit2",
  },
  {
    number: "03",
    title: "Advanced OOP and Templates",
    description: "Explore advanced programming concepts and reusable code structures.",
    topics: ["Function overloading", "Operator overloading", "Templates", "Exception handling"],
    route: "/learn-cpp/unit3",
  },
  {
    number: "04",
    title: "STL and File Handling",
    description: "Work with the Standard Template Library and manage files in C++.",
    topics: ["STL containers", "Iterators", "Algorithms", "File operations"],
    route: "/learn-cpp/unit4",
  },
];

export default function LearnCpp() {
  const navigate = useNavigate();

  return (
    <main className="cpplearn-page">
      <header className="cpplearn-topbar">
        <button
          className="cpplearn-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="cpplearn-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <button
          className="cpplearn-back"
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

          <h1>Learn <span>C++</span>.</h1>

          <p className="cpplearn-hero-description">
            Go beyond the basics. Explore object-oriented programming,
            develop problem-solving skills, and build efficient programs.
          </p>

          <div className="cpplearn-hero-actions">
            <button
              className="cpplearn-primary-btn"
              onClick={() => navigate("/learn-cpp/unit1")}
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
                <i /><i /><i />
              </div>
              <span>main.cpp</span>
            </div>

            <div className="cpplearn-code-content">
              <div><span className="cpplearn-line">01</span><span className="cpplearn-purple">#include</span> <span className="cpplearn-green">&lt;iostream&gt;</span></div>
              <div><span className="cpplearn-line">02</span></div>
              <div><span className="cpplearn-line">03</span><span className="cpplearn-purple">using namespace</span> std;</div>
              <div><span className="cpplearn-line">04</span></div>
              <div><span className="cpplearn-line">05</span><span className="cpplearn-purple">int</span> main() {"{"}</div>
              <div><span className="cpplearn-line">06</span>  cout &lt;&lt; <span className="cpplearn-yellow">"Hello, C++!"</span>;</div>
              <div><span className="cpplearn-line">07</span>  <span className="cpplearn-purple">return</span> <span className="cpplearn-yellow">0</span>;</div>
              <div><span className="cpplearn-line">08</span>{"}"}</div>
            </div>

            <div className="cpplearn-code-footer">
              <span><i /> C++ PROGRAMMING</span>
              <span>READY TO RUN</span>
            </div>
          </div>

          <div className="cpplearn-art-orbit cpplearn-orbit-one" />
          <div className="cpplearn-art-orbit cpplearn-orbit-two" />
          <div className="cpplearn-floating-tag">#include &lt;iostream&gt;</div>
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
          <span className="cpplearn-overview-number">C++</span>
          <span className="cpplearn-overview-label">Programming language</span>
        </div>

        <div className="cpplearn-overview-divider" />

        <div className="cpplearn-overview-item">
          <span className="cpplearn-overview-number">01</span>
          <span className="cpplearn-overview-label">Start from the basics</span>
        </div>
      </section>

      <section className="cpplearn-units-section">
        <div className="cpplearn-section-heading">
          <div>
            <div className="cpplearn-section-kicker">YOUR LEARNING PATH</div>
            <h2>Explore the units<span>.</span></h2>
            <p>Choose a unit to open its lessons and learning material.</p>
          </div>

          <div className="cpplearn-unit-count">01 — 04</div>
        </div>

        <div className="cpplearn-unit-grid">
          {units.map((unit) => (
            <button
              className="cpplearn-unit-card"
              key={unit.number}
              onClick={() => navigate(unit.route)}
            >
              <div className="cpplearn-unit-card-top">
                <span className="cpplearn-unit-number">{unit.number}</span>
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
        <span>FUSION <span className="cpplearn-footer-dot">•</span> LEARN BY DOING</span>
        <span>Keep learning. Keep building.</span>
      </footer>
    </main>
  );
}
