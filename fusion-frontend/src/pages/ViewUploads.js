
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/uploads.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const UNITS = ["All", "Unit 1", "Unit 2", "Unit 3", "Unit 4"];

export default function ViewUploads() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [deletingFile, setDeletingFile] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_URL}/api/files`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.files || [];

        setFiles(data);
      } catch (err) {
        console.error("Error loading uploaded files:", err);
        setError("Unable to load uploaded materials. Please try again.");
        toast.error("Failed to load uploaded files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    if (selectedUnit === "All") return files;

    const selectedNumber = selectedUnit.replace("Unit ", "").trim();

    return files.filter((file) => {
      const unit = String(file.metadata?.unit || "")
        .trim()
        .toLowerCase();

      const unitNumber = unit.replace(/^unit\s*/, "");

      return unitNumber === selectedNumber;
    });
  }, [files, selectedUnit]);

  const handleDelete = async (filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingFile(filename);

      await axios.delete(
        `${API_URL}/api/files/${encodeURIComponent(filename)}`
      );

      setFiles((previousFiles) =>
        previousFiles.filter((file) => file.filename !== filename)
      );

      toast.success("File deleted successfully!");
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setDeletingFile("");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7f7f3",
      padding: "42px 5%",
      fontFamily: "'DM Sans', Arial, sans-serif",
      color: "#183c35",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    eyebrow: {
      color: "#8a9b85",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      marginBottom: "10px",
    },
    title: {
      fontSize: "clamp(26px, 4vw, 36px)",
      fontWeight: "750",
      margin: "0 0 10px",
      color: "#183c35",
    },
    subtitle: {
      color: "#718078",
      fontSize: "15px",
      lineHeight: "1.7",
      margin: "0 0 30px",
    },
    filterCard: {
      background: "#ffffff",
      border: "1px solid #e4e9e2",
      borderRadius: "15px",
      padding: "20px",
      marginBottom: "25px",
      boxShadow: "0 5px 20px rgba(24, 60, 53, 0.04)",
    },
    filterTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#214d40",
      margin: "0 0 14px",
    },
    filters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },
    filterButton: {
      padding: "10px 19px",
      borderRadius: "9px",
      border: "1px solid #dce5da",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    activeFilter: {
      background: "#214d40",
      color: "#ffffff",
      borderColor: "#214d40",
    },
    inactiveFilter: {
      background: "#ffffff",
      color: "#536b5b",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "20px",
    },
    fileCard: {
      background: "#ffffff",
      border: "1px solid #e4e9e2",
      borderRadius: "15px",
      padding: "22px",
      boxShadow: "0 7px 22px rgba(24, 60, 53, 0.045)",
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
    fileIcon: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      background: "#edf4ec",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      marginBottom: "16px",
    },
    fileTitle: {
      color: "#214d40",
      fontSize: "17px",
      fontWeight: "700",
      lineHeight: "1.4",
      margin: "0 0 12px",
      overflowWrap: "anywhere",
    },
    description: {
      color: "#718078",
      fontSize: "13px",
      lineHeight: "1.6",
      margin: "0 0 15px",
    },
    metadata: {
      background: "#f7f9f5",
      borderRadius: "10px",
      padding: "13px",
      marginBottom: "18px",
    },
    metaRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      fontSize: "12px",
      padding: "5px 0",
      color: "#718078",
    },
    metaValue: {
      color: "#315444",
      fontWeight: "700",
      textAlign: "right",
      overflowWrap: "anywhere",
    },
    actions: {
      display: "flex",
      gap: "10px",
      marginTop: "auto",
    },
    download: {
      flex: 1,
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      textDecoration: "none",
      background: "#214d40",
      color: "#ffffff",
      padding: "11px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "700",
      border: "none",
    },
    delete: {
      padding: "11px 13px",
      background: "#fff1ef",
      color: "#a33c32",
      border: "1px solid #f4d8d4",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
    },
    message: {
      background: "#ffffff",
      border: "1px solid #e4e9e2",
      borderRadius: "14px",
      padding: "45px 20px",
      textAlign: "center",
      color: "#718078",
      fontSize: "14px",
    },
    back: {
      marginTop: "30px",
      padding: "12px 20px",
      background: "#e9efe7",
      color: "#214d40",
      border: "1px solid #dce5da",
      borderRadius: "9px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
    },
    footer: {
      marginTop: "25px",
      color: "#8a968e",
      fontSize: "12px",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header>
          <div style={styles.eyebrow}>Teacher Dashboard / Study Materials</div>
          <h1 style={styles.title}>Uploaded Study Materials</h1>
          <p style={styles.subtitle}>
            Manage, download and organize notes and presentations uploaded
            for your students.
          </p>
        </header>

        <section style={styles.filterCard}>
          <h2 style={styles.filterTitle}>Filter Materials by Unit</h2>

          <div style={styles.filters}>
            {UNITS.map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setSelectedUnit(unit)}
                style={{
                  ...styles.filterButton,
                  ...(selectedUnit === unit
                    ? styles.activeFilter
                    : styles.inactiveFilter),
                }}
              >
                {unit}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div style={styles.message}>
            Loading uploaded study materials...
          </div>
        ) : error ? (
          <div style={styles.message}>{error}</div>
        ) : filteredFiles.length === 0 ? (
          <div style={styles.message}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>
              <span aria-hidden="true">📂</span>
            </div>
            <strong>No uploaded materials found.</strong>
            <p>
              There are currently no files available for {selectedUnit}.
            </p>
          </div>
        ) : (
          <section style={styles.grid}>
            {filteredFiles.map((file) => (
              <article
                key={file._id || file.filename}
                style={styles.fileCard}
              >
                <div style={styles.fileIcon}>📄</div>

                <h2 style={styles.fileTitle}>
                  {file.metadata?.title || file.filename}
                </h2>

                {file.metadata?.description && (
                  <p style={styles.description}>
                    {file.metadata.description}
                  </p>
                )}

                <div style={styles.metadata}>
                  <div style={styles.metaRow}>
                    <span>Unit</span>
                    <span style={styles.metaValue}>
                      {file.metadata?.unit || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>Category</span>
                    <span style={styles.metaValue}>
                      {file.metadata?.category || "—"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>Uploaded By</span>
                    <span style={styles.metaValue}>
                      {file.metadata?.uploadedBy || "Unknown"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>Upload Date</span>
                    <span style={styles.metaValue}>
                      {file.uploadDate
                        ? new Date(file.uploadDate).toLocaleDateString("en-GB")
                        : "—"}
                    </span>
                  </div>
                </div>

                <div style={styles.actions}>
                  <a
                    href={`${API_URL}/api/files/file/${encodeURIComponent(
                      file.filename
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.download}
                  >
                    Download
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(file.filename)}
                    disabled={deletingFile === file.filename}
                    style={{
                      ...styles.delete,
                      opacity: deletingFile === file.filename ? 0.6 : 1,
                      cursor:
                        deletingFile === file.filename
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {deletingFile === file.filename ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        <button
          type="button"
          style={styles.back}
          onClick={() => navigate("/teacher-dashboard")}
        >
          ← Back to Dashboard
        </button>

        <p style={styles.footer}>
          Fusion · Study Material Management
        </p>
      </div>

      <ToastContainer theme="light" position="top-right" />
    </main>
  );
}
