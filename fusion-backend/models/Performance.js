
import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },

  rollNumber: {
    type: String,
    required: true,
  },

  correct: {
    type: Number,
    required: true,
  },

  wrong: {
    type: Number,
    required: true,
  },

  accuracy: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    default: "Unit 1",
  },

  section: {
    type: String,
    required: true,
  },

  // Connects each performance record to its assignment.
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: false,
  },

  // Supports all five programming languages.
  subject: {
    type: String,
    enum: ["c", "cpp", "java", "python", "javascript"],
    lowercase: true,
    trim: true,
    default: "c",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Performance", performanceSchema);
