import express from "express";
import Feedback from "../models/Feedback.js";
import { protect, adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

// Students submit feedback from inside FUSION. Identity is taken from the signed-in account.
router.post("/", protect, async (req, res) => {
  try {
    if (!["student", "test_student"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only students can submit feedback." });
    }
    const { rating, category, message } = req.body || {};
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5 || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ msg: "Please select a rating and enter your feedback." });
    }
    if (message.trim().length > 1200) return res.status(400).json({ msg: "Feedback must be under 1200 characters." });
    const feedback = await Feedback.create({
      user: req.user.id,
      name: req.user.name,
      email: req.user.email,
      rollNumber: req.user.rollNumber || "",
      rating: score,
      category: ["Learning Content", "Coding Practice", "Website Experience", "Performance", "Other"].includes(category) ? category : "Website Experience",
      message: message.trim(),
      source: "student_submitted",
    });
    return res.status(201).json({ msg: "Thank you! Your feedback has been submitted.", feedback });
  } catch (error) {
    console.error("FEEDBACK SUBMIT ERROR:", error.message);
    return res.status(500).json({ msg: "Unable to submit feedback right now." });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const items = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20).lean();
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to load your feedback." });
  }
});

// Admin view includes provenance so seeded examples are never confused with student submissions.
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 }).limit(500).lean();
    const real = items.filter((item) => item.source === "student_submitted");
    const average = real.length ? Number((real.reduce((sum, item) => sum + item.rating, 0) / real.length).toFixed(1)) : 0;
    return res.json({ items, summary: { total: items.length, submitted: real.length, averageRating: average } });
  } catch (error) {
    console.error("FEEDBACK ADMIN ERROR:", error.message);
    return res.status(500).json({ msg: "Unable to load feedback records." });
  }
});

export default router;
