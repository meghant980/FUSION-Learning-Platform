
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-language-management.css";

const units = [
  {
    number: "01",
    title: "Unit 1",
    subtitle: "Introduction to C Programming",
    description: "Manage learning materials, coding questions and assignments.",
    route: "/teacher/unit1",
  },
  {
    number: "02",
    title: "Unit 2",
    subtitle: "Control Statements and Loops",
    description: "Manage learning materials, coding questions and assignments.",
    route: "/teacher/unit2",
  },
  {
    number: "03",
    title: "Unit 3",
    subtitle: "Functions and Arrays",
    description: "Manage learning materials, coding questions and assignments.",
    route: "/teacher/unit3",
  },
  {
    number: "04",
    title: "Unit 4",
    subtitle: "Pointers and File Handling",
    description: "Manage learning materials, coding questions and assignments.",
    route: "/teacher/unit4",
  },
];

export default function ManageCLanguage() {
  const navigate = useNavigate();

  return (
    <div className="teacher-language-page">
      <header className="teacher-language-header">
        <div className="teacher-language-header-inner">
          <button
            className="teacher-language-back-top"
            onClick={() => navigate("/teacher-dashboard")}
          >
            ← Dashboard
          </button>

          <div className="teacher-language-brand">FUSION</div>

          <div className="teacher-language-eyebrow">
            TEACHER WORKSPACE / C PROGRAMMING
          </div>

          <h1>Manage C Language</h1>

          <p>
            Organise your course content, learning resources and student
            activities across all four units.
          </p>
        </div>
      </header>

      <main className="teacher-language-main">
        <div className="teacher-language-section-heading">
          <div>
            <span>COURSE MANAGEMENT</span>
            <h2>Select a Unit</h2>
            <p>Choose a unit to manage its teaching resources and activities.</p>
          </div>

          <div className="teacher-language-count">
            <strong>04</strong>
            <span>COURSE UNITS</span>
          </div>
        </div>

        <div className="teacher-language-unit-grid">
          {units.map((unit) => (
            <button
              className="teacher-language-unit-card"
              key={unit.number}
              onClick={() => navigate(unit.route)}
            >
              <div className="teacher-language-card-top">
                <span className="teacher-language-unit-number">
                  {unit.number}
                </span>
                <span className="teacher-language-card-arrow">↗</span>
              </div>

              <div className="teacher-language-card-content">
                <span className="teacher-language-unit-label">
                  C PROGRAMMING
                </span>
                <h3>{unit.title}</h3>
                <h4>{unit.subtitle}</h4>
                <p>{unit.description}</p>
              </div>

              <div className="teacher-language-card-footer">
                <span>Manage unit</span>
                <span>Explore →</span>
              </div>
            </button>
          ))}
        </div>

        <div className="teacher-language-bottom">
          <span>FUSION · LEARN. PRACTICE. GROW.</span>

          <button onClick={() => navigate("/teacher-dashboard")}>
            ← Back to Teacher Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
