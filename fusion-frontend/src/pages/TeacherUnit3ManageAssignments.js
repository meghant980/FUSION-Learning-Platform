
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-unit-dashboard.css";

export default function TeacherUnit3ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const unit = 3;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5001/api/assignments/unit/${unit}?type=quiz`
        );

        const data = response.data;

        setAssignments(
          Array.isArray(data?.assignments)
            ? data.assignments
            : Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error("Error fetching Unit 3 assignments:", err);
        setError("Unable to load assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const deleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5001/api/assignments/${id}`);

      setAssignments((previousAssignments) =>
        previousAssignments.filter((assignment) => assignment._id !== id)
      );

      window.alert("Assignment deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err);
      window.alert("Unable to delete the assignment. Please try again.");
    }
  };

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Manage Assignments</h1>
        <p>View and manage Unit 3 MCQ assignments.</p>
      </header>

      <main className="fusion-unit-main">
        <section className="fusion-unit-section">
          <div className="fusion-unit-section-heading">
            <span>UNIT 03</span>
            <h2>Created Assignments</h2>
            <p>
              View assignment details, check results or remove an assignment.
            </p>
          </div>

          {loading ? (
            <div className="fusion-unit-card">
              <p>Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="fusion-unit-card">
              <p>{error}</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="fusion-unit-card">
              <div className="fusion-unit-card-content">
                <div className="fusion-unit-card-icon">📂</div>
                <div className="fusion-unit-card-text">
                  <h3>No assignments found</h3>
                  <p>
                    There are currently no MCQ assignments available for Unit 3.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="fusion-unit-card-grid">
              {assignments.map((assignment) => (
                <div className="fusion-unit-card" key={assignment._id}>
                  <div className="fusion-unit-card-content">
                    <div className="fusion-unit-card-icon">📄</div>

                    <div className="fusion-unit-card-text">
                      <h3>{assignment.title || "Untitled Assignment"}</h3>

                      <p>
                        {assignment.description || "No description available."}
                      </p>

                      <p>
                        <strong>Deadline:</strong>{" "}
                        {assignment.deadline
                          ? new Date(assignment.deadline).toLocaleDateString()
                          : "No deadline"}
                      </p>
                    </div>
                  </div>

                  <div className="manage-actions">
                    <button
                      className="fusion-unit-back-button"
                      onClick={() =>
                        navigate(
                          `/teacher/assignment-results/${assignment._id}`
                        )
                      }
                    >
                      📊 Results
                    </button>

                    <button
                      className="fusion-unit-back-button"
                      onClick={() => deleteAssignment(assignment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fusion-unit-back-area">
        <button
          className="fusion-unit-back-button"
          onClick={() => navigate("/teacher/unit3/assignments")}
        >
          ← Back to Unit 3 Assignments
        </button>
      </div>
    </div>
  );
}
