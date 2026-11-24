
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeacherSubjectiveAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  const supportedSubjects = [
    "c",
    "cpp",
    "java",
    "python",
    "javascript",
  ];

  // Language-specific routes:
  // /teacher/java/unit/1/subjective
  // /teacher/python/unit/1/subjective
  // /teacher/javascript/unit/1/subjective

  const languageMatch = location.pathname.match(
    /^\/teacher\/(c|cpp|java|python|javascript)\/unit\/(\d+)/i
  );

  // Older C routes:
  // /teacher/unit1/subjective
  // /teacher/unit/1/subjective

  const legacyUnitMatch =
    location.pathname.match(/\/unit(\d+)/i) ||
    location.pathname.match(/\/unit\/(\d+)/i);

  const querySubject = new URLSearchParams(location.search)
    .get("subject")
    ?.trim()
    .toLowerCase();

  const subject = languageMatch
    ? languageMatch[1].toLowerCase()
    : supportedSubjects.includes(querySubject)
      ? querySubject
      : "c";

  const unit = languageMatch
    ? Number(languageMatch[2])
    : legacyUnitMatch
      ? Number(legacyUnitMatch[1])
      : 1;

  // Generate the correct routes for the current language.
  const basePath = languageMatch
    ? `/teacher/${subject}/unit/${unit}/subjective`
    : `/teacher/unit${unit}/subjective`;

  const backPath = languageMatch
    ? `/teacher/${subject}/unit/${unit}`
    : `/teacher/unit${unit}`;

  const options = [
    {
      number: "01",
      icon: "✍️",
      title: "Create Subjective Assignment",
      description:
        "Prepare and publish written assignments for your students.",
      detail: "Create new questions and assignment instructions",
      path: `${basePath}/create`,
    },
    {
      number: "02",
      icon: "📚",
      title: "Manage Assignments",
      description:
        "View, edit and manage the subjective assignments you have created.",
      detail: "Organise your existing assignments",
      path: `${basePath}/manage`,
    },
    {
      number: "03",
      icon: "📊",
      title: "View Results",
      description:
        "Review student submissions and evaluate their performance.",
      detail: "Check submissions and student results",
      path: languageMatch
        ? `${basePath}/results`
        : `/teacher/unit/${unit}/subjective/results`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f3",
        padding: "38px 5%",
        fontFamily: "'DM Sans', Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          style={{
            border: "1px solid #dce5dc",
            background: "#ffffff",
            color: "#315b4d",
            padding: "10px 17px",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          ← Back to Unit {unit}
        </button>

        <div
          style={{
            background: "#183c35",
            borderRadius: "20px",
            padding: "34px 38px",
            color: "#ffffff",
            marginBottom: "34px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: "#c4d6c6",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "13px",
            }}
          >
            TEACHER WORKSPACE · {subject.toUpperCase()} · UNIT {unit}
          </div>

          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              margin: "0 0 12px",
              fontWeight: 700,
              letterSpacing: "-0.8px",
            }}
          >
            Subjective Assessments
          </h1>

          <p
            style={{
              color: "#d4e1d7",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "620px",
              margin: 0,
            }}
          >
            Create written assessments, manage your assignments and
            keep track of your students' performance, all in one place.
          </p>
        </div>

        <div style={{ marginBottom: "22px" }}>
          <div
            style={{
              color: "#718278",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.8px",
              marginBottom: "8px",
            }}
          >
            ASSESSMENT MANAGEMENT
          </div>

          <h2
            style={{
              color: "#203d34",
              fontSize: "23px",
              margin: 0,
              fontWeight: 700,
            }}
          >
            What would you like to do?
          </h2>

          <p
            style={{
              color: "#78857c",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            Choose an option to continue managing Unit {unit} assessments.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {options.map((option) => (
            <button
              type="button"
              key={option.number}
              onClick={() => navigate(option.path)}
              style={{
                textAlign: "left",
                border: "1px solid #e1e9e1",
                background: "#ffffff",
                borderRadius: "17px",
                padding: "25px",
                cursor: "pointer",
                minHeight: "225px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
                color: "#203d34",
                boxShadow: "0 5px 18px rgba(30, 65, 48, 0.045)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8a9b85";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 26px rgba(30, 65, 48, 0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e1e9e1";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 5px 18px rgba(30, 65, 48, 0.045)";
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "#edf3ec",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "25px",
                    }}
                  >
                    {option.icon}
                  </div>

                  <span
                    style={{
                      color: "#a2b2a2",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {option.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    margin: "0 0 10px",
                    fontWeight: 700,
                    color: "#23483b",
                  }}
                >
                  {option.title}
                </h3>

                <p
                  style={{
                    color: "#78857c",
                    fontSize: "13px",
                    lineHeight: 1.65,
                    margin: "0 0 12px",
                  }}
                >
                  {option.description}
                </p>

                <p
                  style={{
                    color: "#9aa69b",
                    fontSize: "11px",
                    margin: 0,
                  }}
                >
                  {option.detail}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #edf1ec",
                  paddingTop: "15px",
                  marginTop: "22px",
                  color: "#315b4d",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <span>Open section</span>
                <span style={{ fontSize: "19px" }}>→</span>
              </div>
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#9aa69b",
            fontSize: "12px",
            marginTop: "38px",
          }}
        >
          FUSION · Teaching and Assessment Workspace
        </p>
      </div>
    </div>
  );
}
