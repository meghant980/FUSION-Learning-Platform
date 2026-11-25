
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      trim: true,
      default: "",
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    unit: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 1,
    },

    subject: {
      type: String,
      enum: ["c", "cpp", "java", "python", "javascript"],
      lowercase: true,
      trim: true,
      default: "c",
    },

    type: {
      type: String,
      enum: ["quiz", "subjective"],
      default: "quiz",
    },

    // Quiz duration in minutes
    durationMinutes: {
      type: Number,
      min: 1,
      max: 180,
      default: 10,
    },

    deadline: {
      type: Date,
      default: null,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    // Subjective assignment fields
    question: {
      type: String,
      trim: true,
      default: "",
    },

    keywords: {
      type: [String],
      default: [],
    },

    maxMarks: {
      type: Number,
      min: 0,
      default: 10,
    },

    section: {
      type: String,
      trim: true,
      default: "",
    },

    // Teacher information
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    teacherId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({
  subject: 1,
  unit: 1,
  type: 1,
});

const Assignment =
  mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);

export default Assignment;
