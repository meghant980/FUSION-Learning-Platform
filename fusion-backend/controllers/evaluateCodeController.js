
import axios from "axios";
import mongoose from "mongoose";
import CodingQuestion from "../models/CodingQuestion.js";
import Submission from "../models/Submission.js";

const JUDGE0_URL = "https://ce.judge0.com";

const MAX_CODE_LENGTH = 20000;
const MAX_INPUT_LENGTH = 10000;
const MAX_TESTCASES = 30;
const MAX_EVALUATION_STEPS = 30;

const getLanguageId = (language) => {
  const lang = String(language || "").toLowerCase().trim();

  const languages = {
    c: 50,
    cpp: 54,
    "c++": 54,
    java: 62,
    javascript: 63,
    js: 63,
    python: 71,
  };

  return languages[lang] || null;
};

const normalizeLanguage = (language) => {
  const lang = String(language || "").toLowerCase().trim();

  if (lang === "c++") return "cpp";
  if (lang === "js") return "javascript";

  return lang;
};

const normalizeOutput = (value) =>
  String(value ?? "").replace(/\r/g, "").trim();

const decodeOutput = (value) => {
  return value
    ? Buffer.from(value, "base64").toString("utf8")
    : "";
};

const validateCode = (code) => {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Please enter your code.");
  }

  if (code.length > MAX_CODE_LENGTH) {
    throw new Error(
      `Code is too large. Maximum allowed length is ${MAX_CODE_LENGTH} characters.`
    );
  }
};

const executeCode = async (code, language, input = "") => {
  validateCode(code);

  if (typeof input !== "string") {
    throw new Error("Test input must be text.");
  }

  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error("Test input is too large.");
  }

  const languageId = getLanguageId(language);

  if (!languageId) {
    throw new Error("Unsupported programming language.");
  }

  const response = await axios.post(
    `${JUDGE0_URL}/submissions/?base64_encoded=true&wait=false`,
    {
      source_code: Buffer.from(code, "utf8").toString("base64"),
      language_id: languageId,
      stdin: Buffer.from(input, "utf8").toString("base64"),
    },
    {
      timeout: 20000,
    }
  );

  const token = response.data?.token;

  if (!token) {
    throw new Error("Code execution service did not return a token.");
  }

  let result = null;

  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const poll = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
      {
        timeout: 20000,
      }
    );

    result = poll.data;

    // Judge0 status IDs 1 and 2 mean processing or queued.
    if (result.status && result.status.id > 2) {
      break;
    }
  }

  if (!result?.status || result.status.id <= 2) {
    throw new Error("Code execution timed out. Please try again.");
  }

  const output =
    decodeOutput(result.stdout) ||
    decodeOutput(result.stderr) ||
    decodeOutput(result.compile_output) ||
    decodeOutput(result.message);

  return {
    output,
    status: result.status.description || "Unknown",
  };
};

// Retained for compatibility with existing imports.
export const runSingleTestcase = async (code, language, input) => {
  const result = await executeCode(code, language, input);
  return result.output.trim();
};

// --------------------------------------------------
// EVALUATE TEST CASES AND MARKING RULES
// --------------------------------------------------

const evaluateSubmission = async (code, language, question) => {
  const testcases = question.testcases || [];
  const evaluationSteps = question.evaluationSteps || [];

  if (testcases.length > MAX_TESTCASES) {
    throw new Error(
      `This question has too many test cases. Maximum allowed is ${MAX_TESTCASES}.`
    );
  }

  if (evaluationSteps.length > MAX_EVALUATION_STEPS) {
    throw new Error("This question has too many evaluation steps.");
  }

  let passed = 0;
  let visibleResults = [];

  for (const tc of testcases) {
    const input = String(tc.input ?? "");

    const expected = String(
      tc.expected ??
      tc.expectedOutput ??
      tc.sampleOutput ??
      ""
    );

    if (input.length > MAX_INPUT_LENGTH) {
      throw new Error("A question test input is too large.");
    }

    let execution;
    let isCorrect = false;

    try {
      execution = await executeCode(code, language, input);

      isCorrect =
        execution.status === "Accepted" &&
        normalizeOutput(execution.output) ===
          normalizeOutput(expected);

      if (isCorrect) {
        passed++;
      }
    } catch (error) {
      execution = {
        output: error.message || "Execution error",
        status: "Execution Error",
      };
    }

    // Never expose hidden testcase inputs or expected outputs.
    if (tc.visible !== false) {
      visibleResults.push({
        input,
        expected,
        got: execution.output,
        status: isCorrect ? "Passed" : "Failed",
        visible: true,
      });
    }
  }

  let totalMarks = 0;
  let maxMarks = 0;

  const stepResults = [];

  for (const step of evaluationSteps) {
    const marks = Math.max(0, Number(step.marks) || 0);

    maxMarks += marks;

    let isPassed = false;

    if (
      step.type === "code-contains" ||
      step.type === "Code contains substring"
    ) {
      isPassed = code
        .toLowerCase()
        .includes(String(step.value || "").toLowerCase());
    } else if (
      step.type === "code-regex" ||
      step.type === "Code matches regex"
    ) {
      const pattern = String(step.value || "");

      if (pattern.length <= 200) {
        try {
          isPassed = new RegExp(pattern, "mi").test(code);
        } catch {
          isPassed = false;
        }
      }
    } else if (step.type === "all-testcases-pass") {
      isPassed =
        testcases.length > 0 &&
        passed === testcases.length;
    } else if (step.type === "min-testcases-pass") {
      isPassed =
        passed >= Number(step.minPassed || 0);
    }

    const marksAwarded = isPassed ? marks : 0;

    totalMarks += marksAwarded;

    stepResults.push({
      label: step.label || "",
      passed: isPassed,
      marksAwarded,
      marksTotal: marks,
    });
  }

  return {
    testcasesPassed: passed,
    totalTestcases: testcases.length,
    results: visibleResults,
    stepResults,
    totalMarks,
    maxMarks,
  };
};

