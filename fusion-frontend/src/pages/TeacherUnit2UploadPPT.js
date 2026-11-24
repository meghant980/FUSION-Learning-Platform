
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit2UploadPPT({ course = "c", unit = 2 }) {
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
        setMessage("PPT uploaded successfully!");

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
        "Unable to upload the PPT. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-upload-page">
      <header className="teacher-upload-header">
        <div className="teacher-upload-brand">FUSION</div>
        <h1>Upload Presentation</h1>
        <p>Share Unit 2 presentations and visual learning resources.</p>
      </header>

      <main className="teacher-upload-main">
        <div className="teacher-upload-card">
          <div className="teacher-upload-intro">
            <h2>Presentation Details</h2>
            <p>Enter the presentation details and select your PPT file.</p>
          </div>

          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-title">Title</label>
            <input
              id="ppt-title"
              type="text"
              placeholder="Enter presentation title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-description">Description</label>
            <textarea
              id="ppt-description"
              placeholder="Enter a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="teacher-upload-form-row">
            <div className="teacher-upload-form-group">
              <label>Category</label>
              <input type="text" value="PPT" disabled />
            </div>

            <div className="teacher-upload-form-group">
              <label>Unit</label>
              <input type="text" value={`Unit ${unit}`} disabled />
            </div>
          </div>

          <div className="teacher-upload-form-group">
            <label htmlFor="ppt-file">Upload Presentation</label>

            <label
              htmlFor="ppt-file"
              className="teacher-upload-file-box"
            >
              <span className="teacher-upload-file-icon">📊</span>

              <span>
                <span className="teacher-upload-file-title">
                  {file ? file.name : "Choose a presentation"}
                </span>

                <span className="teacher-upload-file-subtitle">
                  {file
                    ? "File selected successfully"
                    : "Supported formats: .ppt and .pptx"}
                </span>
              </span>
            </label>

            <input
              id="ppt-file"
              type="file"
              accept=".ppt,.pptx"
              hidden
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setSuccess(false);
                setMessage("");
              }}
            />
          </div>

          <button
            type="button"
            className="teacher-upload-submit"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Presentation"}
          </button>

          {message && (
            <p
              className={`teacher-upload-message ${
                success ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </main>

      <div className="teacher-upload-actions">
        {success && (
          <button
            className="teacher-upload-secondary"
            onClick={() => navigate("/view-uploads")}
          >
            View Uploaded Material
          </button>
        )}

        <button
          className="teacher-upload-back"
          onClick={() => navigate(`/teacher/unit${unit}`)}
        >
          ← Back to Unit {unit}
        </button>
      </div>
    </div>
  );
}
