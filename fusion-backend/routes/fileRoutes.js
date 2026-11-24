
import express from "express";

import {
  upload,
  uploadFile,
  getAllFiles,
  getFilesByUnit,
  getFile,
  getFilteredFiles,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

// Upload a file with diagnostic logs
router.post(
  "/upload",

  (req, res, next) => {
    console.log("1. Upload request reached fileRoutes.js");
    next();
  },

  upload.single("file"),

  (req, res, next) => {
    console.log("2. Multer finished processing the file");

    if (!req.file) {
      console.log("No file received by Multer");
    } else {
      console.log("File received:", req.file.originalname);
      console.log("File size:", req.file.size);
    }

    next();
  },

  uploadFile,

  (error, req, res, next) => {
    console.error("Upload route error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        msg: error.message || "Upload route failed.",
      });
    }

    next(error);
  }
);

// Get all uploaded files
router.get("/", getAllFiles);

// Filter files
router.get("/filter", getFilteredFiles);

// Get files by unit
router.get("/unit/:unit", (req, res) => {
  req.query.unit = req.params.unit;
  return getFilesByUnit(req, res);
});

// Download file
router.get("/download/:filename", getFile);

// Delete file
router.delete("/:filename", deleteFile);

// Raw file listing
router.get("/raw/all", getAllFiles);

export default router;
