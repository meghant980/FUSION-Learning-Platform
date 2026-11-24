
import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit4UploadNotes({ course = "c", unit = 4 }) {
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
      setError("Please enter a title for your notes.");
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", "Notes");
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

      setSuccess("Your Unit 4 notes have been uploaded successfully.");
      setTitle("");
      setDescription("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Unit 4 notes upload error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to upload notes. Please try again."
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
            <h1>Upload Study Notes</h1>
            <p>Share learning material with your students.</p>
          </div>
        </div>
      </header>

      <main className="upload-card">
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="notes-title">Notes Title</label>
            <input
              id="notes-title"
              type="text"
              placeholder="Enter notes title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes-description">Description</label>
            <textarea
              id="notes-description"
              placeholder="Briefly describe these notes..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label htmlFor="notes-category">Category</label>
              <select id="notes-category" value="Notes" disabled>
                <option value="Notes">Notes</option>
              </select>
            </div>

            <div className="form-group small">
              <label htmlFor="notes-unit">Unit</label>
              <select id="notes-unit" value={String(unit)} disabled>
                <option value={String(unit)}>Unit {unit}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Choose Notes File</label>

            <div className="custom-file-upload">
              <label
                htmlFor="notes-file"
                className="file-label"
              >
                <div className="file-content">
                  <div className="file-icon">📂</div>

                  <div>
                    <p className="file-main">
                      {file ? "File selected" : "Click to choose a file"}
                    </p>
                    <p className="file-sub">
                      {file
                        ? file.name
                        : "Select the notes file from your computer"}
                    </p>
                  </div>
                </div>
              </label>

              <input
                ref={fileInputRef}
                id="notes-file"
                type="file"
                onChange={(event) =>
                  setFile(event.target.files?.[0] || null)
                }
                hidden
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">✓ {success}</p>}

          <button
            type="submit"
            className="upload-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Notes →"}
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
            onClick={() => navigate(`/teacher/unit${unit}`)}
          >
            ← Back to Unit {unit}
          </button>
        </div>
      </main>
    </div>
  );
}
