
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { submitCode } from "../controllers/evaluateCodeController.js";
import { submitSubjectiveAnswer } from "../controllers/assignmentController.js";

import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";

import {
  protect,
  teacherOrAdminOnly,
} from "../middleware/authmiddleware.js";

const router = express.Router();

// --------------------------------------------------
// ROLE CHECK
// --------------------------------------------------

const studentOnly = (req, res, next) => {
  if (
    !req.user ||
    !["student", "test_student"].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: "Student access required.",
    });
  }

  return next();
};

// --------------------------------------------------
// PDF UPLOAD
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const isPDF =
      file.mimetype === "application/pdf" &&
      String(file.originalname || "")
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      return callback(new Error("Only PDF files are accepted."));
    }

    callback(null, true);
  },
});

// --------------------------------------------------
// CODING SUBMISSION
// Backend evaluates code and calculates marks.
// --------------------------------------------------

router.post(
  "/",
  protect,
  studentOnly,
  submitCode
);

// --------------------------------------------------
// SUBJECTIVE SUBMISSION
// --------------------------------------------------

router.post(
  "/subjective",
  protect,
  studentOnly,
  upload.single("file"),
  submitSubjectiveAnswer
);

// --------------------------------------------------
// GET UNIT 3 CODING SUBMISSIONS
// Teacher/admin only.
// --------------------------------------------------

router.get(
  "/unit/3",
  protect,
  teacherOrAdminOnly,
  async (req, res) => {
    try {
      const questions = await CodingQuestion.find({
        unit: {
          $in: [3, "3", "Unit 3", "unit 3"],
        },
      }).select("_id");

      const questionIds = questions.map((question) => question._id);

      const submissions = await Submission.find({
        questionId: { $in: questionIds },
      })
        .populate("userId", "name email rollNumber section")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error("UNIT 3 SUBMISSIONS ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch unit submissions.",
      });
    }
  }
);

// --------------------------------------------------
// GET SUBMISSIONS BY ASSIGNMENT
// Teacher/admin only.
// --------------------------------------------------

router.get(
  "/assignment/:assignmentId",
  protect,
  teacherOrAdminOnly,
  async (req, res) => {
    try {
      const { assignmentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment ID.",
        });
      }

      const submissions = await Submission.find({
        assignmentId,
      })
        .populate("userId", "name email rollNumber section")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error("ASSIGNMENT SUBMISSIONS ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch assignment submissions.",
      });
    }
  }
);

export default router;
