
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/c-unit-page.css";

export default function CUnit4() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCpp = location.pathname.includes("learn-cpp");
  const language = isCpp ? "cpp" : "c";
  const languageName = isCpp ? "C++" : "C";

  const topics = isCpp
    ? "STL and File Handling"
    : "Pointers and File Handling";

  return (
    <div className="cu-page">
      {/* HEADER */}
      <header className="cu-header">
        <button
          className="cu-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="cu-brand-mark">F</span>
          FUSION
        </button>

        <div className="cu-header-right">
          <span className="cu-language-tag">
            {languageName} PROGRAMMING
          </span>
          <button
            className="cu-dashboard-link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard <span>↗</span>
          </button>
        </div>
      </header>

      <main className="cu-main">
        {/* BACK BUTTON */}
        <button
          className="cu-back-link"
          onClick={() => navigate(`/learn-${language}`)}
        >
          <span>←</span> Back to all units
        </button>

        {/* HERO */}
        <section className="cu-hero">
          <div className="cu-hero-content">
            <div className="cu-eyebrow">
              <span className="cu-eyebrow-dot"></span>
              {languageName} PROGRAMMING · UNIT 04
            </div>

            <h1>
              Unit <span>04.</span>
            </h1>

            <p>
              {topics}. Explore important programming concepts,
              strengthen your understanding, and put your skills
              into practice.
            </p>

            <div className="cu-hero-meta">
              <span>LEARN</span>
              <span className="cu-meta-divider"></span>
              <span>PRACTICE</span>
              <span className="cu-meta-divider"></span>
              <span>IMPROVE</span>
            </div>
          </div>

          <div className="cu-hero-art">
            <div className="cu-art-orbit cu-art-orbit-one"></div>
            <div className="cu-art-orbit cu-art-orbit-two"></div>

            <div className="cu-art-window">
              <div className="cu-art-window-top">
                <span></span>
                <span></span>
                <span></span>
                <small>unit_04.code</small>
              </div>

              <div className="cu-art-code">
                <div><i>01</i> <b>int</b> main() {"{"}</div>
                <div><i>02</i> &nbsp; <em>int</em> value = 4;</div>
                <div><i>03</i> &nbsp; process(value);</div>
                <div><i>04</i> <strong>return</strong> 0;</div>
                <div><i>05</i> {"}"}</div>
              </div>

              <div className="cu-art-status">
                <span></span> READY TO LEARN
              </div>
            </div>

            <div className="cu-art-floating">{"</>"}</div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section className="cu-overview">
          <div>
            <div className="cu-overview-label">UNIT OVERVIEW</div>
            <h2>{topics}</h2>
          </div>

          <div className="cu-overview-count">
            <strong>05</strong>
            <span>LEARNING RESOURCES</span>
          </div>
        </section>

        <div className="cu-sections">
          {/* STUDY MATERIAL */}
          <section className="cu-section">
            <div className="cu-section-heading">
              <div className="cu-section-number">01</div>
              <div>
                <h2>Study Material</h2>
                <p>Build your concepts with notes and presentations.</p>
              </div>
            </div>

            <div className="cu-card-grid">
              <button
                className="cu-resource-card"
                onClick={() =>
                  navigate(`/student/notes/${language}/4`)
                }
              >
                <div className="cu-card-top">
                  <span className="cu-card-icon">▤</span>
                  <span className="cu-card-arrow">↗</span>
                </div>
                <div className="cu-card-copy">
                  <h3>View Notes</h3>
                  <p>Access your Unit 4 study notes.</p>
                </div>
                <div className="cu-card-bottom">
                  <span>STUDY MATERIAL</span>
                  <span>Explore →</span>
                </div>
              </button>

              <button
                className="cu-resource-card"
                onClick={() =>
                  navigate(`/learn-${language}/unit4/ppt`)
                }
              >
                <div className="cu-card-top">
                  <span className="cu-card-icon">▧</span>
                  <span className="cu-card-arrow">↗</span>
                </div>
                <div className="cu-card-copy">
                  <h3>View PPTs</h3>
                  <p>Explore lecture presentations.</p>
                </div>
                <div className="cu-card-bottom">
                  <span>PRESENTATIONS</span>
                  <span>Explore →</span>
                </div>
              </button>
            </div>
          </section>

          {/* ASSIGNMENTS */}
          <section className="cu-section">
            <div className="cu-section-heading">
              <div className="cu-section-number">02</div>
              <div>
                <section className="cu-section">
          <div className="cu-section-heading">
            <div className="cu-section-number">02</div>
            <div>
              <h2>Learn Topics</h2>
              <p>Understand every topic with detailed theory, examples and code.</p>
            </div>
          </div>
          <div className="cu-card-grid">
            <button type="button" className="cu-resource-card" onClick={() => navigate(`/learn/${language}/unit/4/topics`)}>
              <div className="cu-card-top"><span className="cu-card-icon">📚</span><span className="cu-card-arrow">↗</span></div>
              <div className="cu-card-copy"><h3>Learn Topics</h3><p>Read topic-wise theory, important points, examples and code for C or C++.</p></div>
              <div className="cu-card-bottom"><span>Start learning</span><span>→</span></div>
            </button>
          </div>
        </section>
        <h2>Assignments</h2>
                <p>Test your understanding and evaluate your progress.</p>
              </div>
            </div>

            <div className="cu-card-grid">
              <button
                className="cu-resource-card"
                onClick={() =>
                  navigate("/student-assignment?unit=4")
                }
              >
                <div className="cu-card-top">
                  <span className="cu-card-icon">◎</span>
                  <span className="cu-card-arrow">↗</span>
                </div>
                <div className="cu-card-copy">
                  <h3>Assignment Quiz</h3>
                  <p>Attempt quizzes and check your knowledge.</p>
                </div>
                <div className="cu-card-bottom">
                  <span>ASSESSMENT</span>
                  <span>Start Quiz →</span>
                </div>
              </button>

              <button
                className="cu-resource-card"
                onClick={() =>
                  navigate(`/learn-${language}/unit/4/subjective`)
                }
              >
                <div className="cu-card-top">
                  <span className="cu-card-icon">✎</span>
                  <span className="cu-card-arrow">↗</span>
                </div>
                <div className="cu-card-copy">
                  <h3>Subjective Assignment</h3>
                  <p>Practice written and descriptive questions.</p>
                </div>
                <div className="cu-card-bottom">
                  <span>WRITTEN PRACTICE</span>
                  <span>Explore →</span>
                </div>
              </button>
            </div>
          </section>

          {/* CODING PRACTICE */}
          <section className="cu-section">
            <div className="cu-section-heading">
              <div className="cu-section-number">03</div>
              <div>
                <h2>Coding Practice</h2>
                <p>Apply what you have learned through programming.</p>
              </div>
            </div>

            <div className="cu-card-grid">
              <button
                className="cu-resource-card"
                onClick={() =>
                  navigate(`/learn-${language}/unit4/coding`)
                }
              >
                <div className="cu-card-top">
                  <span className="cu-card-icon">{"</>"}</span>
                  <span className="cu-card-arrow">↗</span>
                </div>
                <div className="cu-card-copy">
                  <h3>Start Coding</h3>
                  <p>Solve programming problems and improve your skills.</p>
                </div>
                <div className="cu-card-bottom">
                  <span>HANDS-ON PRACTICE</span>
                  <span>Start Practicing →</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="cu-footer">
          <span>FUSION</span>
          <span>Learn · Practice · Grow</span>
          <button onClick={() => navigate(`/learn-${language}`)}>
            Back to Units ↑
          </button>
        </footer>
      </main>
    </div>
  );
}
