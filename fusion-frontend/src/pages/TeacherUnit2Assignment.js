
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit2Assignment() {
  const navigate = useNavigate();

  const unit = 2;

  const assignmentOptions = [
    {
      icon: "➕",
      title: "MCQ Assignment",
      description:
        "Create a new multiple-choice assignment for your students.",
      route: `/teacher/unit/${unit}/create-assignment`,
    },
    {
      icon: "📁",
      title: "Manage Assignments",
      description:
        "View, edit and delete assignments created for this unit.",
      route: `/teacher/unit${unit}/assignment-manage?unit=${unit}`,
    },
    {
      icon: "📊",
      title: "Assignment Results",
      description:
        "Review student submissions and check their performance.",
      route: `/teacher/unit${unit}/results`,
    },
  ];

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Unit 2 Assignments</h1>
        <p>
          Create MCQ assignments, manage existing work and
          review student performance.
        </p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>ASSESSMENT MANAGEMENT</span>
            <h2>Assignment Centre</h2>
            <p>
              Choose an action to manage Unit 2 assignments.
            </p>
          </div>

          <div className="fusion-unit-card-grid">
            {assignmentOptions.map((option) => (
              <div
                className="fusion-unit-card"
                key={option.title}
                role="button"
                tabIndex={0}
                onClick={() => navigate(option.route)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(option.route);
                  }
                }}
              >
                <div className="fusion-unit-card-content">
                  <div className="fusion-unit-card-icon">
                    {option.icon}
                  </div>

                  <div className="fusion-unit-card-text">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                </div>

                <div className="fusion-unit-card-arrow">→</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fusion-unit-back-area">
        <button
          className="fusion-unit-back-button"
          onClick={() => navigate("/teacher/unit2")}
        >
          ← Back to Unit 2
        </button>
      </div>
    </div>
  );
}
