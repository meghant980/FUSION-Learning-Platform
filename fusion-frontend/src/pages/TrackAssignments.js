
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TrackAssignments() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_URL}/api/assignments/performance`
        );

        setPerformances(res.data.performances || []);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(
          "Unable to load assignment performance. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f5f7f3",
      padding: "42px 5%",
      fontFamily: "'DM Sans', Arial, sans-serif",
      color: "#183c35",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1250px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "30px",
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
      margin: 0,
    },
    card: {
      background: "#ffffff",
      border: "1px solid #dce5dc",
      borderRadius: "16px",
      padding: "25px",
      boxShadow: "0 8px 28px rgba(24, 60, 53, 0.05)",
    },
    cardHeading: {
      fontSize: "18px",
      fontWeight: "700",
      margin: "0 0 5px",
      color: "#214d40",
    },
    cardDescription: {
      color: "#829087",
      fontSize: "13px",
      margin: "0 0 22px",
    },
    tableWrapper: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "950px",
      textAlign: "left",
    },
    th: {
      padding: "15px 14px",
      background: "#f0f4ee",
      color: "#486454",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
      borderBottom: "1px solid #e2e9e1",
    },
    td: {
      padding: "16px 14px",
      fontSize: "14px",
      color: "#53645b",
      borderBottom: "1px solid #edf0eb",
    },
    student: {
      color: "#214d40",
      fontWeight: "700",
    },
    badge: {
      display: "inline-block",
      background: "#edf4ec",
      color: "#315d43",
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
    },
    message: {
      padding: "35px 15px",
      textAlign: "center",
      color: "#718078",
      fontSize: "14px",
    },
    error: {
      padding: "20px",
      borderRadius: "10px",
      background: "#fff1ef",
      color: "#a33c32",
      fontSize: "14px",
      textAlign: "center",
    },
    footer: {
      marginTop: "20px",
      color: "#8a968e",
      fontSize: "12px",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.eyebrow}>Teacher Dashboard / Analytics</div>
          <h1 style={styles.title}>Assignment Performance</h1>
          <p style={styles.subtitle}>
            Monitor student performance and review MCQ assignment results.
          </p>
        </header>

        <section style={styles.card}>
          <h2 style={styles.cardHeading}>Student Performance</h2>
          <p style={styles.cardDescription}>
            Overview of assignment attempts, scores and accuracy.
          </p>

          {loading ? (
            <div style={styles.message}>
              Loading student performance...
            </div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : performances.length === 0 ? (
            <div style={styles.message}>
              No student performance data is available yet.
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Roll Number</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Unit</th>
                    <th style={styles.th}>Correct</th>
                    <th style={styles.th}>Wrong</th>
                    <th style={styles.th}>Accuracy</th>
                    <th style={styles.th}>Submitted At</th>
                  </tr>
                </thead>

                <tbody>
                  {performances.map((p, index) => (
                    <tr key={p._id || index}>
                      <td style={{ ...styles.td, ...styles.student }}>
                        {p.studentName || "—"}
                      </td>
                      <td style={styles.td}>{p.rollNumber || "—"}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {(p.subject || "c").toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>{p.unit || "—"}</td>
                      <td style={styles.td}>{p.correct ?? 0}</td>
                      <td style={styles.td}>{p.wrong ?? 0}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {Number(p.accuracy || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td style={styles.td}>
                        {p.date
                          ? new Date(p.date).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p style={styles.footer}>
          Fusion · Student Assignment Analytics
        </p>
      </div>
    </main>
  );
}
