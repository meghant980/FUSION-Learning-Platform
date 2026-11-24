
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Shared teacher dashboard for Java, Python and JavaScript.
const languageDetails = {
  java: {
    name: "Java",
    topics: {
      1: "Java Basics",
      2: "Object-Oriented Programming",
      3: "Arrays, Strings and Methods",
      4: "Advanced Java Concepts",
    },
  },

  python: {
    name: "Python",
    topics: {
      1: "Python Fundamentals",
      2: "Decision Making and Loops",
      3: "Functions and Data Structures",
      4: "Object-Oriented and Practical Python",
    },
  },

  javascript: {
    name: "JavaScript",
    topics: {
      1: "Introduction to JavaScript",
      2: "Functions and DOM",
      3: "Asynchronous JavaScript",
      4: "Advanced JavaScript Concepts",
    },
  },
};

const sections = [
  {
    eyebrow: "STUDY RESOURCES",
    title: "Study Material",
    description: "Upload notes and presentations for your students.",
    cards: [
      {
        title: "Upload Notes",
        description: "Share written notes and additional learning material.",
        icon: "📄",
        action: "upload-notes",
      },
      {
        title: "Upload PPT",
        description: "Add presentations and visual learning resources.",
        icon: "📊",
        action: "upload-ppt",
      },
    ],
  },
  {
    eyebrow: "STUDENT ASSESSMENT",
    title: "Assignments",
    description: "Create and manage learning assessments.",
    cards: [
      {
        title: "MCQ Assignment",
        description: "Create multiple-choice assignments for students.",
        icon: "☑️",
        action: "mcq",
      },
      {
        title: "Subjective Assignment",
        description: "Manage written assignments and student responses.",
        icon: "📝",
        action: "subjective",
      },
    ],
  },
  {
    eyebrow: "PROGRAMMING PRACTICE",
    title: "Coding Practice",
    description:
      "Manage programming questions and review student performance.",
    cards: [
      {
        title: "Add Questions",
        description: "Create coding questions and their test cases.",
        icon: "💻",
        action: "coding",
      },
      {
        title: "Coding Results",
        description: "View coding submissions and student results.",
        icon: "📈",
        action: "coding-results",
      },
    ],
  },
];

export default function TeacherAdditionalLanguageUnit() {
  const navigate = useNavigate();
  const { language, unit } = useParams();

  const selectedLanguage = String(language || "").toLowerCase();
  const unitNumber = String(unit || "1");
  const course = languageDetails[selectedLanguage];

  if (!course || !["1", "2", "3", "4"].includes(unitNumber)) {
    return (
      <div style={styles.page}>
        <h2>Language or unit not found</h2>
        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/teacher-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleCardClick = (action) => {
    const base = `/teacher/${selectedLanguage}/unit/${unitNumber}`;

    switch (action) {
      case "mcq":
        navigate(
          `/teacher/create-assignment?unit=${unitNumber}&subject=${selectedLanguage}`
        );
        break;

      case "coding":
        navigate(`${base}/coding`);
        break;

      case "coding-results":
        navigate(
          `/teacher/coding/results?language=${selectedLanguage}&unit=${unitNumber}`
        );
        break;

      default:
        navigate(`${base}/${action}`);
        break;
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.breadcrumb}>
            TEACHER WORKSPACE / {course.name.toUpperCase()} PROGRAMMING /
            UNIT {unitNumber}
          </p>

          <h1 style={styles.heroTitle}>
            {course.name} — Unit {unitNumber}
          </h1>

          <p style={styles.heroDescription}>
            {course.topics[unitNumber]}
          </p>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.topNavigation}>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate(`/teacher/${selectedLanguage}`)}
          >
            ← Back to Units
          </button>

          <span style={styles.unitLabel}>
            {course.name.toUpperCase()} · UNIT {unitNumber}
          </span>
        </div>

        {sections.map((section) => (
          <section key={section.title} style={styles.section}>
            <p style={styles.sectionEyebrow}>{section.eyebrow}</p>

            <h2 style={styles.sectionTitle}>{section.title}</h2>

            <p style={styles.sectionDescription}>
              {section.description}
            </p>

            <div style={styles.cardGrid}>
              {section.cards.map((card) => (
                <button
                  type="button"
                  key={card.action + card.title}
                  style={styles.actionCard}
                  onClick={() => handleCardClick(card.action)}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.borderColor = "#9bb9a5";
                    event.currentTarget.style.boxShadow =
                      "0 9px 24px rgba(26, 67, 54, 0.08)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.borderColor = "#dfe6dd";
                    event.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={styles.cardIcon}>{card.icon}</span>

                  <span style={styles.cardText}>
                    <strong style={styles.cardTitle}>
                      {card.title}
                    </strong>

                    <span style={styles.cardDescription}>
                      {card.description}
                    </span>
                  </span>

                  <span style={styles.cardArrow}>→</span>
                </button>
              ))}
            </div>
          </section>
        ))}
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
    minHeight: "145px",
    boxSizing: "border-box",
    background: "#173f35",
    color: "#ffffff",
    padding: "22px 8% 30px",
  },

  heroInner: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  breadcrumb: {
    color: "#a9c4b4",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 13px",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "600",
    margin: "0 0 8px",
  },

  heroDescription: {
    color: "#d0dfd6",
    fontSize: "14px",
    margin: 0,
  },

  content: {
    width: "84%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "35px 0 65px",
    boxSizing: "border-box",
  },

  topNavigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "35px",
  },

  backButton: {
    background: "#ffffff",
    color: "#245342",
    border: "1px solid #dce5db",
    padding: "10px 17px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  unitLabel: {
    color: "#829486",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.3px",
  },

  section: {
    marginBottom: "43px",
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
    fontSize: "25px",
    fontWeight: "600",
    margin: "0 0 8px",
  },

  sectionDescription: {
    color: "#7c8d83",
    fontSize: "13px",
    margin: "0 0 22px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  actionCard: {
    minWidth: 0,
    minHeight: "135px",
    display: "flex",
    alignItems: "center",
    gap: "19px",
    textAlign: "left",
    padding: "22px 24px",
    background: "#ffffff",
    border: "1px solid #dfe6dd",
    borderRadius: "12px",
    color: "#21483d",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "none",
  },

  cardIcon: {
    width: "55px",
    height: "55px",
    minWidth: "55px",
    borderRadius: "11px",
    background: "#eaf1e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  cardText: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    color: "#234d41",
    fontSize: "16px",
    fontWeight: "600",
  },

  cardDescription: {
    color: "#829187",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  cardArrow: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "9px",
    background: "#edf2eb",
    color: "#315e4e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
};
