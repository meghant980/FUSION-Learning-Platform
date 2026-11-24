
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

import "../styles/JavaModule.css";
import "../styles/additionalCodePractice.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const JAVASCRIPT_STARTER_CODE = `// Write your JavaScript code here

console.log("Hello, JavaScript!");`;

function getUserData() {
  try {
    return JSON.parse(localStorage.getItem("fusionUser") || "{}");
  } catch {
    return {};
  }
}

function getToken() {
  const user = getUserData();

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken") ||
    user.token ||
    user.accessToken ||
    ""
  );
}

function getQuestionTitle(question) {
  return (
    question?.title ||
    question?.questionTitle ||
    question?.name ||
    "Untitled question"
  );
}

function getQuestionDescription(question) {
  return (
    question?.description ||
    question?.question ||
    question?.problemStatement ||
    "No description provided."
  );
}

function getSampleTestcases(question) {
  const cases = question?.testcases || question?.testCases || [];
  return Array.isArray(cases) ? cases : [];
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function JavaScriptUnitCoding() {
  const navigate = useNavigate();
  const { unit } = useParams();

  const unitNumber = String(unit || "1");
  const validUnit = ["1", "2", "3", "4"].includes(unitNumber);

  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editorCode, setEditorCode] = useState(JAVASCRIPT_STARTER_CODE);
  const [runResult, setRunResult] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [running, setRunning] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [practiceError, setPracticeError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Fetch JavaScript coding questions for the selected unit.
  useEffect(() => {
    let cancelled = false;

    async function fetchPracticeQuestions() {
      setLoadingQuestions(true);
      setPracticeError("");
      setPracticeQuestions([]);
      setSelectedQuestion(null);

      try {
        if (!validUnit) {
          throw new Error("Invalid JavaScript unit selected.");
        }

        const token = getToken();

        const response = await axios.get(
          `${API_URL}/api/coding/practice`,
          {
            params: {
              language: "javascript",
              unit: unitNumber,
            },
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (cancelled) return;

        const fetchedQuestions = response.data?.questions || [];

        setPracticeQuestions(fetchedQuestions);

        if (fetchedQuestions.length > 0) {
          setSelectedQuestion(fetchedQuestions[0]);
        }
      } catch (error) {
        if (!cancelled) {
          setPracticeError(
            getErrorMessage(
              error,
              "Unable to load JavaScript coding questions. Please try again."
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    }

    fetchPracticeQuestions();

    return () => {
      cancelled = true;
    };
  }, [unitNumber, validUnit, retryCount]);

  // Restore saved code whenever the selected question changes.
  useEffect(() => {
    if (!selectedQuestion?._id) return;

    const storageKey =
      `fusion_code_javascript_unit${unitNumber}_${selectedQuestion._id}`;

    const savedCode = localStorage.getItem(storageKey);

    setEditorCode(savedCode || JAVASCRIPT_STARTER_CODE);
    setRunResult(null);
    setPracticeError("");
  }, [selectedQuestion?._id, unitNumber]);

  function handleEditorChange(value) {
    const code = value ?? "";

    setEditorCode(code);

    if (selectedQuestion?._id) {
      const storageKey =
        `fusion_code_javascript_unit${unitNumber}_${selectedQuestion._id}`;

      localStorage.setItem(storageKey, code);
    }
  }

  function resetEditor() {
    setEditorCode(JAVASCRIPT_STARTER_CODE);

    if (selectedQuestion?._id) {
      const storageKey =
        `fusion_code_javascript_unit${unitNumber}_${selectedQuestion._id}`;

      localStorage.removeItem(storageKey);
    }

    setRunResult(null);
    setPracticeError("");
  }

  async function runCode() {
    if (!selectedQuestion?._id) return;

    setRunning(true);
    setRunResult(null);
    setPracticeError("");

    try {
      const token = getToken();

      if (!token) {
        setPracticeError("Please log in again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/coding/run`,
        {
          code: editorCode,
          language: "javascript",
          questionId: selectedQuestion._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRunResult(response.data);
    } catch (error) {
      setPracticeError(
        getErrorMessage(
          error,
          "Code execution failed. Please try again."
        )
      );
    } finally {
      setRunning(false);
    }
  }

  async function submitCode() {
    if (!selectedQuestion?._id) return;

    const token = getToken();

    if (!token) {
      setPracticeError(
        "Please log in again before submitting your solution."
      );
      return;
    }

    if (!runResult) {
      setPracticeError("Please run your code before submitting it.");
      return;
    }

    const passed = Number(
      runResult.passed ??
      runResult.testcasesPassed ??
      0
    );

    const total = Number(
      runResult.total ??
      runResult.totalTestcases ??
      runResult.totalTestCases ??
      0
    );

    if (
      runResult.success === false ||
      total === 0 ||
      passed !== total
    ) {
      setPracticeError(
        "Your code must pass all test cases before you can submit it."
      );
      return;
    }

    setSubmittingCode(true);
    setPracticeError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/coding/submit`,
        {
          code: editorCode,
          language: "javascript",
          questionId: selectedQuestion._id,
          unit: unitNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const submissionId =
        response.data?.submissionId ||
        response.data?.submission?._id;

      if (submissionId) {
        navigate(`/submission/${submissionId}`);
      } else {
        setPracticeError(
          response.data?.message ||
            "Submission was received, but no submission ID was returned."
        );
      }
    } catch (error) {
      setPracticeError(
        getErrorMessage(error, "Unable to submit your code.")
      );
    } finally {
      setSubmittingCode(false);
    }
  }

  const resultPassed = Number(
    runResult?.passed ??
    runResult?.testcasesPassed ??
    0
  );

  const resultTotal = Number(
    runResult?.total ??
    runResult?.totalTestcases ??
    runResult?.totalTestCases ??
    0
  );

  const resultCases =
    runResult?.results ||
    runResult?.testResults ||
    [];

  return (
    <main className="ap-practice-page">
      <header className="java-topbar">
        <button
          className="java-brand"
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="java-brand-mark">F</span>
          <span>FUSION</span>
        </button>

        <button
          className="java-dashboard-btn"
          type="button"
          onClick={() =>
            navigate(`/learn/javascript/unit${unitNumber}`)
          }
        >
          ← Back to Unit {unitNumber}
        </button>
      </header>

      <div className="ap-practice-heading">
        <div>
          <span className="additional-label">
            JAVASCRIPT · UNIT {unitNumber}
          </span>

          <h2>Code Practice</h2>

          <p>
            Solve questions assigned by your teacher, run your code
            and submit your solutions.
          </p>
        </div>

        <span className="ap-language-tag">JAVASCRIPT</span>
      </div>

      {practiceError && (
        <div className="ap-alert">
          {practiceError}
        </div>
      )}

      {loadingQuestions ? (
        <div className="ap-empty-state">
          <h3>Loading JavaScript questions...</h3>
          <p>
            Please wait while we fetch your Unit {unitNumber} practice
            questions.
          </p>
        </div>
      ) : practiceQuestions.length === 0 ? (
        <div className="ap-empty-state">
          <h3>No JavaScript questions available yet</h3>

          <p>
            Your teacher has not added any JavaScript coding questions
            for Unit {unitNumber} yet. Please check again later.
          </p>

          <button
            type="button"
            className="ap-run-button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Refresh Questions
          </button>
        </div>
      ) : (
        <div className="ap-practice-layout">
          <aside className="ap-question-sidebar">
            <h3>Practice Questions</h3>

            <p>
              {practiceQuestions.length} questions available
            </p>

            {practiceQuestions.map((question, index) => (
              <button
                type="button"
                key={question._id}
                className={
                  selectedQuestion?._id === question._id
                    ? "active"
                    : ""
                }
                onClick={() => setSelectedQuestion(question)}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                {getQuestionTitle(question)}
              </button>
            ))}
          </aside>

          {selectedQuestion && (
            <div className="ap-workspace">
              <section className="ap-problem">
                <span className="additional-label">
                  CODING QUESTION
                </span>

                <h3>
                  {getQuestionTitle(selectedQuestion)}
                </h3>

                <p>
                  {getQuestionDescription(selectedQuestion)}
                </p>

                {getSampleTestcases(selectedQuestion).length > 0 && (
                  <div className="ap-sample-tests">
                    <h4>Sample Test Cases</h4>

                    {getSampleTestcases(selectedQuestion).map(
                      (testcase, index) => (
                        <div
                          className="ap-sample-test"
                          key={index}
                        >
                          <strong>Sample {index + 1}</strong>

                          <p>
                            <b>Input:</b>{" "}
                            {String(testcase.input ?? "No input")}
                          </p>

                          <p>
                            <b>Expected output:</b>{" "}
                            {String(
                              testcase.expectedOutput ??
                                testcase.expected ??
                                testcase.output ??
                                "Not provided"
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              <section className="ap-editor-card">
                <div className="ap-editor-toolbar">
                  <strong>Code Editor</strong>
                  <span>JAVASCRIPT · main.js</span>
                </div>

                <Editor
                  height="420px"
                  language="javascript"
                  theme="vs-dark"
                  value={editorCode}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                    wordWrap: "on",
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                  }}
                />

                <div className="ap-editor-actions">
                  <button
                    type="button"
                    className="ap-reset-button"
                    onClick={resetEditor}
                    disabled={running || submittingCode}
                  >
                    Reset Code
                  </button>

                  <button
                    type="button"
                    className="ap-run-button"
                    onClick={runCode}
                    disabled={running || submittingCode}
                  >
                    {running ? "Running..." : "▶ Run Code"}
                  </button>

                  <button
                    type="button"
                    className="ap-submit-button"
                    onClick={submitCode}
                    disabled={
                      running ||
                      submittingCode ||
                      !runResult ||
                      runResult.success === false ||
                      resultTotal === 0 ||
                      resultPassed !== resultTotal
                    }
                  >
                    {submittingCode
                      ? "Submitting..."
                      : "Submit Solution"}
                  </button>
                </div>
              </section>

              {runResult && (
                <section className="ap-result-panel">
                  <div className="ap-result-heading">
                    <strong>Execution Results</strong>

                    <span>
                      {resultPassed} / {resultTotal} test cases passed
                    </span>
                  </div>

                  {runResult.message && (
                    <p className="ap-result-message">
                      {runResult.message}
                    </p>
                  )}

                  {runResult.output && (
                    <pre className="ap-output">
                      {runResult.output}
                    </pre>
                  )}

                  {runResult.error && (
                    <pre className="ap-error">
                      {runResult.error}
                    </pre>
                  )}

                  {resultCases.map((testcase, index) => {
                    const normalizedStatus = String(
                      testcase.status || ""
                    ).toLowerCase();

                    const passed =
                      normalizedStatus === "passed" ||
                      normalizedStatus === "accepted" ||
                      testcase.passed === true;

                    return (
                      <div className="ap-testcase" key={index}>
                        <div>
                          <strong>
                            Test Case {index + 1}
                          </strong>

                          <span
                            className={
                              passed ? "ap-pass" : "ap-fail"
                            }
                          >
                            {passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>

                        {testcase.input !== undefined && (
                          <p>
                            <b>Input:</b>{" "}
                            {String(testcase.input)}
                          </p>
                        )}

                        {(
                          testcase.expected ??
                          testcase.expectedOutput
                        ) !== undefined && (
                          <p>
                            <b>Expected:</b>{" "}
                            {String(
                              testcase.expected ??
                                testcase.expectedOutput
                            )}
                          </p>
                        )}

                        {(
                          testcase.got ??
                          testcase.actualOutput ??
                          testcase.output
                        ) !== undefined && (
                          <p>
                            <b>Your output:</b>{" "}
                            {String(
                              testcase.got ??
                                testcase.actualOutput ??
                                testcase.output
                            )}
                          </p>
                        )}

                        {testcase.error && (
                          <p>
                            <b>Error:</b>{" "}
                            {String(testcase.error)}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {runResult.success === true &&
                    resultTotal > 0 &&
                    resultPassed === resultTotal && (
                      <p className="ap-success-text">
                        All test cases passed. You can now submit
                        your solution.
                      </p>
                    )}
                </section>
              )}
            </div>
          )}
        </div>
      )}

      <footer className="java-footer">
        <span>
          FUSION <i>•</i> JAVASCRIPT · UNIT {unitNumber}
        </span>

        <button
          type="button"
          onClick={() =>
            navigate(`/learn/javascript/unit${unitNumber}`)
          }
        >
          Back to Unit {unitNumber} →
        </button>
      </footer>
    </main>
  );
}
