
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherCppUnit2Assignment() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: "✳",
      title: "Create Assignment",
      description: "Create a new MCQ assignment for C++ Unit 2 students.",
      path: "/teacher/create-assignment?unit=2&subject=cpp",
    },
    {
      icon: "📁",
      title: "Manage Assignments",
      description: "View and manage previously created Unit 2 assignments.",
      path: "/teacher/cpp/unit2/assignment-manage?unit=2",
    },
    {
      icon: "📊",
      title: "View Assignment Results",
      description: "Review C++ Unit 2 student submissions and performance.",
      path: "/teacher/cpp/unit2/results",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/teacher/cpp/unit2")}
        >
          ← Back to C++ Unit 2
        </button>

        <header style={styles.header}>
          <div style={styles.eyebrow}>TEACHER WORKSPACE · C++</div>

          <h1 style={styles.heading}>Unit 2 Assignments</h1>

          <p style={styles.subtitle}>
            Create MCQ assignments, manage existing assignments and
            review student performance for C++ Unit 2.
          </p>
        </header>

        <h2 style={styles.sectionTitle}>Assignment Management</h2>

        <div style={styles.grid}>
          {sections.map((section) => (
            <button
              key={section.title}
              type="button"
              style={styles.card}
              onClick={() => navigate(section.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#8a9b85";
                e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(24, 60, 53, 0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e2e9e1";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(24, 60, 53, 0.04)";
              }}
            >
              <div style={styles.iconBox}>{section.icon}</div>

              <h3 style={styles.cardTitle}>{section.title}</h3>

              <p style={styles.cardDescription}>
                {section.description}
              </p>

              <div style={styles.cardFooter}>
                <span>Open section</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7f3",
    padding: "38px 5%",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  },

  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },

  backButton: {
    background: "transparent",
    border: "1px solid #d9e2d8",
    color: "#214d40",
    borderRadius: "9px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "34px",
  },

  header: {
    background: "#183c35",
    borderRadius: "18px",
    padding: "38px 36px",
    color: "#ffffff",
    marginBottom: "32px",
  },

  eyebrow: {
    color: "#c5d4c2",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  heading: {
    fontSize: "clamp(27px, 4vw, 36px)",
    fontWeight: 700,
    margin: "0 0 12px",
  },

  subtitle: {
    color: "#dce7dc",
    fontSize: "15px",
    lineHeight: 1.7,
    margin: 0,
  },

  sectionTitle: {
    color: "#183c35",
    fontSize: "21px",
    fontWeight: 700,
    margin: "0 0 20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid #e2e9e1",
    borderRadius: "15px",
    padding: "27px 24px",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(24, 60, 53, 0.04)",
    fontFamily: "inherit",
  },

  iconBox: {
    width: "48px",
    height: "48px",
    background: "#edf2eb",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    marginBottom: "18px",
  },

  cardTitle: {
    color: "#183c35",
    fontSize: "17px",
    fontWeight: 700,
    margin: "0 0 9px",
  },

  cardDescription: {
    color: "#718075",
    fontSize: "13px",
    lineHeight: 1.65,
    margin: "0 0 20px",
    flex: 1,
  },

  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#456b54",
    fontSize: "12px",
    fontWeight: 700,
  },
};
