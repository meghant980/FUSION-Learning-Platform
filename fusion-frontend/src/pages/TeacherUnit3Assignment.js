
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit3Assignment() {
  const navigate = useNavigate();
  const unit = 3;

  const assignmentOptions = [
    {
      icon: "📝",
      title: "Create MCQ Assignment",
      description: "Create a new objective assignment for Unit 3.",
      route: `/teacher/unit/${unit}/create-assignment`,
    },
    {
      icon: "📁",
      title: "Manage Assignments",
      description: "View, edit or delete existing assignments.",
      route: `/teacher/unit3/manage-assignments?unit=${unit}`,
    },
    {
      icon: "📊",
      title: "Assignment Results",
      description: "Review student submissions and performance.",
      route: "/teacher/unit3/results",
    },
  ];

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>MCQ Assignments</h1>
        <p>
          Create and manage objective assessments for Unit 3.
        </p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>UNIT 03</span>
            <h2>Assignment Management</h2>
            <p>
              Choose an option to create assignments or review student performance.
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
          onClick={() => navigate("/teacher/unit3")}
        >
          ← Back to Unit 3
        </button>
      </div>
    </div>
  );
}
