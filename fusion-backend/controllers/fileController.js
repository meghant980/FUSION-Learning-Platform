
import mongoose from "mongoose";
import multer from "multer";

const BUCKET_NAME = "uploads";

// Use the MongoDB driver provided by Mongoose.
// This is the driver that passed our GridFS upload test.
const getBucket = () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error("MongoDB is not connected yet.");
  }

  const GridFSBucket = mongoose.mongo.GridFSBucket;

  return new GridFSBucket(mongoose.connection.db, {
    bucketName: BUCKET_NAME,
  });
};

const normalizeUnit = (value) => {
  const cleaned = String(value || "").trim();

  if (!cleaned) return "";

  return cleaned.toLowerCase().startsWith("unit")
    ? cleaned.toLowerCase()
    : `unit ${cleaned}`.toLowerCase();
};

const normalizeText = (value) =>
  String(value || "").trim().toLowerCase();

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

// =====================================================
// UPLOAD FILE
// =====================================================
export const uploadFile = async (req, res) => {
  console.log("Upload controller reached");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "Please select a file to upload.",
      });
    }

    const subject = normalizeText(req.body.subject);
    const unit = normalizeUnit(req.body.unit);
    const category = normalizeText(req.body.category);

    if (!subject || !unit || !category) {
      return res.status(400).json({
        success: false,
        msg: "Subject, unit and category are required.",
      });
    }

    const bucket = getBucket();

    const metadata = {
      title: String(req.body.title || req.file.originalname).trim(),
      description: String(req.body.description || "").trim(),
      subject,
      unit,
      category,
      uploadedBy: String(req.body.uploadedBy || "Teacher").trim(),
      contentType: req.file.mimetype,
    };

    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      {
        contentType: req.file.mimetype,
        metadata,
      }
    );

    uploadStream.on("error", (error) => {
      console.error("GRIDFS UPLOAD ERROR:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          msg: error.message || "File upload failed.",
        });
      }
    });

    uploadStream.on("finish", () => {
      console.log("GridFS upload completed:", uploadStream.filename);

      if (!res.headersSent) {
        res.status(201).json({
          success: true,
          msg: "File uploaded successfully!",
          file: {
            id: uploadStream.id,
            filename: uploadStream.filename,
            metadata,
          },
        });
      }
    });

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("UPLOAD CONTROLLER ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: error.message || "Upload failed.",
      });
    }
  }
};

// =====================================================
// FILTER FILES
// =====================================================
export const getFilteredFiles = async (req, res) => {
  try {
    const subject = normalizeText(req.query.subject);
    const unit = normalizeUnit(req.query.unit);
    const category = normalizeText(req.query.category);

    if (!subject || !unit || !category) {
      return res.status(400).json({
        success: false,
        msg: "Subject, unit and category are required.",
      });
    }

    const db = mongoose.connection.db;

    if (mongoose.connection.readyState !== 1 || !db) {
      throw new Error("MongoDB is not connected.");
    }

    const files = await db
      .collection(`${BUCKET_NAME}.files`)
      .find({
        "metadata.subject": subject,
        "metadata.unit": unit,
        "metadata.category": category,
      })
      .sort({ uploadDate: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Fetch files error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to fetch files.",
      error: error.message,
    });
  }
};

// =====================================================
// GET FILES BY UNIT
// =====================================================
export const getFilesByUnit = async (req, res) => {
  try {
    const subject = normalizeText(req.query.subject);
    const unit = normalizeUnit(req.query.unit);

    if (!subject || !unit) {
      return res.status(400).json({
        success: false,
        msg: "Subject and unit are required.",
      });
    }

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB is not connected.");
    }

    const files = await db
      .collection(`${BUCKET_NAME}.files`)
      .find({
        "metadata.subject": subject,
        "metadata.unit": unit,
        "metadata.category": "notes",
      })
      .sort({ uploadDate: -1 })
      .toArray();

    return res.status(200).json(files);
  } catch (error) {
    console.error("Get files by unit error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to fetch files.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL FILES
// =====================================================
export const getAllFiles = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB is not connected.");
    }

    const files = await db
      .collection(`${BUCKET_NAME}.files`)
      .find({})
      .sort({ uploadDate: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Get all files error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to fetch files.",
      error: error.message,
    });
  }
};

// =====================================================
// DOWNLOAD FILE
// =====================================================
export const getFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB is not connected.");
    }

    const file = await db
      .collection(`${BUCKET_NAME}.files`)
      .findOne({ filename });

    if (!file) {
      return res.status(404).json({
        success: false,
        msg: "File not found.",
      });
    }

    const bucket = getBucket();

    res.setHeader(
      "Content-Type",
      file.metadata?.contentType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.filename)}"`
    );

    const downloadStream = bucket.openDownloadStream(file._id);

    downloadStream.on("error", (error) => {
      console.error("Download error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          msg: "Unable to download file.",
        });
      } else {
        res.end();
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        msg: error.message,
      });
    }
  }
};

// =====================================================
// DELETE FILE
// =====================================================
export const deleteFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB is not connected.");
    }

    const file = await db
      .collection(`${BUCKET_NAME}.files`)
      .findOne({ filename });

    if (!file) {
      return res.status(404).json({
        success: false,
        msg: "File not found.",
      });
    }

    const bucket = getBucket();

    await bucket.delete(file._id);

    return res.status(200).json({
      success: true,
      msg: "File deleted successfully.",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to delete file.",
      error: error.message,
    });
  }
};
