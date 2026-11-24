
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit4Assignment() {
  const navigate = useNavigate();
  const unit = 4;

  const options = [
    {
      number: "01",
      icon: "📝",
      title: "Create MCQ Assignment",
      description: "Create objective questions and assignments for students.",
      route: `/teacher/unit/${unit}/create-assignment`
    },
    {
      number: "02",
      icon: "📁",
      title: "Manage Assignments",
      description: "View and manage existing Unit 4 assignments.",
      route: `/teacher/unit${unit}/assignment-manage?unit=${unit}`
    },
    {
      number: "03",
      icon: "📊",
      title: "View Results",
      description: "Review student submissions and performance.",
      route: `/teacher/unit${unit}/results`
    }
  ];

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">
          <div className="fusion-unit-brand-mark">F</div>
          <div>
            <strong>FUSION</strong>
            <span>TEACHER WORKSPACE</span>
          </div>
        </div>

        <div className="fusion-unit-hero-content">
          <span className="fusion-unit-eyebrow">
            COURSE MANAGEMENT / UNIT 04
          </span>
          <h1>MCQ Assignments</h1>
          <p>
            Create objective assignments, manage existing work and
            review student performance.
          </p>
        </div>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <div>
              <span className="fusion-unit-section-number">01</span>
              <div>
                <h2>Assignment Management</h2>
                <p>Select an action to continue managing Unit 4 assignments.</p>
              </div>
            </div>
          </div>

          <div className="fusion-unit-card-grid">
            {options.map((option) => (
              <button
                type="button"
                className="fusion-unit-card"
                key={option.number}
                onClick={() => navigate(option.route)}
              >
                <div className="fusion-unit-card-content">
                  <span className="fusion-unit-card-icon">
                    {option.icon}
                  </span>

                  <div className="fusion-unit-card-text">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                </div>

                <span className="fusion-unit-card-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <div className="fusion-unit-back-area">
          <button
            type="button"
            className="fusion-unit-back-button"
            onClick={() => navigate("/teacher/unit4")}
          >
            ← Back to Unit 4
          </button>
        </div>
      </main>

      <footer className="fusion-unit-footer">
        <strong>FUSION</strong>
        <span>Faculty Student Interactive Online Network</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
