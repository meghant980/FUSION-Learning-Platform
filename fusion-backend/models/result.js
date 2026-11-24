
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      enum: ["c", "cpp", "java", "python", "javascript"],
      default: "c",
      lowercase: true,
      trim: true,
    },

    unit: {
      type: Number,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    fileName: {
      type: String,
      default: "",
    },

    fileContentType: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["submitted", "evaluated"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index(
  { assignmentId: 1, studentId: 1 },
  { unique: true }
);

export default mongoose.model("Result", resultSchema);
