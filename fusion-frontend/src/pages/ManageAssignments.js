
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/teacher.css";

export default function ManageAssignments() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  const unit = Number(query.get("unit")) || 1;

  // Identify whether this page belongs to C or C++.
  const subject = location.pathname.startsWith("/teacher/cpp/")
    ? "cpp"
    : "c";

  const courseName = subject === "cpp" ? "C++" : "C";

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5001/api/assignments/unit/${unit}`,
          {
            params: {
              type: "quiz",
              subject: subject,
            },
          }
        );

        console.log("Assignments API Response:", res.data);

        setAssignments(res.data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [unit, subject]);

  const deleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/assignments/${id}`
      );

      alert("Assignment deleted successfully!");

      setAssignments((previousAssignments) =>
        previousAssignments.filter((assignment) => assignment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment. Please try again.");
    }
  };

  return (
    <div className="unit-page">
      <div className="unit-header">
        📁 Manage {courseName} Assignments – Unit {unit}
      </div>

      {loading ? (
        <div className="empty-state">
          Loading assignments...
        </div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          No {courseName} assignments found for Unit {unit}.
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="section-card">
              {/* LEFT SIDE */}
              <div className="card-left">
                <div className="card-icon">📄</div>

                <div>
                  <h3>{assignment.title}</h3>

                  <p>{assignment.description}</p>

                  <p>
                    <strong>Course:</strong> {courseName}
                  </p>

                  <p>
                    <strong>Unit:</strong> {unit}
                  </p>

                  <p>
                    <strong>Deadline:</strong>{" "}
                    {assignment.deadline
                      ? new Date(assignment.deadline).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="manage-actions">
                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/teacher/assignment-results/${assignment._id}`)
                  }
                >
                  📊 Results
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteAssignment(assignment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
