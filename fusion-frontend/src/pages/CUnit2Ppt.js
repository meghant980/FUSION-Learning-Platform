
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/c-ppt-page.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function CUnit2Ppt() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log("Fetching C Unit 2 PPTs...");

        const res = await axios.get(`${API_URL}/api/notes/filter`, {
          params: {
            subject: "c",
            unit: 2,
            category: "PPT"
          }
        });

        if (res.data.success && Array.isArray(res.data.files)) {
          setFiles(res.data.files);
          setError("");
        } else {
          setFiles([]);
          setError(res.data.msg || "");
        }
      } catch (err) {
        console.error("Error fetching C Unit 2 PPTs:", err);

        setError(
          err.response?.data?.msg ||
          "Unable to connect to the backend. Please check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="ppt-page">
      <header className="ppt-header">
        <button
          className="ppt-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="ppt-brand-mark">F</span>
          FUSION
        </button>

        <div className="ppt-header-right">
          <span>C PROGRAMMING</span>
          <button
            className="ppt-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard ↗
          </button>
        </div>
      </header>

      <main className="ppt-main">
        <button
          className="ppt-back"
          onClick={() => navigate("/learn-c/unit2")}
        >
          ← Back to Unit 2
        </button>

        <section className="ppt-hero">
          <div className="ppt-hero-content">
            <div className="ppt-eyebrow">
              <span></span>
              FUSION LEARNING RESOURCES
            </div>

            <h1>
              Presentation <span>Library.</span>
            </h1>

            <p>
              Explore presentations uploaded by your teacher.
              Use these resources to understand concepts and revise
              important topics from C Programming Unit 2.
            </p>

            <div className="ppt-hero-meta">
              <span>C PROGRAMMING</span>
              <span className="ppt-meta-line"></span>
              <span>UNIT 02</span>
              <span className="ppt-meta-line"></span>
              <span>PRESENTATIONS</span>
            </div>
          </div>

          <div className="ppt-hero-art">
            <div className="ppt-slide-back"></div>
            <div className="ppt-slide">
              <div className="ppt-slide-top">
                <span>FUSION CLASSROOM</span>
                <span>02</span>
              </div>
              <div className="ppt-slide-heading"></div>
              <div className="ppt-slide-heading small"></div>
              <div className="ppt-slide-content">
                <div className="ppt-slide-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="ppt-slide-chart">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
              <div className="ppt-slide-footer"></div>
            </div>
            <div className="ppt-art-badge">PPT</div>
          </div>
        </section>

        <section className="ppt-overview">
          <div>
            <span className="ppt-overview-label">
              YOUR CLASSROOM MATERIAL
            </span>
            <h2>Unit 2 Presentations</h2>
            <p>Teacher-uploaded presentations for your revision.</p>
          </div>

          <div className="ppt-count">
            <strong>{loading ? "—" : files.length}</strong>
            <span>AVAILABLE PPTs</span>
          </div>
        </section>

        <section className="ppt-files-section">
          <div className="ppt-section-heading">
            <div className="ppt-section-icon">▤</div>
            <div>
              <h2>Uploaded Presentations</h2>
              <p>Open a presentation to view or download it.</p>
            </div>
          </div>

          {loading ? (
            <div className="ppt-state">
              <div className="ppt-loader"></div>
              <h3>Loading presentations...</h3>
              <p>Please wait while we fetch your PPTs.</p>
            </div>
          ) : error ? (
            <div className="ppt-state">
              <div className="ppt-state-icon">!</div>
              <h3>Unable to Load PPTs</h3>
              <p>{error}</p>
              <button
                className="ppt-secondary-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="ppt-state">
              <div className="ppt-state-icon">▤</div>
              <h3>No Presentations Available</h3>
              <p>
                Your teacher has not uploaded any PPTs for C Programming
                Unit 2 yet.
              </p>
              <button
                className="ppt-secondary-btn"
                onClick={() => navigate("/learn-c/unit2")}
              >
                Go Back to Unit
              </button>
            </div>
          ) : (
            <div className="ppt-grid">
              {files.map((file) => (
                <article className="ppt-card" key={file._id}>
                  <div className="ppt-card-top">
                    <div className="ppt-file-icon">PPT</div>
                    <span className="ppt-file-label">Presentation</span>
                  </div>

                  <div className="ppt-card-copy">
                    <h3>{file.metadata?.title || file.filename}</h3>
                    <p>
                      {file.metadata?.description ||
                        "Presentation uploaded for C Programming Unit 2."}
                    </p>
                  </div>

                  <div className="ppt-card-meta">
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
                          ? new Date(file.uploadDate).toLocaleDateString("en-GB")
                          : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="ppt-card-actions">
                    <a
                      href={`${API_URL}/api/notes/file/${encodeURIComponent(file.filename)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ppt-view-btn"
                    >
                      View / Download ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="ppt-footer">
          <strong>FUSION</strong>
          <span>Learn · Practice · Grow</span>
          <button onClick={() => navigate("/learn-c/unit2")}>
            Back to Unit ↑
          </button>
        </footer>
      </main>
    </div>
  );
}
