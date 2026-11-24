
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/additionalLanguages.css";
import "../styles/additionalCodePractice.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const courseContent = {
  python: {
    name: "Python",
    icon: "🐍",
    description: "Build your programming foundation with Python, from basic syntax to practical programming concepts.",
    units: [
      {
        title: "Python Fundamentals",
        description: "Understand Python syntax, variables, data types and operators.",
        topics: [
          {
            title: "Introduction to Python",
            description: "Python is a high-level, interpreted programming language. It is popular because its syntax is readable and concise. Python programs are commonly saved with the .py extension.",
            code: `print("Hello, Python!")`,
            output: "Hello, Python!"
          },
          {
            title: "Variables and Data Types",
            description: "Variables store data values. Python automatically determines the type of a value. Common types include int, float, str and bool.",
            code: `name = "Aman"
age = 20
marks = 85.5
is_student = True

print(name)
print(age)
print(type(marks))`,
            output: `Aman
20
<class 'float'>`
          },
          {
            title: "Input and Type Conversion",
            description: "The input() function accepts user input as a string. Convert it using int(), float() or str() when another data type is required.",
            code: `age = int(input("Enter age: "))
print("Next year:", age + 1)`,
            output: `Enter age: 20
Next year: 21`
          },
          {
            title: "Operators",
            description: "Operators perform calculations and comparisons. Python supports arithmetic, assignment, comparison and logical operators.",
            code: `a = 10
b = 3

print(a + b)
print(a // b)
print(a > b)
print(a > 5 and b < 5)`,
            output: `13
3
True
True`
          }
        ],
        quiz: [
          {
            question: "Which function displays output in Python?",
            options: ["display()", "print()", "echo()", "show()"],
            answer: 1
          },
          {
            question: "Which data type stores a decimal number?",
            options: ["int", "str", "float", "bool"],
            answer: 2
          },
          {
            question: "What does input() return by default?",
            options: ["Integer", "String", "Boolean", "Float"],
            answer: 1
          },
          {
            question: "What is the result of 10 // 3?",
            options: ["3.33", "1", "3", "4"],
            answer: 2
          }
        ]
      },
      {
        title: "Decision Making and Loops",
        description: "Control program execution using conditions and repetition.",
        topics: [
          {
            title: "Conditional Statements",
            description: "if, elif and else allow a program to make decisions. Indentation defines the blocks of code that belong to each condition.",
            code: `marks = 72

if marks >= 80:
    print("Excellent")
elif marks >= 40:
    print("Pass")
else:
    print("Fail")`,
            output: "Pass"
          },
          {
            title: "For Loop",
            description: "A for loop iterates over a sequence. The range() function generates a sequence of numbers useful for repetition.",
            code: `for number in range(1, 6):
    print(number)`,
            output: `1
2
3
4
5`
          },
          {
            title: "While Loop",
            description: "A while loop repeats as long as its condition remains true. Update the loop variable carefully to avoid an infinite loop.",
            code: `count = 1

while count <= 3:
    print(count)
    count += 1`,
            output: `1
2
3`
          },
          {
            title: "Break and Continue",
            description: "break terminates a loop. continue skips the remaining statements in the current iteration and moves to the next one.",
            code: `for number in range(1, 6):
    if number == 3:
        continue
    print(number)`,
            output: `1
2
4
5`
          }
        ],
        quiz: [
          {
            question: "Which keyword checks another condition after if?",
            options: ["else if", "elif", "otherwise", "check"],
            answer: 1
          },
          {
            question: "What does range(1, 5) generate?",
            options: ["1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "2, 3, 4, 5"],
            answer: 0
          },
          {
            question: "Which statement immediately exits a loop?",
            options: ["continue", "skip", "break", "pass"],
            answer: 2
          },
          {
            question: "Which loop is commonly used while a condition is true?",
            options: ["for", "while", "if", "switch"],
            answer: 1
          }
        ]
      },
      {
        title: "Functions and Data Structures",
        description: "Organise code into functions and work with collections of data.",
        topics: [
          {
            title: "Functions",
            description: "Functions are reusable blocks of code. Define them with def and call them by using their name followed by parentheses.",
            code: `def greet(name):
    print("Welcome", name)

greet("Aman")`,
            output: "Welcome Aman"
          },
          {
            title: "Lists and Tuples",
            description: "Lists are ordered and mutable collections. Tuples are ordered but cannot be modified after creation.",
            code: `numbers = [10, 20, 30]
numbers.append(40)

values = (1, 2, 3)

print(numbers)
print(values[0])`,
            output: `[10, 20, 30, 40]
1`
          },
          {
            title: "Sets and Dictionaries",
            description: "A set stores unique elements. A dictionary stores information as key-value pairs and allows values to be accessed using their keys.",
            code: `colors = {"red", "blue", "red"}
student = {"name": "Aman", "age": 20}

print(len(colors))
print(student["name"])`,
            output: `2
Aman`
          },
          {
            title: "Strings",
            description: "Strings are sequences of characters. Python provides methods such as upper(), lower(), strip() and replace() to process text.",
            code: `message = "hello python"

print(message.upper())
print(message.replace("python", "world"))`,
            output: `HELLO PYTHON
hello world`
          }
        ],
        quiz: [
          {
            question: "Which keyword defines a function?",
            options: ["function", "define", "def", "fun"],
            answer: 2
          },
          {
            question: "Which collection is immutable?",
            options: ["List", "Tuple", "Dictionary", "Set"],
            answer: 1
          },
          {
            question: "Which data structure stores key-value pairs?",
            options: ["List", "Tuple", "Dictionary", "String"],
            answer: 2
          },
          {
            question: "Which method converts a string to uppercase?",
            options: ["upper()", "capital()", "uppercase()", "up()"],
            answer: 0
          }
        ]
      },
      {
        title: "Object-Oriented and Practical Python",
        description: "Learn object-oriented programming, error handling, files and useful modules.",
        topics: [
          {
            title: "Classes and Objects",
            description: "A class is a blueprint for creating objects. Objects contain data and can use methods defined in their class.",
            code: `class Student:
    def __init__(self, name):
        self.name = name

    def display(self):
        print(self.name)

student = Student("Aman")
student.display()`,
            output: "Aman"
          },
          {
            title: "Inheritance",
            description: "Inheritance allows a child class to reuse and extend the functionality of a parent class.",
            code: `class Animal:
    def speak(self):
        print("Animal sound")

class Dog(Animal):
    pass

dog = Dog()
dog.speak()`,
            output: "Animal sound"
          },
          {
            title: "Exception Handling",
            description: "try and except help handle runtime errors. finally can be used for code that should execute whether an exception occurs or not.",
            code: `try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
finally:
    print("Finished")`,
            output: `Cannot divide by zero
Finished`
          },
          {
            title: "File Handling and Modules",
            description: "Python can read and write files. Modules let you reuse code and access built-in functionality such as mathematical operations.",
            code: `import math

print(math.sqrt(25))
print(math.factorial(5))`,
            output: `5.0
120`
          }
        ],
        quiz: [
          {
            question: "Which method is commonly used as a class constructor?",
            options: ["__start__", "__init__", "__create__", "__main__"],
            answer: 1
          },
          {
            question: "Which concept allows a class to reuse another class?",
            options: ["Encapsulation", "Iteration", "Inheritance", "Compilation"],
            answer: 2
          },
          {
            question: "Which block handles an exception?",
            options: ["try", "except", "for", "define"],
            answer: 1
          },
          {
            question: "Which keyword imports a module?",
            options: ["include", "using", "import", "require"],
            answer: 2
          }
        ]
      }
    ]
  },

  javascript: {
    name: "JavaScript",
    icon: "🟨",
    description: "Learn JavaScript and build interactive, dynamic web applications.",
    units: [
      {
        title: "JavaScript Fundamentals",
        description: "Understand JavaScript syntax, variables, data types and operators.",
        topics: [
          {
            title: "Introduction to JavaScript",
            description: "JavaScript is a programming language used to add behaviour and interactivity to websites. It can run in browsers and environments such as Node.js.",
            code: `console.log("Hello, JavaScript!");`,
            output: "Hello, JavaScript!"
          },
          {
            title: "Variables: let, const and var",
            description: "Variables store values. let allows reassignment, const prevents reassignment and var is the older declaration keyword.",
            code: `let name = "Aman";
const age = 20;
var city = "Delhi";

console.log(name);
console.log(age);
console.log(city);`,
            output: `Aman
20
Delhi`
          },
          {
            title: "Data Types",
            description: "JavaScript supports strings, numbers, booleans, undefined, null, objects and other data types. typeof can be used to inspect a value's type.",
            code: `let name = "Aman";
let marks = 85;
let passed = true;

console.log(typeof name);
console.log(typeof marks);
console.log(typeof passed);`,
            output: `string
number
boolean`
          },
          {
            title: "Operators",
            description: "Operators perform arithmetic, comparisons and logical operations. Strict equality (===) checks both value and type.",
            code: `let a = 10;
let b = 5;

console.log(a + b);
console.log(a > b);
console.log(10 === "10");`,
            output: `15
true
false`
          }
        ],
        quiz: [
          {
            question: "Which keyword declares a variable that cannot be reassigned?",
            options: ["var", "let", "const", "static"],
            answer: 2
          },
          {
            question: "Which command prints a message to the console?",
            options: ["print()", "console.log()", "echo()", "display()"],
            answer: 1
          },
          {
            question: "Which operator checks strict equality?",
            options: ["=", "==", "===", "!="],
            answer: 2
          },
          {
            question: "What is the result of typeof 25?",
            options: ["integer", "float", "number", "string"],
            answer: 2
          }
        ]
      },
      {
        title: "Conditions and Loops",
        description: "Control the flow of JavaScript programs using decisions and repetition.",
        topics: [
          {
            title: "Conditional Statements",
            description: "if, else if and else execute different blocks depending on conditions.",
            code: `let marks = 75;

if (marks >= 80) {
    console.log("Excellent");
} else if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}`,
            output: "Pass"
          },
          {
            title: "Switch Statement",
            description: "The switch statement selects a block based on the value of an expression. break prevents execution from falling through to the next case.",
            code: `let day = 2;

switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    default:
        console.log("Other day");
}`,
            output: "Tuesday"
          },
          {
            title: "For and While Loops",
            description: "for and while loops repeat statements. Use for when the repetition structure is known and while when repetition depends on a condition.",
            code: `for (let i = 1; i <= 3; i++) {
    console.log(i);
}

let count = 1;
while (count <= 2) {
    console.log("Hi");
    count++;
}`,
            output: `1
2
3
Hi
Hi`
          },
          {
            title: "Break and Continue",
            description: "break exits a loop, while continue skips the current iteration and moves to the next one.",
            code: `for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue;
    }
    console.log(i);
}`,
            output: `1
2
4
5`
          }
        ],
        quiz: [
          {
            question: "Which keyword provides an alternative condition?",
            options: ["otherwise", "elif", "else if", "next"],
            answer: 2
          },
          {
            question: "Which statement is used to select among multiple cases?",
            options: ["switch", "repeat", "choose", "select"],
            answer: 0
          },
          {
            question: "Which statement exits a loop?",
            options: ["continue", "break", "skip", "return"],
            answer: 1
          },
          {
            question: "How many times does for(let i=0; i<3; i++) run?",
            options: ["2", "3", "4", "Infinite"],
            answer: 1
          }
        ]
      },
      {
        title: "Functions, Arrays and Objects",
        description: "Create reusable functions and organise related information.",
        topics: [
          {
            title: "Functions",
            description: "Functions group reusable statements. They can accept parameters and return values.",
            code: `function add(a, b) {
    return a + b;
}

console.log(add(10, 5));`,
            output: "15"
          },
          {
            title: "Arrow Functions",
            description: "Arrow functions provide a shorter syntax for writing function expressions.",
            code: `const greet = (name) => {
    return "Welcome " + name;
};

console.log(greet("Aman"));`,
            output: "Welcome Aman"
          },
          {
            title: "Arrays and Array Methods",
            description: "Arrays store ordered collections. Common methods include push(), pop(), map() and filter().",
            code: `const numbers = [1, 2, 3];

numbers.push(4);

const doubled = numbers.map(n => n * 2);

console.log(doubled);`,
            output: `[2, 4, 6, 8]`
          },
          {
            title: "Objects",
            description: "Objects store related information as key-value pairs. Properties can be accessed using dot notation or bracket notation.",
            code: `const student = {
    name: "Aman",
    age: 20
};

console.log(student.name);
console.log(student["age"]);`,
            output: `Aman
20`
          }
        ],
        quiz: [
          {
            question: "Which keyword sends a value back from a function?",
            options: ["break", "return", "output", "send"],
            answer: 1
          },
          {
            question: "Which syntax is used for an arrow function?",
            options: ["->", "=>", "::", "==>"],
            answer: 1
          },
          {
            question: "Which array method adds an item to the end?",
            options: ["pop()", "shift()", "push()", "slice()"],
            answer: 2
          },
          {
            question: "How can an object property be accessed?",
            options: ["student.name", "student->name", "student:name", "student/name"],
            answer: 0
          }
        ]
      },
      {
        title: "Modern JavaScript and Web Development",
        description: "Explore DOM interaction, events, asynchronous programming and modern JavaScript features.",
        topics: [
          {
            title: "DOM Manipulation",
            description: "The Document Object Model represents an HTML page as objects. JavaScript can select and update elements using DOM methods.",
            code: `// Example HTML: <p id="message">Hello</p>

const element = document.getElementById("message");
element.textContent = "Welcome to Fusion";`,
            output: "The paragraph text changes to: Welcome to Fusion"
          },
          {
            title: "Events",
            description: "Events represent user actions such as clicks and keyboard input. Event listeners allow JavaScript to respond to these actions.",
            code: `// Example HTML: <button id="btn">Click</button>

const button = document.getElementById("btn");

button.addEventListener("click", () => {
    console.log("Button clicked");
});`,
            output: "Button clicked (when the button is clicked)"
          },
          {
            title: "Promises and Async/Await",
            description: "Promises represent the eventual completion or failure of an asynchronous operation. async and await make asynchronous code easier to read.",
            code: `async function getMessage() {
    return "Data received";
}

getMessage().then(message => {
    console.log(message);
});`,
            output: "Data received"
          },
          {
            title: "Modern JavaScript Features",
            description: "Template literals make string formatting easier. Destructuring extracts values from arrays or objects into variables.",
            code: `const name = "Aman";
const marks = 90;

console.log(\`Student: \${name}, Marks: \${marks}\`);

const [a, b] = [10, 20];
console.log(a + b);`,
            output: `Student: Aman, Marks: 90
30`
          }
        ],
        quiz: [
          {
            question: "Which method selects an element using its ID?",
            options: ["getElementById()", "queryById()", "selectId()", "getId()"],
            answer: 0
          },
          {
            question: "Which method attaches an event handler?",
            options: ["addEventListener()", "addEvent()", "attachClick()", "onEvent()"],
            answer: 0
          },
          {
            question: "Which keyword is used to declare an asynchronous function?",
            options: ["await", "promise", "async", "then"],
            answer: 2
          },
          {
            question: "Which symbols are used for template literals?",
            options: ['" "', "' '", "` `", "( )"],
            answer: 2
          }
        ]
      }
    ]
  }
};

