import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7f3",
    padding: "40px 6%",
    fontFamily: "'DM Sans', Arial, sans-serif",
    color: "#263b34",
  },
  header: {
    background: "#183c35",
    color: "#fff",
    padding: "30px",
    borderRadius: "17px",
    marginBottom: "28px",
  },
  title: {
    fontSize: "27px",
    margin: 0,
  },
  subtitle: {
    color: "#dce8df",
    lineHeight: 1.6,
    marginBottom: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    border: "1px solid #dce5dc",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "left",
    cursor: "pointer",
    color: "#183c35",
    minHeight: "150px",
    boxShadow: "0 4px 15px rgba(24,60,53,0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    margin: "0 0 10px",
  },
  description: {
    color: "#718078",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
  },
  back: {
    marginTop: "30px",
    padding: "12px 19px",
    background: "#e8eee7",
    color: "#183c35",
    border: "1px solid #d5e0d5",
    borderRadius: "9px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function TeacherCppUnit2Assignment() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "✳",
      title: "Create Assignment",
      description: "Prepare a new assignment for C++ Unit 2 students.",
      route: "/teacher/create-assignment?unit=2&subject=cpp",
    },
    {
      icon: "📁",
      title: "Manage Assignments",
      description: "View and manage the assignments you have created.",
      route: "/teacher/cpp/unit2/assignment-manage?unit=2",
    },
    {
      icon: "📊",
      title: "View Assignment Results",
      description: "Review student submissions and performance.",
      route: "/teacher/cpp/unit2/results",
    },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div
          style={{
            fontSize: "13px",
            color: "#c5d6c8",
            marginBottom: "9px",
          }}
        >
          TEACHER PANEL / C++ / UNIT 2
        </div>

        <h1 style={styles.title}>Unit 2 Assignments</h1>

        <p style={styles.subtitle}>
          Create, manage, and review student performance for C++ Unit 2.
        </p>
      </header>

      <div style={styles.grid}>
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            style={styles.card}
            onClick={() => navigate(action.route)}
          >
            <div style={{ fontSize: "27px", marginBottom: "16px" }}>
              {action.icon}
            </div>

            <h2 style={styles.cardTitle}>{action.title}</h2>

            <p style={styles.description}>{action.description}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        style={styles.back}
        onClick={() => navigate("/teacher/cpp/unit2")}
      >
        ← Back to C++ Unit 2
      </button>
    </div>
  );
}