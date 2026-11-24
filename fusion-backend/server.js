import feedbackRoutes from "./routes/feedbackRoutes.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import pptRoutes from "./routes/pptRoutes.js";
import evaluatecodeRoutes from "./routes/evaluatecodeRoutes.js";

dotenv.config();

const app = express();

// --------------------------------------------------
// BASIC SECURITY
// --------------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Render runs the application behind a reverse proxy.
app.set("trust proxy", 1);

// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://fusion-0-1.vercel.app",
];

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || "").split(","),
]
  .map((origin) => origin?.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...defaultAllowedOrigins,
    ...configuredOrigins,
  ]),
];

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without an Origin header can include
    // server-to-server requests and local tools.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// --------------------------------------------------
// RATE LIMITING
// --------------------------------------------------

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// --------------------------------------------------
// REQUEST BODY PARSING
// --------------------------------------------------

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/seed", seedRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ppt", pptRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/code", evaluatecodeRoutes);
app.use("/api/submit", submitRoutes);

// --------------------------------------------------
// HOME / HEALTH ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).send("Fusion Backend Running");
});

app.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    server: "Fusion Backend",
    database: databaseReady ? "connected" : "not connected",
  });
});

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    msg: "Internal Server Error",
  });
});

// --------------------------------------------------
// START SERVER AFTER DATABASE CONNECTION
// --------------------------------------------------

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  const PORT = Number(process.env.PORT) || 5001;

  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Connected");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected.");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fusion Backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Fusion startup failed:", error.message);
  process.exit(1);
});
