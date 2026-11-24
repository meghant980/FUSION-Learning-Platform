
import mongoose from "mongoose";
import CodingQuestion from "../models/CodingQuestion.js";
import Submission from "../models/Submission.js";

const getLanguageId = (language) => {
  const lang = (language || "").toString().toLowerCase().trim();

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
  const lang = (language || "").toString().toLowerCase().trim();

  if (lang === "c++") return "cpp";
  if (lang === "js") return "javascript";

  return lang;
};

const normalizeUnit = (unit) => {
  if (unit === undefined || unit === null || unit === "") {
    return "";
  }

  const match = String(unit).trim().match(/\d+/);
  return match ? match[0] : "";
};

const getUnitFilter = (unit) => {
  const normalized = normalizeUnit(unit);

  if (!normalized) return {};

  return {
    unit: {
      $in: [normalized, `Unit ${normalized}`, `unit ${normalized}`],
    },
  };
};

const normalizeOutput = (value) =>
  (value ?? "").toString().replace(/\s+/g, "").trim();

const decodeJudgeOutput = (value) =>
  value ? Buffer.from(value, "base64").toString("utf8") : "";

const runJudge0 = async (code, languageId, input) => {
  const submitResponse = await fetch(
    "https://ce.judge0.com/submissions/?base64_encoded=true&wait=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: Buffer.from(code).toString("base64"),
        language_id: languageId,
        stdin: Buffer.from(input || "").toString("base64"),
      }),
    }
  );

  if (!submitResponse.ok) {
    throw new Error("Judge0 submission failed");
  }

  const submitData = await submitResponse.json();

  if (!submitData.token) {
    throw new Error("Judge0 did not return an execution token");
  }

  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollResponse = await fetch(
      `https://ce.judge0.com/submissions/${submitData.token}?base64_encoded=true`
    );

    if (!pollResponse.ok) {
      throw new Error("Could not retrieve execution result from Judge0");
    }

    const result = await pollResponse.json();

    if (
      result.status &&
      result.status.id !== 1 &&
      result.status.id !== 2
    ) {
      return result;
    }
  }

  throw new Error("Code execution timed out");
};

const evaluateTestcase = async (code, languageId, testcase) => {
  const result = await runJudge0(
    code,
    languageId,
    testcase.input || ""
  );

  const output = decodeJudgeOutput(result.stdout);
  const stderr = decodeJudgeOutput(result.stderr);

  const expected =
    testcase.expected ??
    testcase.expectedOutput ??
    testcase.sampleOutput ??
    "";

  const correct =
    result.status?.description === "Accepted" &&
    normalizeOutput(output) === normalizeOutput(expected);

  return {
    correct,
    output,
    expected,
    status: result.status?.description || "Execution error",
    stderr,
  };
};

