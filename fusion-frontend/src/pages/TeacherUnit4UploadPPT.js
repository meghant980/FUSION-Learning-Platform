
import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit4UploadPPT({ course = "c", unit = 4 }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!title.trim()) {
      setError("Please enter a presentation title.");
      return;
    }

    if (!file) {
      setError("Please select a PowerPoint file.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["ppt", "pptx"].includes(extension)) {
      setError("Only .ppt and .pptx files are allowed.");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", "PPT");
    formData.append("unit", `Unit ${unit}`);
    formData.append("subject", course);
    formData.append("uploadedBy", "Teacher");
    formData.append("file", file);

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      });

      setSuccess("Unit 4 presentation uploaded successfully.");
      setTitle("");
      setDescription("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Unit 4 PPT upload error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to upload the presentation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-modern-page">
      <header className="upload-header">
        <div className="unit-header">
          <div>
            <span>FUSION / TEACHER WORKSPACE / UNIT 04</span>
            <h1>Upload PowerPoint</h1>
            <p>Share presentation material with your students.</p>
          </div>
        </div>
      </header>

      <main className="upload-card">
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="ppt-title">Presentation Title</label>
            <input
              id="ppt-title"
              type="text"
              placeholder="Enter presentation title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ppt-description">Description</label>
            <textarea
              id="ppt-description"
              placeholder="Briefly describe this presentation..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label htmlFor="ppt-category">Category</label>
              <select id="ppt-category" value="PPT" disabled>
                <option value="PPT">PPT</option>
              </select>
            </div>

            <div className="form-group small">
              <label htmlFor="ppt-unit">Unit</label>
              <select id="ppt-unit" value={String(unit)} disabled>
                <option value={String(unit)}>Unit {unit}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Choose PowerPoint File</label>

            <label className="file-upload-box" htmlFor="ppt-file">
              <span className="file-main">
                📁 {file ? file.name : "Click to choose a PPT file"}
              </span>
              <span className="file-sub">
                Accepted formats: .ppt and .pptx
              </span>
            </label>

            <input
              ref={fileInputRef}
              id="ppt-file"
              type="file"
              accept=".ppt,.pptx"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              hidden
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">✓ {success}</p>}

          <button
            type="submit"
            className="upload-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Presentation →"}
          </button>
        </form>

        <div className="upload-actions">
          {success && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/view-uploads")}
            >
              View Uploaded Materials
            </button>
          )}

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/teacher/unit4")}
          >
            ← Back to Unit 4
          </button>
        </div>
      </main>
    </div>
  );
}
