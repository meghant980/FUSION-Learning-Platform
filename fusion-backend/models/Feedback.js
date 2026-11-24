import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  rollNumber: { type: String, trim: true, default: "" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  category: { type: String, enum: ["Learning Content", "Coding Practice", "Website Experience", "Performance", "Other"], default: "Website Experience" },
  message: { type: String, required: true, trim: true, maxlength: 1200 },
  source: { type: String, enum: ["student_submitted", "seeded_demo"], default: "student_submitted", index: true },
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