// --------------------------------------------------
// VALIDATE QUESTION
// --------------------------------------------------

const getValidatedQuestion = async (questionId, language) => {
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new Error("Invalid question ID.");
  }

  const question = await CodingQuestion.findById(questionId);

  if (!question) {
    throw new Error("Question not found.");
  }

  if (
    normalizeLanguage(question.language) !==
    normalizeLanguage(language)
  ) {
    throw new Error(
      "Selected language does not match the question language."
    );
  }

  return question;
};

const getErrorStatus = (error) => {
  if (error.message === "Question not found.") {
    return 404;
  }

  if (
    error.message === "Invalid question ID." ||
    error.message.includes("does not match") ||
    error.message.startsWith("Unsupported") ||
    error.message.startsWith("Please enter") ||
    error.message.startsWith("Code is") ||
    error.message.startsWith("Test input")
  ) {
    return 400;
  }

  return 500;
};

// --------------------------------------------------
// RUN CODE
// Login protection is applied in the route file.
// --------------------------------------------------

export const evaluateCode = async (req, res) => {
  try {
    const { code, language, questionId } = req.body || {};

    validateCode(code);

    if (!language || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Language and question ID are required.",
      });
    }

    if (!getLanguageId(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language.",
      });
    }

    const question = await getValidatedQuestion(
      questionId,
      language
    );

    const evaluation = await evaluateSubmission(
      code,
      language,
      question
    );

    return res.status(200).json({
      success: true,
      ...evaluation,
    });
  } catch (error) {
    console.error("EVALUATION ERROR:", error.message);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message: error.message || "Code evaluation failed.",
    });
  }
};

// --------------------------------------------------
// SUBMIT CODE
// User ID and marks are determined on the backend.
// --------------------------------------------------

export const submitCode = async (req, res) => {
  try {
    const {
      code,
      language,
      questionId,
      assignmentId,
      unit,
    } = req.body || {};

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in before submitting code.",
      });
    }

    validateCode(code);

    if (!language || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Language and question ID are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!getLanguageId(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language.",
      });
    }

    if (
      assignmentId &&
      !mongoose.Types.ObjectId.isValid(assignmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const question = await getValidatedQuestion(
      questionId,
      language
    );

    // All tests and marks are calculated on the backend.
    // Never accept marks or passed counts from the browser.
    const evaluation = await evaluateSubmission(
      code,
      language,
      question
    );

    const status =
      evaluation.totalTestcases > 0 &&
      evaluation.testcasesPassed === evaluation.totalTestcases
        ? "Accepted"
        : "Wrong Answer";

    const submissionData = {
      userId,
      questionId,
      code,
      language: normalizeLanguage(language),
      status,
      passed: evaluation.testcasesPassed,
      total: evaluation.totalTestcases,
      totalMarks: evaluation.totalMarks,
      maxMarks: evaluation.maxMarks,
      stepResults: evaluation.stepResults,
      unit: unit ? String(unit).slice(0, 30) : "",
    };

    if (assignmentId) {
      submissionData.assignmentId = assignmentId;
    }

    const submission = await Submission.create(submissionData);

    return res.status(201).json({
      success: true,
      message: "Code submitted successfully.",
      submissionId: submission._id,
      status,
      passed: evaluation.testcasesPassed,
      total: evaluation.totalTestcases,
      totalMarks: evaluation.totalMarks,
      maxMarks: evaluation.maxMarks,
      stepResults: evaluation.stepResults,
    });
  } catch (error) {
    console.error("SUBMIT ERROR:", error.message);

    return res.status(getErrorStatus(error)).json({
      success: false,
      message: error.message || "Code submission failed.",
    });
  }
};