const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("fusionUser") || "{}");
  } catch {
    return {};
  }
};

const getToken = () => {
  const userData = getUserData();

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken") ||
    userData.token ||
    userData.accessToken ||
    ""
  );
};

const getQuestionTitle = (question) =>
  question?.title ||
  question?.questionTitle ||
  question?.name ||
  "Untitled question";

const getQuestionDescription = (question) =>
  question?.description ||
  question?.question ||
  question?.problemStatement ||
  "";

const getStarterCode = (language) => {
  if (language === "python") {
    return `# Write your code here
print("Hello Python")`;
  }

  return `// Write your code here
console.log("Hello JavaScript");`;
};

export default function AdditionalLanguageLearning() {
  const { language } = useParams();
  const navigate = useNavigate();
  const data = courseContent[language];

  const [activeTab, setActiveTab] = useState("learn");
  const [activeUnit, setActiveUnit] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const [practiceUnit, setPracticeUnit] = useState("1");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editorCode, setEditorCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [practiceError, setPracticeError] = useState("");

  const token = getToken();

  // Reset the learning and practice state when the selected language changes.
  useEffect(() => {
    setActiveTab("learn");
    setActiveUnit(0);
    setActiveTopic(0);
    setAnswers({});
    setSubmittedQuiz(false);
    setPracticeUnit("1");
    setQuestions([]);
    setSelectedQuestion(null);
    setRunResult(null);
    setPracticeError("");
    setEditorCode(data ? getStarterCode(language) : "");
  }, [language, data]);

  // Fetch coding questions for the selected language and unit.
  useEffect(() => {
    if (activeTab !== "practice" || !data) return;

    let isActive = true;

    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      setPracticeError("");
      setQuestions([]);
      setSelectedQuestion(null);
      setRunResult(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/coding/practice`,
          {
            params: {
              language,
              unit: practiceUnit
            },
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {}
          }
        );

        if (!isActive) return;

        const received = response.data?.questions || [];
        setQuestions(received);

        if (received.length > 0) {
          setSelectedQuestion(received[0]);
        } else {
          setPracticeError(
            `No ${data.name} coding questions are available for Unit ${practiceUnit} yet. Ask your teacher to add questions for this unit.`
          );
        }
      } catch (error) {
        if (!isActive) return;

        setPracticeError(
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.response?.data?.error ||
          "Unable to load coding questions. Check that the Fusion backend is running."
        );
      } finally {
        if (isActive) setLoadingQuestions(false);
      }
    };

    fetchQuestions();

    return () => {
      isActive = false;
    };
  }, [activeTab, language, practiceUnit, token, data]);

  // Restore saved code whenever the selected question changes.
  useEffect(() => {
    if (!selectedQuestion) {
      setEditorCode(getStarterCode(language));
      setRunResult(null);
      return;
    }

    const savedKey = `fusion_code_${language}_${selectedQuestion._id}`;
    const savedCode = localStorage.getItem(savedKey);

    setEditorCode(savedCode || getStarterCode(language));
    setRunResult(null);
  }, [selectedQuestion, language]);

  // Save the student's editor contents locally.
  useEffect(() => {
    if (!selectedQuestion) return;

    const savedKey = `fusion_code_${language}_${selectedQuestion._id}`;
    localStorage.setItem(savedKey, editorCode);
  }, [editorCode, selectedQuestion, language]);

  if (!data) {
    return (
      <div className="additional-page">
        <h2>Language not found</h2>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const unit = data.units[activeUnit];
  const currentTopic = unit.topics[activeTopic];
  const quizScore = unit.quiz.filter(
    (question, index) => answers[index] === question.answer
  ).length;

  const allTopics = data.units.flatMap((item, unitIndex) =>
    item.topics.map((topic, topicIndex) => ({
      ...topic,
      unitIndex,
      topicIndex,
      unitTitle: item.title
    }))
  );

  const changeTab = (tab) => {
    setActiveTab(tab);

    if (tab === "quiz") {
      setAnswers({});
      setSubmittedQuiz(false);
    }
  };

  const selectUnit = (index) => {
    setActiveUnit(index);
    setActiveTopic(0);
  };

  const goToTopic = (unitIndex, topicIndex) => {
    setActiveUnit(unitIndex);
    setActiveTopic(topicIndex);
  };

  const moveTopic = (direction) => {
    const nextTopic = activeTopic + direction;

    if (nextTopic >= 0 && nextTopic < unit.topics.length) {
      setActiveTopic(nextTopic);
      return;
    }

    const nextUnit = activeUnit + direction;

    if (nextUnit >= 0 && nextUnit < data.units.length) {
      setActiveUnit(nextUnit);
      setActiveTopic(
        direction > 0 ? 0 : data.units[nextUnit].topics.length - 1
      );
    }
  };

  const runCode = async () => {
    if (!selectedQuestion) {
      setPracticeError("Select a coding question first.");
      return;
    }

    setRunning(true);
    setRunResult(null);
    setPracticeError("");

    try {
      if (!token) {
        setPracticeError("Please log in again.");
        setRunning(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/coding/run`,
        {
          code: editorCode,
          language,
          questionId: selectedQuestion._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRunResult(response.data);
    } catch (error) {
      setRunResult({
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.response?.data?.error ||
          error.message ||
          "Code execution failed."
      });
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    if (!selectedQuestion || !runResult) return;

    const passed = Number(runResult.testcasesPassed ?? 0);
    const total = Number(runResult.totalTestcases ?? 0);

    if (!runResult.success || total === 0 || passed !== total) {
      setPracticeError(
        "Run your code and pass all test cases before submitting."
      );
      return;
    }

    if (!token) {
      setPracticeError("Please log in again before submitting.");
      return;
    }

    setSubmitting(true);
    setPracticeError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/coding/submit`,
        {
          code: editorCode,
          language,
          questionId: selectedQuestion._id,
          unit: practiceUnit
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          "Submission ID was not returned."
        );
      }
    } catch (error) {
      setPracticeError(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Unable to submit your solution."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderRunResults = () => {
    if (!runResult) return null;

    const results = runResult.results || runResult.testResults || [];

    return (
      <div className="ap-result-panel">
        <div className="ap-result-heading">
          <strong>Execution Results</strong>
          <span>
            {runResult.testcasesPassed ?? 0} /{" "}
            {runResult.totalTestcases ?? 0} test cases passed
          </span>
        </div>

        {runResult.message && (
          <p className="ap-result-message">{runResult.message}</p>
        )}

        {runResult.output && (
          <pre className="ap-output">{runResult.output}</pre>
        )}

        {runResult.error && (
          <pre className="ap-error">{runResult.error}</pre>
        )}

        {results.map((item, index) => (
          <div className="ap-testcase" key={index}>
            <div>
              <strong>Test Case {index + 1}</strong>
              <span
                className={
                  item.status === "Passed" ? "ap-pass" : "ap-fail"
                }
              >
                {item.status || "Failed"}
              </span>
            </div>

            {item.input !== undefined && (
              <p><b>Input:</b> {String(item.input)}</p>
            )}

            {item.expected !== undefined && (
              <p><b>Expected:</b> {String(item.expected)}</p>
            )}

            {item.got !== undefined && (
              <p><b>Actual:</b> {String(item.got)}</p>
            )}
          </div>
        ))}

        {runResult.success && (
          <p className="ap-success-text">
            Execution completed successfully.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="additional-page">
      <header className="additional-header">
        <button
          className="additional-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div className="additional-course-heading">
          <span className="additional-icon">{data.icon}</span>
          <div>
            <span className="additional-label">FUSION LEARNING MODULE</span>
            <h1>{data.name} Learning Module</h1>
            <p>{data.description}</p>
          </div>
        </div>

        <div className="additional-course-info">
          <span>4 Learning Units</span>
          <span>{allTopics.length} Lessons</span>
          <span>{data.units.reduce((sum, item) => sum + item.quiz.length, 0)} Quiz Questions</span>
          <span>Coding Practice</span>
        </div>
      </header>

      <nav className="additional-tabs">
        {[
          ["learn", "Learn"],
          ["examples", "Examples"],
          ["quiz", "Quiz"],
          ["practice", "Code Practice"]
        ].map(([tab, label]) => (
          <button
            key={tab}
            className={activeTab === tab ? "selected" : ""}
            onClick={() => changeTab(tab)}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "learn" && (
        <div className="additional-layout">
          <aside className="additional-topics">
            <div className="additional-sidebar-heading">
              <span className="additional-label">YOUR COURSE</span>
              <h2>Course Units</h2>
              <p>4 units · {allTopics.length} lessons</p>
            </div>

            <div className="additional-topic-list">
              {data.units.map((item, unitIndex) => (
                <React.Fragment key={item.title}>
                  <button
                    className={activeUnit === unitIndex ? "active" : ""}
                    onClick={() => selectUnit(unitIndex)}
                  >
                    <span className="additional-topic-number">
                      {String(unitIndex + 1).padStart(2, "0")}
                    </span>
                    <span>{item.title}</span>
                  </button>

                  {activeUnit === unitIndex &&
                    item.topics.map((topic, topicIndex) => (
                      <button
                        key={topic.title}
                        className={activeTopic === topicIndex ? "active" : ""}
                        style={{ paddingLeft: "22px", fontSize: "11px" }}
                        onClick={() => setActiveTopic(topicIndex)}
                      >
                        <span className="additional-topic-number">
                          {String(topicIndex + 1).padStart(2, "0")}
                        </span>
                        <span>{topic.title}</span>
                      </button>
                    ))}
                </React.Fragment>
              ))}
            </div>
          </aside>

          <main className="additional-lesson">
            <div className="additional-lesson-top">
              <span className="additional-label">
                UNIT {String(activeUnit + 1).padStart(2, "0")} · LESSON{" "}
                {String(activeTopic + 1).padStart(2, "0")}
              </span>
              <span className="additional-lesson-count">
                {activeTopic + 1} / {unit.topics.length}
              </span>
            </div>

            <h2>{currentTopic.title}</h2>
            <p className="additional-lesson-description">
              {currentTopic.description}
            </p>

            <div className="additional-code-panel">
              <div className="additional-code-heading">
                <span>CODE EXAMPLE</span>
                <span className="additional-code-language">{data.name}</span>
              </div>
              <pre className="additional-code">
                <code>{currentTopic.code}</code>
              </pre>
            </div>

            <div className="additional-code-panel additional-output-panel">
              <div className="additional-code-heading">
                <span>EXPECTED OUTPUT</span>
                <span className="additional-code-language">Output</span>
              </div>
              <pre className="additional-code">
                <code>{currentTopic.output}</code>
              </pre>
            </div>

            <div className="additional-navigation">
              <button
                disabled={activeUnit === 0 && activeTopic === 0}
                onClick={() => moveTopic(-1)}
              >
                ← Previous
              </button>
              <button
                disabled={
                  activeUnit === data.units.length - 1 &&
                  activeTopic === unit.topics.length - 1
                }
                onClick={() => moveTopic(1)}
              >
                Next Lesson →
              </button>
            </div>
          </main>
        </div>
      )}

      {activeTab === "examples" && (
        <main className="additional-examples">
          <div className="additional-section-heading">
            <span className="additional-label">PRACTICE SECTION</span>
            <h2>{data.name} Code Examples</h2>
            <p>
              Explore examples from all four units. Each example includes
              its expected output.
            </p>
          </div>

          {data.units.map((item, unitIndex) => (
            <section key={item.title}>
              <div className="additional-section-heading">
                <span className="additional-label">
                  UNIT {String(unitIndex + 1).padStart(2, "0")}
                </span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>

              {item.topics.map((topic, topicIndex) => (
                <section className="additional-example" key={topic.title}>
                  <div className="additional-example-title">
                    <span>{String(topicIndex + 1).padStart(2, "0")}</span>
                    <h3>{topic.title}</h3>
                  </div>
                  <p>{topic.description}</p>

                  <div className="additional-code-panel">
                    <div className="additional-code-heading">
                      <span>CODE</span>
                      <span>{data.name}</span>
                    </div>
                    <pre className="additional-code">
                      <code>{topic.code}</code>
                    </pre>
                  </div>

                  <div className="additional-code-panel additional-output-panel">
                    <div className="additional-code-heading">
                      <span>EXPECTED OUTPUT</span>
                    </div>
                    <pre className="additional-code">
                      <code>{topic.output}</code>
                    </pre>
                  </div>

                  <div className="additional-navigation">
                    <button
                      onClick={() => {
                        goToTopic(unitIndex, topicIndex);
                        setActiveTab("learn");
                      }}
                    >
                      Open this lesson →
                    </button>
                  </div>
                </section>
              ))}
            </section>
          ))}
        </main>
      )}

      {activeTab === "quiz" && (
        <main className="additional-quiz">
          <div className="additional-section-heading">
            <span className="additional-label">TEST YOUR KNOWLEDGE</span>
            <h2>{data.name} Unit-wise Quiz</h2>
            <p>
              Choose a unit, answer its questions and check your score.
            </p>

            <div className="additional-topic-list">
              {data.units.map((item, index) => (
                <button
                  key={item.title}
                  className={activeUnit === index ? "active" : ""}
                  onClick={() => {
                    setActiveUnit(index);
                    setAnswers({});
                    setSubmittedQuiz(false);
                  }}
                >
                  <span className="additional-topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="additional-section-heading">
            <span className="additional-label">
              UNIT {String(activeUnit + 1).padStart(2, "0")}
            </span>
            <h2>{unit.title} Quiz</h2>
            <p>
              Answer all {unit.quiz.length} questions before submitting.
            </p>
          </div>

          {unit.quiz.map((question, index) => (
            <section className="additional-question" key={question.question}>
              <h3>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {question.question}
              </h3>

              <div className="additional-options">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={option}
                    className={`additional-option ${
                      answers[index] === optionIndex ? "chosen" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${activeUnit}-${index}`}
                      disabled={submittedQuiz}
                      checked={answers[index] === optionIndex}
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          [index]: optionIndex
                        })
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              {submittedQuiz && (
                <p
                  className={
                    answers[index] === question.answer
                      ? "correct-answer"
                      : "wrong-answer"
                  }
                >
                  {answers[index] === question.answer
                    ? "Correct!"
                    : `Correct answer: ${question.options[question.answer]}`}
                </p>
              )}
            </section>
          ))}

          {!submittedQuiz ? (
            <button
              className="additional-submit"
              onClick={() => {
                if (Object.keys(answers).length !== unit.quiz.length) {
                  alert("Please answer all questions first.");
                  return;
                }
                setSubmittedQuiz(true);
              }}
            >
              Submit Unit Quiz
            </button>
          ) : (
            <section className="additional-result">
              <span className="additional-label">UNIT QUIZ COMPLETED</span>
              <h2>Your Score: {quizScore} / {unit.quiz.length}</h2>
              <p>
                Percentage:{" "}
                {Math.round((quizScore / unit.quiz.length) * 100)}%
              </p>
              <button
                className="additional-submit"
                onClick={() => {
                  setAnswers({});
                  setSubmittedQuiz(false);
                }}
              >
                Try Again
              </button>
            </section>
          )}
        </main>
      )}

      {activeTab === "practice" && (
        <main className="ap-practice-page">
          <div className="ap-practice-heading">
            <div>
              <span className="additional-label">FUSION CODING ARENA</span>
              <h2>{data.name} Coding Practice</h2>
              <p>
                Select a unit and question, write your solution and run it
                against the teacher's test cases.
              </p>
            </div>
            <span className="ap-language-tag">{data.name}</span>
          </div>

          <div className="additional-section-heading">
            <span className="additional-label">SELECT COURSE UNIT</span>
            <select
              value={practiceUnit}
              onChange={(event) => setPracticeUnit(event.target.value)}
              style={{
                display: "block",
                width: "100%",
                maxWidth: "360px",
                marginTop: "12px",
                padding: "12px",
                border: "1px solid #dce5dc",
                borderRadius: "7px",
                background: "#fff",
                color: "#214d40",
                fontSize: "14px"
              }}
            >
              {data.units.map((item, index) => (
                <option key={item.title} value={String(index + 1)}>
                  Unit {index + 1} - {item.title}
                </option>
              ))}
            </select>
          </div>

          {practiceError && (
            <div className="ap-alert">{practiceError}</div>
          )}

          {loadingQuestions ? (
            <div className="ap-empty-state">Loading coding questions...</div>
          ) : questions.length === 0 ? (
            <div className="ap-empty-state">
              <h3>No coding questions available</h3>
              <p>
                Questions for this language and unit will appear here when
                added by a teacher.
              </p>
            </div>
          ) : (
            <div className="ap-practice-layout">
              <aside className="ap-question-sidebar">
                <h3>Questions</h3>
                <p>{questions.length} available</p>

                {questions.map((question, index) => (
                  <button
                    key={question._id || index}
                    className={
                      selectedQuestion?._id === question._id ? "active" : ""
                    }
                    onClick={() => {
                      setSelectedQuestion(question);
                      setRunResult(null);
                      setPracticeError("");
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {getQuestionTitle(question)}
                  </button>
                ))}
              </aside>

              <section className="ap-workspace">
                {selectedQuestion && (
                  <>
                    <div className="ap-problem">
                      <span className="additional-label">
                        PROBLEM STATEMENT
                      </span>
                      <h3>{getQuestionTitle(selectedQuestion)}</h3>
                      <p>
                        {getQuestionDescription(selectedQuestion) ||
                          "No description was provided for this question."}
                      </p>

                      {Array.isArray(selectedQuestion.testcases) &&
                        selectedQuestion.testcases.length > 0 && (
                          <div className="ap-sample-tests">
                            <h4>Sample Test Cases</h4>

                            {selectedQuestion.testcases.slice(0, 3).map(
                              (test, index) => (
                                <div className="ap-sample-test" key={index}>
                                  <strong>Test Case {index + 1}</strong>
                                  <p>
                                    <b>Input:</b>{" "}
                                    {String(test.input ?? "No input")}
                                  </p>
                                  <p>
                                    <b>Expected Output:</b>{" "}
                                    {String(
                                      test.expected ??
                                      test.output ??
                                      test.expectedOutput ??
                                      "Not provided"
                                    )}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <div className="ap-editor-card">
                      <div className="ap-editor-toolbar">
                        <strong>{data.name} Editor</strong>
                        <span>{data.name}</span>
                      </div>

                      <Editor
                        height="420px"
                        language={language}
                        theme="vs-dark"
                        value={editorCode}
                        onChange={(value) => setEditorCode(value ?? "")}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                          tabSize: 4,
                          padding: { top: 16 }
                        }}
                      />

                      <div className="ap-editor-actions">
                        <button
                          className="ap-reset-button"
                          onClick={() => {
                            setEditorCode(getStarterCode(language));
                            setRunResult(null);
                            setPracticeError("");
                          }}
                        >
                          Reset Code
                        </button>

                        <button
                          className="ap-run-button"
                          onClick={runCode}
                          disabled={running || submitting}
                        >
                          {running ? "Running..." : "▶ Run Code"}
                        </button>

                        <button
                          className="ap-submit-button"
                          onClick={submitCode}
                          disabled={
                            submitting ||
                            running ||
                            !runResult ||
                            !runResult.success ||
                            Number(runResult.totalTestcases ?? 0) === 0 ||
                            Number(runResult.testcasesPassed ?? 0) !==
                              Number(runResult.totalTestcases ?? 0)
                          }
                        >
                          {submitting ? "Submitting..." : "Submit Solution"}
                        </button>
                      </div>
                    </div>

                    {renderRunResults()}
                  </>
                )}
              </section>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
