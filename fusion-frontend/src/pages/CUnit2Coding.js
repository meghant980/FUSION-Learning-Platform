
import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/codingPractice.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const UNIT_NUMBER = "2";

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

const getStorageKey = (qId, lang) =>
  `fusion_code_unit2_${qId}_${lang}`;

const getInitialLanguage = () =>
  window.location.pathname.startsWith("/learn-cpp/")
    ? "cpp"
    : "c";

const getAuthToken = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("fusionUser") || "{}"
    );

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      user.token ||
      user.accessToken ||
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

export default function CUnit2Coding() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchQuestions = async () => {
      setLoading(true);
      setFetchError("");
      setQuestions([]);
      setSelected(null);
      setCode("");
      setResult(null);
      setCanSubmit(false);

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

        console.error("UNIT 2 CODING FETCH ERROR:", error);

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
  }, [selected, language]);

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;

    if (newLanguage === language) return;

    setLanguage(newLanguage);
    setSelected(null);
    setCode("");
    setResult(null);
    setCanSubmit(false);
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
  };

  const openQuestion = (question) => {
    setSelected(question);
    setResult(null);
    setCanSubmit(false);
  };

  const backToQuestions = () => {
    setSelected(null);
    setResult(null);
    setCanSubmit(false);
  };

  const runCode = async () => {
    if (!selected || isRunning || !code.trim()) {
      if (!code.trim()) alert("Please write your code first.");
      return;
    }

    try {
      setIsRunning(true);
      setCanSubmit(false);
      setResult(null);

      const token = getAuthToken();

      if (!token) {
        alert("Please log in again.");
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

      setResult(response.data);

      if (
        response.data.success &&
        response.data.totalTestcases > 0 &&
        response.data.testcasesPassed ===
          response.data.totalTestcases
      ) {
        setCanSubmit(true);
      }
    } catch (error) {
      console.error("UNIT 2 RUN ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to run code."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected || !result || !canSubmit || isSubmitting) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      alert("Please log in again before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

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

      if (response.data.success) {
        alert("Accepted!");

        if (response.data.submissionId) {
          window.location.href =
            `/submission/${response.data.submissionId}`;
        }
      } else {
        alert(
          response.data.message || "Submit failed."
        );
      }
    } catch (error) {
      console.error("UNIT 2 SUBMIT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Submit failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetTemplate = () => {
    const defaultCode = templates[language] || "";

    setCode(defaultCode);
    setResult(null);
    setCanSubmit(false);

    if (selected) {
      localStorage.setItem(
        getStorageKey(selected._id, language),
        defaultCode
      );
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Code copied!");
    } catch {
      alert("Unable to copy code.");
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], {
      type: "text/plain"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      language === "c" ? "unit2-solution.c" : "unit2-solution.cpp";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="cp-page">

      {/* HEADER */}
      <header className="cp-header">
        <div className="cp-brand">
          <div className="cp-brand-logo">F</div>

          <div>
            <strong>FUSION</strong>
            <span>CODING PRACTICE</span>
          </div>
        </div>

        <button
          type="button"
          className="cp-dashboard-btn"
          onClick={() => window.history.back()}
        >
          ← Dashboard
        </button>
      </header>

      {!selected ? (
        <main className="cp-main">

          {/* HERO */}
          <section className="cp-hero">
            <span>LEARN BY DOING</span>

            <h1>Coding Practice</h1>

            <p>
              Explore Unit 2 coding problems, write your own
              solutions and test your programming skills.
            </p>
          </section>

          {/* QUESTION SECTION */}
          <section className="cp-question-section">
            <div className="cp-section-heading">
              <div>
                <span>UNIT 02 · YOUR CHALLENGES</span>
                <h2>Choose a Coding Question</h2>
              </div>

              <span className="cp-question-count">
                {questions.length} Questions
              </span>
            </div>

            <div className="cp-editor-language">
              <label htmlFor="unit2-language">
                Programming Language
              </label>

              <select
                id="unit2-language"
                value={language}
                onChange={changeLanguage}
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            {loading && (
              <div className="cp-state">
                <div className="cp-loader" />
                <h3>Loading questions</h3>
                <p>Please wait while we fetch Unit 2 questions.</p>
              </div>
            )}

            {!loading && fetchError && (
              <div className="cp-error">
                {fetchError}
              </div>
            )}

            {!loading && !fetchError && questions.length === 0 && (
              <div className="cp-state">
                <div className="cp-empty-icon">▤</div>
                <h3>No questions available yet</h3>
                <p>
                  No {language.toUpperCase()} coding questions
                  are available for Unit 2 yet.
                </p>
              </div>
            )}

            {!loading && !fetchError && questions.length > 0 && (
              <div className="cp-question-grid">
                {questions.map((question, index) => (
                  <article
                    key={question._id}
                    className="cp-question-card"
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
                      {(question.description || "").substring(0, 180)}
                      {(question.description || "").length > 180
                        ? "..."
                        : ""}
                    </p>

                    <div className="cp-question-footer">
                      <span>UNIT 02</span>

                      <button
                        type="button"
                        className="cp-start-button"
                        onClick={() => openQuestion(question)}
                      >
                        Start Coding →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        /* CODING WORKSPACE */
        <main className="cp-workspace">

          <div className="cp-workspace-heading">
            <button
              type="button"
              className="cp-back-link"
              onClick={backToQuestions}
            >
              ← Back to Questions
            </button>

            <div>
              <span>UNIT 02 · CODING WORKSPACE</span>
              <h1>Coding Practice</h1>
            </div>
          </div>

          <div className="cp-workspace-grid">

            {/* LEFT: QUESTION */}
            <aside className="cp-problem-panel">
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
                <h3>Test Cases</h3>
              </div>

              {selected.testcases?.length > 0 ? (
                selected.testcases.map((testcase, index) => (
                  <div className="cp-sample-box" key={index}>
                    <strong>Test Case {index + 1}</strong>

                    <div>
                      <span>Input</span>
                      <pre>{testcase.input || "No input"}</pre>
                    </div>

                    <div>
                      <span>Expected Output</span>
                      <pre>
                        {testcase.expected ??
                          testcase.expectedOutput ??
                          ""}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <p className="cp-no-tests">
                  No sample test cases provided.
                </p>
              )}
            </aside>

            {/* RIGHT: EDITOR */}
            <section className="cp-editor-panel">
              <div className="cp-editor-toolbar">
                <div className="cp-editor-language">
                  <span className="cp-live-dot" />

                  <label htmlFor="unit2-workspace-language">
                    Language
                  </label>

                  <select
                    id="unit2-workspace-language"
                    value={language}
                    onChange={changeLanguage}
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div className="cp-editor-actions">
                  <button type="button" onClick={resetTemplate}>
                    Reset
                  </button>

                  <button type="button" onClick={copyCode}>
                    Copy
                  </button>

                  <button type="button" onClick={downloadCode}>
                    Download
                  </button>
                </div>
              </div>

              <div className="cp-monaco-container">
                <Editor
                  height="420px"
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    padding: { top: 16 }
                  }}
                />
              </div>

              <div className="cp-run-toolbar">
                <span className="cp-run-hint">
                  Run your solution against the test cases.
                </span>

                <div className="cp-run-actions">
                  <button
                    type="button"
                    className="cp-run-btn"
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                  >
                    {isRunning ? "Running..." : "▶ Run Code"}
                  </button>

                  <button
                    type="button"
                    className={`cp-submit-btn ${canSubmit ? "active" : ""}`}
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting || isRunning}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* RESULTS */}
              {result && (
                <div className="cp-results">
                  <div className="cp-results-heading">
                    <div>
                      <span>EXECUTION SUMMARY</span>
                      <h3>Execution Results</h3>
                    </div>

                    <span
                      className={`cp-result-status ${
                        canSubmit ? "passed" : "failed"
                      }`}
                    >
                      {canSubmit ? "All Tests Passed" : "Review Results"}
                    </span>
                  </div>

                  <div className="cp-result-summary">
                    <div>
                      <strong>
                        {result.testcasesPassed || 0}/
                        {result.totalTestcases || 0}
                      </strong>
                      <span>Test Cases Passed</span>
                    </div>

                    {result.totalMarks !== undefined && (
                      <div>
                        <strong>
                          {result.totalMarks}/{result.maxMarks}
                        </strong>
                        <span>Evaluation Score</span>
                      </div>
                    )}
                  </div>

                  {result.results?.map((item, index) => (
                    <div className="cp-test-result" key={index}>
                      <div className="cp-test-result-heading">
                        <strong>Test Case {index + 1}</strong>

                        <span
                          className={
                            String(item.status || "").toLowerCase() === "passed"
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
                          <pre>{item.input}</pre>
                        </div>

                        <div>
                          <span>Expected</span>
                          <pre>{item.expected}</pre>
                        </div>

                        <div>
                          <span>Your Output</span>
                          <pre>{item.got}</pre>
                        </div>
                      </div>
                    </div>
                  ))}

                  {result.stepResults?.length > 0 && (
                    <div className="cp-evaluation">
                      <h4>Step-by-Step Evaluation</h4>

                      {result.stepResults.map((step, index) => (
                        <div className="cp-step-row" key={index}>
                          <span>{step.label}</span>

                          <strong>
                            {step.marksAwarded}/{step.marksTotal}
                            {" · "}
                            {step.passed ? "Passed" : "Failed"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
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
