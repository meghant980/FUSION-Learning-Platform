import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit1Assignment() {
  const navigate = useNavigate();

  const unit = 1;

  const assignmentOptions = [
    {
      icon: "✚",
      title: "Create Assignment",
      description:
        "Create a new assignment and add questions for your students.",
      route: `/teacher/unit/${unit}/create-assignment`,
    },
    {
      icon: "📚",
      title: "Manage Assignments",
      description:
        "View, manage and update the assignments created for this unit.",
      route: `/teacher/unit${unit}/manage-assignments?unit=${unit}`,
    },
    {
      icon: "📊",
      title: "Assignment Results",
      description:
        "Review student submissions and check their assignment performance.",
      route: `/teacher/unit${unit}/results`,
    },
  ];

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>

        <h1>Unit 1 Assignments</h1>

        <p>
          Create assignments, manage existing work and review
          student performance.
        </p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>ASSESSMENT MANAGEMENT</span>
            <h2>Assignment Centre</h2>
            <p>
              Select an option below to manage assignments for Unit 1.
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
          onClick={() => navigate("/teacher/unit1")}
        >
          ← Back to Unit 1
        </button>
      </div>
    </div>
  );
}