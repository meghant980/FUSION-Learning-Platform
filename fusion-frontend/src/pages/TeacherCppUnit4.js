import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7f3",
    padding: "45px 6%",
    fontFamily: "'DM Sans', Arial, sans-serif",
  },
  container: {
    maxWidth: "1050px",
    margin: "0 auto",
  },
  header: {
    background: "#183c35",
    color: "#ffffff",
    padding: "35px",
    borderRadius: "18px",
    marginBottom: "30px",
  },
  eyebrow: {
    color: "#c5d6c8",
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "30px",
    margin: "0 0 12px",
  },
  description: {
    color: "#dce8df",
    margin: 0,
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  button: {
    background: "#ffffff",
    border: "1px solid #dce5dc",
    borderRadius: "14px",
    padding: "25px",
    minHeight: "115px",
    textAlign: "left",
    cursor: "pointer",
    color: "#183c35",
    fontSize: "17px",
    fontWeight: "600",
    boxShadow: "0 4px 14px rgba(24, 60, 53, 0.05)",
  },
  buttonText: {
    display: "block",
    color: "#718078",
    fontSize: "13px",
    fontWeight: "400",
    marginTop: "9px",
  },
  back: {
    marginTop: "35px",
    padding: "12px 20px",
    border: "1px solid #183c35",
    borderRadius: "9px",
    background: "transparent",
    color: "#183c35",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default function TeacherCppUnit2() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>TEACHER PANEL / C++ / UNIT 4</div>
          <h1 style={styles.title}>C++ Unit 4 – Teacher Panel</h1>
          <p style={styles.description}>
            Manage Unit 4 C++ notes, presentations, assignments, and coding
            practice from one place.
          </p>
        </div>

        <div style={styles.grid}>
          <button
            style={styles.button}
            onClick={() => navigate("/teacher/cpp/unit4/upload-notes")}
          >
            📄 Upload Notes
            <span style={styles.buttonText}>
              Add learning notes for Unit 4
            </span>
          </button>

          <button
            style={styles.button}
            onClick={() => navigate("/teacher/cpp/unit4/upload-ppt")}
          >
            📊 Upload PPT
            <span style={styles.buttonText}>
              Add presentation material
            </span>
          </button>

          <button
            style={styles.button}
            onClick={() => navigate("/teacher/cpp/unit4/assignments")}
          >
            📝 Assignments
            <span style={styles.buttonText}>
              Manage Unit 4 assignments
            </span>
          </button>

          <button
            style={styles.button}
            onClick={() => navigate("/teacher/cpp/unit4/coding")}
          >
            💻 Coding Practice
            <span style={styles.buttonText}>
              Create and manage coding questions
            </span>
          </button>
        </div>

        <button
          style={styles.back}
          onClick={() => navigate("/teacher/manage-cpp")}
        >
          ← Back to Manage C++ Language
        </button>
      </div>
    </div>
  );
}