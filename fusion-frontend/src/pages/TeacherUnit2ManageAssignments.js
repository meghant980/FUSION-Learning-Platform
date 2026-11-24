
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit2ManageAssignments() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_URL}/api/assignments/unit/2`
      );

      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error("Error fetching Unit 2 assignments:", error);
      setErrorMessage("Unable to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API_URL}/api/assignments/${id}`);

      setAssignments((previous) =>
        previous.filter((assignment) => assignment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
      window.alert("Unable to delete the assignment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Manage Unit 2 Assignments</h1>
        <p>
          View existing assignments, check their details and
          manage assignment records.
        </p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>ASSESSMENT MANAGEMENT</span>
            <h2>Your Assignments</h2>
            <p>
              Assignments created for Unit 2 are displayed below.
            </p>
          </div>

          {loading ? (
            <p>Loading assignments...</p>
          ) : errorMessage ? (
            <div className="fusion-unit-card">
              <p>{errorMessage}</p>
              <button
                className="fusion-unit-back-button"
                onClick={fetchAssignments}
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
                    There are currently no assignments available for Unit 2.
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
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  <div className="fusion-unit-card-content">
                    <div className="fusion-unit-card-icon">📝</div>

                    <div className="fusion-unit-card-text">
                      <h3>
                        {assignment.description || "Untitled Assignment"}
                      </h3>
                      <p>Unit 2 Assignment</p>
                    </div>
                  </div>

                  <div style={{ width: "100%", marginTop: "12px" }}>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {assignment.deadline
                        ? new Date(assignment.deadline).toLocaleString()
                        : "No deadline set"}
                    </p>

                    <p>
                      <strong>Uploaded on:</strong>{" "}
                      {assignment.createdAt
                        ? new Date(assignment.createdAt).toLocaleString()
                        : "Unknown"}
                    </p>

                    <p>
                      <strong>Unit:</strong> {assignment.unit ?? 2}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteAssignment(assignment._id)}
                    disabled={deletingId === assignment._id}
                    style={{
                      marginTop: "12px",
                      padding: "11px 17px",
                      border: "1px solid #e5c8c3",
                      borderRadius: "7px",
                      background: "#fff5f3",
                      color: "#a13d32",
                      fontWeight: 700,
                      cursor:
                        deletingId === assignment._id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        deletingId === assignment._id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === assignment._id
                      ? "Deleting..."
                      : "Delete Assignment"}
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
          onClick={() => navigate("/teacher/unit2/assignments")}
        >
          ← Back to Unit 2 Assignments
        </button>
      </div>
    </div>
  );
}
