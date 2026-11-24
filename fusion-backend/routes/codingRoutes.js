
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import {
  addCodingQuestion,
  getCodingQuestions,
  deleteCodingQuestion,
  getAllCodingResults,
  updateCodingQuestion,
} from "../controllers/codingController.js";

import {
  evaluateCode,
  submitCode,
} from "../controllers/evaluateCodeController.js";

import { getLeaderboard } from "../controllers/leaderboardController.js";
import { getSubmissionById } from "../controllers/submitCodeController.js";

import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";

import {
  protect,
  teacherOrAdminOnly,
} from "../middleware/authmiddleware.js";

const router = express.Router();

// --------------------------------------------------
// CODE EXECUTION RATE LIMIT
// --------------------------------------------------

const runCodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many code execution requests. Please wait a minute.",
  },
});

// --------------------------------------------------
// NORMALIZATION HELPERS
// --------------------------------------------------

const normalizeLanguage = (language) => {
  const value = String(language || "").toLowerCase().trim();

  if (value === "c++") return "cpp";
  if (value === "js") return "javascript";

  return value;
};

const normalizeUnit = (unit) => {
  const match = String(unit || "").trim().match(/\d+/);
  return match ? match[0] : "";
};

// --------------------------------------------------
// TEACHER: GET QUESTIONS FOR A LANGUAGE AND UNIT
// --------------------------------------------------

router.get(
  "/teacher/practice",
  protect,
  teacherOrAdminOnly,
  async (req, res) => {
    try {
      const language = normalizeLanguage(req.query.language);
      const unit = normalizeUnit(req.query.unit);

      if (!language) {
        return res.status(400).json({
          success: false,
          message: "Language is required.",
        });
      }

      if (!unit || !["1", "2", "3", "4"].includes(unit)) {
        return res.status(400).json({
          success: false,
          message: "A valid unit number (1 to 4) is required.",
        });
      }

      const filter = {
        category: "practice",
        language,
        unit: {
          $in: [
            unit,
            `Unit ${unit}`,
            `unit ${unit}`,
          ],
        },
      };

      const questions = await CodingQuestion.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        questions,
      });
    } catch (error) {
      console.error("Teacher questions error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not fetch teacher questions.",
      });
    }
  }
);

// --------------------------------------------------
// STUDENT: GET PRACTICE QUESTIONS
// --------------------------------------------------

router.get("/practice", getCodingQuestions);

// --------------------------------------------------
// TEACHER: ADD CODING QUESTION
// --------------------------------------------------

router.post(
  "/add",
  protect,
  teacherOrAdminOnly,
  addCodingQuestion
);

// --------------------------------------------------
// GET A SINGLE SUBMISSION
// Owner, teacher or admin access is checked in controller.
// --------------------------------------------------

router.get(
  "/submission/:id",
  protect,
  getSubmissionById
);

// --------------------------------------------------
// TEACHER: DELETE CODING QUESTION
// --------------------------------------------------

router.delete(
  "/delete/:id",
  protect,
  teacherOrAdminOnly,
  deleteCodingQuestion
);

// --------------------------------------------------
// RUN CODE
// Login and rate limit required.
// --------------------------------------------------

router.post(
  "/run",
  protect,
  runCodeLimiter,
  evaluateCode
);

// --------------------------------------------------
// SUBMIT CODE
// Backend calculates marks.
// --------------------------------------------------

router.post(
  "/submit",
  protect,
  runCodeLimiter,
  submitCode
);

// --------------------------------------------------
// LEADERBOARD
// --------------------------------------------------

router.get("/leaderboard", getLeaderboard);

// --------------------------------------------------
// TEACHER: GET ALL CODING RESULTS
// --------------------------------------------------

router.get(
  "/results",
  protect,
  teacherOrAdminOnly,
  getAllCodingResults
);

// --------------------------------------------------
// TEACHER: GET RESULTS FOR ONE QUESTION
// --------------------------------------------------

router.get(
  "/results/:questionId",
  protect,
  teacherOrAdminOnly,
  async (req, res) => {
    try {
      const { questionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid question ID.",
        });
      }

      const questionExists = await CodingQuestion.exists({
        _id: questionId,
      });

      if (!questionExists) {
        return res.status(404).json({
          success: false,
          message: "Coding question not found.",
        });
      }

      const submissions = await Submission.find({
        questionId,
      })
        .populate("userId", "name rollNumber section")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error("Question results error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not fetch question results.",
      });
    }
  }
);

// --------------------------------------------------
// TEACHER: UPDATE CODING QUESTION
// --------------------------------------------------

router.put(
  "/update/:id",
  protect,
  teacherOrAdminOnly,
  updateCodingQuestion
);

export default router;
