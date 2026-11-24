
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "./teacher-language.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const languageNames = {
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const getToken = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("fusionUser") || "null"
    );

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      user?.token ||
      user?.accessToken ||
      ""
    );
  } catch {
    return "";
  }
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

const courseContent = {
  java: [
    {
      title: "Introduction to Java",
      level: "Beginner",
      description: "Understand Java, its features, JVM and the structure of a Java program.",
      explanation: "Java is a high-level, object-oriented programming language. Java source code is compiled into bytecode, which runs on the Java Virtual Machine (JVM). A Java program commonly begins execution from the main method.",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      outcome: "Write and run your first Java program.",
    },
    {
      title: "Variables and Data Types",
      level: "Beginner",
      description: "Learn how to store values using variables and primitive data types.",
      explanation: "A variable is a named memory location used to store data. Java is statically typed, so every variable must have a declared type. Common primitive types include int, double, char and boolean.",
      code: `public class Main {
    public static void main(String[] args) {
        int age = 20;
        double price = 45.5;
        char grade = 'A';
        boolean passed = true;

        System.out.println(age);
        System.out.println(price);
    }
}`,
      outcome: "Declare variables and use basic Java data types.",
    },
    {
      title: "Conditional Statements",
      level: "Beginner",
      description: "Control program flow using if, else-if and switch statements.",
      explanation: "Conditional statements allow a program to make decisions. The if statement executes a block when a condition is true. The else block executes when the condition is false.",
      code: `public class Main {
    public static void main(String[] args) {
        int number = 10;

        if (number > 0) {
            System.out.println("Positive");
        } else if (number < 0) {
            System.out.println("Negative");
        } else {
            System.out.println("Zero");
        }
    }
}`,
      outcome: "Write programs that make decisions.",
    },
    {
      title: "Loops",
      level: "Beginner",
      description: "Repeat instructions using for, while and do-while loops.",
      explanation: "Loops execute a block of code repeatedly. A for loop is useful when the number of iterations is known. A while loop repeats as long as its condition remains true.",
      code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
      outcome: "Use loops to solve repetitive problems.",
    },
    {
      title: "Arrays and Methods",
      level: "Intermediate",
      description: "Store multiple values and divide programs into reusable methods.",
      explanation: "An array stores multiple values of the same type. A method is a reusable block of code that performs a particular task. Methods make programs easier to organise and maintain.",
      code: `public class Main {
    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};
        System.out.println(add(numbers[0], numbers[1]));
    }
}`,
      outcome: "Use arrays and create reusable methods.",
    },
    {
      title: "Object-Oriented Programming",
      level: "Intermediate",
      description: "Understand classes, objects, constructors and inheritance.",
      explanation: "Object-oriented programming organises software around objects. A class defines properties and methods, while an object is an instance of a class. Inheritance allows one class to reuse features of another class.",
      code: `class Student {
    String name;

    Student(String name) {
        this.name = name;
    }

    void display() {
        System.out.println(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Aman");
        s.display();
    }
}`,
      outcome: "Create classes and objects in Java.",
    },
  ],

  python: [
    {
      title: "Introduction to Python",
      level: "Beginner",
      description: "Understand Python and write your first program.",
      explanation: "Python is a high-level, general-purpose programming language known for readable syntax. Python programs are commonly executed by the Python interpreter.",
      code: `print("Hello, World!")
print("Welcome to Python")`,
      outcome: "Write and execute a basic Python program.",
    },
    {
      title: "Variables and Data Types",
      level: "Beginner",
      description: "Store information using variables and built-in data types.",
      explanation: "Python variables refer to values and do not require explicit type declarations. Common data types include int, float, str and bool.",
      code: `name = "Riya"
age = 20
percentage = 85.5
is_student = True

print(name)
print(age)
print(type(percentage))`,
      outcome: "Create variables and identify their data types.",
    },
    {
      title: "Conditional Statements",
      level: "Beginner",
      description: "Make decisions using if, elif and else.",
      explanation: "Conditional statements execute different instructions depending on whether a condition is true or false. Python uses indentation to define code blocks.",
      code: `number = 12

if number > 0:
    print("Positive")
elif number < 0:
    print("Negative")
else:
    print("Zero")`,
      outcome: "Build programs using conditional logic.",
    },
    {
      title: "Loops",
      level: "Beginner",
      description: "Repeat tasks using for and while loops.",
      explanation: "A for loop iterates over a sequence such as a list or range. A while loop continues executing while its condition is true.",
      code: `for number in range(1, 6):
    print(number)

count = 1
while count <= 3:
    print("Python")
    count += 1`,
      outcome: "Use loops to repeat instructions.",
    },
    {
      title: "Lists, Tuples and Dictionaries",
      level: "Intermediate",
      description: "Work with Python's commonly used collection types.",
      explanation: "Lists are ordered and mutable collections. Tuples are ordered and immutable. Dictionaries store information as key-value pairs.",
      code: `marks = [80, 90, 85]
student = ("Riya", 20)
details = {"name": "Riya", "age": 20}

print(marks[0])
print(student[0])
print(details["name"])`,
      outcome: "Store and access collections of information.",
    },
    {
      title: "Functions and Modules",
      level: "Intermediate",
      description: "Write reusable functions and organise code.",
      explanation: "A function is a reusable block of instructions defined using the def keyword. Functions can accept parameters and return results. Modules allow code to be organised and reused.",
      code: `def add(a, b):
    return a + b

result = add(10, 20)
print(result)`,
      outcome: "Create functions and reuse code.",
    },
  ],

  javascript: [
    {
      title: "Introduction to JavaScript",
      level: "Beginner",
      description: "Understand JavaScript and write your first program.",
      explanation: "JavaScript is a programming language widely used to create interactive web pages. It can run in web browsers and in environments such as Node.js.",
      code: `console.log("Hello, World!");
console.log("Welcome to JavaScript");`,
      outcome: "Write and execute basic JavaScript statements.",
    },
    {
      title: "Variables and Data Types",
      level: "Beginner",
      description: "Declare variables and work with JavaScript data types.",
      explanation: "JavaScript provides let and const for declaring variables. Common data types include string, number, boolean, undefined, null and object.",
      code: `let name = "Riya";
const age = 20;
let percentage = 85.5;
let isStudent = true;

console.log(name);
console.log(age);`,
      outcome: "Declare variables and understand basic data types.",
    },
    {
      title: "Operators and Conditions",
      level: "Beginner",
      description: "Use operators and conditional statements.",
      explanation: "Operators perform arithmetic, comparison and logical operations. Conditional statements such as if, else-if and else allow programs to make decisions.",
      code: `let number = 10;

if (number > 0) {
  console.log("Positive");
} else if (number < 0) {
  console.log("Negative");
} else {
  console.log("Zero");
}`,
      outcome: "Use operators and conditional logic.",
    },
    {
      title: "Loops",
      level: "Beginner",
      description: "Repeat instructions using for and while loops.",
      explanation: "Loops execute a block of code repeatedly. A for loop is useful for controlled repetition, while a while loop repeats as long as its condition is true.",
      code: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}

let count = 1;
while (count <= 3) {
  console.log("JavaScript");
  count++;
}`,
      outcome: "Write programs using loops.",
    },
    {
      title: "Functions and Arrays",
      level: "Intermediate",
      description: "Create reusable functions and work with arrays.",
      explanation: "Functions group reusable instructions. Arrays store ordered collections of values and provide methods such as push, pop and map.",
      code: `function add(a, b) {
  return a + b;
}

const numbers = [10, 20, 30];
numbers.push(40);

console.log(add(5, 3));
console.log(numbers);`,
      outcome: "Use functions and manipulate arrays.",
    },
    {
      title: "Objects and DOM Basics",
      level: "Intermediate",
      description: "Understand objects and how JavaScript interacts with web pages.",
      explanation: "Objects store information as key-value pairs. The Document Object Model (DOM) represents a web page as a tree of objects. JavaScript can use the DOM to read and update page content.",
      code: `const student = {
  name: "Riya",
  age: 20
};

console.log(student.name);

// Browser example:
// document.getElementById("title").textContent = "Hello";`,
      outcome: "Understand objects and basic DOM interaction.",
    },
  ],
};

