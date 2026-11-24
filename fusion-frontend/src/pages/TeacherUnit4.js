
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit4() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Study Material",
      description: "Manage learning resources for Unit 4.",
      cards: [
        {
          icon: "📒",
          title: "Upload Notes",
          description: "Add and manage study notes",
          route: "/teacher/unit4/upload-notes"
        },
        {
          icon: "📑",
          title: "Upload PPT",
          description: "Upload presentation files",
          route: "/teacher/unit4/upload-ppt"
        }
      ]
    },
    {
      title: "Assignments",
      description: "Create assignments and review student work.",
      cards: [
        {
          icon: "🧠",
          title: "MCQ Assignment",
          description: "Create objective assignments",
          route: "/teacher/unit4/assignments"
        },
        {
          icon: "📝",
          title: "Subjective Assignment",
          description: "Manage written assignments",
          route: "/teacher/unit4/subjective"
        }
      ]
    },
    {
      title: "Coding Practice",
      description: "Create coding problems and review submissions.",
      cards: [
        {
          icon: "💻",
          title: "Add Questions",
          description: "Create coding practice problems",
          route: "/teacher/unit/4/coding/add"
        },
        {
          icon: "📊",
          title: "Coding Results",
          description: "View student coding performance",
          route: "/teacher/unit/4/coding/results"
        }
      ]
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
          <h1>Unit 4</h1>
          <p>
            Manage study materials, assignments and coding practice
            for your students.
          </p>
        </div>
      </header>

      <main className="fusion-unit-main">
        {sections.map((section, sectionIndex) => (
          <section className="fusion-unit-section" key={section.title}>
            <div className="fusion-unit-section-heading">
              <div>
                <span className="fusion-unit-section-number">
                  0{sectionIndex + 1}
                </span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
              </div>
            </div>

            <div className="fusion-unit-card-grid">
              {section.cards.map((card) => (
                <button
                  type="button"
                  className="fusion-unit-card"
                  key={card.title}
                  onClick={() => navigate(card.route)}
                >
                  <div className="fusion-unit-card-content">
                    <span className="fusion-unit-card-icon">
                      {card.icon}
                    </span>

                    <div className="fusion-unit-card-text">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>

                  <span className="fusion-unit-card-arrow">→</span>
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="fusion-unit-back-area">
          <button
            type="button"
            className="fusion-unit-back-button"
            onClick={() => navigate("/teacher/manage-c")}
          >
            ← Back to Course Management
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
