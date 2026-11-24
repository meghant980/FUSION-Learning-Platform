
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/submission-result.css";

const API = "http://localhost:5001";

const getToken = () => {
  let fusionUser = {};

  try {
    fusionUser = JSON.parse(localStorage.getItem("fusionUser") || "{}");
  } catch {
    fusionUser = {};
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken") ||
    fusionUser.token ||
    fusionUser.accessToken ||
    ""
  );
};

export default function SubmissionResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchSubmission = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Please log in again to view this submission.");
        }

        const response = await axios.get(
          `${API}/api/coding/submission/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!active) return;

        setData(response.data.submission || response.data);
      } catch (err) {
        console.error("Submission fetch error:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load submission."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    } else {
      setError("Submission ID is missing.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="submission-page">
        <div className="submission-loading">
          <div className="submission-loader" />
          <h2>Loading submission...</h2>
          <p>Please wait while we retrieve your result.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="submission-page">
        <section className="submission-error-card">
          <span className="submission-eyebrow">FUSION · SUBMISSIONS</span>
          <h1>Unable to load submission</h1>
          <p>{error}</p>

          <button
            className="submission-primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="submission-page">
        <section className="submission-error-card">
          <h1>Submission not found</h1>
          <button
            className="submission-primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </section>
      </main>
    );
  }

  const stepResults = data.stepResults || [];
  const accepted = data.status === "Accepted";
  const marksAssigned = Number(data.maxMarks) > 0;

  const scoreDisplay = marksAssigned
    ? `${data.totalMarks ?? 0} / ${data.maxMarks}`
    : "Not assigned";

  return (
    <main className="submission-page">
      <header className="submission-header">
        <button
          className="submission-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="submission-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <button
          className="submission-dashboard-link"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <div className="submission-container">
        <section className="submission-title-row">
          <div>
            <span className="submission-eyebrow">
              CODING PRACTICE · SUBMISSION RESULT
            </span>
            <h1>Your submission</h1>
            <p>Review your solution, execution details and evaluation.</p>
          </div>

          <span
            className={
              accepted
                ? "submission-status accepted"
                : "submission-status rejected"
            }
          >
            <span className="submission-status-dot" />
            {data.status || "Submitted"}
          </span>
        </section>

        <div className="submission-action-row">
          <button
            className="submission-history-button"
            onClick={() => navigate("/submissions")}
          >
            View All Submissions →
          </button>
        </div>

        <nav className="submission-tabs">
          <button
            className={activeTab === "details" ? "active" : ""}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>

          <button
            className={activeTab === "code" ? "active" : ""}
            onClick={() => setActiveTab("code")}
          >
            Submitted Code
          </button>

          <button
            className={activeTab === "output" ? "active" : ""}
            onClick={() => setActiveTab("output")}
          >
            Output
          </button>
        </nav>

        {activeTab === "details" && (
          <div className="submission-content">
            <section className="submission-stats">
              <article className="submission-stat-card">
                <span>PROGRAMMING LANGUAGE</span>
                <h2>{data.language?.toUpperCase() || "-"}</h2>
                <p>Selected language</p>
              </article>

              <article className="submission-stat-card">
                <span>TEST CASES PASSED</span>
                <h2>
                  {data.passed ?? 0}
                  <small> / {data.total ?? 0}</small>
                </h2>
                <p>Execution result</p>
              </article>

              <article className="submission-stat-card">
                <span>TOTAL SCORE</span>
                <h2>{scoreDisplay}</h2>
                <p>
                  {marksAssigned ? "Evaluation marks" : "No marks assigned"}
                </p>
              </article>
            </section>

            {stepResults.length > 0 && (
              <section className="submission-panel">
                <div className="submission-panel-heading">
                  <div>
                    <span className="submission-eyebrow">
                      MARKING BREAKDOWN
                    </span>
                    <h2>Step Evaluation</h2>
                  </div>
                </div>

                <div className="submission-steps">
                  {stepResults.map((step, index) => {
                    const stepMaximum =
                      step.marksTotal ?? step.maxMarks ?? 0;

                    return (
                      <article className="submission-step" key={index}>
                        <div className="submission-step-info">
                          <span className="submission-step-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3>
                              {step.label || `Evaluation step ${index + 1}`}
                            </h3>
                            <p>
                              {step.passed
                                ? "Requirement satisfied"
                                : "Requirement not satisfied"}
                            </p>
                          </div>
                        </div>

                        <div className="submission-step-result">
                          <span
                            className={
                              step.passed
                                ? "submission-step-badge pass"
                                : "submission-step-badge fail"
                            }
                          >
                            {step.passed ? "Passed" : "Failed"}
                          </span>

                          <strong>
                            {Number(stepMaximum) > 0
                              ? `${step.marksAwarded ?? 0}/${stepMaximum}`
                              : "Not assigned"}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            <section
              className={
                accepted
                  ? "submission-summary success"
                  : "submission-summary failure"
              }
            >
              <div>
                <span className="submission-eyebrow">FINAL RESULT</span>
                <h2>
                  {accepted
                    ? "Your solution was accepted!"
                    : "Your solution needs improvement"}
                </h2>
                <p>
                  {data.passed ?? 0} out of {data.total ?? 0} test cases passed.
                </p>
              </div>

              <div className="submission-summary-score">
                {scoreDisplay}
                {marksAssigned && <span> marks</span>}
              </div>
            </section>
          </div>
        )}

        {activeTab === "code" && (
          <section className="submission-panel submission-code-panel">
            <div className="submission-panel-heading">
              <div>
                <span className="submission-eyebrow">YOUR SOLUTION</span>
                <h2>Submitted Code</h2>
              </div>
              <span className="submission-language-chip">
                {data.language?.toUpperCase() || "CODE"}
              </span>
            </div>

            <pre className="submission-code-box">
              <code>{data.code || "No code available."}</code>
            </pre>
          </section>
        )}

        {activeTab === "output" && (
          <section className="submission-panel">
            <div className="submission-panel-heading">
              <div>
                <span className="submission-eyebrow">EXECUTION SUMMARY</span>
                <h2>Output Details</h2>
              </div>
              <span
                className={
                  accepted
                    ? "submission-step-badge pass"
                    : "submission-step-badge fail"
                }
              >
                {data.status || "Submitted"}
              </span>
            </div>

            <div className="submission-output-list">
              <div>
                <span>Language</span>
                <strong>{data.language?.toUpperCase() || "-"}</strong>
              </div>

              <div>
                <span>Test cases passed</span>
                <strong>
                  {data.passed ?? 0} / {data.total ?? 0}
                </strong>
              </div>

              <div>
                <span>Submitted at</span>
                <strong>
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleString()
                    : "-"}
                </strong>
              </div>

              <div>
                <span>Total score</span>
                <strong>{scoreDisplay}</strong>
              </div>
            </div>

            <div className="submission-output-message">
              {accepted
                ? "All test cases passed successfully."
                : `${data.passed ?? 0} out of ${data.total ?? 0} test cases passed.`}
            </div>
          </section>
        )}

        <footer className="submission-footer">
          <span>FUSION <i>•</i> CODE PRACTICE</span>
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard →
          </button>
        </footer>
      </div>
    </main>
  );
}
