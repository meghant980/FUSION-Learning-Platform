
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import "../styles/student-subjective.css";

const API = "http://localhost:5001";

const LANGUAGE_NAMES = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_NAMES);

const normalizeLanguage = (value) => {
  const language = String(value || "").trim().toLowerCase();

  if (language === "c++") return "cpp";

  return SUPPORTED_LANGUAGES.includes(language) ? language : "c";
};

export default function StudentSubjective() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const unit = params.unit || "1";

  // New routes use /learn/:language/unit/:unit/subjective.
  // Existing C and C++ routes are also supported.
  const path = location.pathname.toLowerCase();

  const routeLanguage =
    params.language ||
    (path.startsWith("/learn-cpp/") ? "cpp" :
      path.startsWith("/learn-c/") ? "c" :
        "c");

  const subject = normalizeLanguage(routeLanguage);
  const languageName = LANGUAGE_NAMES[subject];

  const [assignments, setAssignments] = useState([]);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [results, setResults] = useState({});
  const [submittedIds, setSubmittedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("fusionUser") || "null");
  } catch (err) {
    console.error("Unable to read student details:", err);
  }

  const userId = user?.user?.id || user?.user?._id || user?.id;
  const token =
    user?.token ||
    user?.accessToken ||
    localStorage.getItem("token");

  /* =====================================================
     FETCH LANGUAGE- AND UNIT-SPECIFIC ASSIGNMENTS
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (
          !userId ||
          !token ||
          !unit ||
          ![1, 2, 3, 4].includes(Number(unit))
        ) {
          setError(
            "Student details or unit information is missing. Please log in again."
          );
          setLoading(false);
          return;
        }

        const authConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const assignmentsRes = await axios.get(
          `${API}/api/assignments/subjective/student`,
          {
            ...authConfig,
            params: {
              unit: Number(unit),
              subject,
            },
          }
        );

        const submissionsRes = await axios.get(
          `${API}/api/assignments/subjective/submissions`,
          {
            ...authConfig,
            params: {
              userId,
              subject,
            },
          }
        );

        if (cancelled) return;

        const assignmentList =
          assignmentsRes.data?.assignments || [];

        const submissionList =
          submissionsRes.data?.submissions || [];

        setAssignments(assignmentList);

        const resultMap = {};
        const ids = new Set();

        submissionList.forEach((submission) => {
          const assignmentId =
            submission.assignmentId?._id ||
            submission.assignmentId;

          if (!assignmentId) return;

          const key = String(assignmentId);

          ids.add(key);

          if (
            !resultMap[key] ||
            new Date(submission.createdAt) >
              new Date(resultMap[key].createdAt)
          ) {
            resultMap[key] = submission;
          }
        });

        setResults(resultMap);

        // Mark as submitted only assignments in the selected unit.
        const currentAssignmentIds = new Set(
          assignmentList.map((assignment) => String(assignment._id))
        );

        setSubmittedIds(
          Array.from(ids).filter((id) => currentAssignmentIds.has(id))
        );
      } catch (err) {
        if (cancelled) return;

        console.error("Subjective assignment fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load assignments. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId, token, unit, subject, retryKey]);

  /* =====================================================
     ANSWER HANDLING
  ===================================================== */

  const handleChange = (assignmentId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [assignmentId]: value,
    }));
  };

  const handleFileChange = (assignmentId, file) => {
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a PDF file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("PDF files must be 25 MB or smaller.");
      return;
    }

    setFiles((previous) => ({
      ...previous,
      [assignmentId]: file,
    }));
  };

  /* =====================================================
     SUBMIT SUBJECTIVE ASSIGNMENT
  ===================================================== */

  const handleSubmit = async (assignment) => {
    const assignmentId = String(assignment._id);

    if (submittedIds.includes(assignmentId)) return;

    if (
      !(answers[assignmentId] || "").trim() &&
      !files[assignmentId]
    ) {
      alert("Please write an answer or upload a PDF before submitting.");
      return;
    }

    try {
      setSubmittingId(assignmentId);

      const formData = new FormData();

      formData.append("assignmentId", assignmentId);
      formData.append("answer", answers[assignmentId] || "");
      formData.append("userId", userId);

      if (files[assignmentId]) {
        formData.append("file", files[assignmentId]);
      }

      const response = await axios.post(
        `${API}/api/assignments/subjective/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const submission = response.data?.submission;

      if (!submission) {
        throw new Error("Submission response was not received.");
      }

      setResults((previous) => ({
        ...previous,
        [assignmentId]: submission,
      }));

      setSubmittedIds((previous) =>
        previous.includes(assignmentId)
          ? previous
          : [...previous, assignmentId]
      );
    } catch (err) {
      console.error("Subjective submission error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Submission failed. Please try again."
      );
    } finally {
      setSubmittingId("");
    }
  };

  /* =====================================================
     LOADING AND ERROR STATES
  ===================================================== */

  if (loading) {
    return (
      <div className="ss-page">
        <div className="ss-state-card">
          <div className="ss-loader"></div>
          <h3>Loading assignments</h3>
          <p>Please wait while we get your assignments ready.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ss-page">
        <div className="ss-state-card">
          <div className="ss-state-icon">!</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>

          <button
            className="ss-primary-btn"
            onClick={() => setRetryKey((previous) => previous + 1)}
          >
            Try Again
          </button>

          <button
            className="ss-back-btn"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="ss-page">
      <header className="ss-header">
        <button
          className="ss-back-btn"
          onClick={() => navigate(-1)}
        >
          <span>←</span> Back
        </button>

        <div className="ss-brand">
          <div className="ss-brand-icon">F</div>
          <span>FUSION</span>
        </div>

        <div className="ss-header-label">
          STUDENT LEARNING
        </div>
      </header>

      <main className="ss-main">
        <section className="ss-hero">
          <div className="ss-hero-content">
            <span className="ss-eyebrow">
              YOUR LEARNING SPACE
            </span>

            <h1>Subjective Assignments</h1>

            <p>
              Express your understanding, write your answers, and submit
              your work for evaluation.
            </p>

            <div className="ss-hero-meta">
              <span>{languageName.toUpperCase()}</span>
              <span className="ss-meta-dot"></span>
              <span>UNIT {unit}</span>
              <span className="ss-meta-dot"></span>
              <span>{assignments.length} ASSIGNMENTS</span>
            </div>
          </div>

          <div className="ss-hero-decoration">
            <div className="ss-decoration-circle">
              <span>✎</span>
            </div>
            <div className="ss-decoration-line"></div>
          </div>
        </section>

        <section className="ss-section-heading">
          <div>
            <span className="ss-section-label">
              PRACTICE & EVALUATION
            </span>

            <h2>Your Assignments</h2>

            <p>
              Complete each assignment and submit it when ready.
            </p>
          </div>

          <div className="ss-count">
            <strong>{assignments.length}</strong>
            <span>Total</span>
          </div>
        </section>

        {assignments.length === 0 ? (
          <div className="ss-empty">
            <div className="ss-empty-icon">✎</div>

            <h3>No assignments available</h3>

            <p>
              There are currently no {languageName} subjective assignments
              for Unit {unit}. Please check again later.
            </p>
          </div>
        ) : (
          <div className="ss-assignment-list">
            {assignments.map((assignment, index) => {
              const assignmentId = String(assignment._id);
              const isSubmitted = submittedIds.includes(assignmentId);
              const isSubmitting = submittingId === assignmentId;
              const maxMarks = assignment.maxMarks || 10;
              const result = results[assignmentId];

              return (
                <article className="ss-card" key={assignment._id}>
                  <div className="ss-card-top">
                    <div className="ss-question-number">
                      <span>QUESTION</span>
                      <strong>
                        {String(index + 1).padStart(2, "0")}
                      </strong>
                    </div>

                    <div
                      className={`ss-status ${
                        isSubmitted ? "ss-status-submitted" : ""
                      }`}
                    >
                      <span className="ss-status-dot"></span>
                      {isSubmitted ? "Submitted" : "Pending"}
                    </div>
                  </div>

                  <div className="ss-question-content">
                    <h3>{assignment.question}</h3>

                    <div className="ss-marks">
                      <span className="ss-marks-icon">✦</span>
                      Maximum marks: <strong>{maxMarks}</strong>
                    </div>

                    {assignment.deadline && (
                      <p className="ss-answer-hint">
                        Deadline:{" "}
                        {new Date(assignment.deadline).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    )}
                  </div>

                  <div className="ss-answer-area">
                    <label htmlFor={`answer-${assignmentId}`}>
                      YOUR ANSWER
                    </label>

                    <textarea
                      id={`answer-${assignmentId}`}
                      rows="7"
                      placeholder="Start writing your answer here..."
                      value={answers[assignmentId] || ""}
                      disabled={isSubmitted || isSubmitting}
                      onChange={(event) =>
                        handleChange(assignmentId, event.target.value)
                      }
                    />

                    <div className="ss-answer-hint">
                      Write a clear and well-structured answer.
                    </div>
                  </div>

                  <div className="ss-submit-area">
                    <div className="ss-upload-section">
                      <label
                        className={`ss-upload-btn ${
                          isSubmitted ? "ss-disabled" : ""
                        }`}
                      >
                        <span className="ss-upload-icon">↥</span>
                        Upload PDF

                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={isSubmitted || isSubmitting}
                          onChange={(event) =>
                            handleFileChange(
                              assignmentId,
                              event.target.files?.[0]
                            )
                          }
                        />
                      </label>

                      {files[assignmentId] && (
                        <div className="ss-file-name">
                          <span>PDF</span>
                          <span>{files[assignmentId].name}</span>
                        </div>
                      )}
                    </div>

                    <button
                      className={`ss-submit-btn ${
                        isSubmitted ? "ss-submitted-btn" : ""
                      }`}
                      disabled={isSubmitted || isSubmitting}
                      onClick={() => handleSubmit(assignment)}
                    >
                      {isSubmitted
                        ? "✓ Submitted"
                        : isSubmitting
                        ? "Submitting..."
                        : "Submit Assignment"}

                      {!isSubmitted && !isSubmitting && <span>→</span>}
                    </button>
                  </div>

                  {result && (
                    <div className="ss-result">
                      <div className="ss-result-heading">
                        <span className="ss-result-check">✓</span>

                        <div>
                          <h4>Evaluation Result</h4>
                          <p>Your submission has been recorded.</p>
                        </div>
                      </div>

                      <div className="ss-result-marks">
                        <span>Marks Awarded</span>

                        <strong>
                          {result.marks ?? "Pending"}{" "}
                          <small>/ {maxMarks}</small>
                        </strong>
                      </div>

                      <div className="ss-feedback">
                        <span>TEACHER FEEDBACK</span>
                        <p>
                          {result.feedback || "No feedback available yet."}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="ss-footer">
        <span>FUSION</span>
        <p>Learn. Practice. Improve.</p>
      </footer>
    </div>
  );
}
