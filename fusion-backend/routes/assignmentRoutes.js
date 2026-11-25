
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherCppUnit1() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: "📒",
      title: "Upload Notes",
      description: "Upload and manage learning notes for C++ Unit 1.",
      path: "/teacher/cpp/unit1/upload-notes",
    },
    {
      icon: "📑",
      title: "Upload PPT",
      description: "Add presentation material for students.",
      path: "/teacher/cpp/unit1/upload-ppt",
    },
    {
      icon: "🧠",
      title: "Assignments",
      description: "Create and manage Unit 1 MCQ assignments.",
      path: "/teacher/cpp/unit1/assignments",
    },
    {
      icon: "💻",
      title: "Coding Practice",
      description: "Manage C++ coding questions and practice.",
      path: "/teacher/cpp/unit1/coding",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/teacher/manage-cpp")}
        >
          ← Back to Manage C++ Language
        </button>

        <header style={styles.header}>
          <div style={styles.eyebrow}>TEACHER WORKSPACE · C++</div>

          <h1 style={styles.heading}>Unit 1 Dashboard</h1>

          <p style={styles.subtitle}>
            Manage learning resources, assignments and coding practice
            for C++ Unit 1.
          </p>
        </header>

        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>Manage Unit 1</h2>
          <span style={styles.sectionLabel}>4 sections</span>
        </div>

        <div style={styles.grid}>
          {sections.map((section) => (
            <button
              key={section.title}
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
                <span style={styles.arrow}>→</span>
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
    marginBottom: "38px",
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
    maxWidth: "600px",
  },

  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  sectionTitle: {
    color: "#183c35",
    fontSize: "21px",
    fontWeight: 700,
    margin: 0,
  },

  sectionLabel: {
    color: "#627665",
    background: "#e8eee5",
    borderRadius: "20px",
    padding: "7px 13px",
    fontSize: "12px",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "20px",
  },

  card: {
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid #e2e9e1",
    borderRadius: "15px",
    padding: "25px 23px",
    minHeight: "205px",
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

  arrow: {
    fontSize: "19px",
  },
};
