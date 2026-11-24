import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";

const normalizeLanguage = (language) => {
  const value = String(language || "").toLowerCase().trim();

  if (value === "c++") return "cpp";
  if (value === "js") return "javascript";

  return value;
};

export const submitCode = async (req, res) => {
  try {
    const {
      code,
      language,
      questionId,
      assignmentId,
      unit,
      testcasesPassed,
      totalTestcases,
    } = req.body;

    const userId = req.user?.id || req.user?._id;

    if (!userId || code === undefined || !language || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required submission data.",
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

    const selectedLanguage = normalizeLanguage(language);
    const questionLanguage = normalizeLanguage(question.language);

    if (selectedLanguage !== questionLanguage) {
      return res.status(400).json({
        success: false,
        message: "Selected language does not match the question language.",
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

    const passed = Math.max(0, Number(testcasesPassed) || 0);
    const total = Math.max(0, Number(totalTestcases) || 0);

    const safePassed = Math.min(passed, total);

    const status =
      total > 0 && safePassed === total
        ? "Accepted"
        : "Wrong Answer";

    let totalMarks = 0;
    let maxMarks = 0;

    const stepResults = [];
    const steps = question.evaluationSteps || [];

    for (const step of steps) {
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
        try {
          isPassed = new RegExp(step.value || "", "mi").test(code);
        } catch {
          isPassed = false;
        }
      } else if (step.type === "all-testcases-pass") {
        isPassed = total > 0 && safePassed === total;
      } else if (step.type === "min-testcases-pass") {
        isPassed = safePassed >= Number(step.minPassed || 0);
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

    const submissionData = {
      userId,
      questionId,
      code,
      language: selectedLanguage,
      status,
      passed: safePassed,
      total,
      totalMarks,
      maxMarks,
      stepResults,
      unit: unit ? String(unit) : "",
    };

    if (assignmentId) {
      submissionData.assignmentId = assignmentId;
    }

    const submission = await Submission.create(submissionData);

    return res.status(201).json({
      success: true,
      submissionId: submission._id,
      status,
      passed: safePassed,
      total,
      totalMarks,
      maxMarks,
      stepResults,
    });
  } catch (error) {
    console.error("Submit Error:", error);

    return res.status(500).json({
      success: false,
      message: "Submit failed.",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const currentUserId = req.user?.id || req.user?._id;

    const isTeacherOrAdmin = ["teacher", "admin"].includes(
      req.user?.role
    );

    const isOwner =
      submission.userId?.toString() === currentUserId?.toString();

    if (!isTeacherOrAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this submission.",
      });
    }

    return res.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Get submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve submission.",
    });
  }
};