
import React from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  {
    name: "C Programming",
    code: "C",
    description: "Manage C programming questions and unit-wise coding practice.",
    color: "#eaf1e8",
    textColor: "#527b58",
    units: [
      { label: "Unit 1", path: "/teacher/unit1/coding" },
      { label: "Unit 2", path: "/teacher/unit2/coding" },
      { label: "Unit 3", path: "/teacher/unit3/coding" },
      { label: "Unit 4", path: "/teacher/unit4/coding" },
    ],
  },
  {
    name: "C++ Programming",
    code: "C++",
    description: "Organise C++ coding questions and practical exercises.",
    color: "#eaf0f7",
    textColor: "#4d739a",
    units: [
      { label: "Unit 1", path: "/teacher/cpp/unit1/coding" },
      { label: "Unit 2", path: "/teacher/cpp/unit2/coding" },
      { label: "Unit 3", path: "/teacher/cpp/unit3/coding" },
      { label: "Unit 4", path: "/teacher/cpp/unit4/coding" },
    ],
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f3",
    padding: "40px 5%",
    fontFamily: '"DM Sans", Arial, sans-serif',
    color: "#183c35",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  back: {
    border: "1px solid #dce5da",
    background: "#ffffff",
    color: "#214d40",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#829680",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    marginBottom: "12px",
  },
  heading: {
    fontSize: "clamp(28px, 4vw, 38px)",
    fontWeight: 800,
    margin: "0 0 12px",
    color: "#183c35",
  },
  description: {
    color: "#718078",
    fontSize: "14px",
    lineHeight: 1.8,
    maxWidth: "650px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "22px",
    marginTop: "35px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e4e9e2",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 7px 22px rgba(24, 60, 53, 0.045)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  icon: {
    width: "55px",
    height: "55px",
    borderRadius: "13px",
    display: "grid",
    placeItems: "center",
    fontSize: "20px",
    fontWeight: 800,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: 800,
    margin: 0,
    color: "#183c35",
  },
  cardDescription: {
    color: "#718078",
    fontSize: "13px",
    lineHeight: 1.7,
    minHeight: "44px",
  },
  unitHeading: {
    marginTop: "23px",
    marginBottom: "12px",
    color: "#829680",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },
  unitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  unitButton: {
    minHeight: "45px",
    border: "1px solid #dce5da",
    borderRadius: "9px",
    background: "#f7f9f5",
    color: "#214d40",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  results: {
    marginTop: "30px",
    padding: "25px",
    borderRadius: "15px",
    background: "#183c35",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  resultsTitle: {
    fontSize: "19px",
    fontWeight: 800,
    margin: "0 0 7px",
  },
  resultsText: {
    color: "#c4d2c9",
    fontSize: "12px",
    margin: 0,
    lineHeight: 1.7,
  },
  resultsButton: {
    background: "#dce8d8",
    color: "#183c35",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default function TeacherCodingHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <button
          type="button"
          style={styles.back}
          onClick={() => navigate("/teacher-dashboard")}
        >
          ← Back to Dashboard
        </button>

        <header>
          <div style={styles.eyebrow}>FUSION / CODING MANAGEMENT</div>

          <h1 style={styles.heading}>
            Coding Practice
          </h1>

          <p style={styles.description}>
            Manage programming questions, organise unit-wise coding practice
            and review student submissions from one place.
          </p>
        </header>

        <section style={styles.grid}>
          {languages.map((language) => (
            <article key={language.name} style={styles.card}>
              <div style={styles.cardTop}>
                <div
                  style={{
                    ...styles.icon,
                    background: language.color,
                    color: language.textColor,
                  }}
                >
                  {language.code}
                </div>

                <h2 style={styles.cardTitle}>
                  {language.name}
                </h2>
              </div>

              <p style={styles.cardDescription}>
                {language.description}
              </p>

              <div style={styles.unitHeading}>
                SELECT A UNIT
              </div>

              <div style={styles.unitGrid}>
                {language.units.map((unit) => (
                  <button
                    key={unit.label}
                    type="button"
                    style={styles.unitButton}
                    onClick={() => navigate(unit.path)}
                  >
                    + {unit.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section style={styles.results}>
          <div>
            <h2 style={styles.resultsTitle}>
              Coding Results and Submissions
            </h2>
            <p style={styles.resultsText}>
              Review submitted solutions and monitor student coding
              performance.
            </p>
          </div>

          <button
            type="button"
            style={styles.resultsButton}
            onClick={() => navigate("/teacher/coding/results")}
          >
            View Coding Results →
          </button>
        </section>
      </main>
    </div>
  );
}
