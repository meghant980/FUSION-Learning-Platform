
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import {
  evaluateCode,
  submitCode,
} from "../controllers/evaluateCodeController.js";

import Submission from "../models/Submission.js";

import {
  protect,
  teacherOrAdminOnly,
} from "../middleware/authmiddleware.js";

const router = express.Router();

// --------------------------------------------------
// CODE EXECUTION RATE LIMIT
// --------------------------------------------------

const codeExecutionLimiter = rateLimit({
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
// GET LEADERBOARD
// Public endpoint
// --------------------------------------------------

router.get("/leaderboard", (req, res, next) => {
  next();
}, async (req, res, next) => {
  // Kept as a placeholder to avoid changing the existing
  // leaderboard response. The controller is imported below.
  next();
});

// Use the existing leaderboard controller.
import { getLeaderboard } from "../controllers/leaderboardController.js";

router.get("/leaderboard", getLeaderboard);

// --------------------------------------------------
// RUN CODE
// Login required
// --------------------------------------------------

router.post(
  "/run",
  protect,
  codeExecutionLimiter,
  evaluateCode
);

// --------------------------------------------------
// SUBMIT CODE
// Login required; marks calculated by backend.
// --------------------------------------------------

router.post(
  "/submit",
  protect,
  codeExecutionLimiter,
  submitCode
);

// --------------------------------------------------
// GET ONE SUBMISSION
// Students can see their own submissions.
// Teachers/admins can see all submissions.
// --------------------------------------------------

router.get(
  "/submission/:id",
  protect,
  async (req, res) => {
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

      const loggedInUserId = String(req.user.id);
      const submissionOwnerId = String(submission.userId);

      const isOwner = loggedInUserId === submissionOwnerId;
      const isTeacherOrAdmin = ["teacher", "admin"].includes(
        req.user.role
      );

      if (!isOwner && !isTeacherOrAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to view this submission.",
        });
      }

      return res.status(200).json({
        success: true,
        submission,
      });
    } catch (error) {
      console.error("GET SUBMISSION ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Error fetching submission.",
      });
    }
  }
);

// --------------------------------------------------
// GET SUBMISSION HISTORY
// Students can only request their own history.
// Teachers/admins can request another user's history.
// --------------------------------------------------

router.get(
  "/submissions/user/:userId",
  protect,
  async (req, res) => {
    try {
      const requestedUserId = req.params.userId;
      const loggedInUserId = String(req.user.id);

      if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const isTeacherOrAdmin = ["teacher", "admin"].includes(
        req.user.role
      );

      const targetUserId = isTeacherOrAdmin
        ? requestedUserId
        : loggedInUserId;

      if (
        !isTeacherOrAdmin &&
        requestedUserId !== loggedInUserId
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own submission history.",
        });
      }

      const submissions = await Submission.find({
        userId: targetUserId,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error("GET USER SUBMISSIONS ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Error fetching submissions.",
      });
    }
  }
);

export default router;
