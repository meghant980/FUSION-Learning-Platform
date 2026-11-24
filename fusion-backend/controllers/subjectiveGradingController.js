
import mongoose from "mongoose";
import Result from "../models/result.js";

/* =========================================================
   GRADE STUDENT SUBJECTIVE SUBMISSION
========================================================= */

export const gradeSubjectiveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const awardedMarks = Number(marks);

    if (!Number.isFinite(awardedMarks) || awardedMarks < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid marks.",
      });
    }

    const submission = await Result.findById(id).populate(
      "assignmentId",
      "maxMarks title question"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Student submission not found.",
      });
    }

    const maximumMarks = Number(submission.assignmentId?.maxMarks);

    if (!Number.isFinite(maximumMarks) || maximumMarks <= 0) {
      return res.status(400).json({
        success: false,
        message: "Assignment maximum marks are not configured correctly.",
      });
    }

    if (awardedMarks > maximumMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks cannot be greater than ${maximumMarks}.`,
      });
    }

    submission.marks = awardedMarks;
    submission.feedback = String(feedback || "").trim();
    submission.status = "evaluated";

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Student submission evaluated successfully.",
      submission,
    });
  } catch (error) {
    console.error("Grade subjective submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate student submission.",
      error: error.message,
    });
  }
};

/* =========================================================
   VIEW STUDENT'S UPLOADED PDF
========================================================= */

export const viewSubjectiveSubmissionFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await Result.findById(id).select(
      "fileId fileName fileContentType"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (!submission.fileId) {
      return res.status(404).json({
        success: false,
        message: "No PDF is attached to this submission.",
      });
    }

    if (!mongoose.connection.db) {
      return res.status(500).json({
        success: false,
        message: "Database connection is not ready.",
      });
    }

    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "subjectiveSubmissions",
      }
    );

    const files = await bucket
      .find({ _id: submission.fileId })
      .toArray();

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "Uploaded PDF could not be found.",
      });
    }

    const filename = String(
      submission.fileName || files[0].filename || "student-answer.pdf"
    ).replace(/[\r\n"]/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"`
    );
    res.setHeader("X-Content-Type-Options", "nosniff");

    const downloadStream = bucket.openDownloadStream(submission.fileId);

    downloadStream.on("error", (error) => {
      console.error("PDF download stream error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Unable to open the uploaded PDF.",
        });
      } else {
        res.destroy(error);
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("View subjective PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to open the uploaded PDF.",
        error: error.message,
      });
    }
  }
};
