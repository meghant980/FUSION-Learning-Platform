
import mongoose from "mongoose";

import Assignment from "../models/Assignment.js";
import Performance from "../models/Performance.js";
import Result from "../models/result.js";
import User from "../models/user.js";

/* =========================================================
   SUPPORTED LANGUAGES AND HELPERS
========================================================= */

const SUPPORTED_SUBJECTS = [
  "c",
  "cpp",
  "java",
  "python",
  "javascript",
];

const normalizeSubject = (subject) => {
  const value = String(subject ?? "c").trim().toLowerCase() || "c";

  if (value === "c++") return "cpp";

  return SUPPORTED_SUBJECTS.includes(value) ? value : null;
};

const getSubjectFilter = (subject) => {
  const normalized = normalizeSubject(subject);

  if (!normalized) {
    return { subject: "__invalid_subject__" };
  }

  // Preserve older C records which may not have a subject field.
  if (normalized === "c") {
    return {
      $or: [
        { subject: "c" },
        { subject: { $exists: false } },
        { subject: null },
        { subject: "" },
      ],
    };
  }

  return { subject: normalized };
};

const getUnitNumber = (value) => {
  const unit = Number(value);

  return Number.isInteger(unit) && unit >= 1 && unit <= 4
    ? unit
    : null;
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.body?.userId || null;

const getStudentSection = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
    return "";
  }

  const user = await User.findById(userId).select("section");
  return user?.section || "";
};

/* =========================================================
   CREATE MCQ ASSIGNMENT
========================================================= */