/* 1. ADD CODING PRACTICE QUESTION */
export const addCodingQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      unit,
      testcases,
      evaluationSteps,
    } = req.body;

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        message: "Title, description and language are required.",
      });
    }

    const normalizedLanguage = normalizeLanguage(language);

    if (!getLanguageId(normalizedLanguage)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language.",
      });
    }

    const normalizedUnit = normalizeUnit(unit);

    if (!normalizedUnit || !["1", "2", "3", "4"].includes(normalizedUnit)) {
      return res.status(400).json({
        success: false,
        message: "A valid unit number (1 to 4) is required.",
      });
    }

    if (!Array.isArray(testcases) || testcases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one test case is required.",
      });
    }

    const cleanedTestcases = testcases.map((tc) => ({
      input: tc.input ?? "",
      expected: tc.expectedOutput ?? tc.expected ?? "",
      visible: tc.visible !== false,
    }));

    const cleanedSteps = (evaluationSteps || []).map((step, index) => ({
      stepId: step.stepId || `step_${index + 1}`,
      label: step.label || `Step ${index + 1}`,
      type: step.type,
      value:
        step.type === "all-testcases-pass"
          ? ""
          : step.value || "",
      minPassed:
        step.type === "min-testcases-pass"
          ? Number(step.minPassed || 0)
          : 0,
      marks: Number(step.marks || 0),
    }));

    const newQuestion = new CodingQuestion({
      title: title.trim(),
      description,
      language: normalizedLanguage,
      category: "practice",
      unit: normalizedUnit,
      testcases: cleanedTestcases,
      evaluationSteps: cleanedSteps,
    });

    await newQuestion.save();

    return res.status(201).json({
      success: true,
      message: "Practice question saved successfully!",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Add coding question error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* 2. GET CODING QUESTIONS - STUDENT VERSION */
export const getCodingQuestions = async (req, res) => {
  try {
    const language = normalizeLanguage(req.query.language);
    const unit = normalizeUnit(req.query.unit);

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required.",
      });
    }

    if (!getLanguageId(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language.",
      });
    }

    if (!unit || !["1", "2", "3", "4"].includes(unit)) {
      return res.status(400).json({
        success: false,
        message: "A valid unit number (1 to 4) is required.",
      });
    }

    const filter = {
      language,
      category: "practice",
      ...getUnitFilter(unit),
    };

    const questions = await CodingQuestion.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const safeQuestions = questions.map((question) => ({
      ...question,
      testcases: (question.testcases || [])
        .filter((tc) => tc.visible !== false)
        .map((tc) => ({
          input: tc.input,
          expected: tc.expected ?? tc.expectedOutput ?? "",
          visible: true,
        })),
    }));

    return res.json({
      success: true,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Get coding questions error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* 3. DELETE CODING QUESTION */
export const deleteCodingQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const deleted = await CodingQuestion.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error("Delete coding question error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* 4. EVALUATE CODE - RUN */
export const evaluateCode = async (req, res) => {
  try {
    const { code, language, questionId } = req.body;

    if (code === undefined || !language || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Code, language and question ID are required.",
      });
    }

    const normalizedLanguage = normalizeLanguage(language);
    const langId = getLanguageId(normalizedLanguage);

    if (!langId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const question = await CodingQuestion.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (
      normalizeLanguage(question.language) !== normalizedLanguage
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected language does not match the question language.",
      });
    }

    const testcases = question.testcases || [];

    if (testcases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This question has no test cases.",
      });
    }

    let passed = 0;
    const visibleResults = [];

    for (const testcase of testcases) {
      try {
        const result = await evaluateTestcase(code, langId, testcase);

        if (result.correct) {
          passed++;
        }

        if (testcase.visible !== false) {
          visibleResults.push({
            input: testcase.input,
            expected: result.expected,
            got: result.output || result.stderr || result.status,
            status: result.correct ? "Passed" : "Failed",
          });
        }
      } catch (error) {
        if (testcase.visible !== false) {
          visibleResults.push({
            input: testcase.input,
            expected: testcase.expected ?? testcase.expectedOutput ?? "",
            got: error.message || "Execution error",
            status: "Failed",
          });
        }

        console.error("Testcase execution error:", error.message);
      }
    }

    /* STEP-BY-STEP EVALUATION */
    const stepResults = [];
    let totalMarks = 0;
    let maxMarks = 0;

    const steps = question.evaluationSteps || [];

    for (const step of steps) {
      const marks = Number(step.marks) || 0;
      maxMarks += marks;

      let isPassed = false;

      if (
        step.type === "code-contains" ||
        step.type === "Code contains substring"
      ) {
        isPassed = code
          .toLowerCase()
          .includes((step.value || "").toLowerCase());
      } else if (
        step.type === "code-regex" ||
        step.type === "Code matches regex"
      ) {
        try {
          isPassed = new RegExp(step.value || "", "mi").test(code);
        } catch {
          isPassed = false;
        }
      } else if (step.type === "all-testcases-pass") {
        isPassed =
          testcases.length > 0 &&
          passed === testcases.length;
      } else if (step.type === "min-testcases-pass") {
        isPassed = passed >= Number(step.minPassed || 0);
      }

      const marksAwarded = isPassed ? marks : 0;
      totalMarks += marksAwarded;

      stepResults.push({
        label: step.label,
        passed: isPassed,
        marksAwarded,
        marksTotal: marks,
      });
    }

    return res.json({
      success: true,
      testcasesPassed: passed,
      totalTestcases: testcases.length,
      results: visibleResults,
      stepResults,
      totalMarks,
      maxMarks,
    });
  } catch (error) {
    console.error("Evaluate code error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Code evaluation failed.",
    });
  }
};

/* 5. UPDATE CODING QUESTION */
export const updateCodingQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const updateData = { ...req.body };

    if (updateData.unit !== undefined) {
      const normalizedUnit = normalizeUnit(updateData.unit);

      if (!normalizedUnit || !["1", "2", "3", "4"].includes(normalizedUnit)) {
        return res.status(400).json({
          success: false,
          message: "A valid unit number (1 to 4) is required.",
        });
      }

      updateData.unit = normalizedUnit;
    }

    if (updateData.language !== undefined) {
      const normalizedLanguage = normalizeLanguage(updateData.language);

      if (!getLanguageId(normalizedLanguage)) {
        return res.status(400).json({
          success: false,
          message: "Unsupported programming language.",
        });
      }

      updateData.language = normalizedLanguage;
    }

    const updatedQuestion = await CodingQuestion.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update coding question error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* 6. TEACHER CODING RESULTS */
export const getAllCodingResults = async (req, res) => {
  try {
    const results = await Submission.find()
      .populate("userId", "name email rollNumber")
      .populate("questionId", "title language unit")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Get coding results error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
