
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit3() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "study-material",
      label: "STUDY RESOURCES",
      title: "Study Material",
      description: "Upload notes and presentations for your students.",
      cards: [
        {
          icon: "📄",
          title: "Upload Notes",
          description: "Share written notes and additional learning material.",
          route: "/teacher/unit3/upload-notes",
        },
        {
          icon: "📊",
          title: "Upload PPT",
          description: "Add presentations and visual learning resources.",
          route: "/teacher/unit3/upload-ppt",
        },
      ],
    },
    {
      id: "assignments",
      label: "STUDENT ASSESSMENT",
      title: "Assignments",
      description: "Create and manage learning assessments.",
      cards: [
        {
          icon: "☑️",
          title: "MCQ Assignment",
          description: "Create multiple-choice assignments for students.",
          route: "/teacher/unit3/assignments",
        },
        {
          icon: "📝",
          title: "Subjective Assignment",
          description: "Manage written assignments and student responses.",
          route: "/teacher/unit3/subjective",
        },
      ],
    },
    {
      id: "coding",
      label: "PROGRAMMING PRACTICE",
      title: "Coding Practice",
      description: "Manage programming questions and review student performance.",
      cards: [
        {
          icon: "💻",
          title: "Add Questions",
          description: "Create coding questions and their test cases.",
          route: "/teacher/unit3/coding",
        },
        {
          icon: "📈",
          title: "Coding Results",
          description: "View coding submissions and student results.",
          route: "/teacher/unit/3/coding/results",
        },
      ],
    },
  ];

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Unit 3</h1>
        <p>
          Manage study resources, assignments and coding practice
          for your students.
        </p>
      </header>

      <main className="fusion-unit-main">
        {sections.map((section) => (
          <section className="fusion-unit-section" key={section.id}>
            <div className="fusion-unit-section-heading">
              <span>{section.label}</span>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>

            <div className="fusion-unit-card-grid">
              {section.cards.map((card) => (
                <div
                  className="fusion-unit-card"
                  key={card.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(card.route)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(card.route);
                    }
                  }}
                >
                  <div className="fusion-unit-card-content">
                    <div className="fusion-unit-card-icon">
                      {card.icon}
                    </div>

                    <div className="fusion-unit-card-text">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>

                  <div className="fusion-unit-card-arrow">→</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="fusion-unit-back-area">
        <button
          className="fusion-unit-back-button"
          onClick={() => navigate("/teacher/manage-c")}
        >
          ← Back to Teacher Dashboard
        </button>
      </div>
    </div>
  );
}
