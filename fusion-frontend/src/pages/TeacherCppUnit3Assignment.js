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
    fontSize: "29px",
    margin: "0 0 12px",
  },
  description: {
    color: "#dce8df",
    lineHeight: 1.6,
    margin: 0,
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
    minHeight: "125px",
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
    marginTop: "10px",
    lineHeight: 1.5,
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

export default function TeacherCppUnit3Assignment() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>TEACHER PANEL / C++ / UNIT 3</div>

          <h1 style={styles.title}>C++ Unit 3 – Assignments</h1>

          <p style={styles.description}>
            Create assignments, manage existing work, and review student
            performance for C++ Unit 3.
          </p>
        </div>

        <div style={styles.grid}>
          <button
            style={styles.button}
            onClick={() =>
              navigate("/teacher/create-assignment?unit=3&subject=cpp")
            }
          >
            ✳ Create Assignment
            <span style={styles.buttonText}>
              Prepare and publish a new assignment
            </span>
          </button>

          <button
            style={styles.button}
            onClick={() =>
              navigate("/teacher/cpp/unit3/assignment-manage?unit=3")
            }
          >
            📁 Manage Assignments
            <span style={styles.buttonText}>
              View and manage existing assignments
            </span>
          </button>

          <button
            style={styles.button}
            onClick={() => navigate("/teacher/cpp/unit3/results")}
          >
            📊 View Assignment Results
            <span style={styles.buttonText}>
              Review student submissions and performance
            </span>
          </button>
        </div>

        <button
          style={styles.back}
          onClick={() => navigate("/teacher/cpp/unit3")}
        >
          ← Back to C++ Unit 3
        </button>
      </div>
    </div>
  );
}