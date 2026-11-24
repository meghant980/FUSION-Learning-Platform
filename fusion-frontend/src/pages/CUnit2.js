
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/c-unit-page.css";

export default function CUnit2() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCpp = location.pathname.includes("learn-cpp");
  const language = isCpp ? "cpp" : "c";
  const languageName = isCpp ? "C++" : "C";

  const sections = [
    {
      title: "Study Material",
      subtitle: "Understand the concepts with notes and presentations.",
      number: "01",
      items: [
        {
          icon: "▤",
          title: "View Notes",
          description: "Access your Unit 2 study notes.",
          action: () => navigate(`/student/notes/${language}/2`),
          label: "Open notes",
        },
        {
          icon: "▧",
          title: "View PPTs",
          description: "Explore presentation files for this unit.",
          action: () => navigate(`/learn-${language}/unit2/ppt`),
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
          action: () => navigate(`/learn/${language}/unit/2/topics`),
          label: "Start learning",
        },
      ],
    },
    {
      title: "Assignments",
      subtitle: "Check your understanding through assessments.",
      number: "02",
      items: [
        {
          icon: "✓",
          title: "Assignment Quiz",
          description: "Attempt the Unit 2 quiz and test your knowledge.",
          action: () => navigate("/student-assignment?unit=2"),
          label: "Attempt quiz",
        },
        {
          icon: "✎",
          title: "Subjective Assignment",
          description: "Complete and submit your written answers.",
          action: () => navigate(`/learn-${language}/unit/2/subjective`),
          label: "View assignment",
        },
      ],
    },
    {
      title: "Coding Practice",
      subtitle: "Put your programming concepts into practice.",
      number: "03",
      items: [
        {
          icon: "</>",
          title: "Coding Practice",
          description: `Solve ${languageName} programming questions for Unit 2.`,
          action: () => navigate(`/learn-${language}/unit2/coding`),
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
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="cu-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <div className="cu-header-right">
          <span className="cu-language-tag">{languageName} PROGRAMMING</span>
          <button
            className="cu-dashboard-link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard <span>↗</span>
          </button>
        </div>
      </header>

      <main className="cu-main">
        <button
          className="cu-back-link"
          onClick={() => navigate(`/learn-${language}`)}
        >
          <span>←</span> Back to all units
        </button>

        <section className="cu-hero">
          <div className="cu-hero-content">
            <div className="cu-eyebrow">
              <span className="cu-eyebrow-dot" />
              {languageName} LEARNING PATH
            </div>

            <h1>
              Unit <span>02</span>
            </h1>

            <p>
              Continue your {languageName} learning journey. Explore study
              resources, complete assignments and sharpen your programming
              skills with Unit 2 practice.
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
                <small>unit_02.{isCpp ? "cpp" : "c"}</small>
              </div>

              <div className="cu-art-code">
                <div><i>01</i> <b>#include</b> <em>&lt;stdio.h&gt;</em></div>
                <div><i>02</i> <strong>int</strong> main() {"{"}</div>
                <div><i>03</i> &nbsp;&nbsp;<strong>for</strong> (int i=1; i&lt;=5; i++)</div>
                <div><i>04</i> &nbsp;&nbsp;&nbsp;&nbsp;printf(<em>"%d", i);</em></div>
                <div><i>05</i> {"}"}</div>
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
            <h2>Keep learning. Keep progressing.</h2>
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
                <div className="cu-section-number">{section.number}</div>

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

          <button onClick={() => navigate(`/learn-${language}`)}>
            Back to units ↑
          </button>
        </footer>
      </main>
    </div>
  );
}
