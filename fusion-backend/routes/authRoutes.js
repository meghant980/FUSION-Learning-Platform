
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import User from "../models/user.js";
import { protect, adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

// Separate rate limiters for each authentication route.
// Successful requests are not counted.

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    msg: "Too many registration attempts. Please try again after 15 minutes.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    msg: "Too many login attempts. Please try again after 15 minutes.",
  },
});

const setPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    msg: "Too many password setup attempts. Please try again after 15 minutes.",
  },
});

// --------------------------------------------------
// SET PASSWORD
// For accounts already created by an administrator.
// --------------------------------------------------

router.post("/set-password", setPasswordLimiter, async (req, res) => {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_UNVERIFIED_PASSWORD_SETUP !== "true"
    ) {
      return res.status(403).json({
        msg: "Student account verification is required. Please contact your administrator.",
      });
    }

    const { identifier, password } = req.body || {};

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        msg: "Email/roll number and password are required.",
      });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({
        msg: "Password must contain at least 8 characters.",
      });
    }

    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { rollNumber: cleanIdentifier },
      ],
    });

    if (!user) {
      return res.status(404).json({
        msg: "User not found in system.",
      });
    }

    if (!["student", "test_student"].includes(user.role)) {
      return res.status(403).json({
        msg: "This account cannot use student password setup.",
      });
    }

    if (user.passwordSet || user.password) {
      return res.status(400).json({
        msg: "Password already set. Please login.",
      });
    }

    user.password = await bcrypt.hash(password.trim(), 12);
    user.passwordSet = true;

    await user.save();

    return res.status(200).json({
      msg: "Password set successfully. You can now login.",
    });
  } catch (error) {
    console.error("SET PASSWORD ERROR:", error.message);

    return res.status(500).json({
      msg: "Unable to set password. Please try again.",
    });
  }
});

// --------------------------------------------------
// PUBLIC SIGNUP
// STUDENTS: AUTOMATIC APPROVAL
// TEACHERS: ADMIN APPROVAL REQUIRED
// ADMINS: PUBLIC SIGNUP NOT ALLOWED
// --------------------------------------------------

router.post("/signup", signupLimiter, async (req, res) => {
  try {
    const { name, email, password, role, sections } = req.body || {};

    if (
      !["student", "teacher"].includes(role) ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        msg: "Invalid registration details.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        msg: "All required fields must be completed.",
      });
    }

    if (cleanPassword.length < 8) {
      return res.status(400).json({
        msg: "Password must contain at least 8 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        msg: "Please enter a valid email address.",
      });
    }

    if (sections !== undefined && !Array.isArray(sections)) {
      return res.status(400).json({
        msg: "Sections must be provided as a list.",
      });
    }

    const cleanSections = (sections || [])
      .filter((section) => typeof section === "string")
      .map((section) => section.trim())
      .filter(Boolean)
      .slice(0, 20);

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        msg: "An account with this email already exists. Please login.",
      });
    }

    const newUser = new User({
      name: cleanName,
      email: cleanEmail,
      password: await bcrypt.hash(cleanPassword, 12),
      role,
      sections: role === "teacher" ? cleanSections : [],
      isApproved: role === "student",
      passwordSet: true,
    });

    await newUser.save();

    if (role === "student") {
      return res.status(201).json({
        msg: "Student account created successfully. You can now login.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }

    return res.status(201).json({
      msg: "Registration request sent. Wait for admin approval.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        msg: "An account with this email already exists.",
      });
    }

    console.error("SIGNUP ERROR:", error.message);

    return res.status(500).json({
      msg: "Signup failed. Please try again.",
    });
  }
});

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body || {};

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        msg: "Please enter all fields.",
      });
    }

    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { rollNumber: cleanIdentifier },
      ],
    });

    if (!user || !user.password || !user.passwordSet) {
      return res.status(400).json({
        msg: "Invalid credentials or password not yet set.",
      });
    }

    if (user.role === "teacher" && user.isApproved !== true) {
      return res.status(403).json({
        msg: "Your account is pending admin approval.",
      });
    }

    const isMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials or password not yet set.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      return res.status(500).json({
        msg: "Server authentication configuration error.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        section: user.section,
        sections: user.sections,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(500).json({
      msg: "Login failed. Please try again.",
    });
  }
});

// --------------------------------------------------
// GET PENDING TEACHERS - ADMIN ONLY
// --------------------------------------------------

router.get("/pending-teachers", protect, adminOnly, async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isApproved: false,
    })
      .select("name email sections extraField createdAt")
      .sort({ createdAt: -1 });

    return res.json(teachers);
  } catch (error) {
    console.error("PENDING TEACHERS ERROR:", error.message);

    return res.status(500).json({
      msg: "Unable to fetch pending teachers.",
    });
  }
});

// --------------------------------------------------
// GET APPROVED TEACHERS - ADMIN ONLY
// --------------------------------------------------

router.get("/approved-teachers", protect, adminOnly, async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isApproved: true,
    })
      .select("name email sections extraField createdAt")
      .sort({ createdAt: -1 });

    return res.json(teachers);
  } catch (error) {
    console.error("APPROVED TEACHERS ERROR:", error.message);

    return res.status(500).json({
      msg: "Unable to fetch approved teachers.",
    });
  }
});

// --------------------------------------------------
// APPROVE TEACHER - ADMIN ONLY
// --------------------------------------------------

router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        msg: "Invalid teacher ID.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "teacher") {
      return res.status(404).json({
        msg: "Teacher not found.",
      });
    }

    user.isApproved = true;
    await user.save();

    return res.json({
      msg: "Teacher approved successfully.",
    });
  } catch (error) {
    console.error("APPROVE TEACHER ERROR:", error.message);

    return res.status(500).json({
      msg: "Unable to approve teacher.",
    });
  }
});

// --------------------------------------------------
// DISAPPROVE TEACHER - ADMIN ONLY
// --------------------------------------------------

router.put("/disapprove/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        msg: "Invalid teacher ID.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "teacher") {
      return res.status(404).json({
        msg: "Teacher not found.",
      });
    }

    user.isApproved = false;
    await user.save();

    return res.json({
      msg: "Teacher approval revoked successfully.",
    });
  } catch (error) {
    console.error("DISAPPROVE TEACHER ERROR:", error.message);

    return res.status(500).json({
      msg: "Unable to revoke teacher approval.",
    });
  }
});

export default router;
