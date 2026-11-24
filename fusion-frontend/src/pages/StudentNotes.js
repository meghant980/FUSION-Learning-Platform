
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/student-notes.css";

export default function StudentNotes() {
  const { subject, unitId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectName = (subject || "").toUpperCase();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:5001/api/files/filter",
          {
            params: {
              subject: subject,
              unit: `unit ${unitId}`,
              category: "notes"
            }
          }
        );

        setFiles(res.data.files || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subject, unitId]);

  return (
    <div className="sn-page">
      {/* HEADER */}
      <header className="sn-header">
        <button
          className="sn-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="sn-brand-mark">F</span>
          FUSION
        </button>

        <div className="sn-header-right">
          <span>{subjectName} PROGRAMMING</span>
          <button
            className="sn-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard ↗
          </button>
        </div>
      </header>

      <main className="sn-main">
        {/* BACK */}
        <button
          className="sn-back"
          onClick={() => navigate(-1)}
        >
          ← Back to Unit
        </button>

        {/* HERO */}
        <section className="sn-hero">
          <div className="sn-hero-content">
            <div className="sn-eyebrow">
              <span></span>
              FUSION LEARNING RESOURCES
            </div>

            <h1>
              Study <span>Notes.</span>
            </h1>

            <p>
              Your learning material, organised in one place.
              Access your uploaded notes and revise at your own pace.
            </p>

            <div className="sn-hero-meta">
              <span>{subjectName}</span>
              <span className="sn-meta-line"></span>
              <span>UNIT {unitId}</span>
              <span className="sn-meta-line"></span>
              <span>STUDY MATERIAL</span>
            </div>
          </div>

          <div className="sn-hero-art">
            <div className="sn-paper sn-paper-back"></div>
            <div className="sn-paper sn-paper-front">
              <div className="sn-paper-top">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="sn-paper-title"></div>
              <div className="sn-paper-line"></div>
              <div className="sn-paper-line short"></div>
              <div className="sn-paper-block"></div>
              <div className="sn-paper-line"></div>
              <div className="sn-paper-line medium"></div>
              <div className="sn-paper-footer">FUSION · NOTES</div>
            </div>
            <div className="sn-paper-badge">PDF</div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section className="sn-overview">
          <div>
            <span className="sn-overview-label">YOUR MATERIAL</span>
            <h2>Unit {unitId} Notes</h2>
          </div>

          <div className="sn-count">
            <strong>{loading ? "—" : files.length}</strong>
            <span>AVAILABLE FILES</span>
          </div>
        </section>

        {/* FILES */}
        <section className="sn-files-section">
          <div className="sn-section-heading">
            <div className="sn-section-icon">▤</div>
            <div>
              <h2>Study Materials</h2>
              <p>Browse and access your uploaded notes.</p>
            </div>
          </div>

          {loading ? (
            <div className="sn-state">
              <div className="sn-loader"></div>
              <h3>Loading your notes...</h3>
              <p>Please wait while we fetch your study material.</p>
            </div>
          ) : files.length === 0 ? (
            <div className="sn-state">
              <div className="sn-empty-icon">▤</div>
              <h3>No Notes Available</h3>
              <p>
                Study material for {subjectName}, Unit {unitId},
                has not been uploaded yet.
              </p>
              <button
                className="sn-secondary-btn"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="sn-grid">
              {files.map((file) => (
                <article className="sn-card" key={file._id}>
                  <div className="sn-card-top">
                    <div className="sn-file-icon">PDF</div>
                    <span className="sn-file-label">
                      {file.metadata?.category || "Notes"}
                    </span>
                  </div>

                  <div className="sn-card-copy">
                    <h3>
                      {file.metadata?.title || file.filename}
                    </h3>
                    <p>
                      {file.metadata?.description ||
                        "Study material uploaded for this unit."}
                    </p>
                  </div>

                  <div className="sn-card-meta">
                    <div>
                      <span>UPLOADED BY</span>
                      <strong>
                        {file.metadata?.uploadedBy || "Teacher"}
                      </strong>
                    </div>

                    <div>
                      <span>UPLOAD DATE</span>
                      <strong>
                        {file.uploadDate
                          ? new Date(file.uploadDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="sn-card-actions">
                    <a
                      className="sn-view-btn"
                      href={`http://localhost:5001/api/files/download/${encodeURIComponent(file.filename)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Notes ↗
                    </a>

                    <a
                      className="sn-download-btn"
                      href={`http://localhost:5001/api/files/download/${encodeURIComponent(file.filename)}`}
                      download={file.filename}
                    >
                      ↓
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="sn-footer">
          <strong>FUSION</strong>
          <span>Learn · Practice · Grow</span>
          <button onClick={() => navigate(-1)}>
            Back to Unit ↑
          </button>
        </footer>
      </main>
    </div>
  );
}
