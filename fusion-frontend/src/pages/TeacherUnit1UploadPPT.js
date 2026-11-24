
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit1UploadPPT({
  course = "c",
  unit = 1
}) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!title.trim()) {
      setMessage("Please enter a title.");
      setSuccess(false);
      return;
    }

    if (!file) {
      setMessage("Please select a PPT file first.");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);
      setMessage("");

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", "PPT");
      formData.append("unit", String(unit));
      formData.append("subject", course);
      formData.append("uploadedBy", "Teacher");
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/api/files/upload`,
        formData
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        setMessage("Presentation uploaded successfully!");

        setTitle("");
        setDescription("");
        setFile(null);
      }
    } catch (error) {
      console.error("PPT upload error:", error);

      setMessage(
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Unable to upload the presentation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-upload-page">

      {/* HEADER */}
      <header className="teacher-upload-header">
        <div className="teacher-upload-brand">FUSION</div>

        <h1>Upload Presentation</h1>

        <p>
          Share PowerPoint presentations and visual learning
          resources with your students.
        </p>
      </header>

      {/* UPLOAD FORM */}
      <main className="teacher-upload-main">
        <div className="teacher-upload-card">

          <div className="teacher-upload-intro">
            <h2>Presentation Details</h2>
            <p>
              Add a title, description and select the presentation
              file you want to upload.
            </p>
          </div>

          {/* TITLE */}
          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-title">Presentation Title</label>

            <input
              id="ppt-title"
              type="text"
              placeholder="e.g. Unit 1 - Introduction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-description">Description</label>

            <textarea
              id="ppt-description"
              placeholder="Write a short description about this presentation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* CATEGORY AND UNIT */}
          <div className="teacher-upload-form-row">

            <div className="teacher-upload-form-group">
              <label>Material Category</label>

              <select value="PPT" disabled>
                <option value="PPT">Presentation (PPT)</option>
              </select>
            </div>

            <div className="teacher-upload-form-group">
              <label>Unit</label>

              <select value={String(unit)} disabled>
                <option value={String(unit)}>
                  Unit {unit}
                </option>
              </select>
            </div>

          </div>

          {/* FILE UPLOAD */}
          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-file">Select Presentation</label>

            <label
              htmlFor="ppt-file"
              className="teacher-upload-file-box"
            >
              <span className="teacher-upload-file-icon">
                📊
              </span>

              <span className="teacher-upload-file-title">
                {file ? file.name : "Click here to choose a file"}
              </span>

              <span className="teacher-upload-file-subtitle">
                {file
                  ? "File selected successfully"
                  : "Select a PPT, PPTX or PDF presentation"}
              </span>
            </label>

            <input
              id="ppt-file"
              type="file"
              accept=".ppt,.pptx,.pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

            <small className="teacher-upload-help">
              Supported formats: PPT, PPTX, PDF, JPG, JPEG and PNG.
            </small>
          </div>

          {/* UPLOAD BUTTON */}
          <button
            type="button"
            className="teacher-upload-submit"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Presentation"}
          </button>

          {/* STATUS MESSAGE */}
          {message && (
            <p
              className={`teacher-upload-message ${
                success ? "success" : "error"
              }`}
            >
              {success ? "✓ " : "⚠ "}
              {message}
            </p>
          )}

        </div>
      </main>

      {/* BOTTOM ACTIONS */}
      <div className="teacher-upload-actions">

        {success && (
          <button
            type="button"
            className="teacher-upload-secondary"
            onClick={() => navigate("/view-uploads")}
          >
            View Uploaded Materials
          </button>
        )}

        <button
          type="button"
          className="teacher-upload-back"
          onClick={() => navigate(`/teacher/unit${unit}`)}
        >
          ← Back to Unit {unit}
        </button>

      </div>

    </div>
  );
}
