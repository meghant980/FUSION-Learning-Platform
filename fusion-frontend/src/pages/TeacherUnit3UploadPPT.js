
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

export default function TeacherUnit3UploadPPT({
  course = "c",
  unit = 3,
}) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for the PPT.");
      return;
    }

    if (!file) {
      setError("Please select a PPT file.");
      return;
    }

    const allowedExtensions = [".ppt", ".pptx"];
    const fileName = file.name.toLowerCase();

    if (!allowedExtensions.some((extension) => fileName.endsWith(extension))) {
      setError("Please select a valid PPT or PPTX file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", desc.trim());
    formData.append("category", "PPT");
    formData.append("unit", `Unit ${unit}`);
    formData.append("subject", course);
    formData.append("uploadedBy", "Teacher");
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");
      setSuccess(false);

      await axios.post(
        "http://localhost:5001/api/files/upload",
        formData
      );

      setSuccess(true);
      setTitle("");
      setDesc("");
      setFile(null);

      const fileInput = document.getElementById("unit3PPTFile");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Unit 3 PPT upload failed:", err);

      setError(
        err.response?.data?.message ||
          "PPT upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-modern-page">
      <header className="upload-header">
        <h1>📊 Upload Presentation</h1>
        <p>Unit {unit} · PPT</p>
      </header>

      <form className="upload-card" onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="unit3PPTTitle">Title</label>
          <input
            id="unit3PPTTitle"
            type="text"
            placeholder="Enter presentation title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit3PPTDescription">Description</label>
          <textarea
            id="unit3PPTDescription"
            placeholder="Enter a short description"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group small">
            <label>Category</label>
            <select value="PPT" disabled>
              <option value="PPT">PPT</option>
            </select>
          </div>

          <div className="form-group small">
            <label>Unit</label>
            <select value={String(unit)} disabled>
              <option value={String(unit)}>Unit {unit}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="unit3PPTFile">Upload Presentation</label>

          <label
            htmlFor="unit3PPTFile"
            className="file-upload-box"
          >
            <span className="file-main">
              📁 {file ? "File selected" : "Click to choose a PPT"}
            </span>

            <span className="file-sub">
              {file ? file.name : "PPT and PPTX files are supported"}
            </span>
          </label>

          <input
            id="unit3PPTFile"
            type="file"
            accept=".ppt,.pptx"
            onChange={(event) =>
              setFile(event.target.files?.[0] || null)
            }
            hidden
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        {success && (
          <p className="success-msg">
            ✔ PPT uploaded successfully!
          </p>
        )}

        <button
          className="upload-btn"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "🚀 Upload PPT"}
        </button>
      </form>

      <div className="upload-actions">
        {success && (
          <button
            className="secondary-btn"
            onClick={() => navigate("/view-uploads")}
          >
            📂 View Uploaded Materials
          </button>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/teacher/unit3")}
        >
          ← Back to Unit 3
        </button>
      </div>
    </div>
  );
}
