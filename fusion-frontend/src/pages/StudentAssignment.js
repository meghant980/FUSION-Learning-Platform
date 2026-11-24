
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../styles/student-assignment.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const LANGUAGE_NAMES = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_NAMES);

export default function StudentAssignment() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const selectedUnit = query.get("unit");

  const requestedSubject = (
    query.get("subject") ||
    (location.pathname.toLowerCase().includes("cpp") ? "cpp" : "c")
  )
    .trim()
    .toLowerCase();

  const subject =
    requestedSubject === "c++" ? "cpp" : requestedSubject;

  const validSubject = SUPPORTED_LANGUAGES.includes(subject);
  const courseName = LANGUAGE_NAMES[subject] || "Programming";

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [detailsFilled, setDetailsFilled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  /* =====================================================
     FETCH ASSIGNMENTS FOR SELECTED LANGUAGE AND UNIT
  ===================================================== */

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!detailsFilled) return;

      if (!validSubject) {
        setError("Invalid programming language selected.");
        setAssignments([]);
        return;
      }

      if (!selectedUnit || ![1, 2, 3, 4].includes(Number(selectedUnit))) {
        setError("Please select a valid unit.");
        setAssignments([]);
        return;
      }

      if (!rollNumber.trim()) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${API_URL}/api/assignments/student`,
          {
            params: {
              unit: Number(selectedUnit),
              rollNumber: rollNumber.trim(),
              subject,
            },
          }
        );

        setAssignments(response.data.assignments || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load assignments. Please try again."
        );
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [
    selectedUnit,
    rollNumber,
    subject,
    detailsFilled,
    validSubject,
    retryKey,
  ]);

  /* =====================================================
     ANSWER HANDLING
  ===================================================== */

  const handleOptionSelect = (questionIndex, option) => {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option,
    }));
  };

  /* =====================================================
     SUBMIT MCQ ASSIGNMENT
  ===================================================== */

  const handleSubmit = async () => {
    if (!selectedAssignment || submitting) return;

    if (
      Object.keys(answers).length !== selectedAssignment.questions.length
    ) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);

    const orderedAnswers = selectedAssignment.questions.map(
      (_, index) => answers[index] || ""
    );

    try {
      const response = await axios.post(
        `${API_URL}/api/assignments/performance`,
        {
          studentName: studentName.trim(),
          rollNumber: rollNumber.trim(),
          answers: orderedAnswers,
          unit: selectedAssignment.unit,
          assignmentId: selectedAssignment._id,
          subject,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to save your performance."
        );
      }

      const savedPerformance = response.data.performance;

      setResult({
        correct: savedPerformance.correct,
        wrong: savedPerformance.wrong,
        accuracy: Number(savedPerformance.accuracy).toFixed(2),
      });
    } catch (err) {
      console.error("Error saving assignment performance:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Your result could not be saved. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     OPEN ASSIGNMENT AND CHECK PREVIOUS ATTEMPT
  ===================================================== */

  const handleAssignmentClick = async (assignment) => {
    if (!rollNumber.trim()) {
      alert("Please enter your details first.");
      return;
    }

    if (assignment.deadline && new Date() > new Date(assignment.deadline)) {
      alert("The deadline for this assignment is over.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/assignments/check`,
        {
          rollNumber: rollNumber.trim(),
          unit: assignment.unit,
          assignmentId: assignment._id,
        }
      );

      if (response.data.attempted) {
        alert("You have already attempted this assignment.");
        return;
      }

      setAnswers({});
      setResult(null);
      setSelectedAssignment(assignment);
    } catch (err) {
      console.error("Error checking assignment attempt:", err);

      alert(
        err.response?.data?.message ||
          "Unable to open this assignment. Please try again."
      );
    }
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
    setAnswers({});
    setResult(null);
  };

  const handleRetry = () => {
    setError("");
    setRetryKey((previous) => previous + 1);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="sa-page">
      <header className="sa-header">
        <a href="/dashboard" className="sa-brand">
          <span className="sa-brand-mark">F</span>
          <span>FUSION</span>
        </a>

        <div className="sa-header-label">
          STUDENT LEARNING PORTAL
        </div>
      </header>

      <main className="sa-main">
        <section className="sa-hero">
          <div className="sa-eyebrow">
            ASSESS · LEARN · IMPROVE
          </div>

          <h1>
            MCQ Assignments
            <span>Unit {selectedUnit || "—"}</span>
          </h1>

          <p>
            Test your understanding, track your progress, and strengthen
            your programming concepts.
          </p>

          <div className="sa-hero-tags">
            <span>UNIT {selectedUnit || "—"}</span>
            <span>{courseName.toUpperCase()} ASSESSMENT</span>
            <span>STUDENT PORTAL</span>
          </div>
        </section>

        {!detailsFilled && (
          <section className="sa-panel sa-details-panel">
            <div className="sa-step-label">
              STEP 01 · STUDENT INFORMATION
            </div>

            <div className="sa-panel-heading">
              <div>
                <h2>Let's get started.</h2>
                <p>
                  Enter your details to view the available assignments.
                </p>
              </div>

              <div className="sa-heading-icon">01</div>
            </div>

            <div className="sa-form">
              <label>
                Your name
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(event) =>
                    setStudentName(event.target.value)
                  }
                />
              </label>

              <label>
                University roll number
                <input
                  type="text"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(event) =>
                    setRollNumber(event.target.value)
                  }
                />
              </label>

              <button
                className="sa-primary-btn"
                onClick={() => {
                  if (!studentName.trim() || !rollNumber.trim()) {
                    alert("Please fill in both your name and roll number.");
                    return;
                  }

                  setDetailsFilled(true);
                }}
              >
                Continue to assignments <span>→</span>
              </button>
            </div>

            <p className="sa-privacy-note">
              Your details help identify your assignment attempts and
              performance.
            </p>
          </section>
        )}

        {detailsFilled && !selectedAssignment && (
          <section className="sa-assignment-section">
            <div className="sa-section-heading">
              <div>
                <div className="sa-step-label">
                  STEP 02 · YOUR ASSESSMENTS
                </div>

                <h2>Choose an assignment</h2>

                <p>
                  Welcome, {studentName}. Select an assignment to begin.
                </p>
              </div>

              <div className="sa-count">
                <strong>{assignments.length}</strong>
                <span>AVAILABLE</span>
              </div>
            </div>

            {loading ? (
              <div className="sa-state">
                <div className="sa-spinner"></div>
                <h3>Finding your assignments</h3>
                <p>
                  Please wait while we load your unit assignments.
                </p>
              </div>
            ) : error ? (
              <div className="sa-state sa-error">
                <div className="sa-state-icon">!</div>
                <h3>Unable to load assignments</h3>
                <p>{error}</p>

                <button
                  className="sa-secondary-btn"
                  onClick={handleRetry}
                >
                  Try again
                </button>
              </div>
            ) : assignments.length === 0 ? (
              <div className="sa-state">
                <div className="sa-state-icon">▤</div>
                <h3>No assignments available</h3>
                <p>
                  There are no {courseName} MCQ assignments available for
                  Unit {selectedUnit} right now. Please check again later.
                </p>
              </div>
            ) : (
              <div className="sa-assignment-grid">
                {assignments.map((assignment, index) => (
                  <button
                    key={assignment._id}
                    className="sa-assignment-card"
                    onClick={() => handleAssignmentClick(assignment)}
                  >
                    <div className="sa-card-top">
                      <span className="sa-card-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="sa-card-icon">✎</span>
                    </div>

                    <h3>{assignment.title}</h3>

                    <p>
                      {assignment.description ||
                        "Test your knowledge with this assignment."}
                    </p>

                    <div className="sa-card-bottom">
                      <span>OPEN ASSIGNMENT</span>
                      <span className="sa-card-arrow">↗</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              className="sa-text-btn"
              onClick={() => {
                setDetailsFilled(false);
                setAssignments([]);
                setError("");
                setSelectedAssignment(null);
                setResult(null);
                setAnswers({});
              }}
            >
              ← Change student details
            </button>
          </section>
        )}

        {selectedAssignment && !result && (
          <section className="sa-questions-section">
            <button
              className="sa-text-btn"
              onClick={handleBackToAssignments}
            >
              ← Back to assignments
            </button>

            <div className="sa-section-heading sa-question-heading">
              <div>
                <div className="sa-step-label">
                  STEP 03 · ANSWER THE QUESTIONS
                </div>

                <h2>{selectedAssignment.title}</h2>

                <p>
                  {selectedAssignment.description ||
                    "Read each question carefully and select your answer."}
                </p>
              </div>

              <div className="sa-count">
                <strong>
                  {Object.keys(answers).length}/
                  {selectedAssignment.questions.length}
                </strong>
                <span>ANSWERED</span>
              </div>
            </div>

            <div className="sa-progress-track">
              <div
                className="sa-progress-fill"
                style={{
                  width: `${
                    (Object.keys(answers).length /
                      selectedAssignment.questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="sa-question-list">
              {selectedAssignment.questions.map((question, index) => (
                <article
                  className="sa-question-card"
                  key={index}
                >
                  <div className="sa-question-number">
                    QUESTION {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3>{question.questionText}</h3>

                  <div className="sa-options">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`sa-option ${
                          answers[index] === option ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() =>
                            handleOptionSelect(index, option)
                          }
                        />

                        <span className="sa-option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <span className="sa-option-text">
                          {option}
                        </span>

                        <span className="sa-option-check">✓</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="sa-submit-area">
              <div>
                <strong>
                  {Object.keys(answers).length} of{" "}
                  {selectedAssignment.questions.length} answered
                </strong>

                <p>Review your selections before submitting.</p>
              </div>

              <button
                className="sa-primary-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit assignment"}
                {!submitting && <span>→</span>}
              </button>
            </div>
          </section>
        )}

        {result && (
          <section className="sa-result-panel">
            <div className="sa-step-label">
              STEP 04 · YOUR PERFORMANCE
            </div>

            <div className="sa-result-icon">✓</div>

            <h2>Assignment completed</h2>

            <p className="sa-result-subtitle">
              Your answers have been evaluated. Here's your performance
              summary.
            </p>

            <div className="sa-result-student">
              <div>
                <span>STUDENT</span>
                <strong>{studentName}</strong>
              </div>

              <div>
                <span>ROLL NUMBER</span>
                <strong>{rollNumber}</strong>
              </div>
            </div>

            <div className="sa-result-grid">
              <div className="sa-result-stat">
                <span className="sa-stat-icon">✓</span>
                <strong>{result.correct}</strong>
                <small>CORRECT ANSWERS</small>
              </div>

              <div className="sa-result-stat">
                <span className="sa-stat-icon">×</span>
                <strong>{result.wrong}</strong>
                <small>INCORRECT ANSWERS</small>
              </div>

              <div className="sa-result-stat sa-accuracy">
                <span className="sa-stat-icon">%</span>
                <strong>{result.accuracy}%</strong>
                <small>ACCURACY</small>
              </div>
            </div>

            <p className="sa-result-message">
              {Number(result.accuracy) >= 80
                ? "Excellent work! Keep building on your understanding."
                : Number(result.accuracy) >= 50
                ? "Good effort! Review the concepts and keep practising."
                : "Keep practising. Every attempt is a step towards improvement."}
            </p>

            <button
              className="sa-primary-btn"
              onClick={handleBackToAssignments}
            >
              Back to assignments <span>→</span>
            </button>
          </section>
        )}
      </main>

      <footer className="sa-footer">
        <span>FUSION · LEARN. PRACTICE. GROW.</span>
        <span>STUDENT ASSESSMENT PORTAL</span>
      </footer>
    </div>
  );
}
