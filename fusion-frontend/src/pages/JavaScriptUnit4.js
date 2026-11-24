
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/c-unit-page.css";

export default function JavaScriptUnit4() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Study Material",
      subtitle: "Build your understanding with JavaScript learning resources.",
      icon: "01",
      items: [
        {
          icon: "▤",
          title: "View Notes",
          description: "Access your JavaScript Unit 4 study notes.",
          action: () =>
            navigate("/learn/javascript/unit/4/materials?category=notes"),
          label: "Open notes",
        },
        {
          icon: "▧",
          title: "View PPTs",
          description: "Explore JavaScript Unit 4 presentation files.",
          action: () =>
            navigate("/learn/javascript/unit/4/materials?category=ppt"),
          label: "Open presentations",
        },
      ],
    },
    {
      title: "Learn Topics",
      subtitle: "Understand every topic with detailed theory, examples and code.",
      icon: "02",
      items: [
        {
          icon: "📚",
          title: "Learn Topics",
          description: "Read topic-wise theory, explanations, important points and language-specific code examples.",
          action: () => navigate(`/learn/${"javascript"}/unit/4/topics`),
          label: "Start learning",
        },
      ],
    },
    {
      title: "Assignments",
      subtitle: "Test your knowledge and practise written answers.",
      icon: "02",
      items: [
        {
          icon: "✓",
          title: "Assignment Quiz",
          description: "Attempt the Unit 4 quiz and check your understanding.",
          action: () =>
            navigate("/student-assignment?unit=4&subject=javascript"),
          label: "Attempt quiz",
        },
        {
          icon: "✎",
          title: "Subjective Assignment",
          description: "Write and submit your descriptive JavaScript answers.",
          action: () =>
            navigate("/learn/javascript/unit/4/subjective"),
          label: "View assignment",
        },
      ],
    },
    {
      title: "Coding Practice",
      subtitle: "Apply what you have learned through JavaScript programming questions.",
      icon: "03",
      items: [
        {
          icon: "</>",
          title: "Coding Practice",
          description:
            "Solve JavaScript Unit 4 programming questions and improve your coding skills.",
          action: () =>
            navigate("/learn/javascript/unit/4/coding"),
          label: "Start coding",
        },
      ],
    },
  ];

  return (
    <div className="cu-page">
      <header className="cu-header">
        <button
          className="cu-brand"
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="cu-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <div className="cu-header-right">
          <span className="cu-language-tag">JAVASCRIPT PROGRAMMING</span>

          <button
            className="cu-dashboard-link"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard <span>↗</span>
          </button>
        </div>
      </header>

      <main className="cu-main">
        <button
          className="cu-back-link"
          type="button"
          onClick={() => navigate("/learn/javascript")}
        >
          <span>←</span> Back to all units
        </button>

        <section className="cu-hero">
          <div className="cu-hero-content">
            <div className="cu-eyebrow">
              <span className="cu-eyebrow-dot" />
              JAVASCRIPT LEARNING PATH
            </div>

            <h1>
              Unit <span>04</span>
            </h1>

            <p>
              Explore modern JavaScript and web development. Learn about
              DOM manipulation, events, promises, asynchronous programming
              and modern JavaScript features.
            </p>

            <div className="cu-hero-meta">
              <span>LEARN AT YOUR PACE</span>
              <span className="cu-meta-divider" />
              <span>STUDY · PRACTISE · IMPROVE</span>
            </div>
          </div>

          <div className="cu-hero-art" aria-hidden="true">
            <div className="cu-art-orbit cu-art-orbit-one" />
            <div className="cu-art-orbit cu-art-orbit-two" />

            <div className="cu-art-window">
              <div className="cu-art-window-top">
                <span />
                <span />
                <span />
                <small>unit_04.js</small>
              </div>

              <div className="cu-art-code">
                <div>
                  <i>01</i> <b>async function</b> getData() {"{"}
                </div>
                <div>
                  <i>02</i> &nbsp;&nbsp;<b>const</b> response = <strong>await</strong> fetch(url);
                </div>
                <div>
                  <i>03</i> &nbsp;&nbsp;<b>return</b> response.json();
                </div>
                <div>
                  <i>04</i> {"}"}
                </div>
                <div>
                  <i>05</i> getData();
                </div>
              </div>

              <div className="cu-art-status">
                <span /> READY TO LEARN
              </div>
            </div>

            <div className="cu-art-floating">{"</>"}</div>
          </div>
        </section>

        <section className="cu-overview">
          <div>
            <span className="cu-overview-label">YOUR UNIT WORKSPACE</span>
            <h2>Everything you need, in one place.</h2>
          </div>

          <div className="cu-overview-count">
            <strong>04</strong>
            <span>Learning sections</span>
          </div>
        </section>

        <div className="cu-sections">
          {sections.map((section) => (
            <section className="cu-section" key={section.title}>
              <div className="cu-section-heading">
                <div className="cu-section-number">{section.icon}</div>

                <div>
                  <h2>{section.title}</h2>
                  <p>{section.subtitle}</p>
                </div>
              </div>

              <div className="cu-card-grid">
                {section.items.map((item) => (
                  <button
                    type="button"
                    className="cu-resource-card"
                    key={item.title}
                    onClick={item.action}
                  >
                    <div className="cu-card-top">
                      <span className="cu-card-icon">{item.icon}</span>
                      <span className="cu-card-arrow">↗</span>
                    </div>

                    <div className="cu-card-copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className="cu-card-bottom">
                      <span>{item.label}</span>
                      <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="cu-footer">
          <span>FUSION</span>
          <span>Learn something. Build something.</span>

          <button
            type="button"
            onClick={() => navigate("/learn/javascript")}
          >
            Back to units ↑
          </button>
        </footer>
      </main>
    </div>
  );
}
