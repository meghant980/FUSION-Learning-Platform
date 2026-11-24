
import mongoose from "mongoose";

const testcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true },
  visible: { type: Boolean, default: true },
});

const evaluationStepSchema = new mongoose.Schema({
  stepId: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "code-contains",
      "code-regex",
      "all-testcases-pass",
      "min-testcases-pass",
      "Code contains substring",
      "Code matches regex",
    ],
    required: true,
  },
  value: { type: String, default: "" },
  minPassed: { type: Number, default: 0 },
  marks: { type: Number, required: true },
});

const codingQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  category: {
    type: String,
    enum: ["practice", "assignment"],
    default: "practice",
  },

  unit: { type: String },

  language: {
    type: String,
    enum: ["c", "cpp", "java", "python", "javascript"],
    lowercase: true,
    required: true,
  },

  testcases: {
    type: [testcaseSchema],
    default: [],
  },

  evaluationSteps: {
    type: [evaluationStepSchema],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CodingQuestion", codingQuestionSchema);
