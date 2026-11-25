
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/teacher.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";

const languages = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const createEmptyQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
});

const getUser = () => {
  try {
    const rawUser = JSON.parse(
      localStorage.getItem("fusionUser") || "{}"
    );
    return rawUser?.user || rawUser || {};
  } catch {
    return {};
  }
};

export default function CreateAssignment() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const requestedSubject = query.get("subject")?.toLowerCase();
  const subject = languages[requestedSubject]
    ? requestedSubject
    : "c";

  const requestedUnit = Number(query.get("unit") || 1);

  const defaultUnit =
    Number.isInteger(requestedUnit) &&
    requestedUnit >= 1 &&
    requestedUnit <= 4
      ? requestedUnit
      : 1;

  const user = getUser();

  const sections = Array.isArray(user?.sections)
    ? user.sections
    : [];

  const [unit, setUnit] = useState(defaultUnit);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);

  const [questions, setQuestions] = useState([
    createEmptyQuestion(),
  ]);

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const languageLabel = languages[subject];

  // ADD QUESTION
  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion(),
    ]);
  };

  // REMOVE QUESTION
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setMsg("At least one question is required.");
      return;
    }

    setQuestions((previous) =>
      previous.filter((_, i) => i !== index)
    );
    setMsg("");
  };

  // CHANGE QUESTION TEXT
  const handleQuestionChange = (index, value) => {
    setQuestions((previous) =>
      previous.map((question, i) =>
        i === index
          ? { ...question, questionText: value }
          : question
      )
    );
  };

  // CHANGE OPTION
  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((previous) =>
      previous.map((question, i) =>
        i === qIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optIndex ? value : option
              ),
              correctAnswer:
                question.correctAnswer === question.options[optIndex]
                  ? ""
                  : question.correctAnswer,
            }
          : question
      )
    );
  };

  // CHANGE CORRECT ANSWER
  const handleCorrectAnswerChange = (index, value) => {
    setQuestions((previous) =>
      previous.map((question, i) =>
        i === index
          ? { ...question, correctAnswer: value }
          : question
      )
    );
  };

  // VALIDATE FORM
  const validateForm = () => {
    if (!title.trim()) {
      return "Assignment title cannot be empty!";
    }

    if (!description.trim()) {
      return "Assignment description cannot be empty!";
    }

    if (!deadline) {
      return "Deadline is required!";
    }

    if (new Date(deadline).getTime() <= Date.now()) {
      return "Please select a future deadline!";
    }

    if (!section) {
      return "Please select a section!";
    }

    const duration = Number(durationMinutes);

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 180
    ) {
      return "Quiz duration must be between 1 and 180 minutes!";
    }

    if (!questions.length) {
      return "At least one question is required!";
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.questionText.trim()) {
        return `Question ${i + 1} is empty!`;
      }

      for (let j = 0; j < 4; j++) {
        if (!question.options[j]?.trim()) {
          return `Option ${j + 1} of Question ${i + 1} is empty!`;
        }
      }

      if (!question.correctAnswer.trim()) {
        return `Please select the correct answer for Question ${i + 1}!`;
      }

      const normalizedOptions = question.options.map((option) =>
        option.trim().toLowerCase()
      );

      if (
        !normalizedOptions.includes(
          question.correctAnswer.trim().toLowerCase()
        )
      ) {
        return `Correct answer for Question ${i + 1} must match one of its options!`;
      }
    }

    return null;
  };

  // NAVIGATION AFTER PUBLISH
  const goBackToTeacherUnit = () => {
    if (subject === "cpp") {
      navigate(`/teacher/cpp/unit${unit}`);
      return;
    }

    if (subject === "c") {
      navigate(`/teacher/unit/${unit}`);
      return;
    }

    navigate(`/teacher/${subject}/unit/${unit}`);
  };

  // PUBLISH ASSIGNMENT
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMsg("");

    const validationError = validateForm();

    if (validationError) {
      setMsg(`❌ ${validationError}`);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        unit: Number(unit),
        subject,
        type: "quiz",
        title: title.trim(),
        description: description.trim(),
        deadline,
        durationMinutes: Number(durationMinutes),

        questions: questions.map((question) => ({
          questionText: question.questionText.trim(),
          options: question.options.map((option) =>
            option.trim()
          ),
          correctAnswer: question.correctAnswer.trim(),
        })),

        teacherId: user?._id || user?.id,
        section,
      };

      const response = await axios.post(
        `${API_URL}/api/assignments/create`,
        payload
      );

      setMsg(
        response.data?.message ||
          "✅ Assignment published successfully!"
      );

      setTimeout(() => {
        goBackToTeacherUnit();
      }, 1200);
    } catch (error) {
      console.error("Error creating assignment:", error);

      setMsg(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "❌ Failed to publish assignment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="unit-page">
      <div className="unit-header">
        <h2>🧩 Create {languageLabel} MCQ Assignment</h2>
        <p>
          Create an objective assignment for {languageLabel},
          Unit {unit}.
        </p>
      </div>

      <div className="section">
        <div className="form-wrapper">
          <form className="modern-form" onSubmit={handleSubmit}>

            {/* UNIT AND SECTION */}
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                className="modern-input"
                value={unit}
                onChange={(event) =>
                  setUnit(Number(event.target.value))
                }
              >
                {[1, 2, 3, 4].map((number) => (
                  <option key={number} value={number}>
                    Unit {number}
                  </option>
                ))}
              </select>

              <select
                className="modern-input"
                value={section}
                onChange={(event) =>
                  setSection(event.target.value)
                }
              >
                <option value="">Select Section</option>

                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* ASSIGNMENT TITLE */}
            <input
              className="modern-input"
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            {/* DEADLINE */}
            <label>Assignment Deadline</label>
            <input
              className="modern-input"
              type="datetime-local"
              value={deadline}
              onChange={(event) =>
                setDeadline(event.target.value)
              }
            />

            {/* QUIZ TIMER */}
            <div
              style={{
                background: "#f0f5f0",
                padding: "18px",
                borderRadius: "12px",
                margin: "12px 0",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                ⏱️ Quiz Duration (Minutes)
              </label>

              <input
                className="modern-input"
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={(event) =>
                  setDurationMinutes(event.target.value)
                }
                required
              />

              <small style={{ color: "#526452" }}>
                Students will get this much time after starting
                the quiz. Maximum 180 minutes.
              </small>
            </div>

            {/* DESCRIPTION */}
            <textarea
              className="modern-input"
              placeholder="Assignment Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            {/* QUESTION COUNT */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "20px 0",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h3>📝 MCQ Questions ({questions.length})</h3>

              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: "#183c35",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                + Add Question
              </button>
            </div>

            {/* DYNAMIC QUESTIONS */}
            {questions.map((question, index) => (
              <div
                key={index}
                className="question-block"
                style={{
                  border: "1px solid #dce5dc",
                  borderRadius: "12px",
                  padding: "18px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h3>Question {index + 1}</h3>

                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length === 1}
                    style={{
                      background: "#b93838",
                      color: "#fff",
                      border: "none",
                      borderRadius: "7px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      opacity: questions.length === 1 ? 0.4 : 1,
                    }}
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  className="modern-input"
                  placeholder={`Enter Question ${index + 1}`}
                  value={question.questionText}
                  onChange={(event) =>
                    handleQuestionChange(
                      index,
                      event.target.value
                    )
                  }
                />

                {/* FOUR OPTIONS */}
                <div className="options-grid">
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      className="modern-input"
                      placeholder={`Option ${String.fromCharCode(
                        65 + optionIndex
                      )}`}
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(
                          index,
                          optionIndex,
                          event.target.value
                        )
                      }
                    />
                  ))}
                </div>

                {/* CORRECT ANSWER */}
                <label
                  style={{
                    display: "block",
                    marginTop: "12px",
                    fontWeight: "600",
                  }}
                >
                  Select Correct Answer
                </label>

                <select
                  className="modern-input"
                  value={question.correctAnswer}
                  onChange={(event) =>
                    handleCorrectAnswerChange(
                      index,
                      event.target.value
                    )
                  }
                >
                  <option value="">Choose correct option</option>

                  {question.options.map((option, optionIndex) => (
                    <option
                      key={optionIndex}
                      value={option}
                      disabled={!option.trim()}
                    >
                      {String.fromCharCode(65 + optionIndex)}:{" "}
                      {option || `Option ${optionIndex + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* ADD QUESTION BUTTON */}
            <button
              type="button"
              onClick={addQuestion}
              style={{
                width: "100%",
                padding: "13px",
                marginBottom: "20px",
                background: "#e8f0e7",
                color: "#183c35",
                border: "1px dashed #78927a",
                borderRadius: "9px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              + Add Another Question
            </button>

            {/* PUBLISH */}
            <button
              className="submit-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Publishing..."
                : "🚀 Publish Assignment"}
            </button>
          </form>

          <p className="form-msg">{msg}</p>
        </div>
      </div>
    </div>
  );
}
