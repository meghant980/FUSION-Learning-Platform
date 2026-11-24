
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit2Results() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_URL}/api/assignments/unit/Unit 2`
      );

      const data = response.data;

      setAssignments(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.assignments)
            ? data.assignments
            : []
      );
    } catch (error) {
      console.error("Error fetching Unit 2 results:", error);
      setErrorMessage(
        "Unable to load Unit 2 assignments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Unit 2 Assignment Results</h1>
        <p>
          Access assignment-wise results and review student submissions.
        </p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>STUDENT PERFORMANCE</span>
            <h2>Assignment Results</h2>
            <p>
              Select an assignment to view its student results.
            </p>
          </div>

          {loading ? (
            <p>Loading assignments...</p>
          ) : errorMessage ? (
            <div className="fusion-unit-card">
              <div className="fusion-unit-card-text">
                <h3>Unable to load results</h3>
                <p>{errorMessage}</p>
              </div>

              <button
                className="fusion-unit-back-button"
                onClick={fetchResults}
              >
                Try Again
              </button>
            </div>
          ) : assignments.length === 0 ? (
            <div className="fusion-unit-card">
              <div className="fusion-unit-card-content">
                <div className="fusion-unit-card-icon">📂</div>
                <div className="fusion-unit-card-text">
                  <h3>No Assignments Found</h3>
                  <p>
                    No assignments are currently available for Unit 2.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="fusion-unit-card-grid">
              {assignments.map((assignment) => (
                <article
                  className="fusion-unit-card"
                  key={assignment._id}
                >
                  <div className="fusion-unit-card-content">
                    <div className="fusion-unit-card-icon">📊</div>

                    <div className="fusion-unit-card-text">
                      <h3>
                        {assignment.description || "Untitled Assignment"}
                      </h3>

                      <p>
                        <strong>Deadline:</strong>{" "}
                        {assignment.deadline
                          ? new Date(assignment.deadline).toLocaleString()
                          : "No deadline set"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="fusion-unit-back-button"
                    onClick={() =>
                      navigate(
                        `/teacher/unit2/results/${assignment._id}`
                      )
                    }
                  >
                    View Results →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fusion-unit-back-area">
        <button
          className="fusion-unit-back-button"
          onClick={() => navigate("/teacher/unit2")}
        >
          ← Back to Unit 2
        </button>
      </div>
    </div>
  );
}
