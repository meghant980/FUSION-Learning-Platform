
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/JavaModule.css";
import "../styles/additionalCodePractice.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const COURSE_UNIT = "1";

const topics = [
  {
    title: "Java Basics",
    description:
      "Java is a programming language. A Java program uses a class and the main method to start execution.",
    example: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java");
  }
}`,
    output: "Hello Java",
  },
  {
    title: "Variables & Data Types",
    description:
      "Variables store data. Common types include int for whole numbers, double for decimal numbers, char for a character, boolean for true/false, and String for text.",
    example: `int age = 18;
String name = "Student";
double marks = 85.5;

System.out.println(name);
System.out.println(age);
System.out.println(marks);`,
    output: "Student\n18\n85.5",
  },
  {
    title: "Conditions",
    description:
      "if and else statements allow a program to make decisions based on a condition.",
    example: `int marks = 75;

if (marks >= 40) {
  System.out.println("Pass");
} else {
  System.out.println("Fail");
}`,
    output: "Pass",
  },
  {
    title: "Loops",
    description:
      "Loops repeat a block of code. A for loop is useful when you know how many times you want to repeat something.",
    example: `for (int i = 1; i <= 3; i++) {
  System.out.println(i);
}`,
    output: "1\n2\n3",
  },
  {
    title: "OOP Concepts",
    description:
      "Object-Oriented Programming organizes code using classes and objects. Important concepts include inheritance, encapsulation, abstraction, and polymorphism.",
    example: `class Student {
  String name = "Aman";
}

Student s = new Student();
System.out.println(s.name);`,
    output: "Aman",
  },
  {
    title: "Arrays",
    description:
      "An array stores multiple values of the same data type in one variable. Array indexing starts from 0.",
    example: `int[] numbers = {10, 20, 30};

System.out.println(numbers[0]);
System.out.println(numbers[2]);`,
    output: "10\n30",
  },
  {
    title: "Strings",
    description:
      "A String stores text. Java provides methods such as length() to find the number of characters and toUpperCase() to convert text to uppercase.",
    example: `String name = "Java";

System.out.println(name.length());
System.out.println(name.toUpperCase());`,
    output: "4\nJAVA",
  },
  {
    title: "Methods",
    description:
      "A method is a reusable block of code that performs a task. You can call a method whenever you need it.",
    example: `static void greet() {
  System.out.println("Welcome to Java");
}

// Call this inside main():
greet();`,
    output: "Welcome to Java",
  },
  {
    title: "Constructors",
    description:
      "A constructor initializes an object. Its name matches the class name and it has no return type.",
    example: `class Student {
  String name;

  Student() {
    name = "Aman";
  }
}

