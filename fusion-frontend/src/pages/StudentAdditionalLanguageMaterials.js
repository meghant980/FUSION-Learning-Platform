
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const languageNames = {
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

export default function StudentAdditionalLanguageMaterials() {
  const navigate = useNavigate();
  const { language, unit } = useParams();
  const [searchParams] = useSearchParams();

  const course = String(language || "").toLowerCase();
  const unitNumber = String(unit || "1");

  // The selected category comes from the URL.
  // Example: ?category=notes or ?category=ppt
  const requestedCategory = String(
    searchParams.get("category") || "notes"
  ).toLowerCase();

  const activeCategory =
    requestedCategory === "ppt" ? "ppt" : "notes";

  const languageName = languageNames[course];
  const isNotes = activeCategory === "notes";
  const resourceTitle = isNotes ? "Study Notes" : "Presentations";
  const resourceLabel = isNotes ? "Notes" : "PPTs";

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const backPath =
    course === "java"
      ? `/learn/java/unit${unitNumber}`
      : `/learn/${course}`;

  useEffect(() => {
    let isActive = true;

    async function fetchMaterials() {
      setLoading(true);
      setError("");
      setFiles([]);

      try {
        const response = await axios.get(
          `${API_URL}/api/files/filter`,
          {
            params: {
              subject: course,
              unit: `unit ${unitNumber}`,
              category: activeCategory,
            },
          }
        );

        if (!isActive) return;

        setFiles(response.data?.files || []);
      } catch (err) {
        if (!isActive) return;

        console.error("Student study material fetch error:", err);

        setError(
          err.response?.data?.msg ||
            err.response?.data?.message ||
            "Unable to load study materials. Please check your connection."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    if (
      languageName &&
      ["1", "2", "3", "4"].includes(unitNumber)
    ) {
      fetchMaterials();
    } else {
      setLoading(false);
      setError("Invalid programming language or unit.");
    }

    return () => {
      isActive = false;
    };
  }, [
    course,
    unitNumber,
    activeCategory,
    languageName,
    retryCount,
  ]);

  function downloadFile(filename) {
    if (!filename) {
      setError("The download link is unavailable for this resource.");
      return;
    }

    window.open(
      `${API_URL}/api/files/download/${encodeURIComponent(filename)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleRetry() {
    setRetryCount((count) => count + 1);
  }

  if (!languageName) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyPage}>
          <h2>Language not found</h2>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.brand}>FUSION</span>
          <span style={styles.headerTag}>
            STUDENT LEARNING SPACE
          </span>
        </div>
      </header>

      <main style={styles.main}>
        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate(backPath)}
        >
          ← Back to Unit {unitNumber}
        </button>

        <section style={styles.hero}>
          <div style={styles.heroIcon}>
            {isNotes ? "📘" : "📊"}
          </div>

          <div>
            <span style={styles.eyebrow}>
              {isNotes ? "STUDY NOTES" : "PRESENTATION MATERIAL"}
            </span>

            <h1 style={styles.title}>{resourceTitle}</h1>

            <p style={styles.subtitle}>
              {languageName} · Unit {unitNumber}
            </p>
          </div>
        </section>

        <section style={styles.contentCard}>
          <div style={styles.sectionHeading}>
            <div>
              <span style={styles.eyebrow}>
                YOUR COURSE MATERIAL
              </span>

              <h2 style={styles.heading}>
                {isNotes
                  ? "Notes uploaded by your teacher"
                  : "Presentations uploaded by your teacher"}
              </h2>

              <p style={styles.description}>
                {isNotes
                  ? "Read and download the study notes provided for this unit."
                  : "Open and download the presentation files provided for this unit."}
              </p>
            </div>

            <span style={styles.categoryBadge}>
              {resourceLabel}
            </span>
          </div>

          {loading ? (
            <div style={styles.status}>
              <div style={styles.loadingIcon}>⏳</div>
              <p>Loading {resourceLabel.toLowerCase()}...</p>
            </div>
          ) : error ? (
            <div style={styles.errorBox}>
              <strong>
                Unable to load {resourceLabel.toLowerCase()}
              </strong>

              <p>{error}</p>

              <button
                type="button"
                style={styles.retryButton}
                onClick={handleRetry}
              >
                Try Again
              </button>
            </div>
          ) : files.length === 0 ? (
            <div style={styles.status}>
              <div style={styles.emptyIcon}>
                {isNotes ? "📘" : "📊"}
              </div>

              <h3>No {resourceLabel} Available</h3>

              <p>
                Your teacher has not uploaded any{" "}
                {isNotes ? "notes" : "presentations"} for{" "}
                {languageName} Unit {unitNumber} yet.
              </p>
            </div>
          ) : (
            <>
              <div style={styles.resultsHeading}>
                <strong>Available {resourceLabel}</strong>

                <span>
                  {files.length}{" "}
                  {files.length === 1 ? "resource" : "resources"}
                </span>
              </div>

              <div style={styles.fileGrid}>
                {files.map((file) => {
                  const metadata = file.metadata || {};

                  return (
                    <article
                      key={String(file._id || file.filename)}
                      style={styles.fileCard}
                    >
                      <div style={styles.fileTop}>
                        <div style={styles.fileIcon}>
                          {isNotes ? "📄" : "📊"}
                        </div>

                        <span style={styles.fileBadge}>
                          {resourceLabel.toUpperCase()}
                        </span>
                      </div>

                      <h3 style={styles.fileTitle}>
                        {metadata.title || file.filename}
                      </h3>

                      <p style={styles.fileDescription}>
                        {metadata.description ||
                          "Learning resource uploaded by your teacher."}
                      </p>

                      <div style={styles.fileDetails}>
                        <div style={styles.fileDetailItem}>
                          <span style={styles.detailLabel}>
                            LANGUAGE
                          </span>

                          <strong style={styles.detailValue}>
                            {languageName}
                          </strong>
                        </div>

                        <div style={styles.fileDetailItem}>
                          <span style={styles.detailLabel}>UNIT</span>

                          <strong style={styles.detailValue}>
                            Unit {unitNumber}
                          </strong>
                        </div>

                        <div style={styles.fileDetailItem}>
                          <span style={styles.detailLabel}>
                            UPLOADED BY
                          </span>

                          <strong style={styles.detailValue}>
                            {metadata.uploadedBy || "Teacher"}
                          </strong>
                        </div>

                        <div style={styles.fileDetailItem}>
                          <span style={styles.detailLabel}>
                            UPLOAD DATE
                          </span>

                          <strong style={styles.detailValue}>
                            {file.uploadDate
                              ? new Date(
                                  file.uploadDate
                                ).toLocaleDateString("en-IN")
                              : "Not available"}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={styles.downloadButton}
                        onClick={() => downloadFile(file.filename)}
                      >
                        ↓ Download {isNotes ? "Notes" : "PPT"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <div style={styles.footer}>
          FUSION · Learn. Code. Grow.
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8f4",
    color: "#1d4539",
    fontFamily: "'Poppins', Arial, sans-serif",
  },

  header: {
    background: "#173f35",
    color: "#fff",
  },

  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "65px",
    padding: "0 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "3px",
  },

  headerTag: {
    color: "#b7cbbd",
    fontSize: "10px",
    letterSpacing: "1.5px",
    fontWeight: "600",
  },

  main: {
    width: "88%",
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "30px 0 55px",
  },

  backButton: {
    padding: "10px 16px",
    background: "#fff",
    color: "#285545",
    border: "1px solid #dce6dc",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "22px",
  },

  hero: {
    background: "#e7eee4",
    border: "1px solid #dce7da",
    borderRadius: "13px",
    padding: "25px 28px",
    display: "flex",
    alignItems: "center",
    gap: "19px",
    marginBottom: "25px",
  },

  heroIcon: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "#f7faf5",
    borderRadius: "11px",
    fontSize: "27px",
  },

  eyebrow: {
    display: "block",
    color: "#879a88",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    marginBottom: "7px",
  },

  title: {
    margin: 0,
    color: "#173f35",
    fontSize: "27px",
    fontWeight: "650",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#718478",
    fontSize: "12px",
  },

  contentCard: {
    background: "#fff",
    border: "1px solid #e0e8de",
    borderRadius: "13px",
    padding: "28px",
    boxShadow: "0 5px 18px rgba(26, 67, 54, 0.035)",
  },

  sectionHeading: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
  },

  heading: {
    margin: "5px 0",
    fontSize: "21px",
    color: "#20483c",
  },

  description: {
    color: "#7c8a80",
    fontSize: "12px",
    lineHeight: "1.7",
    margin: 0,
  },

  categoryBadge: {
    padding: "9px 13px",
    borderRadius: "7px",
    background: "#edf3e9",
    color: "#55745b",
    fontSize: "10px",
    letterSpacing: "1px",
    fontWeight: "800",
  },

  status: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#78877c",
  },

  loadingIcon: {
    fontSize: "27px",
  },

  emptyIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },

  errorBox: {
    padding: "22px",
    background: "#fff1ef",
    border: "1px solid #f1d4cf",
    borderRadius: "9px",
    color: "#93483f",
    fontSize: "13px",
  },

  retryButton: {
    marginTop: "8px",
    padding: "9px 15px",
    border: "1px solid #dfbdb7",
    borderRadius: "6px",
    background: "#fff",
    color: "#93483f",
    cursor: "pointer",
  },

  resultsHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#345647",
    fontSize: "13px",
    marginBottom: "17px",
  },

  fileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "17px",
  },

  fileCard: {
    background: "#fff",
    border: "1px solid #e3eae1",
    borderRadius: "10px",
    padding: "19px",
    minWidth: 0,
  },

  fileTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  fileIcon: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    background: "#eaf1e8",
    borderRadius: "9px",
    fontSize: "21px",
  },

  fileBadge: {
    color: "#55745b",
    background: "#edf3e9",
    borderRadius: "5px",
    padding: "6px 9px",
    fontSize: "9px",
    letterSpacing: "1px",
    fontWeight: "800",
  },

  fileTitle: {
    margin: "0 0 8px",
    color: "#214b3d",
    fontSize: "16px",
    overflowWrap: "anywhere",
  },

  fileDescription: {
    minHeight: "38px",
    margin: "0 0 17px",
    color: "#7d8b81",
    fontSize: "11px",
    lineHeight: "1.7",
  },

  fileDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "13px",
    padding: "14px 0",
    borderTop: "1px solid #edf0eb",
    borderBottom: "1px solid #edf0eb",
    marginBottom: "16px",
  },

  fileDetailItem: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  detailLabel: {
    color: "#87968b",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "0.8px",
  },

  detailValue: {
    color: "#345647",
    fontSize: "11px",
    fontWeight: "600",
    overflowWrap: "anywhere",
  },

  downloadButton: {
    width: "100%",
    padding: "12px",
    background: "#173f35",
    color: "#fff",
    border: "0",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    padding: "25px 0 0",
    color: "#91a094",
    fontSize: "10px",
    letterSpacing: "1px",
  },

  emptyPage: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
  },

  primaryButton: {
    padding: "12px 20px",
    background: "#173f35",
    color: "#fff",
    border: "0",
    borderRadius: "7px",
    cursor: "pointer",
  },
};
