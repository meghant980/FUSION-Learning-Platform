
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      user.token ||
      user.accessToken ||
      ""
    );
  } catch {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwtToken") ||
      ""
    );
  }
};

const getUploadedBy = () => {
  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");

    return (
      user.name ||
      user.fullName ||
      user.email ||
      user.username ||
      "Teacher"
    );
  } catch {
    return "Teacher";
  }
};

export default function TeacherAdditionalLanguageUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, unit } = useParams();

  const course = String(language || "").toLowerCase();
  const unitNumber = String(unit || "1");

  const isNotes = location.pathname.endsWith("/upload-notes");
  const isPPT = location.pathname.endsWith("/upload-ppt");
  const category = isNotes ? "Notes" : "PPT";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const validLanguages = ["java", "python", "javascript"];
  const validUnits = ["1", "2", "3", "4"];

  const goBack = () => {
    navigate(`/teacher/${course}/unit/${unitNumber}`);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  if (
    !validLanguages.includes(course) ||
    !validUnits.includes(unitNumber) ||
    (!isNotes && !isPPT)
  ) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2>Invalid upload page</h2>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/teacher-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    clearMessage();

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setFile(null);
      event.target.value = "";
      setMessage("File size must not exceed 25 MB.");
      setMessageType("error");
      return;
    }

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    const allowedExtensions = isNotes
      ? ["pdf"]
      : ["pdf", "ppt", "pptx"];

    if (!allowedExtensions.includes(extension)) {
      setFile(null);
      event.target.value = "";

      setMessage(
        isNotes
          ? "Please select a PDF file for notes."
          : "Please select a PDF, PPT or PPTX file."
      );

      setMessageType("error");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearMessage();

    if (!title.trim()) {
      setMessage("Please enter a title.");
      setMessageType("error");
      return;
    }

    if (!file) {
      setMessage("Please select a file before uploading.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("subject", course);
    formData.append("unit", `unit ${unitNumber}`);
    formData.append("uploadedBy", getUploadedBy());
    formData.append("file", file);

    try {
      setLoading(true);

      const token = getAuthToken();

      const response = await axios.post(
        `${API_URL}/api/files/upload`,
        formData,
        {
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      setMessage(
        response.data?.message ||
          `${category} uploaded successfully!`
      );
      setMessageType("success");

      setTitle("");
      setDescription("");
      setFile(null);

      const fileInput = document.getElementById(
        "additional-language-file"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("ADDITIONAL LANGUAGE UPLOAD ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Upload failed. Please check your backend and try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.breadcrumb}>
            TEACHER WORKSPACE / {course.toUpperCase()} PROGRAMMING / UNIT {unitNumber}
          </p>

          <h1 style={styles.heroTitle}>Upload {category}</h1>

          <p style={styles.heroDescription}>
            Add learning resources for {course.toUpperCase()} — Unit {unitNumber}.
          </p>
        </div>
      </header>

      <main style={styles.content}>
        <button style={styles.backButton} onClick={goBack}>
          ← Back to Unit
        </button>

        <section style={styles.formCard}>
          <div style={styles.formHeading}>
            <div style={styles.iconBox}>
              {isNotes ? "📄" : "📊"}
            </div>

            <div>
              <p style={styles.formEyebrow}>STUDY RESOURCES</p>
              <h2 style={styles.formTitle}>Upload {category}</h2>
              <p style={styles.formSubtitle}>
                {course.toUpperCase()} · UNIT {unitNumber}
              </p>
            </div>
          </div>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.successMessage
                  : styles.errorMessage),
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Resource Title <span style={styles.required}>*</span>
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                clearMessage();
              }}
              placeholder={
                isNotes
                  ? "Example: Introduction to Java"
                  : "Example: Java Fundamentals Presentation"
              }
              style={styles.input}
              required
            />

            <label style={styles.label}>Description</label>

            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearMessage();
              }}
              placeholder="Enter a short description of this learning resource..."
              rows={4}
              style={styles.textarea}
            />

            <label style={styles.label}>
              Select File <span style={styles.required}>*</span>
            </label>

            <div style={styles.fileBox}>
              <div style={styles.fileIcon}>
                {file ? "✅" : "📁"}
              </div>

              <div style={styles.fileText}>
                <strong>
                  {file ? file.name : "Choose your learning resource"}
                </strong>

                <span>
                  {isNotes
                    ? "PDF files only · Maximum 25 MB"
                    : "PDF, PPT or PPTX files · Maximum 25 MB"}
                </span>
              </div>

              <label
                htmlFor="additional-language-file"
                style={styles.chooseButton}
              >
                Browse
              </label>

              <input
                id="additional-language-file"
                type="file"
                accept={isNotes ? ".pdf,application/pdf" : ".pdf,.ppt,.pptx"}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div style={styles.metadata}>
              <div style={styles.metadataItem}>
                <span style={styles.metadataLabel}>LANGUAGE</span>
                <strong style={styles.metadataValue}>
                  {course.toUpperCase()}
                </strong>
              </div>

              <div style={styles.metadataItem}>
                <span style={styles.metadataLabel}>UNIT</span>
                <strong style={styles.metadataValue}>
                  UNIT {unitNumber}
                </strong>
              </div>

              <div style={styles.metadataItem}>
                <span style={styles.metadataLabel}>CATEGORY</span>
                <strong style={styles.metadataValue}>
                  {category.toUpperCase()}
                </strong>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={goBack}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  ...styles.primaryButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Uploading..." : `Upload ${category} →`}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8f4",
    color: "#1c443a",
    fontFamily: "'Poppins', sans-serif",
  },

  hero: {
    background: "#173f35",
    color: "#ffffff",
    padding: "25px 8% 32px",
  },

  heroInner: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  breadcrumb: {
    color: "#a9c4b4",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 12px",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "600",
    margin: "0 0 8px",
  },

  heroDescription: {
    color: "#d0dfd6",
    fontSize: "14px",
    margin: 0,
  },

  content: {
    width: "84%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "35px 0 65px",
    boxSizing: "border-box",
  },

  backButton: {
    background: "#ffffff",
    color: "#245342",
    border: "1px solid #dce5db",
    padding: "10px 17px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "24px",
  },

  formCard: {
    background: "#ffffff",
    border: "1px solid #dfe6dd",
    borderRadius: "14px",
    padding: "32px",
    maxWidth: "820px",
    margin: "0 auto",
    boxShadow: "0 5px 18px rgba(26, 67, 54, 0.04)",
  },

  formHeading: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    paddingBottom: "24px",
    marginBottom: "25px",
    borderBottom: "1px solid #e9ede7",
  },

  iconBox: {
    width: "58px",
    height: "58px",
    minWidth: "58px",
    borderRadius: "12px",
    background: "#eaf1e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  formEyebrow: {
    color: "#8a9d8c",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 5px",
  },

  formTitle: {
    color: "#1b443a",
    fontSize: "22px",
    margin: "0 0 5px",
    fontWeight: "600",
  },

  formSubtitle: {
    color: "#839188",
    fontSize: "11px",
    margin: 0,
    letterSpacing: "1px",
  },

  label: {
    display: "block",
    color: "#315347",
    fontSize: "13px",
    fontWeight: "600",
    margin: "19px 0 9px",
  },

  required: {
    color: "#c65b58",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    border: "1px solid #dce5db",
    borderRadius: "8px",
    padding: "13px 14px",
    color: "#25483c",
    fontSize: "13px",
    outlineColor: "#6c9b7e",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    border: "1px solid #dce5db",
    borderRadius: "8px",
    padding: "13px 14px",
    color: "#25483c",
    fontSize: "13px",
    resize: "vertical",
    fontFamily: "inherit",
    outlineColor: "#6c9b7e",
  },

  fileBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    border: "1px dashed #aac1ad",
    background: "#f8faf6",
    borderRadius: "10px",
    padding: "17px",
  },

  fileIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "9px",
    background: "#eaf1e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  fileText: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
    minWidth: "150px",
    fontSize: "12px",
    color: "#345849",
    overflowWrap: "anywhere",
  },

  chooseButton: {
    background: "#e9f0e7",
    color: "#285642",
    padding: "10px 17px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  metadata: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginTop: "25px",
    padding: "17px",
    background: "#f7f9f5",
    border: "1px solid #e8ede5",
    borderRadius: "9px",
  },

  metadataItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "7px",
    minWidth: 0,
  },

  metadataLabel: {
    color: "#829486",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.2px",
  },

  metadataValue: {
    color: "#234d41",
    fontSize: "14px",
    fontWeight: "600",
    overflowWrap: "anywhere",
  },

  message: {
    padding: "13px 15px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "18px",
  },

  successMessage: {
    color: "#205b3e",
    background: "#e9f5eb",
    border: "1px solid #c6e5ce",
  },

  errorMessage: {
    color: "#963e38",
    background: "#fff0ee",
    border: "1px solid #f1cfca",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "25px",
    flexWrap: "wrap",
  },

  cancelButton: {
    background: "#ffffff",
    color: "#49675a",
    border: "1px solid #dce5db",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  primaryButton: {
    background: "#173f35",
    color: "#ffffff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },

  errorCard: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
};
