
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TrackPerformance() {
  const [tab, setTab] = useState("assignment");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint =
          tab === "assignment"
            ? `${API_URL}/api/assignments/performance`
            : `${API_URL}/api/coding/performance`;

        const res = await axios.get(endpoint);

        const data =
          tab === "assignment"
            ? res.data?.performances || []
            : res.data?.performances || res.data || [];

        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching performance:", err);
        setRecords([]);
        setError("Unable to load performance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [tab]);

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
      margin: "0 0 28px",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #dce5dc",
      borderRadius: "16px",
      padding: "25px",
      boxShadow: "0 8px 28px rgba(24, 60, 53, 0.05)",
    },
    tabs: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      padding: "6px",
      background: "#f0f4ee",
      borderRadius: "12px",
      width: "fit-content",
      maxWidth: "100%",
      marginBottom: "25px",
    },
    tab: {
      border: "none",
      borderRadius: "9px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    activeTab: {
      background: "#214d40",
      color: "#ffffff",
      boxShadow: "0 3px 8px rgba(24, 60, 53, 0.13)",
    },
    inactiveTab: {
      background: "transparent",
      color: "#63766a",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#214d40",
      margin: "0 0 5px",
    },
    sectionText: {
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
      minWidth: tab === "assignment" ? "950px" : "650px",
      borderCollapse: "collapse",
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
        <header>
          <div style={styles.eyebrow}>Teacher Dashboard / Analytics</div>
          <h1 style={styles.title}>Track Student Performance</h1>
          <p style={styles.subtitle}>
            Review student results across assignments and coding practice.
          </p>
        </header>

        <section style={styles.card}>
          <div style={styles.tabs}>
            <button
              type="button"
              onClick={() => setTab("assignment")}
              style={{
                ...styles.tab,
                ...(tab === "assignment"
                  ? styles.activeTab
                  : styles.inactiveTab),
              }}
            >
              Assignments
            </button>

            <button
              type="button"
              onClick={() => setTab("coding")}
              style={{
                ...styles.tab,
                ...(tab === "coding"
                  ? styles.activeTab
                  : styles.inactiveTab),
              }}
            >
              Coding Practice
            </button>
          </div>

          <h2 style={styles.sectionTitle}>
            {tab === "assignment"
              ? "Assignment Performance"
              : "Coding Practice Performance"}
          </h2>

          <p style={styles.sectionText}>
            {tab === "assignment"
              ? "Student results from MCQ assignments."
              : "Student results from coding practice submissions."}
          </p>

          {loading ? (
            <div style={styles.message}>Loading performance data...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : records.length === 0 ? (
            <div style={styles.message}>
              No performance data found for{" "}
              {tab === "assignment" ? "assignments" : "coding practice"}.
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Roll Number</th>
                    {tab === "assignment" && (
                      <>
                        <th style={styles.th}>Subject</th>
                        <th style={styles.th}>Unit</th>
                      </>
                    )}
                    <th style={styles.th}>Correct</th>
                    <th style={styles.th}>Wrong</th>
                    <th style={styles.th}>Accuracy</th>
                    {tab === "assignment" && (
                      <th style={styles.th}>Submitted At</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => (
                    <tr key={record._id || index}>
                      <td style={{ ...styles.td, ...styles.student }}>
                        {record.studentName || "—"}
                      </td>
                      <td style={styles.td}>
                        {record.rollNumber || "—"}
                      </td>

                      {tab === "assignment" && (
                        <>
                          <td style={styles.td}>
                            <span style={styles.badge}>
                              {(record.subject || "c").toUpperCase()}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {record.unit || "—"}
                          </td>
                        </>
                      )}

                      <td style={styles.td}>
                        {record.correct ?? 0}
                      </td>
                      <td style={styles.td}>
                        {record.wrong ?? 0}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {Number(record.accuracy || 0).toFixed(1)}%
                        </span>
                      </td>

                      {tab === "assignment" && (
                        <td style={styles.td}>
                          {record.date
                            ? new Date(record.date).toLocaleString()
                            : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p style={styles.footer}>
          Fusion · Student Performance Analytics
        </p>
      </div>
    </main>
  );
}
