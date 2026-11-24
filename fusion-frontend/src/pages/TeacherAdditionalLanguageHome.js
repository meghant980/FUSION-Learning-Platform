
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const courses = {
  java: {
    name: "Java",
    topics: [
      "Introduction to Java Programming",
      "Object-Oriented Programming",
      "Exception Handling and Collections",
      "Advanced Java Concepts",
    ],
  },
  python: {
    name: "Python",
    topics: [
      "Introduction to Python Programming",
      "Functions and Data Structures",
      "Object-Oriented Programming",
      "File Handling and Advanced Python",
    ],
  },
  javascript: {
    name: "JavaScript",
    topics: [
      "Introduction to JavaScript",
      "Functions and DOM",
      "Asynchronous JavaScript",
      "Advanced JavaScript Concepts",
    ],
  },
};

export default function TeacherAdditionalLanguageHome() {
  const navigate = useNavigate();
  const { language } = useParams();

  const selectedLanguage = String(language || "").toLowerCase();
  const course = courses[selectedLanguage];

  if (!course) {
    return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <p style={styles.breadcrumb}>TEACHER WORKSPACE</p>
            <h1 style={styles.heroTitle}>Language not found</h1>
          </div>
        </div>
        <div style={styles.content}>
          <button
            style={styles.backButton}
            onClick={() => navigate("/teacher-dashboard")}
          >
            Back to Teacher Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.breadcrumb}>
            TEACHER WORKSPACE / {course.name.toUpperCase()} PROGRAMMING
          </p>

          <h1 style={styles.heroTitle}>
            Manage {course.name} Language
          </h1>

          <p style={styles.heroDescription}>
            Organise your course content, learning resources and student
            activities across all four units.
          </p>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.sectionTop}>
          <div>
            <p style={styles.sectionEyebrow}>COURSE MANAGEMENT</p>
            <h2 style={styles.sectionTitle}>Select a Unit</h2>
            <p style={styles.sectionDescription}>
              Choose a unit to manage its teaching resources and activities.
            </p>
          </div>

          <div style={styles.unitCount}>
            <strong>04</strong>
            <span>COURSE UNITS</span>
          </div>
        </div>

        <div style={styles.unitGrid}>
          {course.topics.map((topic, index) => {
            const unit = index + 1;

            return (
              <button
                key={unit}
                type="button"
                style={styles.unitCard}
                onClick={() =>
                  navigate(`/teacher/${selectedLanguage}/unit/${unit}`)
                }
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = "#9bb9a5";
                  event.currentTarget.style.boxShadow =
                    "0 9px 24px rgba(26, 67, 54, 0.08)";
                  event.currentTarget.style.transform = "translateY(-2px)";
                  event.currentTarget.querySelector(".unit-arrow").style.background =
                    "#173f35";
                  event.currentTarget.querySelector(".unit-arrow").style.color =
                    "#ffffff";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = "#dfe6dd";
                  event.currentTarget.style.boxShadow = "none";
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.querySelector(".unit-arrow").style.background =
                    "#edf2eb";
                  event.currentTarget.querySelector(".unit-arrow").style.color =
                    "#315e4e";
                }}
              >
                <div style={styles.cardTop}>
                  <span style={styles.unitNumber}>
                    {String(unit).padStart(2, "0")}
                  </span>
                  <span className="unit-arrow" style={styles.unitArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.cardEyebrow}>
                  {course.name.toUpperCase()} PROGRAMMING
                </p>

                <h3 style={styles.cardTitle}>Unit {unit}</h3>

                <p style={styles.topicTitle}>{topic}</p>

                <p style={styles.cardDescription}>
                  Manage learning materials, coding questions and assignments.
                </p>

                <div style={styles.cardFooter}>
                  <span>Manage unit</span>
                  <strong>Explore →</strong>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8f4",
    color: "#1c443a",
    fontFamily: "'Poppins', sans-serif",
  },

  hero: {
    width: "100%",
    minHeight: "195px",
    boxSizing: "border-box",
    background: "#173f35",
    color: "#ffffff",
    padding: "22px 8% 38px",
    position: "relative",
    overflow: "hidden",
  },

  heroInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  breadcrumb: {
    color: "#a9c4b4",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 15px",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: "clamp(27px, 3vw, 36px)",
    fontWeight: "600",
    margin: "0 0 12px",
  },

  heroDescription: {
    color: "#d0dfd6",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.7",
  },

  content: {
    maxWidth: "1400px",
    width: "84%",
    margin: "0 auto",
    padding: "48px 0 70px",
    boxSizing: "border-box",
  },

  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "26px",
  },

  sectionEyebrow: {
    color: "#8a9d8c",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 10px",
  },

  sectionTitle: {
    color: "#1b443a",
    fontSize: "27px",
    fontWeight: "600",
    margin: "0 0 8px",
  },

  sectionDescription: {
    color: "#7c8d83",
    fontSize: "13px",
    margin: 0,
  },

  unitCount: {
    width: "120px",
    height: "85px",
    flexShrink: 0,
    borderRadius: "10px",
    background: "#e9f0e7",
    color: "#234e41",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },

  unitCountNumber: {
    fontSize: "25px",
    fontWeight: "700",
  },

  unitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "21px",
  },

  unitCard: {
    minWidth: 0,
    minHeight: "295px",
    textAlign: "left",
    padding: "25px",
    background: "#ffffff",
    color: "#21483d",
    border: "1px solid #dfe6dd",
    borderRadius: "13px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    boxShadow: "none",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  unitNumber: {
    width: "52px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "11px",
    background: "#eaf1e8",
    color: "#225244",
    fontWeight: "700",
    fontSize: "17px",
  },

  unitArrow: {
    width: "38px",
    height: "38px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#edf2eb",
    color: "#315e4e",
    borderRadius: "9px",
    fontSize: "21px",
    transition: "all 0.2s ease",
  },

  cardEyebrow: {
    color: "#8b9f8d",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1.8px",
    margin: "0 0 10px",
  },

  cardTitle: {
    color: "#234d41",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 7px",
  },

  topicTitle: {
    color: "#405b51",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 10px",
  },

  cardDescription: {
    color: "#829187",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "0 0 20px",
  },

  cardFooter: {
    borderTop: "1px solid #e9ede7",
    paddingTop: "16px",
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#89978d",
    fontSize: "11px",
  },

  backButton: {
    background: "#173f35",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
