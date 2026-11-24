import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Verify the login token and fetch the user's CURRENT account details.
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please log in.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization token.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing.");

    return res.status(500).json({
      success: false,
      message: "Server authentication configuration error.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }

  const userId = decoded.id || decoded._id || decoded.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid token: user ID is missing.",
    });
  }

  try {
    const user = await User.findById(userId).select(
      "_id name email role isApproved section sections rollNumber"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please log in again.",
      });
    }

    if (user.role === "teacher" && user.isApproved !== true) {
      return res.status(403).json({
        success: false,
        message: "Your teacher account is not approved.",
      });
    }

    req.user = {
      ...decoded,
      id: user._id.toString(),
      _id: user._id,
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      section: user.section,
      sections: user.sections,
      rollNumber: user.rollNumber,
    };

    return next();
  } catch (error) {
    console.error("AUTHENTICATION DATABASE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your account.",
    });
  }
};

// Only administrators can access these operations.
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required.",
    });
  }

  return next();
};

// Teachers and administrators can access these operations.
export const teacherOrAdminOnly = (req, res, next) => {
  if (
    !req.user ||
    !["teacher", "admin"].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: "Teacher or administrator access required.",
    });
  }

  return next();
};