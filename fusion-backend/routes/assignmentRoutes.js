
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
  createAssignment,
  getAssignment,
  getAllAssignments,
  deleteAssignment,
  savePerformance,
  getAllPerformances,
  getAssignmentsByUnit,
  createSubjectiveAssignment,
  updateSubjectiveAssignment,
  getSubjectiveResults,
  getSubjectiveAssignmentsForStudent,
  submitSubjectiveAnswer,
  getStudentSubmissions,
} from "../controllers/assignmentController.js";

import {
  gradeSubjectiveSubmission,
  viewSubjectiveSubmissionFile,
} from "../controllers/subjectiveGradingController.js";

import Performance from "../models/Performance.js";
import User from "../models/user.js";

import {
  protect,
  adminOnly,
  teacherOrAdminOnly,
} from "../middleware/authmiddleware.js";

const router = express.Router();

// --------------------------------------------------
// STUDENT PERMISSION
// --------------------------------------------------

const studentOnly = (req, res, next) => {
  if (!req.user || !["student", "test_student"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Student access required.",
    });
  }

  return next();
};

// --------------------------------------------------
// GET CURRENT STUDENT ACCOUNT
// --------------------------------------------------

const loadStudentIdentity = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.id).select(
      "name email rollNumber section"
    );

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Student account not found.",
      });
    }

    req.studentAccount = student;

    next();
  } catch (error) {
    console.error("Student identity error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify student account.",
    });
  }
};

// --------------------------------------------------
// MULTER SETUP
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const isPDF =
      file.mimetype === "application/pdf" &&
      String(file.originalname || "").toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return callback(new Error("Only PDF files are accepted."));
    }

    callback(null, true);
  },
});

// ==================================================
// SUBJECTIVE ASSIGNMENTS
// ==================================================

// Teacher/admin: view all subjective results.
router.get(
  "/subjective/results",
  protect,
  teacherOrAdminOnly,
  getSubjectiveResults
);

// Student: view assignments for their section.
router.get(
  "/subjective/student",
  protect,
  studentOnly,
  getSubjectiveAssignmentsForStudent
);

// Student: view their own subjective submissions.
router.get(
  "/subjective/submissions",
  protect,
  studentOnly,
  getStudentSubmissions
);

// Teacher/admin: create subjective assignment.
router.post(
  "/subjective",
  protect,
  teacherOrAdminOnly,
  createSubjectiveAssignment
);

// Student: submit an answer or PDF.
router.post(
  "/subjective/submit",
  protect,
  studentOnly,
  loadStudentIdentity,
  upload.single("file"),
  submitSubjectiveAnswer
);

// Teacher/admin: view uploaded student PDF.
router.get(
  "/subjective/submissions/:id/file",
  protect,
  teacherOrAdminOnly,
  viewSubjectiveSubmissionFile
);

// Teacher/admin: grade student submission.
router.put(
  "/subjective/submissions/:id/grade",
  protect,
  teacherOrAdminOnly,
  gradeSubjectiveSubmission
);

// Teacher/admin: update subjective assignment.
router.put(
  "/subjective/:id",
  protect,
  teacherOrAdminOnly,
  updateSubjectiveAssignment
);

// ==================================================
// MCQ ASSIGNMENTS
// ==================================================

// Teacher/admin: create MCQ assignment.
router.post(
  "/create",
  protect,
  teacherOrAdminOnly,
  createAssignment
);

// Teacher/admin: view all assignments.
router.get(
  "/all",
  protect,
  teacherOrAdminOnly,
  getAllAssignments
);

// Student: view assignments using their own roll number.
router.get(
  "/student",
  protect,
  studentOnly,
  loadStudentIdentity,
  (req, res, next) => {
    req.query.rollNumber = req.studentAccount.rollNumber || "";
    next();
  },
  getAssignment
);

// Teacher/admin: view assignments by unit.
router.get(
  "/unit/:unit",
  protect,
  teacherOrAdminOnly,
  getAssignmentsByUnit
);

// ==================================================
// PERFORMANCE
// ==================================================

// Teacher/admin: view performance of an assignment.
router.get(
  "/performance/:assignmentId",
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

      const performances = await Performance.find({
        assignmentId,
      }).sort({ date: -1 });

      return res.status(200).json({
        success: true,
        performances,
      });
    } catch (error) {
      console.error("Assignment performance error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch assignment results.",
      });
    }
  }
);

// Student: save performance for their own account.
router.post(
  "/performance",
  protect,
  studentOnly,
  loadStudentIdentity,
  (req, res, next) => {
    req.body.studentName = req.studentAccount.name;
    req.body.rollNumber = req.studentAccount.rollNumber;
    next();
  },
  savePerformance
);

// Teacher/admin: view performance records.
router.get(
  "/performance",
  protect,
  teacherOrAdminOnly,
  getAllPerformances
);

// ==================================================
// CHECK ASSIGNMENT ATTEMPT
// ==================================================

router.post(
  "/check",
  protect,
  studentOnly,
  loadStudentIdentity,
  async (req, res) => {
    try {
      const { assignmentId } = req.body || {};

      if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json({
          attempted: false,
          message: "A valid assignment ID is required.",
        });
      }

      const attempt = await Performance.findOne({
        rollNumber: req.studentAccount.rollNumber,
        assignmentId,
      }).select("_id");

      return res.status(200).json({
        attempted: Boolean(attempt),
      });
    } catch (error) {
      console.error("Assignment attempt check error:", error.message);

      return res.status(500).json({
        attempted: false,
        message: "Unable to check assignment attempt.",
      });
    }
  }
);

// ==================================================
// DELETE ASSIGNMENT
// ==================================================

// Teacher/admin only.
router.delete(
  "/:id",
  protect,
  teacherOrAdminOnly,
  deleteAssignment
);

export default router;
