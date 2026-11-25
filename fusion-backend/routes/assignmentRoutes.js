import express from "express";
import mongoose from "mongoose";

import Assignment from "../models/Assignment.js";
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

const router = express.Router();

// MCQ assignment creation and listing
router.post("/create", createAssignment);
router.get("/student", getAssignment);
router.get("/unit/:unit", getAssignmentsByUnit);
router.get("/", getAllAssignments);

// Check whether a student has already attempted an assignment
router.post("/check", async (req, res) => {
  try {
    const { rollNumber, assignmentId } = req.body || {};

    if (!rollNumber?.trim() || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid roll number and assignment ID are required.",
      });
    }

    const existing = await Performance.findOne({
      rollNumber: rollNumber.trim(),
      assignmentId,
    }).select("_id");

    return res.json({ success: true, attempted: Boolean(existing) });
  } catch (error) {
    console.error("Check assignment attempt:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to check previous attempt.",
    });
  }
});

// Existing performance endpoints
router.post("/performance", savePerformance);
router.get("/performance", getAllPerformances);
router.get("/performance/:assignmentId", (req, res, next) => {
  req.query.assignmentId = req.params.assignmentId;
  next();
}, getAllPerformances);

// Delete an assignment
router.delete("/:id", deleteAssignment);

// Subjective assignments — preserve existing functionality
router.post("/subjective", createSubjectiveAssignment);
router.put("/subjective/:id", updateSubjectiveAssignment);
router.get("/subjective/student", getSubjectiveAssignmentsForStudent);
router.post("/subjective/submit", submitSubjectiveAnswer);
router.get("/subjective/results", getSubjectiveResults);
router.get("/subjective/submissions", getStudentSubmissions);

export default router;
