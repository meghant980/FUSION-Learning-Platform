
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/codingPractice.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const UNIT_NUMBER = "4";

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
}`
};

const getStorageKey = (questionId, lang) =>
  `fusion_code_unit4_${questionId}_${lang}`;

const getAuthToken = () => {
  let fusionUser = {};

  try {
    fusionUser = JSON.parse(
      localStorage.getItem("fusionUser") || "{}"
    );
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

export default function CUnit4Coding() {
  const navigate = useNavigate();
  const location = useLocation();

  const courseLanguage = location.pathname.includes("/learn-cpp/")
    ? "cpp"
    : "c";

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState(courseLanguage);
  const [code, setCode] = useState(templates[courseLanguage]);
  const [result, setResult] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelected(null);
    setLanguage(courseLanguage);
    setResult(null);
    setCanSubmit(false);
    setCode(templates[courseLanguage] || templates.c);
    setError("");
  }, [courseLanguage]);

  useEffect(() => {
    let active = true;

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(
          `${API}/api/coding/practice`,
          {
            params: {
              language,
              unit: UNIT_NUMBER
            }
          }
        );

        if (active) {
          const fetchedQuestions = Array.isArray(response.data)
            ? response.data
            : response.data?.questions ||
              response.data?.data ||
              [];

          setQuestions(fetchedQuestions);
        }
      } catch (err) {
        console.error("Unit 4 coding questions error:", err);

        if (active) {
          setQuestions([]);
          setError(
            err.response?.data?.message ||
              err.response?.data?.msg ||
              "Unable to load coding questions. Please check that the backend is running."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      active = false;
    };
  }, [language]);

  useEffect(() => {
    if (!selected) return;

    const saved = localStorage.getItem(
      getStorageKey(selected._id, language)
    );

    setCode(saved ?? templates[language] ?? templates.c);
    setResult(null);
    setCanSubmit(false);
    setError("");
  }, [selected, language]);

  const selectQuestion = (question) => {
    setSelected(question);
    setLanguage(question.language || language);
    setResult(null);
    setCanSubmit(false);
    setError("");
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;

    setSelected(null);
    setResult(null);
    setCanSubmit(false);
    setError("");
    setLanguage(newLanguage);
    setCode(templates[newLanguage] || templates.c);
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

    setCanSubmit(false);
    setResult(null);
  };

  const runCode = async () => {
    if (!selected) {
      setError("Please select a question first.");
      return;
    }

    if (!code.trim()) {
      setError("Please write your code first.");
      return;
    }

    try {
      setIsRunning(true);
      setCanSubmit(false);
      setResult(null);
      setError("");

      const token = getAuthToken();

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API}/api/coding/run`,
        {
          code,
          language,
          unit: UNIT_NUMBER,
          questionId: selected._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data || {};

      setResult(data);

      const passed = Number(
        data.testcasesPassed ??
          data.passed ??
          data.passedTestcases ??
          0
      );

      const total = Number(
        data.totalTestcases ??
          data.total ??
          data.totalTests ??
          0
      );

      const allPassed =
        data.success !== false &&
        total > 0 &&
        passed === total;

      setCanSubmit(allPassed);

      if (total === 0) {
        setError("No testcases were found for this question.");
      }
    } catch (err) {
      console.error("Unit 4 run code error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Code execution failed. Please check your code and try again."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected || !result || !canSubmit) {
      setError("Run your code and pass all testcases before submitting.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setError("Your login session was not found. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await axios.post(
        `${API}/api/coding/submit`,
        {
          code,
          language,
          unit: UNIT_NUMBER,
          questionId: selected._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success && response.data?.submissionId) {
        navigate(`/submission/${response.data.submissionId}`);
      } else {
        setError(
          response.data?.message ||
            response.data?.msg ||
            "Submission failed. Please try again."
        );
      }
    } catch (err) {
      console.error("Unit 4 submit error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to submit your solution. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setError("");
      alert("Code copied successfully!");
    } catch {
      setError("Unable to copy code.");
    }
  };

  const downloadCode = () => {
    const extensions = {
      c: "c",
      cpp: "cpp"
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `unit4-solution.${extensions[language] || "txt"}`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(url);
  };

  const resetTemplate = () => {
    if (!window.confirm("Reset your code to the starter template?")) {
      return;
    }

    const template = templates[language] || templates.c;

    setCode(template);
    setResult(null);
    setCanSubmit(false);
    setError("");

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
    setError("");
  };

  const passedCount = result
    ? Number(
        result.testcasesPassed ??
          result.passed ??
          result.passedTestcases ??
          0
      )
    : 0;

  const totalCount = result
    ? Number(
        result.totalTestcases ??
          result.total ??
          result.totalTests ??
          0
      )
    : 0;

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
            <span>LEARN BY DOING · UNIT 04</span>

            <h1>
              {language === "cpp" ? "C++" : "C"} Coding Practice
            </h1>

            <p>
              Choose a problem, write your solution and test your code.
              Improve your programming skills one question at a time.
            </p>
          </section>

          <section className="cp-question-section">
            <div className="cp-section-heading">
              <div>
                <span>YOUR CHALLENGES · UNIT 04</span>
                <h2>Choose a Coding Question</h2>
              </div>

              <div className="cp-question-count">
                {questions.length} Questions
              </div>
            </div>

            <div className="cp-editor-language">
              <label htmlFor="unit4-language">
                Programming Language
              </label>

              <select
                id="unit4-language"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            {isLoading && (
              <div className="cp-state">
                <div className="cp-loader" />
                <p>Loading Unit 4 coding questions...</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="cp-error">{error}</div>
            )}

            {!isLoading && !error && questions.length === 0 && (
              <div className="cp-state">
                <div className="cp-empty-icon">⌨</div>
                <h3>No questions available yet</h3>
                <p>
                  New Unit 4 coding questions will appear here when added by your teacher.
                </p>
              </div>
            )}

            {!isLoading && questions.length > 0 && (
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
                        {(question.language || language).toUpperCase()}
                      </span>
                    </div>

                    <h3>{question.title}</h3>

                    <p>
                      {question.description?.length > 115
                        ? `${question.description.substring(0, 115)}...`
                        : question.description ||
                          "Open this question to view its details."}
                    </p>

                    <div className="cp-question-footer">
                      <span>Unit 4 · Practice this problem</span>

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
              <span>UNIT 04 · CODING WORKSPACE</span>
              <h1>{selected.title}</h1>
            </div>
          </div>

          {error && (
            <div className="cp-error cp-workspace-error">
              {error}
              <button onClick={() => setError("")}>×</button>
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
                    onChange={handleLanguageChange}
                    aria-label="Programming language"
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
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
                  language={language === "cpp" ? "cpp" : "c"}
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
                      <h4>Step Evaluation</h4>

                      {result.stepResults.map((step, index) => (
                        <div className="cp-step-row" key={index}>
                          <span>
                            {step.passed ? "✓" : "✕"} {step.label}
                          </span>

                          <strong>
                            {step.marksAwarded}/
                            {step.marksTotal ?? step.maxMarks ?? 0}
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
