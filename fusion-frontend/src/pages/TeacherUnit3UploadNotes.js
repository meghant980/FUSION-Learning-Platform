
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-upload.css";

export default function TeacherUnit3UploadNotes({
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
      setError("Please enter a title.");
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", desc.trim());
    formData.append("category", "Notes");
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

      const fileInput = document.getElementById("unit3NotesFile");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Unit 3 notes upload failed:", err);
      setError(
        err.response?.data?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-modern-page">
      <header className="unit-header">
        <h1>📘 Upload Study Material</h1>
        <p>Unit {unit} · Notes</p>
      </header>

      <form className="upload-card" onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="unit3NotesTitle">Title</label>
          <input
            id="unit3NotesTitle"
            type="text"
            placeholder="Enter notes title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit3NotesDescription">Description</label>
          <textarea
            id="unit3NotesDescription"
            placeholder="Enter a short description"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group small">
            <label>Category</label>
            <select value="Notes" disabled>
              <option value="Notes">Notes</option>
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
          <label htmlFor="unit3NotesFile">Upload File</label>

          <div className="custom-file-upload">
            <label
              htmlFor="unit3NotesFile"
              className="file-label"
            >
              <div className="file-content">
                <div className="file-icon">📂</div>

                {file ? (
                  <div>
                    <p className="file-main">Selected File</p>
                    <p className="file-sub">{file.name}</p>
                  </div>
                ) : (
                  <div>
                    <p className="file-main">Click to choose a file</p>
                    <p className="file-sub">
                      Select your Unit {unit} notes
                    </p>
                  </div>
                )}
              </div>
            </label>

            <input
              id="unit3NotesFile"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              hidden
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {success && (
          <p className="success-msg">
            ✔ Notes uploaded successfully!
          </p>
        )}

        <button
          className="upload-btn"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "🚀 Upload Notes"}
        </button>
      </form>

      <div className="upload-actions">
        {success && (
          <button
            className="secondary-btn"
            onClick={() => navigate("/view-uploads")}
          >
            📂 View Uploads
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
