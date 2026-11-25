
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

  const [questions, setQuestions] = useState(() =>
    Array.from({ length: 10 }, () => ({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    }))
  );

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const languageLabel = languages[subject];

  // QUESTION HANDLERS

  const handleQuestionChange = (index, value) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, questionText: value }
          : question
      )
    );
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === qIndex
          ? {
              ...question,
              options: question.options.map(
                (option, optionIndex) =>
                  optionIndex === optIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const handleCorrectAnswerChange = (index, value) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, correctAnswer: value }
          : question
      )
    );
  };

  // FORM VALIDATION

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

    if (!section) {
      return "Please select a section!";
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.questionText.trim()) {
        return `Question ${i + 1} is empty!`;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          return `Option ${j + 1} of Question ${i + 1} is empty!`;
        }
      }

      if (!question.correctAnswer.trim()) {
        return `Correct answer missing in Question ${i + 1}!`;
      }

      const normalizedOptions = question.options.map((option) =>
        option.trim().toLowerCase()
      );

      const normalizedAnswer = question.correctAnswer
        .trim()
        .toLowerCase();

      if (!normalizedOptions.includes(normalizedAnswer)) {
        return `Correct answer in Question ${i + 1} must match one of its options!`;
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

  // SUBMIT ASSIGNMENT

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

        questions: questions.map((question) => ({
          questionText: question.questionText.trim(),
          options: question.options.map((option) => option.trim()),
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

  // UI

  return (
    <div className="unit-page">
      <div className="unit-header">
        <h2>🧩 Create {languageLabel} MCQ Assignment</h2>

        <p>
          Create an objective assignment for {languageLabel}, Unit {unit}.
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
                <option value={1}>Unit 1</option>
                <option value={2}>Unit 2</option>
                <option value={3}>Unit 3</option>
                <option value={4}>Unit 4</option>
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

            <input
              className="modern-input"
              type="datetime-local"
              value={deadline}
              onChange={(event) =>
                setDeadline(event.target.value)
              }
            />

            {/* DESCRIPTION */}

            <textarea
              className="modern-input"
              placeholder="Description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            {/* MCQ QUESTIONS */}

            {questions.map((question, index) => (
              <div key={index} className="question-block">
                <h3>Question {index + 1}</h3>

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
                      placeholder={`Option ${optionIndex + 1}`}
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

                <input
                  className="modern-input"
                  placeholder="Enter Correct Answer (must match an option)"
                  value={question.correctAnswer}
                  onChange={(event) =>
                    handleCorrectAnswerChange(
                      index,
                      event.target.value
                    )
                  }
                />
              </div>
            ))}

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
