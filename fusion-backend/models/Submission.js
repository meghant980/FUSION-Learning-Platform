
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingQuestion",
    required: false,
  },

  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: false,
  },

  unit: {
    type: String,
    default: "",
  },

  code: {
    type: String,
    default: "",
  },

  language: {
    type: String,
    default: "",
    lowercase: true,
  },

  status: {
    type: String,
    default: "Submitted",
  },

  passed: {
    type: Number,
    default: 0,
  },

  total: {
    type: Number,
    default: 0,
  },

  totalMarks: {
    type: Number,
    default: 0,
  },

  maxMarks: {
    type: Number,
    default: 0,
  },

  marks: {
    type: Number,
    default: 0,
  },

  feedback: {
    type: String,
    default: "",
  },

  stepResults: [
    {
      label: String,
      passed: Boolean,
      marksAwarded: Number,
      marksTotal: Number,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

submissionSchema.index({ questionId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Submission", submissionSchema);
