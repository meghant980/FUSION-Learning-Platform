
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../styles/teacher-coding-management.css";

const API = "http://localhost:5001";
const UNIT = "1";
const LANGUAGE = "cpp";

const emptyTestCase = () => ({
  input: "",
  expected: "",
  visible: true
});

const emptyEvaluationStep = () => ({
  stepId: `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  type: "code-contains",
  value: "",
  minPassed: 1,
  marks: 1
});

function getToken() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("fusionUser") || "{}");
  } catch {
    user = {};
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken") ||
    user.token ||
    user.accessToken ||
    ""
  );
}

export default function TeacherCppUnit1Coding() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testcases, setTestcases] = useState([emptyTestCase()]);
  const [evaluationSteps, setEvaluationSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const authConfig = () => {
    const token = getToken();

    if (!token) {
      throw new Error("Your login session was not found. Please log in again.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/api/coding/teacher/practice`,
        {
          params: {
            language: LANGUAGE,
            unit: UNIT
          },
          ...authConfig()
        }
      );

      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.questions || response.data?.data || [];

      setQuestions(list);
    } catch (error) {
      console.error("Unable to load C++ Unit 1 questions:", error);

      showMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Unable to load questions. Check your login and backend connection.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const updateTestCase = (index, field, value) => {
    setTestcases((current) =>
      current.map((testcase, i) =>
        i === index ? { ...testcase, [field]: value } : testcase
      )
    );
  };

  const addTestCase = () => {
    setTestcases((current) => [...current, emptyTestCase()]);
  };

  const removeTestCase = (index) => {
    setTestcases((current) =>
      current.length === 1
        ? current
        : current.filter((_, i) => i !== index)
    );
  };

  const updateEvaluationStep = (index, field, value) => {
    setEvaluationSteps((current) =>
      current.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    );
  };

  const addEvaluationStep = () => {
    setEvaluationSteps((current) => [
      ...current,
      emptyEvaluationStep()
    ]);
  };

  const removeEvaluationStep = (index) => {
    setEvaluationSteps((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTestcases([emptyTestCase()]);
    setEvaluationSteps([]);
  };

  const handleCreateQuestion = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !description.trim()) {
      showMessage("Enter both a question title and description.", "error");
      return;
    }

    if (testcases.some((testcase) => !testcase.expected.trim())) {
      showMessage(
        "Enter the expected output for every test case. Input can be left blank when no input is required.",
        "error"
      );
      return;
    }

    const invalidStep = evaluationSteps.find(
      (step) =>
        !step.label.trim() ||
        !Number.isFinite(Number(step.marks)) ||
        Number(step.marks) <= 0 ||
        ((step.type === "code-contains" || step.type === "code-regex") &&
          !step.value.trim()) ||
        (step.type === "min-testcases-pass" &&
          (Number(step.minPassed) < 1 ||
            Number(step.minPassed) > testcases.length))
    );

    if (invalidStep) {
      showMessage(
        "Complete each evaluation rule with a valid label, condition and marks.",
        "error"
      );
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      language: LANGUAGE,
      unit: UNIT,
      category: "practice",
      testcases: testcases.map((testcase) => ({
        input: testcase.input,
        expected: testcase.expected,
        visible: testcase.visible
      })),
      evaluationSteps: evaluationSteps.map((step) => ({
        stepId: step.stepId,
        label: step.label.trim(),
        type: step.type,
        value: step.value,
        minPassed: Number(step.minPassed) || 0,
        marks: Number(step.marks)
      }))
    };

    try {
      setSaving(true);

      const response = await axios.post(
        `${API}/api/coding/add`,
        payload,
        authConfig()
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "The question could not be saved."
        );
      }

      showMessage(
        response.data?.message || "C++ Unit 1 question created successfully.",
        "success"
      );

      resetForm();
      await fetchQuestions();
    } catch (error) {
      console.error("Create C++ Unit 1 question error:", error);

      showMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Question creation failed. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      setDeletingId(questionId);

      await axios.delete(
        `${API}/api/coding/delete/${questionId}`,
        authConfig()
      );

      setQuestions((current) =>
        current.filter((question) => question._id !== questionId)
      );

      showMessage("Question deleted successfully.", "success");
    } catch (error) {
      console.error("Delete C++ Unit 1 question error:", error);

      showMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Unable to delete this question.",
        "error"
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="tcm-page">
      <header className="tcm-header">
        <div className="tcm-brand">
          <div className="tcm-logo">F</div>
          <div>
            <strong>FUSION</strong>
            <span>TEACHER WORKSPACE</span>
          </div>
        </div>

        <button
          type="button"
          className="tcm-back-button"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </header>

      <main className="tcm-main">
        <section className="tcm-hero">
          <div className="tcm-eyebrow">COURSE MANAGEMENT / UNIT 01</div>
          <h1>Manage C++ Coding Questions</h1>
          <p>
            Create C++ practice problems, add sample test cases and define
            evaluation rules for your students.
          </p>

          <div className="tcm-meta">
            <span>Language: C++</span>
            <span>Unit: 1</span>
            <span>{questions.length} saved questions</span>
          </div>
        </section>

        {message && (
          <div
            className={`tcm-message ${
              messageType === "error"
                ? "tcm-message-error"
                : "tcm-message-success"
            }`}
            role="alert"
          >
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        <form className="tcm-form" onSubmit={handleCreateQuestion}>
          <div className="tcm-section-title">
            <div>
              <span className="tcm-section-number">01</span>
              <div>
                <h2>Create a question</h2>
                <p>Enter the problem details students will see.</p>
              </div>
            </div>
          </div>

          <div className="tcm-field">
            <label htmlFor="tcm-title">Question title</label>
            <input
              id="tcm-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Find the largest of three numbers"
              maxLength={160}
              required
            />
          </div>

          <div className="tcm-field">
            <label htmlFor="tcm-description">Problem description</label>
            <textarea
              id="tcm-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain the problem clearly. Include what the program should do."
              rows={5}
              required
            />
          </div>

          <div className="tcm-divider" />

          <div className="tcm-section-title">
            <div>
              <span className="tcm-section-number">02</span>
              <div>
                <h2>Test cases</h2>
                <p>Add input and expected output for program evaluation.</p>
              </div>
            </div>

            <button
              type="button"
              className="tcm-outline-button"
              onClick={addTestCase}
            >
              + Add test case
            </button>
          </div>

          <div className="tcm-testcase-list">
            {testcases.map((testcase, index) => (
              <section className="tcm-testcase" key={index}>
                <div className="tcm-card-heading">
                  <strong>Test case {index + 1}</strong>
                  <button
                    type="button"
                    className="tcm-remove-button"
                    onClick={() => removeTestCase(index)}
                    disabled={testcases.length === 1}
                  >
                    Remove
                  </button>
                </div>

                <div className="tcm-two-columns">
                  <div className="tcm-field">
                    <label htmlFor={`tcm-input-${index}`}>Input</label>
                    <textarea
                      id={`tcm-input-${index}`}
                      value={testcase.input}
                      onChange={(event) =>
                        updateTestCase(index, "input", event.target.value)
                      }
                      placeholder="Enter test input (leave blank if no input is needed)"
                      rows={3}
                    />
                  </div>

                  <div className="tcm-field">
                    <label htmlFor={`tcm-output-${index}`}>
                      Expected output
                    </label>
                    <textarea
                      id={`tcm-output-${index}`}
                      value={testcase.expected}
                      onChange={(event) =>
                        updateTestCase(index, "expected", event.target.value)
                      }
                      placeholder="Enter the expected program output"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <label className="tcm-checkbox">
                  <input
                    type="checkbox"
                    checked={testcase.visible}
                    onChange={(event) =>
                      updateTestCase(index, "visible", event.target.checked)
                    }
                  />
                  <span>Show this test case to students as a sample</span>
                </label>
              </section>
            ))}
          </div>

          <div className="tcm-divider" />

          <div className="tcm-section-title">
            <div>
              <span className="tcm-section-number">03</span>
              <div>
                <h2>Evaluation rules</h2>
                <p>
                  Optional rules for awarding marks based on code and test
                  case results.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="tcm-outline-button"
              onClick={addEvaluationStep}
            >
              + Add evaluation rule
            </button>
          </div>

          {evaluationSteps.length === 0 && (
            <div className="tcm-empty-rules">
              No extra evaluation rules added. Test case evaluation will
              still be available.
            </div>
          )}

          <div className="tcm-rule-list">
            {evaluationSteps.map((step, index) => (
              <section className="tcm-rule-card" key={step.stepId}>
                <div className="tcm-card-heading">
                  <strong>Evaluation rule {index + 1}</strong>
                  <button
                    type="button"
                    className="tcm-remove-button"
                    onClick={() => removeEvaluationStep(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="tcm-two-columns">
                  <div className="tcm-field">
                    <label htmlFor={`tcm-rule-label-${index}`}>
                      Rule name
                    </label>
                    <input
                      id={`tcm-rule-label-${index}`}
                      value={step.label}
                      onChange={(event) =>
                        updateEvaluationStep(index, "label", event.target.value)
                      }
                      placeholder="Example: Use a for loop"
                    />
                  </div>

                  <div className="tcm-field">
                    <label htmlFor={`tcm-rule-type-${index}`}>
                      Evaluation type
                    </label>
                    <select
                      id={`tcm-rule-type-${index}`}
                      value={step.type}
                      onChange={(event) =>
                        updateEvaluationStep(index, "type", event.target.value)
                      }
                    >
                      <option value="code-contains">Code contains text</option>
                      <option value="code-regex">Code matches pattern</option>
                      <option value="all-testcases-pass">
                        All test cases pass
                      </option>
                      <option value="min-testcases-pass">
                        Minimum test cases pass
                      </option>
                    </select>
                  </div>
                </div>

                {(step.type === "code-contains" ||
                  step.type === "code-regex") && (
                  <div className="tcm-field">
                    <label htmlFor={`tcm-rule-value-${index}`}>
                      {step.type === "code-contains"
                        ? "Required text in code"
                        : "Regular expression"}
                    </label>
                    <input
                      id={`tcm-rule-value-${index}`}
                      value={step.value}
                      onChange={(event) =>
                        updateEvaluationStep(index, "value", event.target.value)
                      }
                      placeholder={
                        step.type === "code-contains"
                          ? "Example: cout"
                          : "Enter a valid regular expression"
                      }
                    />
                  </div>
                )}

                {step.type === "min-testcases-pass" && (
                  <div className="tcm-field tcm-small-field">
                    <label htmlFor={`tcm-rule-min-${index}`}>
                      Minimum test cases that must pass
                    </label>
                    <input
                      id={`tcm-rule-min-${index}`}
                      type="number"
                      min="1"
                      max={testcases.length}
                      value={step.minPassed}
                      onChange={(event) =>
                        updateEvaluationStep(
                          index,
                          "minPassed",
                          event.target.value
                        )
                      }
                    />
                  </div>
                )}

                <div className="tcm-field tcm-small-field">
                  <label htmlFor={`tcm-rule-marks-${index}`}>
                    Marks for this rule
                  </label>
                  <input
                    id={`tcm-rule-marks-${index}`}
                    type="number"
                    min="1"
                    value={step.marks}
                    onChange={(event) =>
                      updateEvaluationStep(index, "marks", event.target.value)
                    }
                  />
                </div>
              </section>
            ))}
          </div>

          <div className="tcm-submit-row">
            <p>
              This question will be saved under <strong>C++ · Unit 1</strong>.
            </p>
            <button
              type="submit"
              className="tcm-submit-button"
              disabled={saving}
            >
              {saving ? "Saving question..." : "Create coding question →"}
            </button>
          </div>
        </form>

        <section className="tcm-saved-section">
          <div className="tcm-section-title">
            <div>
              <span className="tcm-section-number">04</span>
              <div>
                <h2>Saved Unit 1 questions</h2>
                <p>Questions currently available in the teacher workspace.</p>
              </div>
            </div>

            <button
              type="button"
              className="tcm-outline-button"
              onClick={fetchQuestions}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="tcm-empty-state">Loading saved questions...</div>
          ) : questions.length === 0 ? (
            <div className="tcm-empty-state">
              <strong>No C++ Unit 1 questions yet</strong>
              <span>Create your first question using the form above.</span>
            </div>
          ) : (
            <div className="tcm-saved-list">
              {questions.map((question, index) => (
                <article className="tcm-saved-card" key={question._id}>
                  <div className="tcm-saved-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="tcm-saved-content">
                    <h3>{question.title}</h3>
                    <p>{question.description}</p>
                    <div className="tcm-saved-meta">
                      <span>C++</span>
                      <span>Unit 1</span>
                      <span>
                        {question.testcases?.length || 0} test cases
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="tcm-delete-button"
                    onClick={() => handleDeleteQuestion(question._id)}
                    disabled={deletingId === question._id}
                  >
                    {deletingId === question._id ? "Deleting..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="tcm-footer">
        <strong>FUSION</strong>
        <span>Faculty Student Interactive Online Network</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
