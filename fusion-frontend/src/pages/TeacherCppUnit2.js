import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7f3",
    padding: "45px 6%",
    fontFamily: "'DM Sans', Arial, sans-serif",
    color: "#263b34",
  },
  header: {
    background: "#183c35",
    color: "#ffffff",
    padding: "32px",
    borderRadius: "18px",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    margin: 0,
  },
  subtitle: {
    color: "#dce8df",
    marginBottom: 0,
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dce5dc",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "left",
    cursor: "pointer",
    minHeight: "135px",
    color: "#183c35",
    boxShadow: "0 4px 15px rgba(24,60,53,0.05)",
    transition: "transform 0.2s ease",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    margin: "0 0 10px",
  },
  cardDescription: {
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#718078",
    margin: 0,
  },
  back: {
    marginTop: "35px",
    padding: "12px 20px",
    border: "1px solid #d5e0d5",
    borderRadius: "9px",
    background: "#e8eee7",
    color: "#183c35",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function TeacherCppUnit2() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: "📒",
      title: "Upload Notes",
      description: "Upload and manage C++ Unit 2 study notes.",
      route: "/teacher/cpp/unit2/upload-notes",
    },
    {
      icon: "📑",
      title: "Upload PPT",
      description: "Add presentation material for Unit 2.",
      route: "/teacher/cpp/unit2/upload-ppt",
    },
    {
      icon: "🧠",
      title: "Assignments",
      description: "Create assignments and review student performance.",
      route: "/teacher/cpp/unit2/assignments",
    },
    {
      icon: "💻",
      title: "Coding Practice",
      description: "Create and manage C++ coding practice questions.",
      route: "/teacher/cpp/unit2/coding",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div
          style={{
            color: "#c5d6c8",
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          TEACHER PANEL / C++
        </div>

        <h1 style={styles.title}>C++ Unit 2</h1>

        <p style={styles.subtitle}>
          Manage Unit 2 notes, presentations, assignments, and coding practice.
        </p>
      </div>

      <div style={styles.grid}>
        {sections.map((section) => (
          <button
            key={section.title}
            type="button"
            style={styles.card}
            onClick={() => navigate(section.route)}
          >
            <div style={{ fontSize: "27px", marginBottom: "15px" }}>
              {section.icon}
            </div>

            <h2 style={styles.cardTitle}>{section.title}</h2>

            <p style={styles.cardDescription}>
              {section.description}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        style={styles.back}
        onClick={() => navigate("/teacher/manage-cpp")}
      >
        ← Back to Manage C++ Language
      </button>
    </div>
  );
}