// Inside main():
Student s = new Student();
System.out.println(s.name);`,
    output: "Aman",
  },
  {
    title: "Exception Handling",
    description:
      "Exception handling helps a program deal with errors using try and catch blocks instead of stopping unexpectedly.",
    example: `try {
  int result = 10 / 0;
  System.out.println(result);
} catch (ArithmeticException e) {
  System.out.println("Cannot divide by zero");
}`,
    output: "Cannot divide by zero",
  },
];

const questions = [
  {
    question: "Which keyword is used to create a class in Java?",
    options: ["function", "class", "define", "struct"],
    answer: 1,
    topic: "Java Basics",
  },
  {
    question: "Which data type stores whole numbers?",
    options: ["int", "boolean", "String", "char"],
    answer: 0,
    topic: "Variables & Data Types",
  },
  {
    question: "Which statement is used for decision-making?",
    options: ["package", "import", "if", "void"],
    answer: 2,
    topic: "Conditions",
  },
  {
    question: "Which loop is commonly used to repeat code a set number of times?",
    options: ["for", "class", "return", "new"],
    answer: 0,
    topic: "Loops",
  },
  {
    question: "An object is created from a:",
    options: ["loop", "class", "condition", "comment"],
    answer: 1,
    topic: "OOP Concepts",
  },
  {
    question: "What is the index of the first element in a Java array?",
    options: ["0", "1", "-1", "It has no index"],
    answer: 0,
    topic: "Arrays",
  },
  {
    question: "Which method returns the length of a String?",
    options: ["size()", "count()", "length()", "getLength()"],
    answer: 2,
    topic: "Strings",
  },
  {
    question: "What is a method mainly used for?",
    options: [
      "Storing a file",
      "Reusing a block of code",
      "Creating a comment",
      "Ending every program",
    ],
    answer: 1,
    topic: "Methods",
  },
  {
    question: "What is the name of a constructor?",
    options: ["Any name", "The class name", "main only", "return"],
    answer: 1,
    topic: "Constructors",
  },
  {
    question: "Which blocks are commonly used for exception handling?",
    options: [
      "if and else",
      "for and while",
      "try and catch",
      "class and object",
    ],
    answer: 2,
    topic: "Exception Handling",
  },
];

const JAVA_STARTER_CODE = `public class Main {
    public static void main(String[] args) {
        // Write your code here

    }
}`;

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

function JavaModule() {
  const navigate = useNavigate();

  const [activeTopic, setActiveTopic] = useState(0);
  const [mode, setMode] = useState("learn");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Code Practice state
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editorCode, setEditorCode] = useState(JAVA_STARTER_CODE);
  const [runResult, setRunResult] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [running, setRunning] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [practiceError, setPracticeError] = useState("");

  const currentTopic = topics[activeTopic];

  const score = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.answer ? 1 : 0),
    0
  );

  const wrongTopics = [
    ...new Set(
      questions
        .filter(
          (question, index) =>
            answers[index] !== undefined &&
            answers[index] !== question.answer
        )
        .map((question) => question.topic)
    ),
  ];

  function selectAnswer(questionIndex, optionIndex) {
    if (submitted) return;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionIndex]: optionIndex,
    }));
  }

  function submitQuiz() {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitted(true);
  }

  function tryAgain() {
    setAnswers({});
    setSubmitted(false);
  }

  // Fetch Java questions created by the teacher.
  useEffect(() => {
    if (mode !== "practice") return;

    let cancelled = false;

    async function fetchPracticeQuestions() {
      setLoadingQuestions(true);
      setPracticeError("");

      try {
        const token = getToken();

        const response = await axios.get(
          `${API_URL}/api/coding/practice`,
          {
            params: {
              language: "java",
              unit: COURSE_UNIT,
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
          setSelectedQuestion((previous) => {
            if (
              previous &&
              fetchedQuestions.some((item) => item._id === previous._id)
            ) {
              return previous;
            }

            return fetchedQuestions[0];
          });
        } else {
          setSelectedQuestion(null);
        }
      } catch (error) {
        if (!cancelled) {
          setPracticeError(
            getErrorMessage(
              error,
              "Unable to load Java practice questions. Please try again."
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
  }, [mode]);

  // Load saved code whenever the selected question changes.
  useEffect(() => {
    if (!selectedQuestion?._id) return;

    const storageKey = `fusion_code_java_${selectedQuestion._id}`;
    const savedCode = localStorage.getItem(storageKey);

    setEditorCode(savedCode || JAVA_STARTER_CODE);
    setRunResult(null);
    setPracticeError("");
  }, [selectedQuestion?._id]);

  function handleEditorChange(value) {
    const code = value ?? "";

    setEditorCode(code);

    if (selectedQuestion?._id) {
      localStorage.setItem(
        `fusion_code_java_${selectedQuestion._id}`,
        code
      );
    }
  }

  function resetEditor() {
    setEditorCode(JAVA_STARTER_CODE);

    if (selectedQuestion?._id) {
      localStorage.removeItem(
        `fusion_code_java_${selectedQuestion._id}`
      );
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
          language: "java",
          questionId: selectedQuestion._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRunResult(response.data);
    } catch (error) {
      setPracticeError(
        getErrorMessage(error, "Code execution failed. Please try again.")
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

    const passed =
      runResult.passed ??
      runResult.testcasesPassed ??
      0;

    const total =
      runResult.total ??
      runResult.totalTestcases ??
      runResult.totalTestCases ??
      0;

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
          language: "java",
          questionId: selectedQuestion._id,
          unit: COURSE_UNIT,
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

  const resultPassed =
    runResult?.passed ??
    runResult?.testcasesPassed ??
    0;

  const resultTotal =
    runResult?.total ??
    runResult?.totalTestcases ??
    runResult?.totalTestCases ??
    0;

  const resultCases =
    runResult?.results ||
    runResult?.testResults ||
    [];

  return (
    <main className="java-module">
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
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <section className="java-hero">
        <div className="java-hero-copy">
          <span className="java-eyebrow">
            <i /> PROGRAMMING LANGUAGE
          </span>

          <h1>
            Learn <span>Java</span>.
          </h1>

          <p>
            Study Java concepts, explore code examples and test your
            understanding with a quiz.
          </p>

          <div className="java-hero-meta">
            <span>10 topics</span>
            <span className="java-meta-dot">•</span>
            <span>Code examples</span>
            <span className="java-meta-dot">•</span>
            <span>Knowledge quiz</span>
          </div>
        </div>

        <div className="java-hero-art">
          <div className="java-art-orbit java-art-orbit-one" />
          <div className="java-art-orbit java-art-orbit-two" />

          <div className="java-code-window">
            <div className="java-code-window-top">
              <div className="java-window-dots">
                <i />
                <i />
                <i />
              </div>
              <span>Main.java</span>
            </div>

            <pre className="java-hero-code">
              <code>
                <span className="java-code-purple">public class</span> Main {"{"}
                {"\n"}  <span className="java-code-purple">public static void</span> main(String[] args) {"{"}
                {"\n"}    System.out.println(
                {"\n"}      <span className="java-code-yellow">"Hello, Java!"</span>
                {"\n"}    );
                {"\n"}  {"}"}
                {"\n"}{"}"}
              </code>
            </pre>

            <div className="java-code-window-bottom">
              <span><i /> JAVA</span>
              <span>MAIN.JAVA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="java-learning-area">
        <div className="java-section-heading">
          <div>
            <span className="java-section-kicker">JAVA COURSE</span>
            <h2>
              Learning modules<span>.</span>
            </h2>
            <p>Select a section to get started.</p>
          </div>

          <button
            className="java-next-btn"
            type="button"
            onClick={() =>
              navigate(`/learn/java/unit/${COURSE_UNIT}/materials`)
            }
          >
            Study Materials →
          </button>
        </div>

        <nav className="java-navigation" aria-label="Java learning sections">
          <button
            type="button"
            className={mode === "learn" ? "active" : ""}
            onClick={() => setMode("learn")}
          >
            <span>01</span> Learn
          </button>

          <button
            type="button"
            className={mode === "examples" ? "active" : ""}
            onClick={() => setMode("examples")}
          >
            <span>02</span> Examples
          </button>

          <button
            type="button"
            className={mode === "quiz" ? "active" : ""}
            onClick={() => setMode("quiz")}
          >
            <span>03</span> Quiz
          </button>

          <button
            type="button"
            className={mode === "practice" ? "active" : ""}
            onClick={() => setMode("practice")}
          >
            <span>04</span> Code Practice
          </button>
        </nav>

        {mode === "learn" && (
          <div className="java-content">
            <aside className="java-topic-list">
              <div className="java-sidebar-heading">
                <span>COURSE CONTENT</span>
                <strong>{topics.length} topics</strong>
              </div>

              {topics.map((topic, index) => (
                <button
                  type="button"
                  key={topic.title}
                  className={
                    activeTopic === index
                      ? "java-topic-button active"
                      : "java-topic-button"
                  }
                  onClick={() => setActiveTopic(index)}
                >
                  <span className="java-topic-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{topic.title}</span>
                  <span className="java-topic-chevron">›</span>
                </button>
              ))}
            </aside>

            <article className="java-lesson">
              <div className="java-lesson-topline">
                <span>JAVA FUNDAMENTALS</span>
                <span>
                  LESSON {String(activeTopic + 1).padStart(2, "0")} / 10
                </span>
              </div>

              <div className="java-lesson-progress">
                <span
                  style={{
                    width: `${((activeTopic + 1) / topics.length) * 100}%`,
                  }}
                />
              </div>

              <span className="java-label">
                LESSON {activeTopic + 1}
              </span>

              <h2>{currentTopic.title}</h2>
              <p className="java-lesson-description">
                {currentTopic.description}
              </p>

              <div className="java-code-section">
                <div className="java-code-heading">
                  <span><i /> CODE EXAMPLE</span>
                  <span>JAVA</span>
                </div>
                <pre><code>{currentTopic.example}</code></pre>
              </div>

              <div className="java-output-section">
                <div className="java-output-heading">
                  <span>EXPECTED OUTPUT</span>
                  <span>OUTPUT</span>
                </div>
                <pre><code>{currentTopic.output}</code></pre>
              </div>

              <div className="java-lesson-buttons">
                <button
                  className="java-previous-btn"
                  type="button"
                  disabled={activeTopic === 0}
                  onClick={() => setActiveTopic((value) => value - 1)}
                >
                  ← Previous topic
                </button>

                <button
                  className="java-next-btn"
                  type="button"
                  disabled={activeTopic === topics.length - 1}
                  onClick={() => setActiveTopic((value) => value + 1)}
                >
                  Next topic →
                </button>
              </div>
            </article>
          </div>
        )}

        {mode === "examples" && (
          <div className="java-examples">
            <div className="java-examples-intro">
              <span className="java-section-kicker">CODE EXAMPLES</span>
              <h2>Java examples</h2>
              <p>Browse the code and expected output for each topic.</p>
            </div>

            {topics.map((topic, index) => (
              <section className="java-example-card" key={topic.title}>
                <div className="java-example-card-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{topic.title}</h3>
                </div>

                <p>{topic.description}</p>

                <div className="java-code-section">
                  <div className="java-code-heading">
                    <span><i /> CODE</span>
                    <span>JAVA</span>
                  </div>
                  <pre><code>{topic.example}</code></pre>
                </div>

                <div className="java-output-section">
                  <div className="java-output-heading">
                    <span>EXPECTED OUTPUT</span>
                    <span>OUTPUT</span>
                  </div>
                  <pre><code>{topic.output}</code></pre>
                </div>
              </section>
            ))}
          </div>
        )}

        {mode === "quiz" && (
          <div className="java-quiz">
            <div className="java-quiz-intro">
              <span className="java-section-kicker">KNOWLEDGE CHECK</span>
              <h2>
                Java quiz<span>.</span>
              </h2>
              <p>Answer all 10 questions to see your result.</p>

              <div className="java-quiz-progress">
                <span>
                  {Object.keys(answers).length} of {questions.length} answered
                </span>
                <div>
                  <i
                    style={{
                      width: `${
                        (Object.keys(answers).length / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {questions.map((question, questionIndex) => (
              <section className="java-question" key={question.question}>
                <div className="java-question-heading">
                  <span>
                    QUESTION {String(questionIndex + 1).padStart(2, "0")}
                  </span>
                  <span>{question.topic}</span>
                </div>

                <h3>{question.question}</h3>

                <div className="java-options">
                  {question.options.map((option, optionIndex) => {
                    let optionClass = "java-option";

                    if (submitted && optionIndex === question.answer) {
                      optionClass += " correct";
                    } else if (
                      submitted &&
                      answers[questionIndex] === optionIndex &&
                      optionIndex !== question.answer
                    ) {
                      optionClass += " incorrect";
                    } else if (answers[questionIndex] === optionIndex) {
                      optionClass += " selected";
                    }

                    return (
                      <label className={optionClass} key={option}>
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={answers[questionIndex] === optionIndex}
                          disabled={submitted}
                          onChange={() =>
                            selectAnswer(questionIndex, optionIndex)
                          }
                        />
                        <span className="java-option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="java-answer-feedback">
                    {answers[questionIndex] === question.answer
                      ? "✓ Correct answer"
                      : `Correct answer: ${question.options[question.answer]}`}
                  </p>
                )}
              </section>
            ))}

            {!submitted ? (
              <button
                className="java-submit"
                type="button"
                onClick={submitQuiz}
              >
                Submit quiz <span>→</span>
              </button>
            ) : (
              <section className="java-results">
                <span className="java-section-kicker">QUIZ RESULT</span>
                <h2>
                  Your result<span>.</span>
                </h2>

                <div className="java-result-score">
                  <strong>
                    {score}
                    <span> / {questions.length}</span>
                  </strong>
                  <span>Correct answers</span>
                </div>

                <div className="java-result-percentage">
                  {Math.round((score / questions.length) * 100)}% score
                </div>

                <h3>Topics to revise</h3>

                {wrongTopics.length > 0 ? (
                  <ul>
                    {wrongTopics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                ) : (
                  <p>All answers are correct.</p>
                )}

                <button
                  className="java-submit"
                  type="button"
                  onClick={tryAgain}
                >
                  Try again <span>↻</span>
                </button>
              </section>
            )}
          </div>
        )}

        {mode === "practice" && (
          <div className="ap-practice-page">
            <div className="ap-practice-heading">
              <div>
                <span className="additional-label">JAVA PROGRAMMING</span>
                <h2>Code Practice</h2>
                <p>
                  Solve questions assigned by your teacher, run your code
                  and submit your solutions.
                </p>
              </div>
              <span className="ap-language-tag">JAVA</span>
            </div>

            {practiceError && (
              <div className="ap-alert">
                {practiceError}
              </div>
            )}

            {loadingQuestions ? (
              <div className="ap-empty-state">
                <h3>Loading Java questions...</h3>
                <p>Please wait while we fetch your practice questions.</p>
              </div>
            ) : practiceQuestions.length === 0 ? (
              <div className="ap-empty-state">
                <h3>No Java questions available yet</h3>
                <p>
                  Your teacher has not added any Java coding questions
                  for this unit yet. Please check again later.
                </p>
              </div>
            ) : (
              <div className="ap-practice-layout">
                <aside className="ap-question-sidebar">
                  <h3>Practice Questions</h3>
                  <p>{practiceQuestions.length} questions available</p>

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
                      <span>{String(index + 1).padStart(2, "0")}</span>
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

                      <h3>{getQuestionTitle(selectedQuestion)}</h3>

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
                        <span>JAVA · Main.java</span>
                      </div>

                      <Editor
                        height="420px"
                        language="java"
                        theme="vs-dark"
                        value={editorCode}
                        onChange={handleEditorChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          automaticLayout: true,
                          wordWrap: "on",
                          tabSize: 4,
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
                            !runResult
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
                                <strong>Test Case {index + 1}</strong>
                                <span className={passed ? "ap-pass" : "ap-fail"}>
                                  {passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>

                              {testcase.input !== undefined && (
                                <p>
                                  <b>Input:</b> {String(testcase.input)}
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
                                  <b>Error:</b> {String(testcase.error)}
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
          </div>
        )}
      </section>

      <footer className="java-footer">
        <span>FUSION <i>•</i> JAVA</span>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Back to dashboard →
        </button>
      </footer>
    </main>
  );
}

export default JavaModule;
