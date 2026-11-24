
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function AssignmentResultTable() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/assignments/performance/${assignmentId}`
        );

        setResults(response.data.performances || []);
      } catch (err) {
        console.error("Error fetching assignment results:", err);
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load assignment results."
        );
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchResults();
    } else {
      setError("Assignment ID is missing.");
      setLoading(false);
    }
  }, [assignmentId]);

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "35px",
      background: "#f5f7f3",
      fontFamily: "'DM Sans', sans-serif",
      color: "#183c35",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "25px",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "700",
      margin: 0,
    },
    subtitle: {
      color: "#718078",
      marginTop: "8px",
      fontSize: "14px",
    },
    button: {
      padding: "11px 20px",
      background: "#214d40",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
    card: {
      background: "#fff",
      border: "1px solid #dce5dc",
      borderRadius: "12px",
      padding: "22px",
      overflowX: "auto",
      boxShadow: "0 3px 12px rgba(24,60,53,0.05)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "750px",
    },
    th: {
      textAlign: "left",
      padding: "15px 12px",
      background: "#edf2ec",
      color: "#214d40",
      fontSize: "13px",
      borderBottom: "1px solid #dce5dc",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "15px 12px",
      borderBottom: "1px solid #e7ece6",
      fontSize: "14px",
      color: "#40534a",
    },
    message: {
      padding: "35px 15px",
      textAlign: "center",
      color: "#718078",
      fontSize: "15px",
    },
    error: {
      color: "#a33b35",
      background: "#fff1ef",
      border: "1px solid #f0d2ce",
      padding: "15px",
      borderRadius: "8px",
    },
    accuracy: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      background: "#e8f1e8",
      color: "#214d40",
      fontWeight: "700",
      fontSize: "13px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Assignment Results</h1>
          <p style={styles.subtitle}>
            Student performance for this quiz assignment
          </p>
        </div>

        <button
          style={styles.button}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.message}>
            Loading assignment results...
          </div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : results.length === 0 ? (
          <div style={styles.message}>
            No students have submitted this assignment yet.
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Roll Number</th>
                <th style={styles.th}>Correct</th>
                <th style={styles.th}>Wrong</th>
                <th style={styles.th}>Total Questions</th>
                <th style={styles.th}>Accuracy</th>
                <th style={styles.th}>Submitted At</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td style={styles.td}>
                    {result.studentName || "N/A"}
                  </td>

                  <td style={styles.td}>
                    {result.rollNumber || "N/A"}
                  </td>

                  <td style={styles.td}>
                    {result.correct ?? 0}
                  </td>

                  <td style={styles.td}>
                    {result.wrong ?? 0}
                  </td>

                  <td style={styles.td}>
                    {(result.correct ?? 0) + (result.wrong ?? 0)}
                  </td>

                  <td style={styles.td}>
                    <span style={styles.accuracy}>
                      {Number(result.accuracy || 0).toFixed(1)}%
                    </span>
                  </td>

                  <td style={styles.td}>
                    {result.date
                      ? new Date(result.date).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
