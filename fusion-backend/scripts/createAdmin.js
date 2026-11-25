
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@fusion.com";
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== "admin") {
        throw new Error("Email already belongs to a non-admin account.");
      }

      console.log("Admin account already exists.");
    } else {
      const password = process.env.ADMIN_PASSWORD;

      if (!password || password.length < 12) {
        throw new Error("Set a strong ADMIN_PASSWORD in Render Environment.");
      }

      await User.create({
        name: "Fusion Admin",
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
        passwordSet: true,
        isApproved: true
      });

      console.log("Admin account created successfully.");
    }
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