const emptyTestcase = () => ({
  input: "",
  output: "",
  visible: true,
});

export default function TeacherAdditionalLanguageCoding({
  language: languageProp,
  unit: unitProp,
}) {
  const navigate = useNavigate();
  const params = useParams();

  // Supports both the old language routes and the new unit routes.
  const language = String(
    params.language || languageProp || ""
  ).toLowerCase();

  const requestedUnit = params.unit || unitProp || "1";
  const parsedUnit = Number(requestedUnit);

  const courseUnit =
    Number.isInteger(parsedUnit) && parsedUnit >= 1 && parsedUnit <= 4
      ? String(parsedUnit)
      : "1";

  const languageName = languageNames[language];
  const lessons = courseContent[language] || [];

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLesson, setSelectedLesson] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testcases, setTestcases] = useState([emptyTestcase()]);
  const [steps, setSteps] = useState([]);

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =====================================================
     FETCH QUESTIONS FOR THIS LANGUAGE AND UNIT
  ===================================================== */

  const fetchQuestions = useCallback(async () => {
    if (!languageName) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_URL}/api/coding/teacher/practice`,
        {
          params: {
            language,
            unit: courseUnit,
          },
          headers: getAuthHeaders(),
        }
      );

      setAllQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error loading questions:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load questions. Please check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  }, [language, languageName, courseUnit]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /* =====================================================
     FORM HELPERS
  ===================================================== */

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTestcases([emptyTestcase()]);
    setSteps([]);
  };

  const updateTestcase = (index, field, value) => {
    setTestcases((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateStep = (index, field, value) => {
    setSteps((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addStep = () => {
    setSteps((previous) => [
      ...previous,
      {
        label: "",
        type: "code-contains",
        value: "",
        minPassed: "",
        marks: 1,
      },
    ]);
  };

  /* =====================================================
     CREATE CODING QUESTION
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!getToken()) {
      setErrorMessage(
        "Your login session was not found. Please log in again."
      );
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage(
        "Please enter both the question title and problem statement."
      );
      return;
    }

    if (
      testcases.length === 0 ||
      testcases.some(
        (item) => !item.input.trim() || !item.output.trim()
      )
    ) {
      setErrorMessage(
        "Please complete the input and expected output of every test case."
      );
      return;
    }

    for (const step of steps) {
      if (
        !step.label.trim() ||
        !step.marks ||
        Number(step.marks) <= 0
      ) {
        setErrorMessage(
          "Please complete every evaluation step and enter valid marks."
        );
        return;
      }

      if (
        ["code-contains", "code-regex"].includes(step.type) &&
        !step.value.trim()
      ) {
        setErrorMessage(
          "Enter a value for each code-based evaluation rule."
        );
        return;
      }

      if (
        step.type === "min-testcases-pass" &&
        (!step.minPassed || Number(step.minPassed) < 1)
      ) {
        setErrorMessage(
          "Enter a valid minimum number of passed test cases."
        );
        return;
      }
    }

    try {
      setSaving(true);

      await axios.post(
        `${API_URL}/api/coding/add`,
        {
          title: title.trim(),
          description: description.trim(),
          language,
          unit: courseUnit,

          testcases: testcases.map((item) => ({
            input: item.input,
            expected: item.output,
            visible: item.visible,
          })),

          evaluationSteps: steps.map((step) => ({
            label: step.label,
            type: step.type,

            value:
              step.type === "all-testcases-pass"
                ? ""
                : step.value || "",

            minPassed:
              step.type === "min-testcases-pass"
                ? Number(step.minPassed)
                : undefined,

            marks: Number(step.marks),
          })),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setSuccessMessage(
        `${languageName} Unit ${courseUnit} question was saved successfully.`
      );

      resetForm();
      await fetchQuestions();
      setActiveTab("questions");
    } catch (error) {
      console.error("Add question error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Could not save the question. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE CODING QUESTION
  ===================================================== */

  const deleteQuestion = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this question?")
    ) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.delete(
        `${API_URL}/api/coding/delete/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setSuccessMessage("Question deleted successfully.");
      await fetchQuestions();
    } catch (error) {
      console.error("Delete question error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Could not delete this question."
      );
    }
  };

  if (!languageName) {
    return (
      <div className="tlc-page">
        Unsupported programming language.
      </div>
    );
  }

  const lesson = lessons[selectedLesson];

  return (
    <div className="tlc-page">
      <header className="tlc-header">
        <div className="tlc-header-inner">
          <button
            className="tlc-back"
            type="button"
            onClick={() => {
              if (params.unit) {
                navigate(`/teacher/${language}/unit/${courseUnit}`);
              } else {
                navigate(-1);
              }
            }}
          >
            ← Back
          </button>

          <div className="tlc-brand">
            <span className="tlc-brand-mark">F</span>
            <span>FUSION</span>
          </div>

          <span className="tlc-header-tag">
            TEACHER WORKSPACE
          </span>
        </div>
      </header>

      <main className="tlc-main">
        <section className="tlc-hero">
          <div>
            <span className="tlc-eyebrow">
              PROGRAMMING COURSE · UNIT {courseUnit}
            </span>

            <h1>{languageName}</h1>

            <p>
              Build learning material, organise coding practice and manage
              questions for your students.
            </p>

            <div className="tlc-hero-tags">
              <span>{lessons.length} learning topics</span>
              <span>{allQuestions.length} coding questions</span>
              <span>UNIT {courseUnit}</span>
            </div>
          </div>

          <div className="tlc-hero-symbol" aria-hidden="true">
            {language === "javascript"
              ? "JS"
              : language === "python"
              ? "Py"
              : "J"}
          </div>
        </section>

        <nav className="tlc-tabs" aria-label="Course sections">
          {[
            ["overview", "Overview"],
            ["lessons", "Learning content"],
            ["questions", "Coding questions"],
            ["create", "Create question"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {label}

              {tab === "questions" && (
                <span className="tlc-tab-count">
                  {allQuestions.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {(errorMessage || successMessage) && (
          <div
            className={`tlc-alert ${
              errorMessage ? "error" : "success"
            }`}
          >
            {errorMessage || successMessage}

            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* OVERVIEW */}

        {activeTab === "overview" && (
          <section className="tlc-section">
            <div className="tlc-section-title">
              <div>
                <span className="tlc-eyebrow">
                  UNIT {courseUnit} OVERVIEW
                </span>

                <h2>
                  Manage your {languageName} Unit {courseUnit}
                </h2>

                <p>
                  Use the sections below to prepare lessons and coding
                  activities for your students.
                </p>
              </div>
            </div>

            <div className="tlc-stat-grid">
              <article className="tlc-stat-card">
                <span className="tlc-stat-icon">▤</span>
                <strong>{lessons.length}</strong>
                <span>Prepared learning topics</span>
              </article>

              <article className="tlc-stat-card">
                <span className="tlc-stat-icon">⌘</span>
                <strong>{allQuestions.length}</strong>
                <span>Saved coding questions</span>
              </article>

              <article className="tlc-stat-card">
                <span className="tlc-stat-icon">✓</span>
                <strong>Practice</strong>
                <span>Test-case based assessment</span>
              </article>
            </div>

            <div className="tlc-overview-grid">
              <article className="tlc-feature-card">
                <div className="tlc-feature-icon">▥</div>
                <h3>Learning content</h3>

                <p>
                  Browse structured topics, explanations, example programs
                  and learning outcomes.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("lessons")}
                >
                  Open learning content →
                </button>
              </article>

              <article className="tlc-feature-card">
                <div className="tlc-feature-icon">⌘</div>
                <h3>Coding questions</h3>

                <p>
                  View the questions already created for students and manage
                  the practice collection for this unit.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("questions")}
                >
                  Manage questions →
                </button>
              </article>

              <article className="tlc-feature-card">
                <div className="tlc-feature-icon">＋</div>
                <h3>Create an assessment</h3>

                <p>
                  Add a programming problem, define expected outputs and
                  configure evaluation rules.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("create")}
                >
                  Create question →
                </button>
              </article>
            </div>

            <div className="tlc-topic-preview">
              <div className="tlc-section-title">
                <div>
                  <span className="tlc-eyebrow">
                    COURSE SYLLABUS
                  </span>
                  <h2>Learning topics</h2>
                </div>

                <button
                  className="tlc-text-button"
                  type="button"
                  onClick={() => setActiveTab("lessons")}
                >
                  View all topics →
                </button>
              </div>

              <div className="tlc-topic-list">
                {lessons.slice(0, 4).map((item, index) => (
                  <button
                    type="button"
                    className="tlc-topic-row"
                    key={item.title}
                    onClick={() => {
                      setSelectedLesson(index);
                      setActiveTab("lessons");
                    }}
                  >
                    <span className="tlc-topic-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="tlc-topic-name">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>

                    <span className="tlc-level">
                      {item.level}
                    </span>

                    <span className="tlc-topic-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LEARNING CONTENT */}

        {activeTab === "lessons" && (
          <section className="tlc-section">
            <div className="tlc-section-title">
              <div>
                <span className="tlc-eyebrow">
                  LEARNING MATERIAL
                </span>

                <h2>{languageName} learning modules</h2>

                <p>
                  Select a topic to view its explanation, example program
                  and learning outcome.
                </p>
              </div>
            </div>

            <div className="tlc-learning-layout">
              <aside className="tlc-lesson-sidebar">
                <h3>Course topics</h3>

                {lessons.map((item, index) => (
                  <button
                    type="button"
                    key={item.title}
                    className={
                      selectedLesson === index ? "selected" : ""
                    }
                    onClick={() => setSelectedLesson(index)}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {item.title}
                  </button>
                ))}
              </aside>

              {lesson && (
                <article className="tlc-lesson-content">
                  <div className="tlc-lesson-top">
                    <span className="tlc-level">
                      {lesson.level}
                    </span>

                    <span className="tlc-lesson-number">
                      TOPIC {String(selectedLesson + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2>{lesson.title}</h2>

                  <p className="tlc-lesson-description">
                    {lesson.description}
                  </p>

                  <div className="tlc-explanation">
                    <h3>Concept explanation</h3>
                    <p>{lesson.explanation}</p>
                  </div>

                  <div className="tlc-example">
                    <div className="tlc-example-header">
                      <h3>Example program</h3>
                      <span>{languageName}</span>
                    </div>

                    <pre>
                      <code>{lesson.code}</code>
                    </pre>
                  </div>

                  <div className="tlc-outcome">
                    <span>LEARNING OUTCOME</span>
                    <p>{lesson.outcome}</p>
                  </div>

                  <div className="tlc-lesson-navigation">
                    <button
                      type="button"
                      disabled={selectedLesson === 0}
                      onClick={() =>
                        setSelectedLesson((value) => value - 1)
                      }
                    >
                      ← Previous topic
                    </button>

                    <button
                      type="button"
                      disabled={selectedLesson === lessons.length - 1}
                      onClick={() =>
                        setSelectedLesson((value) => value + 1)
                      }
                    >
                      Next topic →
                    </button>
                  </div>
                </article>
              )}
            </div>
          </section>
        )}

        {/* CODING QUESTIONS */}

        {activeTab === "questions" && (
          <section className="tlc-section">
            <div className="tlc-section-title tlc-question-heading">
              <div>
                <span className="tlc-eyebrow">
                  PRACTICE MANAGEMENT · UNIT {courseUnit}
                </span>

                <h2>{languageName} coding questions</h2>

                <p>
                  Review and manage the programming questions available
                  in this unit.
                </p>
              </div>

              <button
                type="button"
                className="tlc-main-button"
                onClick={() => setActiveTab("create")}
              >
                + Create question
              </button>
            </div>

            {loading ? (
              <div className="tlc-empty">
                Loading coding questions...
              </div>
            ) : allQuestions.length === 0 ? (
              <div className="tlc-empty">
                <div className="tlc-empty-icon">⌘</div>

                <h3>No questions added yet</h3>

                <p>
                  Start building your {languageName} Unit {courseUnit}
                  practice collection by creating the first coding question.
                </p>

                <button
                  type="button"
                  className="tlc-main-button"
                  onClick={() => setActiveTab("create")}
                >
                  Create first question
                </button>
              </div>
            ) : (
              <div className="tlc-question-list">
                {allQuestions.map((question, index) => (
                  <article
                    className="tlc-question-card"
                    key={question._id}
                  >
                    <div className="tlc-question-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="tlc-question-info">
                      <h3>{question.title}</h3>
                      <p>{question.description}</p>

                      <div className="tlc-question-tags">
                        <span>
                          {question.testcases?.length || 0} test cases
                        </span>

                        <span>
                          {question.evaluationSteps?.length || 0} evaluation rules
                        </span>

                        <span>
                          Unit {question.unit || courseUnit}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="tlc-delete-button"
                      onClick={() => deleteQuestion(question._id)}
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}

            <button
              type="button"
              className="tlc-refresh-button"
              onClick={fetchQuestions}
              disabled={loading}
            >
              ↻ Refresh questions
            </button>
          </section>
        )}

        {/* CREATE QUESTION */}

        {activeTab === "create" && (
          <section className="tlc-section">
            <div className="tlc-section-title">
              <div>
                <span className="tlc-eyebrow">
                  ASSESSMENT BUILDER · UNIT {courseUnit}
                </span>

                <h2>Create a {languageName} question</h2>

                <p>
                  Write the problem, add test cases and configure optional
                  evaluation rules.
                </p>
              </div>
            </div>

            <form className="tlc-form" onSubmit={handleSubmit}>
              <div className="tlc-form-heading">
                <span>01</span>

                <div>
                  <h3>Question details</h3>
                  <p>Provide the instructions students will receive.</p>
                </div>
              </div>

              <label htmlFor="tlc-title">
                Question title
              </label>

              <input
                id="tlc-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Find the sum of two numbers"
                required
              />

              <label htmlFor="tlc-description">
                Problem statement
              </label>

              <textarea
                id="tlc-description"
                rows="5"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the problem clearly. Include the task students need to perform."
                required
              />

              <div className="tlc-form-divider"></div>

              <div className="tlc-form-heading">
                <span>02</span>

                <div>
                  <h3>Test cases</h3>
                  <p>
                    Specify sample inputs and their expected outputs.
                  </p>
                </div>
              </div>

              {testcases.map((item, index) => (
                <div className="tlc-testcase-card" key={index}>
                  <div className="tlc-testcase-header">
                    <h4>Test case {index + 1}</h4>

                    {testcases.length > 1 && (
                      <button
                        type="button"
                        className="tlc-remove-link"
                        onClick={() =>
                          setTestcases((previous) =>
                            previous.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="tlc-input-grid">
                    <div>
                      <label htmlFor={`tlc-input-${index}`}>
                        Input
                      </label>

                      <textarea
                        id={`tlc-input-${index}`}
                        rows="3"
                        value={item.input}
                        onChange={(event) =>
                          updateTestcase(index, "input", event.target.value)
                        }
                        placeholder="Enter test input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`tlc-output-${index}`}>
                        Expected output
                      </label>

                      <textarea
                        id={`tlc-output-${index}`}
                        rows="3"
                        value={item.output}
                        onChange={(event) =>
                          updateTestcase(index, "output", event.target.value)
                        }
                        placeholder="Enter expected output"
                        required
                      />
                    </div>
                  </div>

                  <label className="tlc-checkbox">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) =>
                        updateTestcase(
                          index,
                          "visible",
                          event.target.checked
                        )
                      }
                    />

                    Show this test case to students
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="tlc-add-button"
                onClick={() =>
                  setTestcases((previous) => [
                    ...previous,
                    emptyTestcase(),
                  ])
                }
              >
                + Add test case
              </button>

              <div className="tlc-form-divider"></div>

              <div className="tlc-form-heading">
                <span>03</span>

                <div>
                  <h3>Evaluation rules</h3>
                  <p>
                    Optional rules for checking specific parts of a solution.
                  </p>
                </div>
              </div>

              {steps.map((step, index) => (
                <div className="tlc-testcase-card" key={index}>
                  <div className="tlc-testcase-header">
                    <h4>Evaluation rule {index + 1}</h4>

                    <button
                      type="button"
                      className="tlc-remove-link"
                      onClick={() =>
                        setSteps((previous) =>
                          previous.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <label htmlFor={`tlc-step-label-${index}`}>
                    Rule name
                  </label>

                  <input
                    id={`tlc-step-label-${index}`}
                    value={step.label}
                    onChange={(event) =>
                      updateStep(index, "label", event.target.value)
                    }
                    placeholder="Example: Uses a loop"
                  />

                  <label htmlFor={`tlc-step-type-${index}`}>
                    Rule type
                  </label>

                  <select
                    id={`tlc-step-type-${index}`}
                    value={step.type}
                    onChange={(event) =>
                      updateStep(index, "type", event.target.value)
                    }
                  >
                    <option value="code-contains">
                      Code contains text
                    </option>

                    <option value="code-regex">
                      Code matches regular expression
                    </option>

                    <option value="all-testcases-pass">
                      All test cases pass
                    </option>

                    <option value="min-testcases-pass">
                      Minimum test cases passed
                    </option>
                  </select>

                  {["code-contains", "code-regex"].includes(step.type) && (
                    <>
                      <label htmlFor={`tlc-step-value-${index}`}>
                        Required value
                      </label>

                      <input
                        id={`tlc-step-value-${index}`}
                        value={step.value}
                        onChange={(event) =>
                          updateStep(index, "value", event.target.value)
                        }
                        placeholder="Enter required text or pattern"
                      />
                    </>
                  )}

                  {step.type === "min-testcases-pass" && (
                    <>
                      <label htmlFor={`tlc-step-min-${index}`}>
                        Minimum test cases to pass
                      </label>

                      <input
                        id={`tlc-step-min-${index}`}
                        type="number"
                        min="1"
                        value={step.minPassed}
                        onChange={(event) =>
                          updateStep(index, "minPassed", event.target.value)
                        }
                        placeholder="Example: 2"
                      />
                    </>
                  )}

                  <label htmlFor={`tlc-step-marks-${index}`}>
                    Marks
                  </label>

                  <input
                    id={`tlc-step-marks-${index}`}
                    type="number"
                    min="1"
                    value={step.marks}
                    onChange={(event) =>
                      updateStep(index, "marks", event.target.value)
                    }
                  />
                </div>
              ))}

              <button
                type="button"
                className="tlc-add-button"
                onClick={addStep}
              >
                + Add evaluation rule
              </button>

              <div className="tlc-submit-area">
                <p>
                  This question will be saved for {languageName} Unit{" "}
                  {courseUnit}.
                </p>

                <button
                  type="submit"
                  className="tlc-main-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving question..."
                    : `Save ${languageName} question`}
                </button>
              </div>
            </form>
          </section>
        )}

        <footer className="tlc-footer">
          <span>FUSION · Learning through practice</span>
          <span>
            {languageName} · Unit {courseUnit} Teacher Workspace
          </span>
        </footer>
      </main>
    </div>
  );
}
