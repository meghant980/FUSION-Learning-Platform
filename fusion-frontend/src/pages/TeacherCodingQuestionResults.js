
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/teacher.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

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

const getScoreDisplay = (submission) => {
  const maximum =
    submission.maxMarks ??
    submission.marksTotal ??
    submission.totalPossibleMarks ??
    0;

  const obtained =
    submission.totalMarks ??
    submission.marksAwarded ??
    submission.marks;

  if (Number(maximum) <= 0 || maximum === null) {
    return "Not assigned";
  }

  return `${obtained ?? 0} / ${maximum}`;
};

export default function TeacherCodingQuestionResults() {
  const { questionId, unit } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(async () => {
    if (!questionId) {
      setError("Question ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Login token not found. Please log in again.");
      }

      const response = await axios.get(
        `${API_URL}/api/coding/results/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions(response.data.submissions || []);
    } catch (err) {
      console.error("Error fetching coding results:", err);

      setSubmissions([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Unable to load student results."
      );
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="unit-page">
      <div className="unit-header">
        <h1>
          💻 {unit ? `Unit ${unit} - ` : ""}
          Coding Results
        </h1>

        <p>Student submissions and evaluation details</p>
      </div>

      <div className="section">
        {loading ? (
          <div className="empty-state">
            <p>Loading student results...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>

            <button className="view-btn" onClick={fetchResults}>
              Try Again
            </button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <p>No student has submitted this question yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Language</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Submitted Code</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id || index}>
                    <td>{sub.userId?.name || "N/A"}</td>

                    <td>{sub.userId?.rollNumber || "N/A"}</td>

                    <td>
                      {(sub.language || "N/A").toUpperCase()}
                    </td>

                    <td>{getScoreDisplay(sub)}</td>

                    <td>{sub.status || "Submitted"}</td>

                    <td>
                      <details>
                        <summary style={{ cursor: "pointer" }}>
                          View Code
                        </summary>

                        <pre className="code-box">
                          {sub.code || "No code available"}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
