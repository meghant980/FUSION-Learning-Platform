
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/c-ppt-page.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function CUnit3Ppt() {
  const [ppts, setPpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPPTs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notes/filter`, {
          params: {
            subject: "c",
            unit: 3,
            category: "PPT",
          },
        });

        if (res.data.success && Array.isArray(res.data.files)) {
          setPpts(res.data.files);
        } else {
          setPpts([]);
        }
      } catch (err) {
        console.error("Error fetching Unit 3 PPTs:", err);
        setError("Unable to load PPTs right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPPTs();
  }, []);

  return (
    <div className="ppt-page">
      <header className="ppt-header">
        <button
          className="ppt-back-link"
          onClick={() => navigate("/learn-c/unit3")}
        >
          ← Back to Unit 3
        </button>

        <div className="ppt-brand">FUSION</div>
      </header>

      <main className="ppt-main">
        <section className="ppt-hero">
          <div className="ppt-eyebrow">LEARNING RESOURCES · C PROGRAMMING</div>
          <h1>Unit 03 Presentations</h1>
          <p>
            Explore the presentations uploaded by your teacher for Functions
            and Arrays.
          </p>

          <div className="ppt-hero-meta">
            <span>UNIT 03</span>
            <span>·</span>
            <span>POWERPOINT RESOURCES</span>
          </div>
        </section>

        <section className="ppt-content">
          <div className="ppt-section-heading">
            <div>
              <span className="ppt-section-label">YOUR MATERIAL</span>
              <h2>Available presentations</h2>
            </div>

            <span className="ppt-count">
              {ppts.length} {ppts.length === 1 ? "FILE" : "FILES"}
            </span>
          </div>

          {loading ? (
            <div className="ppt-state">
              <div className="ppt-loader"></div>
              <p>Loading your presentations...</p>
            </div>
          ) : error ? (
            <div className="ppt-state ppt-error">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : ppts.length === 0 ? (
            <div className="ppt-empty">
              <div className="ppt-empty-icon">▤</div>
              <h3>No presentations yet</h3>
              <p>
                Your teacher has not uploaded any PPTs for Unit 3 yet.
                Please check again later.
              </p>
            </div>
          ) : (
            <div className="ppt-grid">
              {ppts.map((ppt) => (
                <article className="ppt-card" key={ppt._id}>
                  <div className="ppt-card-top">
                    <div className="ppt-file-icon">PPT</div>
                    <span className="ppt-file-tag">PRESENTATION</span>
                  </div>

                  <h3>{ppt.metadata?.title || ppt.filename}</h3>

                  {ppt.metadata?.description && (
                    <p className="ppt-description">
                      {ppt.metadata.description}
                    </p>
                  )}

                  <div className="ppt-details">
                    <div>
                      <span>UPLOADED BY</span>
                      <strong>
                        {ppt.metadata?.uploadedBy || "Teacher"}
                      </strong>
                    </div>

                    <div>
                      <span>UNIT</span>
                      <strong>{ppt.metadata?.unit || "Unit 3"}</strong>
                    </div>

                    <div>
                      <span>UPLOAD DATE</span>
                      <strong>
                        {ppt.uploadDate
                          ? new Date(ppt.uploadDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <a
                    href={`${API_URL}/api/notes/file/${encodeURIComponent(
                      ppt.filename
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ppt-download-btn"
                  >
                    View presentation <span>↗</span>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="ppt-footer">
        <span>FUSION · LEARN. PRACTICE. GROW.</span>
        <span>C PROGRAMMING</span>
      </footer>
    </div>
  );
}
