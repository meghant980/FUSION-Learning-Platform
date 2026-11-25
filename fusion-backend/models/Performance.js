
import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Student's individual answers in question order
    answers: {
      type: [String],
      default: [],
    },

    correct: {
      type: Number,
      required: true,
      default: 0,
    },

    wrong: {
      type: Number,
      required: true,
      default: 0,
    },

    accuracy: {
      type: Number,
      required: true,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "Unit 1",
    },

    section: {
      type: String,
      required: true,
    },

    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: false,
    },

    subject: {
      type: String,
      enum: ["c", "cpp", "java", "python", "javascript"],
      lowercase: true,
      trim: true,
      default: "c",
    },

    // Quiz timing information
    durationMinutes: {
      type: Number,
      min: 1,
      default: 10,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    // Existing records remain submitted by default
    status: {
      type: String,
      enum: ["in_progress", "submitted", "auto_submitted"],
      default: "submitted",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Performance =
  mongoose.models.Performance ||
  mongoose.model("Performance", performanceSchema);

export default Performance;
