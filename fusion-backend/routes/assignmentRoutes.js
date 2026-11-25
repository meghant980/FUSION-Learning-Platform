import express from "express";
import mongoose from "mongoose";

import Performance from "../models/Performance.js";

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
  getSubjectiveAssignmentsForStudent,
  submitSubjectiveAnswer,
  getSubjectiveResults,
  getStudentSubmissions,
} from "../controllers/assignmentController.js";

import {
  gradeSubjectiveSubmission,
  viewSubjectiveSubmissionFile,
} from "../controllers/subjectiveGradingController.js";

const router = express.Router();

// CREATE MCQ ASSIGNMENT
router.post("/create", createAssignment);

// GET ASSIGNMENTS FOR STUDENT
router.get("/student", getAssignment);

// GET ASSIGNMENTS BY UNIT
router.get("/unit/:unit", getAssignmentsByUnit);

// GET ALL ASSIGNMENTS
router.get("/all", getAllAssignments);

// CHECK PREVIOUS ATTEMPT
router.post("/check", async (req, res) => {
  try {
    const { rollNumber, assignmentId } = req.body;

    if (!rollNumber || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: "Roll number and assignment ID are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const performance = await Performance.findOne({
      rollNumber: String(rollNumber).trim(),
      assignmentId,
    });

    return res.status(200).json({
      success: true,
      attempted: Boolean(performance),
      performance,
    });
  } catch (error) {
    console.error("Check assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check assignment.",
    });
  }
});

// SAVE MCQ PERFORMANCE
router.post("/performance", savePerformance);

// GET MCQ PERFORMANCE
router.get("/performance", getAllPerformances);

// GET PERFORMANCE BY ASSIGNMENT
router.get("/performance/:assignmentId", getAllPerformances);

// DELETE ASSIGNMENT
router.delete("/:id", deleteAssignment);

// CREATE SUBJECTIVE ASSIGNMENT
router.post("/subjective/create", createSubjectiveAssignment);

// UPDATE SUBJECTIVE ASSIGNMENT
router.put("/subjective/:id", updateSubjectiveAssignment);

// GET SUBJECTIVE ASSIGNMENTS FOR STUDENT
router.get(
  "/subjective/student",
  getSubjectiveAssignmentsForStudent
);

// SUBMIT SUBJECTIVE ANSWER
router.post("/subjective/submit", submitSubjectiveAnswer);

// GET SUBJECTIVE RESULTS
router.get("/subjective/results", getSubjectiveResults);

// GET STUDENT SUBJECTIVE SUBMISSIONS
router.get("/subjective/submissions", getStudentSubmissions);

// GRADE SUBJECTIVE SUBMISSION
router.put("/subjective/grade/:id", gradeSubjectiveSubmission);

// VIEW SUBJECTIVE SUBMISSION FILE
router.get(
  "/subjective/file/:id",
  viewSubjectiveSubmissionFile
);

export default router;
