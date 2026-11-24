
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/codingPractice.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const UNIT_NUMBER = "1";

const templates = {
  c: `#include <stdio.h>

int main() {
    // Write your C code here
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ code here
    return 0;
}`,
  python: `# Write your Python code here

def main():
    pass

if __name__ == "__main__":
    main()
`
};

const getInitialLanguage = () => {
  const path = window.location.pathname;

  if (path.startsWith("/learn-cpp/")) return "cpp";
  if (path.startsWith("/learn-python/")) return "python";

  return "c";
};

const getStorageKey = (questionId, language) =>
  `fusion_code_unit1_${questionId}_${language}`;

const getAuthToken = () => {
  try {
    const fusionUser = JSON.parse(
      localStorage.getItem("fusionUser") || "{}"
    );

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      fusionUser.token ||
      fusionUser.accessToken ||
      ""
    );
  } catch {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      ""
    );
  }
};

export default function CUnit1Coding() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");

  const [canSubmit, setCanSubmit] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchQuestions = async () => {
      setLoading(true);
      setFetchError("");
      setQuestions([]);

      try {
        const response = await axios.get(
          `${API_URL}/api/coding/practice`,
          {
            params: {
              language,
              unit: UNIT_NUMBER
            }
          }
        );

        if (!active) return;

        const data = response.data;

        const receivedQuestions = Array.isArray(data)
          ? data
          : Array.isArray(data?.questions)
            ? data.questions
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setQuestions(receivedQuestions);
      } catch (error) {
        if (!active) return;

        console.error("UNIT 1 CODING FETCH ERROR:", error);

        setFetchError(
          error.response?.data?.message ||
            "Unable to load coding questions. Please check your backend."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      active = false;
    };
  }, [language]);

  useEffect(() => {
    if (!selected) {
      setCode("");
      return;
    }

    const saved = localStorage.getItem(
      getStorageKey(selected._id, language)
    );

    setCode(
      saved !== null
        ? saved
        : templates[language] || ""
    );

    setResult(null);
    setCanSubmit(false);
    setActionError("");
  }, [selected, language]);

  const selectQuestion = (question) => {
    setSelected(question);
    setResult(null);
    setCanSubmit(false);
    setActionError("");
  };

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;

    if (newLanguage === language) return;

    setLanguage(newLanguage);
    setSelected(null);
    setCode("");
    setResult(null);
    setCanSubmit(false);
    setActionError("");
  };

  const handleCodeChange = (value) => {
    const updatedCode = value || "";

    setCode(updatedCode);

    if (selected) {
      localStorage.setItem(
        getStorageKey(selected._id, language),
        updatedCode
      );
    }

    setResult(null);
    setCanSubmit(false);
  };

  const runCode = async () => {
    if (!selected || isRunning) {
      setActionError("Please select a question first.");
      return;
    }

    if (!code.trim()) {
      setActionError("Please write your code first.");
      return;
    }

    try {
      setIsRunning(true);
      setCanSubmit(false);
      setResult(null);
      setActionError("");

      const token = getAuthToken();

      if (!token) {
        setActionError("Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/coding/run`,
        {
          code,
          language,
          questionId: selected._id,
          unit: UNIT_NUMBER
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response?.data) {
        setActionError("No response received from the server.");
        return;
      }

      const data = response.data;

      setResult(data);

      const total = Number(data.totalTestcases || 0);
      const passed = Number(data.testcasesPassed || 0);

      const allPassed =
        data.success === true &&
        total > 0 &&
        passed === total;

      setCanSubmit(allPassed);
    } catch (error) {
      console.error("UNIT 1 RUN ERROR:", error);

      setActionError(
        error.response?.data?.message ||
          "Code execution failed. Please check your code and try again."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) {
      setActionError("Please select a question first.");
      return;
    }

    if (!result) {
      setActionError("Run your code at least once before submitting.");
      return;
    }

    if (!canSubmit) {
      setActionError("You can submit only when all testcases pass.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setActionError("Please log in again before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError("");

      const response = await axios.post(
        `${API_URL}/api/coding/submit`,
        {
          code,
          language,
          questionId: selected._id,
          unit: UNIT_NUMBER
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        if (response.data.submissionId) {
          navigate(`/submission/${response.data.submissionId}`);
        } else {
          setActionError(
            "Your solution was accepted, but no submission ID was returned."
          );
        }
      } else {
        setActionError(
          response.data?.message || "Submission failed on the server."
        );
      }
    } catch (error) {
      console.error("UNIT 1 SUBMIT ERROR:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to submit your solution. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setActionError("");
      alert("Code copied successfully!");
    } catch {
      setActionError("Unable to copy code.");
    }
  };

  const downloadCode = () => {
    const extensions = {
      c: "c",
      cpp: "cpp",
      python: "py"
    };

    const blob = new Blob([code], {
      type: "text/plain"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `solution.${extensions[language] || "txt"}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  const resetTemplate = () => {
    if (!window.confirm("Reset your code to the starter template?")) {
      return;
    }

    const template = templates[language] || "";

    setCode(template);
    setResult(null);
    setCanSubmit(false);
    setActionError("");

    if (selected) {
      localStorage.setItem(
        getStorageKey(selected._id, language),
        template
      );
    }
  };

  const backToQuestions = () => {
    setSelected(null);
    setResult(null);
    setCanSubmit(false);
    setActionError("");
  };

  const passedCount = Number(result?.testcasesPassed || 0);
  const totalCount = Number(result?.totalTestcases || 0);

  return (
    <div className="cp-page">
      <header className="cp-header">
        <div className="cp-brand">
          <div className="cp-brand-logo">F</div>

          <div>
            <strong>FUSION</strong>
            <span>CODING PRACTICE</span>
          </div>
        </div>

        <button
          className="cp-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      {!selected ? (
        <main className="cp-main">
          <section className="cp-hero">
            <span>LEARN BY DOING</span>

            <h1>Coding Practice</h1>

            <p>
              Explore Unit 1 coding problems, write your own solutions
              and test your programming skills.
            </p>
          </section>

          <section className="cp-question-section">
            <div className="cp-section-heading">
              <div>
                <span>UNIT 01 · YOUR CHALLENGES</span>
                <h2>Choose a Coding Question</h2>
              </div>

              <div className="cp-question-count">
                {questions.length} Questions
              </div>
            </div>

            <div className="cp-editor-language">
              <label htmlFor="unit1-language">
                Programming Language
              </label>

              <select
                id="unit1-language"
                value={language}
                onChange={changeLanguage}
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
            </div>

            {loading && (
              <div className="cp-state">
                <div className="cp-loader" />
                <p>Loading Unit 1 coding questions...</p>
              </div>
            )}

            {!loading && fetchError && (
              <div className="cp-error">{fetchError}</div>
            )}

            {!loading &&
              !fetchError &&
              questions.length === 0 && (
                <div className="cp-state">
                  <div className="cp-empty-icon">⌨</div>
                  <h3>No questions available yet</h3>
                  <p>
                    No {language.toUpperCase()} coding questions
                    are available for Unit 1 yet.
                  </p>
                </div>
              )}

            {!loading && questions.length > 0 && (
              <div className="cp-question-grid">
                {questions.map((question, index) => (
                  <article
                    className="cp-question-card"
                    key={question._id}
                  >
                    <div className="cp-question-card-top">
                      <span className="cp-question-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="cp-question-language">
                        {language.toUpperCase()}
                      </span>
                    </div>

                    <h3>
                      {question.title || "Untitled Question"}
                    </h3>

                    <p>
                      {question.description
                        ? question.description.length > 115
                          ? `${question.description.substring(0, 115)}...`
                          : question.description
                        : "Open this question to view its details."}
                    </p>

                    <div className="cp-question-footer">
                      <span>Practice this problem</span>

                      <button
                        type="button"
                        className="cp-start-button"
                        onClick={() => selectQuestion(question)}
                      >
                        Start Coding <span>→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        <main className="cp-workspace">
          <div className="cp-workspace-heading">
            <button
              className="cp-back-link"
              onClick={backToQuestions}
            >
              ← All Questions
            </button>

            <div>
              <span>UNIT 01 · CODING WORKSPACE</span>
              <h1>{selected.title}</h1>
            </div>
          </div>

          {actionError && (
            <div className="cp-error cp-workspace-error">
              {actionError}
              <button onClick={() => setActionError("")}>×</button>
            </div>
          )}

          <div className="cp-workspace-grid">
            <section className="cp-problem-panel">
              <div className="cp-panel-heading">
                <span>01</span>
                <h2>Problem Description</h2>
              </div>

              <h3>{selected.title}</h3>

              <p className="cp-description">
                {selected.description}
              </p>

              <div className="cp-testcase-heading">
                <span>02</span>
                <h3>Sample Testcases</h3>
              </div>

              {selected.testcases?.length > 0 ? (
                selected.testcases.map((testcase, index) => (
                  <div className="cp-sample-box" key={index}>
                    <strong>Testcase {index + 1}</strong>

                    <div>
                      <span>Input</span>
                      <pre>{testcase.input || "No input"}</pre>
                    </div>

                    <div>
                      <span>Expected Output</span>
                      <pre>
                        {testcase.expected ??
                          testcase.expectedOutput ??
                          "No expected output"}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <p className="cp-no-tests">
                  No sample testcases provided.
                </p>
              )}
            </section>

            <section className="cp-editor-panel">
              <div className="cp-editor-toolbar">
                <div className="cp-editor-language">
                  <span className="cp-live-dot" />

                  <select
                    value={language}
                    onChange={changeLanguage}
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                  </select>
                </div>

                <div className="cp-editor-actions">
                  <button onClick={resetTemplate}>↺ Reset</button>
                  <button onClick={copyCode}>Copy</button>
                  <button onClick={downloadCode}>↓ Download</button>
                </div>
              </div>

              <div className="cp-monaco-container">
                <Editor
                  height="440px"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    tabSize: 4,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              </div>

              <div className="cp-run-toolbar">
                <span className="cp-run-hint">
                  Run your solution to check the testcases.
                </span>

                <div className="cp-run-actions">
                  <button
                    className="cp-run-btn"
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                  >
                    {isRunning ? "Running..." : "▶ Run Code"}
                  </button>

                  <button
                    className={`cp-submit-btn ${canSubmit ? "active" : ""}`}
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting || isRunning}
                  >
                    {isSubmitting ? "Submitting..." : "✓ Submit"}
                  </button>
                </div>
              </div>

              {result && (
                <div className="cp-results">
                  <div className="cp-results-heading">
                    <div>
                      <span>EXECUTION REPORT</span>
                      <h3>Testcase Results</h3>
                    </div>

                    <span
                      className={`cp-result-status ${
                        canSubmit ? "passed" : "failed"
                      }`}
                    >
                      {canSubmit ? "All Passed" : "Needs Improvement"}
                    </span>
                  </div>

                  <div className="cp-result-summary">
                    <div>
                      <strong>
                        {passedCount}/{totalCount}
                      </strong>
                      <span>Testcases Passed</span>
                    </div>

                    {result.totalMarks !== undefined && (
                      <div>
                        <strong>{result.totalMarks}</strong>
                        <span>Total Score</span>
                      </div>
                    )}
                  </div>

                  {result.stepResults?.length > 0 && (
                    <div className="cp-evaluation">
                      <h4>Step-by-Step Evaluation</h4>

                      {result.stepResults.map((step, index) => (
                        <div className="cp-step-row" key={index}>
                          <span>
                            {step.passed ? "✓" : "✕"} {step.label}
                          </span>

                          <strong>
                            {step.marksAwarded}/{step.marksTotal}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.results?.map((item, index) => (
                    <div className="cp-test-result" key={index}>
                      <div className="cp-test-result-heading">
                        <strong>Testcase {index + 1}</strong>

                        <span
                          className={
                            String(item.status).toLowerCase().includes("pass")
                              ? "passed"
                              : "failed"
                          }
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="cp-output-grid">
                        <div>
                          <span>Input</span>
                          <pre>{item.input || "—"}</pre>
                        </div>

                        <div>
                          <span>Expected</span>
                          <pre>{item.expected || "—"}</pre>
                        </div>

                        <div>
                          <span>Your Output</span>
                          <pre>{item.got || "—"}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      )}

      <footer className="cp-footer">
        <strong>FUSION</strong>
        <span>Faculty Student Interactive Online Network</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
