
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const colors = {
  forest: "#183c35",
  green: "#214d40",
  sage: "#8a9b85",
  background: "#f5f7f3",
  white: "#ffffff",
  border: "#dce5dc",
  text: "#243b34",
  muted: "#718078",
  red: "#c94c4c",
};

const getToken = () => {
  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwtToken");

  if (directToken) return directToken;

  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");
    return user.token || user.accessToken || "";
  } catch {
    return "";
  }
};

export default function UploadPage({
  unit = 1,
  course = "c",
  category = "notes",
  title = "Upload Study Material",
}) {
  const navigate = useNavigate();

  const [materialTitle, setMaterialTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const normalizedCategory =
    String(category).toLowerCase() === "ppt" ? "PPT" : "Notes";

  const courseName =
    String(course).toLowerCase() === "cpp" ? "C++" : "C";

  const isPPT = normalizedCategory === "PPT";

  const acceptedFiles = isPPT
    ? ".ppt,.pptx"
    : ".pdf,.doc,.docx,.txt";

  const handleUpload = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSuccess("");
    setError("");

    if (!materialTitle.trim()) {
      setError("Please enter a title for the uploaded material.");
      return;
    }

    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();

    formData.append("title", materialTitle.trim());
    formData.append("description", description.trim());
    formData.append("category", normalizedCategory);
    formData.append("unit", String(unit));
    formData.append("subject", course);
    formData.append("file", file);

    try {
      setSaving(true);

      const token = getToken();

      const response = await axios.post(
        `${API_URL}/api/files/upload`,
        formData,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          timeout: 60000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "The server could not complete the upload."
        );
      }

      setSuccess(
        `${normalizedCategory} uploaded successfully!`
      );

      setMaterialTitle("");
      setDescription("");
      setFile(null);

      const fileInput = document.getElementById("upload-material-file");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Material upload error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.msg ||
          err.message ||
          "Something went wrong while uploading the file."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (String(course).toLowerCase() === "cpp") {
      navigate(`/teacher/cpp/unit${unit}`);
    } else {
      navigate(`/teacher/unit${unit}`);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        color: colors.text,
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: "22px" }}>
        <div
          style={{
            fontSize: "12px",
            color: colors.sage,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {courseName} • Unit {unit}
        </div>

        <h2
          style={{
            color: colors.forest,
            fontSize: "21px",
            margin: 0,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: colors.muted,
            fontSize: "13px",
            marginTop: "8px",
            lineHeight: 1.6,
          }}
        >
          Add your {normalizedCategory.toLowerCase()} and make them
          available to students.
        </p>
      </div>

      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="material-title"
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Material Title
          </label>

          <input
            id="material-title"
            type="text"
            placeholder="Enter material title..."
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 15px",
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              background: "#fbfcfa",
              color: colors.text,
              fontSize: "14px",
              outlineColor: colors.sage,
            }}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="material-description"
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Description
          </label>

          <textarea
            id="material-description"
            placeholder="Enter a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 15px",
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              background: "#fbfcfa",
              color: colors.text,
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit",
              outlineColor: colors.sage,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "14px",
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              background: "#f8faf7",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: colors.muted,
                marginBottom: "6px",
              }}
            >
              CATEGORY
            </div>

            <strong style={{ color: colors.forest }}>
              {normalizedCategory}
            </strong>
          </div>

          <div
            style={{
              padding: "14px",
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              background: "#f8faf7",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: colors.muted,
                marginBottom: "6px",
              }}
            >
              UNIT
            </div>

            <strong style={{ color: colors.forest }}>
              Unit {unit}
            </strong>
          </div>

          <div
            style={{
              padding: "14px",
              border: `1px solid ${colors.border}`,
              borderRadius: "10px",
              background: "#f8faf7",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: colors.muted,
                marginBottom: "6px",
              }}
            >
              SUBJECT
            </div>

            <strong style={{ color: colors.forest }}>
              {courseName}
            </strong>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="upload-material-file"
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "9px",
            }}
          >
            Select {normalizedCategory} File
          </label>

          <div
            style={{
              border: `1.5px dashed ${colors.sage}`,
              borderRadius: "12px",
              padding: "24px 15px",
              background: "#f8faf7",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "8px",
              }}
            >
              📁
            </div>

            <label
              htmlFor="upload-material-file"
              style={{
                display: "inline-block",
                background: colors.green,
                color: colors.white,
                padding: "11px 20px",
                borderRadius: "9px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Choose File
            </label>

            <input
              id="upload-material-file"
              type="file"
              accept={acceptedFiles}
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setSuccess("");
                setError("");
              }}
              required
              style={{ display: "none" }}
            />

            <p
              style={{
                fontSize: "12px",
                color: colors.muted,
                margin: "12px 0 0",
              }}
            >
              {isPPT
                ? "Accepted formats: PPT and PPTX"
                : "Accepted formats: PDF, DOC, DOCX and TXT"}
            </p>

            {file && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "11px",
                  background: colors.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "13px",
                  overflowWrap: "anywhere",
                }}
              >
                <strong style={{ color: colors.green }}>
                  Selected file:
                </strong>
                <br />
                {file.name}
                <div
                  style={{
                    fontSize: "11px",
                    color: colors.muted,
                    marginTop: "4px",
                  }}
                >
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: "13px 15px",
              background: "#fff1f0",
              border: "1px solid #f0c8c5",
              borderRadius: "9px",
              color: colors.red,
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            style={{
              padding: "13px 15px",
              background: "#edf6ed",
              border: "1px solid #c8dfc8",
              borderRadius: "9px",
              color: colors.green,
              fontSize: "13px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            ✔ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: colors.forest,
            color: colors.white,
            fontSize: "14px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving
            ? "Uploading..."
            : `Upload ${normalizedCategory}`}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/view-uploads")}
          style={{
            flex: "1 1 180px",
            padding: "12px",
            border: `1px solid ${colors.border}`,
            borderRadius: "9px",
            background: colors.white,
            color: colors.forest,
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View Uploaded Materials
        </button>

        <button
          type="button"
          onClick={handleBack}
          style={{
            flex: "1 1 150px",
            padding: "12px",
            border: `1px solid ${colors.border}`,
            borderRadius: "9px",
            background: "#edf1eb",
            color: colors.forest,
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back to Unit {unit}
        </button>
      </div>
    </div>
  );
}
