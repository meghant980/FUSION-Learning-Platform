
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateSubjective() {
  const navigate = useNavigate();
  const location = useLocation();

  // Support the new language-specific routes:
  // /teacher/java/unit/2/subjective/create
  // /teacher/python/unit/2/subjective/create
  // /teacher/javascript/unit/2/subjective/create
  // /teacher/cpp/unit/2/subjective/create

  const languageRouteMatch = location.pathname.match(
    /^\/teacher\/(c|cpp|java|python|javascript)\/unit\/(\d+)/i
  );

  // Preserve support for the older C routes:
  // /teacher/unit1/subjective/create
  // /teacher/unit/1/subjective/create

  const legacyUnitMatch =
    location.pathname.match(/\/unit(\d+)/i) ||
    location.pathname.match(/\/unit\/(\d+)/i);

  const supportedSubjects = [
    "c",
    "cpp",
    "java",
    "python",
    "javascript",
  ];

  const querySubject = new URLSearchParams(location.search)
    .get("subject")
    ?.trim()
    .toLowerCase();

  const currentSubject = languageRouteMatch
    ? languageRouteMatch[1].toLowerCase()
    : supportedSubjects.includes(querySubject)
      ? querySubject
      : "c";

  const currentUnit = languageRouteMatch
    ? Number(languageRouteMatch[2])
    : legacyUnitMatch
      ? Number(legacyUnitMatch[1])
      : "";

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [marks, setMarks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [unit, setUnit] = useState(
    currentUnit ? String(currentUnit) : ""
  );
  const [section, setSection] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("fusionUser") || "null"
      );

      if (!user || !user.token) {
        setMsg("Please log in again to continue.");
        return;
      }

      await axios.post(
        "http://localhost:5001/api/assignments/subjective",
        {
          question: question.trim(),

          keywords: keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),

          maxMarks: Number(marks),
          unit: Number(unit),
          deadline,
          section: section.trim(),

          // Important: save this assignment under the selected language.
          subject: currentSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMsg(
        `${currentSubject.toUpperCase()} subjective assignment created successfully!`
      );

      setQuestion("");
      setKeywords("");
      setMarks("");
      setDeadline("");
      setUnit(currentUnit ? String(currentUnit) : "");
      setSection("");
    } catch (err) {
      console.error("Error creating subjective assignment:", err);

      setMsg(
        err.response?.data?.message ||
          "Unable to create assignment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    border: "1px solid #dce5dc",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#29463b",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    color: "#405c4d",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f3",
        padding: "35px 5%",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "#ffffff",
            border: "1px solid #dce5dc",
            borderRadius: "9px",
            padding: "10px 16px",
            color: "#315b4d",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "#183c35",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "30px 34px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              color: "#c4d6c6",
              fontSize: "11px",
              letterSpacing: "2px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            TEACHER WORKSPACE · {currentSubject.toUpperCase()}
          </div>

          <h1 style={{ fontSize: "29px", margin: "0 0 10px" }}>
            Create Subjective Assignment
          </h1>

          <p
            style={{
              color: "#d4e1d7",
              fontSize: "14px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Add a written question, define its marking details and assign it
            to the appropriate student section.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e9e1",
            borderRadius: "17px",
            padding: "30px",
            boxShadow: "0 6px 22px rgba(30, 65, 48, 0.05)",
          }}
        >
          <div style={{ marginBottom: "25px" }}>
            <h2
              style={{
                color: "#23483b",
                fontSize: "20px",
                margin: "0 0 7px",
              }}
            >
              Assignment Details
            </h2>

            <p
              style={{
                color: "#849087",
                fontSize: "13px",
                margin: 0,
              }}
            >
              Complete all fields before creating the assignment.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "21px" }}>
              <label style={labelStyle}>Question</label>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write the complete subjective question..."
                required
                rows={5}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ marginBottom: "21px" }}>
              <label style={labelStyle}>Expected Keywords</label>

              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Example: algorithm, function, data structure"
                required
                style={inputStyle}
              />

              <p
                style={{
                  color: "#929d94",
                  fontSize: "11px",
                  margin: "7px 0 0",
                }}
              >
                Separate each keyword with a comma.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "20px",
                marginBottom: "21px",
              }}
            >
              <div>
                <label style={labelStyle}>Maximum Marks</label>

                <input
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="Enter marks"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Unit Number</label>

                <input
                  type="number"
                  min="1"
                  max="4"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Enter unit"
                  required
                  style={{
                    ...inputStyle,
                    background: currentUnit ? "#f3f6f1" : "#ffffff",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "20px",
                marginBottom: "27px",
              }}
            >
              <div>
                <label style={labelStyle}>Student Section</label>

                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Section</option>
                  <option value="CSE-A">CSE-A</option>
                  <option value="CSE-B">CSE-B</option>
                  <option value="CSE-C">CSE-C</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Submission Deadline</label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {msg && (
              <div
                role="status"
                style={{
                  padding: "13px 15px",
                  borderRadius: "9px",
                  marginBottom: "20px",
                  background: msg.includes("successfully")
                    ? "#edf5ed"
                    : "#fff2ed",
                  color: msg.includes("successfully")
                    ? "#286344"
                    : "#a34d37",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "10px",
                background: loading ? "#71877b" : "#214d40",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Creating Assignment..."
                : "Create Assignment →"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#9aa69b",
            fontSize: "12px",
            marginTop: "25px",
          }}
        >
          FUSION · Teaching and Assessment Workspace
        </p>
      </div>
    </div>
  );
}
