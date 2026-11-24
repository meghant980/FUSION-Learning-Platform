
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const languages = [
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
];

const getToken = () => {
  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken");

  if (directToken) return directToken;

  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");
    return user.token || user.accessToken || "";
  } catch {
    return "";
  }
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7f3",
    padding: "40px 5%",
    color: "#183c35",
    fontFamily: '"DM Sans", Arial, sans-serif',
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  back: {
    background: "#ffffff",
    border: "1px solid #dce5dc",
    color: "#214d40",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#829680",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "2px",
    marginBottom: "12px",
  },
  heading: {
    fontSize: "clamp(27px, 4vw, 36px)",
    fontWeight: 800,
    margin: "0 0 10px",
    color: "#183c35",
  },
  description: {
    color: "#718078",
    fontSize: "14px",
    lineHeight: 1.7,
    margin: 0,
  },
  panel: {
    marginTop: "30px",
    padding: "25px",
    background: "#ffffff",
    border: "1px solid #e4e9e2",
    borderRadius: "15px",
    boxShadow: "0 7px 22px rgba(24, 60, 53, 0.045)",
  },
  panelTitle: {
    fontSize: "18px",
    color: "#183c35",
    fontWeight: 800,
    margin: "0 0 17px",
  },
  select: {
    width: "100%",
    maxWidth: "350px",
    padding: "12px 14px",
    border: "1px solid #dce5dc",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#214d40",
    fontSize: "14px",
    outlineColor: "#8a9b85",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "15px",
    marginTop: "22px",
  },
  card: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "19px",
    background: "#ffffff",
    border: "1px solid #e4e9e2",
    borderRadius: "12px",
    textAlign: "left",
    cursor: "pointer",
    color: "#183c35",
    transition: "border-color 0.2s ease",
  },
  icon: {
    width: "45px",
    height: "45px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "#eaf1e8",
    color: "#527b58",
    borderRadius: "11px",
    fontSize: "20px",
  },
  questionTitle: {
    margin: "0 0 7px",
    color: "#214d40",
    fontSize: "15px",
    fontWeight: 800,
  },
  questionDescription: {
    margin: "0 0 9px",
    color: "#718078",
    fontSize: "12px",
    lineHeight: 1.7,
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    color: "#829680",
    fontSize: "10px",
    fontWeight: 700,
  },
  arrow: {
    flexShrink: 0,
    color: "#8a9b85",
    fontSize: "20px",
  },
  message: {
    padding: "30px 15px",
    textAlign: "center",
    color: "#718078",
    fontSize: "13px",
    lineHeight: 1.7,
  },
  retry: {
    marginTop: "12px",
    padding: "10px 17px",
    background: "#214d40",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function TeacherCodingResults() {
  const navigate = useNavigate();
  const { unit: routeUnit } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isCppRoute = location.pathname.startsWith("/teacher/cpp/");

  const requestedLanguage = searchParams.get("language");
  const validLanguage = languages.some(
    (item) => item.value === requestedLanguage
  );

  const initialLanguage = validLanguage
    ? requestedLanguage
    : isCppRoute
    ? "cpp"
    : "c";

  const unitNumber = (
    searchParams.get("unit") ||
    routeUnit ||
    ""
  ).replace(/^unit\s*/i, "");

  const [questions, setQuestions] = useState([]);
  const [language, setLanguage] = useState(initialLanguage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Login token not found. Please log in again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let fetchedQuestions = [];

      if (unitNumber) {
        const response = await axios.get(
          `${API_URL}/api/coding/teacher/practice`,
          {
            params: {
              language,
              unit: unitNumber,
            },
            headers,
          }
        );

        const responseData = response.data;

        fetchedQuestions = Array.isArray(responseData)
          ? responseData
          : responseData?.questions || [];
      } else {
        const responses = await Promise.all(
          ["1", "2", "3", "4"].map((unit) =>
            axios.get(`${API_URL}/api/coding/teacher/practice`, {
              params: {
                language,
                unit,
              },
              headers,
            })
          )
        );

        fetchedQuestions = responses.flatMap((response) => {
          const responseData = response.data;

          return Array.isArray(responseData)
            ? responseData
            : responseData?.questions || [];
        });
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Fetch coding questions error:", err);

      setQuestions([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Unable to load coding questions."
      );
    } finally {
      setLoading(false);
    }
  }, [language, unitNumber]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const openQuestion = (question) => {
    if (!question._id) {
      setError("This coding question does not have a valid ID.");
      return;
    }

    const questionUnit = String(
      question.unit || unitNumber || "1"
    ).replace(/^unit\s*/i, "");

    // Keep the existing C++ results route.
    if (language === "cpp") {
      navigate(
        `/teacher/cpp/unit/${questionUnit}/coding/results/${question._id}`
      );
      return;
    }

    // The existing common results page is reused for C,
    // Java, Python and JavaScript.
    navigate(
      `/teacher/unit/${questionUnit}/coding/results/${question._id}`
    );
  };

  const selectedLanguage =
    languages.find((item) => item.value === language)?.label || language;

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <button
          type="button"
          style={styles.back}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <header>
          <div style={styles.eyebrow}>
            FUSION / STUDENT PERFORMANCE
          </div>

          <h1 style={styles.heading}>
            {unitNumber ? `Unit ${unitNumber} - ` : ""}
            Coding Questions & Results
          </h1>

          <p style={styles.description}>
            Select a programming language and open a coding question to
            review its student submissions and evaluation results.
          </p>
        </header>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Select Programming Language
          </h2>

          <select
            aria-label="Select programming language"
            style={styles.select}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {loading ? (
            <div style={styles.message}>
              Loading coding questions...
            </div>
          ) : error ? (
            <div style={styles.message}>
              <p>{error}</p>

              <button
                type="button"
                style={styles.retry}
                onClick={fetchQuestions}
              >
                Try Again
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div style={styles.message}>
              No {selectedLanguage} coding questions found
              {unitNumber ? ` in Unit ${unitNumber}` : ""}.
            </div>
          ) : (
            <>
              <div style={styles.eyebrow}>
                {questions.length} CODING QUESTION
                {questions.length !== 1 ? "S" : ""} FOUND
              </div>

              <div style={styles.grid}>
                {questions.map((question, index) => (
                  <button
                    key={question._id || index}
                    type="button"
                    style={styles.card}
                    onClick={() => openQuestion(question)}
                    onMouseOver={(event) => {
                      event.currentTarget.style.borderColor = "#8a9b85";
                    }}
                    onMouseOut={(event) => {
                      event.currentTarget.style.borderColor = "#e4e9e2";
                    }}
                  >
                    <div style={styles.icon}>{"</>"}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={styles.questionTitle}>
                        {question.title || "Untitled Question"}
                      </h3>

                      <p style={styles.questionDescription}>
                        {question.description
                          ? `${question.description.substring(0, 120)}${
                              question.description.length > 120 ? "..." : ""
                            }`
                          : "No description available."}
                      </p>

                      <div style={styles.metadata}>
                        <span>
                          Language:{" "}
                          {languages.find(
                            (item) => item.value === question.language
                          )?.label ||
                            question.language ||
                            selectedLanguage}
                        </span>

                        {question.unit && (
                          <span>Unit: {question.unit}</span>
                        )}
                      </div>
                    </div>

                    <span style={styles.arrow}>→</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