export const createAssignment = async (req, res) => {
  try {
    const {
      unit,
      subject,
      title,
      description,
      deadline,
      questions,
      section,
      teacherId,
    } = req.body;

    const unitNumber = getUnitNumber(unit);
    const normalizedSubject = normalizeSubject(subject);

    if (!unitNumber) {
      return res.status(400).json({
        success: false,
        message: "A valid unit is required.",
      });
    }

    if (!normalizedSubject) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid programming language.",
      });
    }

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Assignment title and description are required.",
      });
    }

    if (!section?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a section.",
      });
    }

    if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid deadline is required.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one question is required.",
      });
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (
        !question.questionText?.trim() ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.some((option) => !String(option).trim()) ||
        !question.correctAnswer?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `Please complete Question ${i + 1} and all its options.`,
        });
      }

      const options = question.options.map((option) =>
        String(option).trim().toLowerCase()
      );

      if (!options.includes(question.correctAnswer.trim().toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Correct answer for Question ${i + 1} must match one of its options.`,
        });
      }
    }

    const assignment = await Assignment.create({
      unit: unitNumber,
      subject: normalizedSubject,
      type: "quiz",
      title: title.trim(),
      description: description.trim(),
      deadline: new Date(deadline),
      section: section.trim(),
      questions,
      createdBy: req.user?.id || teacherId || undefined,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Create MCQ assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create assignment.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ASSIGNMENTS FOR STUDENT
========================================================= */

export const getAssignment = async (req, res) => {
  try {
    const unit = getUnitNumber(req.query.unit);
    const rollNumber = String(req.query.rollNumber || "").trim();
    const subject = normalizeSubject(req.query.subject);

    if (!unit || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Unit and roll number are required.",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Invalid programming language.",
      });
    }

    const student = await User.findOne({
      rollNumber: {
        $regex: `^${escapeRegex(rollNumber)}$`,
        $options: "i",
      },
    }).select("section");

    const filter = {
      unit,
      type: "quiz",
      isActive: true,
      ...getSubjectFilter(subject),
    };

    if (student?.section) {
      filter.section = {
        $regex: `^${escapeRegex(student.section)}$`,
        $options: "i",
      };
    }

    const assignments = await Assignment.find(filter)
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get student assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL ASSIGNMENTS
========================================================= */

export const getAllAssignments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.unit) {
      const unit = getUnitNumber(req.query.unit);

      if (!unit) {
        return res.status(400).json({
          success: false,
          message: "Invalid unit.",
        });
      }

      filter.unit = unit;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.subject !== undefined) {
      const subject = normalizeSubject(req.query.subject);

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: "Invalid programming language.",
        });
      }

      Object.assign(filter, getSubjectFilter(subject));
    }

    if (req.query.section) {
      filter.section = {
        $regex: `^${escapeRegex(req.query.section.trim())}$`,
        $options: "i",
      };
    }

    const assignments = await Assignment.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get all assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments.",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE ASSIGNMENT
========================================================= */

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    await Performance.deleteMany({
      assignmentId: assignment._id,
    });

    await Result.deleteMany({
      assignmentId: assignment._id,
    });

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete assignment.",
      error: error.message,
    });
  }
};

/* =========================================================
   SAVE MCQ PERFORMANCE
========================================================= */

export const savePerformance = async (req, res) => {
  try {
    const { studentName, rollNumber, assignmentId } = req.body;

    if (!studentName?.trim() || !rollNumber?.trim() || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: "Student name, roll number and assignment ID are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      type: "quiz",
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found or no longer active.",
      });
    }

    if (assignment.deadline && new Date() > assignment.deadline) {
      return res.status(400).json({
        success: false,
        message: "The deadline for this assignment has passed.",
      });
    }

    const existing = await Performance.findOne({
      rollNumber: String(rollNumber).trim(),
      assignmentId: assignment._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already attempted this assignment.",
      });
    }

    const answers = Array.isArray(req.body.answers)
      ? req.body.answers
      : [];

    if (answers.length !== assignment.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Please submit answers to all questions.",
      });
    }

    let correct = 0;

    assignment.questions.forEach((question, index) => {
      const submitted = String(answers[index] || "")
        .trim()
        .toLowerCase();

      const expected = String(question.correctAnswer || "")
        .trim()
        .toLowerCase();

      if (submitted === expected) {
        correct++;
      }
    });

    const total = assignment.questions.length;
    const wrong = total - correct;
    const accuracy = Number(((correct / total) * 100).toFixed(2));

    const performance = await Performance.create({
      studentName: studentName.trim(),
      rollNumber: String(rollNumber).trim(),
      correct,
      wrong,
      accuracy,
      unit: String(assignment.unit),
      section: assignment.section || "Not specified",
      assignmentId: assignment._id,
      subject: normalizeSubject(assignment.subject),
      date: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Performance saved successfully.",
      performance,
    });
  } catch (error) {
    console.error("Save performance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save performance.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL PERFORMANCE RECORDS
========================================================= */

export const getAllPerformances = async (req, res) => {
  try {
    const { unit, section, assignmentId, type, subject } = req.query;

    const performanceFilter = {};
    const assignmentFilter = {};

    if (unit) {
      const unitNumber = getUnitNumber(unit);

      if (!unitNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid unit.",
        });
      }

      performanceFilter.unit = String(unitNumber);
      assignmentFilter.unit = unitNumber;
    }

    if (section) {
      const safeSection = String(section).trim();

      performanceFilter.section = {
        $regex: `^${escapeRegex(safeSection)}$`,
        $options: "i",
      };

      assignmentFilter.section = {
        $regex: `^${escapeRegex(safeSection)}$`,
        $options: "i",
      };
    }

    if (type) {
      assignmentFilter.type = type;
    }

    if (subject !== undefined) {
      const normalizedSubject = normalizeSubject(subject);

      if (!normalizedSubject) {
        return res.status(400).json({
          success: false,
          message: "Invalid programming language.",
        });
      }

      Object.assign(
        assignmentFilter,
        getSubjectFilter(normalizedSubject)
      );
    }

    if (assignmentId) {
      if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment ID.",
        });
      }

      const assignment = await Assignment.findOne({
        _id: assignmentId,
        ...assignmentFilter,
      }).select("_id");

      if (!assignment) {
        return res.status(200).json({
          success: true,
          performances: [],
        });
      }

      performanceFilter.assignmentId = assignment._id;
    } else {
      const matchingAssignments = await Assignment.find(
        assignmentFilter
      ).select("_id");

      const ids = matchingAssignments.map((item) => item._id);

      if (ids.length === 0) {
        return res.status(200).json({
          success: true,
          performances: [],
        });
      }

      performanceFilter.assignmentId = {
        $in: ids,
      };
    }

    const performances = await Performance.find(performanceFilter)
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      performances,
    });
  } catch (error) {
    console.error("Get performances error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch performances.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ASSIGNMENTS BY UNIT
========================================================= */

export const getAssignmentsByUnit = async (req, res) => {
  try {
    const unit = getUnitNumber(req.params.unit);

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: "Invalid unit number.",
      });
    }

    const filter = { unit };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.subject !== undefined) {
      const subject = normalizeSubject(req.query.subject);

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: "Invalid programming language.",
        });
      }

      Object.assign(filter, getSubjectFilter(subject));
    }

    if (req.query.section) {
      filter.section = {
        $regex: `^${escapeRegex(req.query.section.trim())}$`,
        $options: "i",
      };
    }

    const assignments = await Assignment.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get assignments by unit error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unit assignments.",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE SUBJECTIVE ASSIGNMENT
========================================================= */

export const createSubjectiveAssignment = async (req, res) => {
  try {
    const {
      question,
      keywords,
      maxMarks,
      unit,
      deadline,
      section,
      subject,
    } = req.body;

    const unitNumber = getUnitNumber(unit);
    const marks = Number(maxMarks);
    const normalizedSubject = normalizeSubject(subject);

    if (!unitNumber || !question?.trim() || !section?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question, valid unit and section are required.",
      });
    }

    if (!normalizedSubject) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid programming language.",
      });
    }

    if (!Number.isFinite(marks) || marks <= 0) {
      return res.status(400).json({
        success: false,
        message: "Maximum marks must be greater than zero.",
      });
    }

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one evaluation keyword is required.",
      });
    }

    if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid deadline is required.",
      });
    }

    const cleanedKeywords = keywords
      .map((keyword) => String(keyword).trim())
      .filter(Boolean);

    if (cleanedKeywords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid evaluation keyword is required.",
      });
    }

    const assignment = await Assignment.create({
      unit: unitNumber,
      subject: normalizedSubject,
      type: "subjective",
      title: `Subjective Assignment - Unit ${unitNumber}`,
      description: question.trim(),
      question: question.trim(),
      keywords: cleanedKeywords,
      maxMarks: marks,
      deadline: new Date(deadline),
      section: section.trim(),
      createdBy: getUserId(req) || undefined,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Subjective assignment created successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Create subjective assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subjective assignment.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE SUBJECTIVE ASSIGNMENT
========================================================= */

export const updateSubjectiveAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const assignment = await Assignment.findOne({
      _id: id,
      type: "subjective",
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Subjective assignment not found.",
      });
    }

    const allowedFields = [
      "question",
      "keywords",
      "maxMarks",
      "deadline",
      "section",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        assignment[field] = req.body[field];
      }
    });

    if (req.body.question !== undefined) {
      assignment.description = String(req.body.question).trim();
    }

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Subjective assignment updated successfully.",
      assignment,
    });
  } catch (error) {
    console.error("Update subjective assignment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subjective assignment.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SUBJECTIVE ASSIGNMENTS FOR STUDENT
========================================================= */

export const getSubjectiveAssignmentsForStudent = async (req, res) => {
  try {
    const unit = getUnitNumber(req.query.unit);
    const subject = normalizeSubject(req.query.subject);

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: "A valid unit is required.",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Invalid programming language.",
      });
    }

    const userId = getUserId(req);
    const section = await getStudentSection(userId);

    const filter = {
      unit,
      type: "subjective",
      isActive: true,
      ...getSubjectFilter(subject),
    };

    if (section) {
      filter.section = {
        $regex: `^${escapeRegex(section)}$`,
        $options: "i",
      };
    }

    const assignments = await Assignment.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get student subjective assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjective assignments.",
      error: error.message,
    });
  }
};

/* =========================================================
   SUBMIT SUBJECTIVE ANSWER
========================================================= */

export const submitSubjectiveAnswer = async (req, res) => {
  let uploadedFileId = null;

  try {
    const assignmentId = req.body.assignmentId;
    const answer = String(req.body.answer || "").trim();
    const userId = getUserId(req);

    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      return res.status(401).json({
        success: false,
        message: "Please log in before submitting your answer.",
      });
    }

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "A valid assignment ID is required.",
      });
    }

    if (!answer && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please write an answer or upload a PDF.",
      });
    }

    if (req.file) {
      if (req.file.size > 25 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "PDF must be 25 MB or smaller.",
        });
      }

      if (
        req.file.mimetype !== "application/pdf" &&
        !String(req.file.originalname || "").toLowerCase().endsWith(".pdf")
      ) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are accepted.",
        });
      }
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      type: "subjective",
      isActive: true,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Subjective assignment not found or inactive.",
      });
    }

    if (assignment.deadline && new Date() > assignment.deadline) {
      return res.status(400).json({
        success: false,
        message: "The deadline for this assignment has passed.",
      });
    }

    const student = await User.findById(userId).select(
      "name email rollNumber section"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student account not found.",
      });
    }

    if (
      student.section &&
      assignment.section &&
      student.section.toLowerCase() !== assignment.section.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "This assignment is not assigned to your section.",
      });
    }

    const existing = await Result.findOne({
      assignmentId: assignment._id,
      studentId: student._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this assignment.",
        submission: existing,
      });
    }

    let fileMetadata = {
      fileId: null,
      fileName: "",
      fileContentType: "",
    };

    if (req.file) {
      if (!mongoose.connection.db) {
        throw new Error("Database connection is not ready.");
      }

      const bucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        { bucketName: "subjectiveSubmissions" }
      );

      const filename = `${Date.now()}-${String(
        req.file.originalname || "answer.pdf"
      ).replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: "application/pdf",
        metadata: {
          assignmentId: String(assignment._id),
          studentId: String(student._id),
        },
      });

      await new Promise((resolve, reject) => {
        uploadStream.once("error", reject);
        uploadStream.once("finish", resolve);
        uploadStream.end(req.file.buffer);
      });

      uploadedFileId = uploadStream.id;

      fileMetadata = {
        fileId: uploadedFileId,
        fileName: req.file.originalname || filename,
        fileContentType: "application/pdf",
      };
    }

    const submission = await Result.create({
      studentId: student._id,
      assignmentId: assignment._id,
      section: student.section || assignment.section || "Not specified",
      subject: normalizeSubject(assignment.subject),
      unit: assignment.unit,
      answer,
      ...fileMetadata,
      marks: null,
      feedback: "",
      status: "submitted",
    });

    return res.status(201).json({
      success: true,
      message: "Your answer has been submitted successfully.",
      submission: {
        ...submission.toObject(),
        assignmentId: assignment._id,
      },
    });
  } catch (error) {
    console.error("Submit subjective answer error:", error);

    if (uploadedFileId && mongoose.connection.db) {
      try {
        const bucket = new mongoose.mongo.GridFSBucket(
          mongoose.connection.db,
          { bucketName: "subjectiveSubmissions" }
        );

        await bucket.delete(uploadedFileId);
      } catch (cleanupError) {
        console.error("PDF cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit your answer.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SUBJECTIVE RESULTS FOR TEACHER
========================================================= */

export const getSubjectiveResults = async (req, res) => {
  try {
    const { assignmentId, unit, subject } = req.query;

    const filter = {};

    if (assignmentId) {
      if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment ID.",
        });
      }

      filter.assignmentId = assignmentId;
    }

    if (unit) {
      const unitNumber = getUnitNumber(unit);

      if (!unitNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid unit.",
        });
      }

      filter.unit = unitNumber;
    }

    if (subject !== undefined) {
      const normalizedSubject = normalizeSubject(subject);

      if (!normalizedSubject) {
        return res.status(400).json({
          success: false,
          message: "Invalid programming language.",
        });
      }

      Object.assign(
        filter,
        getSubjectFilter(normalizedSubject)
      );
    }

    const results = await Result.find(filter)
      .populate("studentId", "name email rollNumber section")
      .populate("assignmentId", "title question maxMarks unit subject")
      .sort({ createdAt: -1 });

    const formattedResults = results.map((result) => {
      const item = result.toObject();
      item.userId = item.studentId;
      return item;
    });

    return res.status(200).json({
      success: true,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Get subjective results error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjective results.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET STUDENT SUBJECTIVE SUBMISSIONS
========================================================= */

export const getStudentSubmissions = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      return res.status(400).json({
        success: false,
        message: "A valid student ID is required.",
      });
    }

    const filter = {
      studentId: userId,
    };

    if (req.query.subject !== undefined) {
      const subject = normalizeSubject(req.query.subject);

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: "Invalid programming language.",
        });
      }

      Object.assign(filter, getSubjectFilter(subject));
    }

    const submissions = await Result.find(filter)
      .populate(
        "assignmentId",
        "title question maxMarks unit deadline subject"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Get student submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student submissions.",
      error: error.message,
    });
  }
};
