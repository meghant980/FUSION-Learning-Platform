
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ManageSubjective() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const supportedSubjects = [
    "c",
    "cpp",
    "java",
    "python",
    "javascript",
  ];

  // New language-specific routes:
  // /teacher/java/unit/2/subjective/manage
  // /teacher/python/unit/2/subjective/manage
  // /teacher/javascript/unit/2/subjective/manage

  const languageRouteMatch = location.pathname.match(
    /^\/teacher\/(c|cpp|java|python|javascript)\/unit\/(\d+)/i
  );

  // Existing C routes:
  // /teacher/unit2/subjective/manage
  // /teacher/unit/2/subjective/manage

  const legacyUnitMatch =
    location.pathname.match(/\/unit(\d+)/i) ||
    location.pathname.match(/\/unit\/(\d+)/i);

  const querySubject = new URLSearchParams(location.search)
    .get("subject")
    ?.trim()
    .toLowerCase();

  const subject = languageRouteMatch
    ? languageRouteMatch[1].toLowerCase()
    : supportedSubjects.includes(querySubject)
      ? querySubject
      : "c";

  const unit = languageRouteMatch
    ? Number(languageRouteMatch[2])
    : legacyUnitMatch
      ? Number(legacyUnitMatch[1])
      : 1;

  // Build navigation paths according to the current language.
  const subjectivePath = languageRouteMatch
    ? `/teacher/${subject}/unit/${unit}/subjective`
    : `/teacher/unit${unit}/subjective`;

  const createPath = `${subjectivePath}/create`;

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5001/api/assignments/unit/${unit}`,
        {
          params: {
            subject,
          },
        }
      );

      const allAssignments = Array.isArray(res.data)
        ? res.data
        : res.data?.assignments || [];

      setAssignments(
        allAssignments.filter(
          (assignment) =>
            assignment.type === "subjective" &&
            String(assignment.subject || "c").toLowerCase() === subject
        )
      );
    } catch (err) {
      console.error("Error fetching subjective assignments:", err);
      setError("Unable to load assignments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [unit, subject]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subjective assignment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await axios.delete(
        `http://localhost:5001/api/assignments/${id}`
      );

      setAssignments((previous) =>
        previous.filter((assignment) => assignment._id !== id)
      );
    } catch (err) {
      console.error("Error deleting assignment:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete this assignment. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "No deadline set";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f3",
        padding: "35px 5%",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate(subjectivePath)}
          style={{
            background: "#ffffff",
            border: "1px solid #dce5dc",
            borderRadius: "9px",
            padding: "10px 16px",
            color: "#315b4d",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Back to Subjective Assessments
        </button>

        <div
          style={{
            background: "#183c35",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "30px 34px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              color: "#c4d6c6",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            TEACHER WORKSPACE · {subject.toUpperCase()} · UNIT {unit}
          </div>

          <h1 style={{ fontSize: "29px", margin: "0 0 10px" }}>
            Manage Assignments
          </h1>

          <p
            style={{
              color: "#d4e1d7",
              fontSize: "14px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            View and organise your subjective assignments. Keep track of
            questions, marks and submission deadlines.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "22px",
          }}
        >
          <div>
            <p
              style={{
                color: "#829087",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.7px",
                margin: "0 0 7px",
              }}
            >
              ASSIGNMENT OVERVIEW
            </p>

            <h2
              style={{
                color: "#23483b",
                fontSize: "22px",
                margin: 0,
              }}
            >
              Your Subjective Assignments
            </h2>
          </div>

          <div
            style={{
              background: "#e8f0e7",
              borderRadius: "12px",
              padding: "12px 19px",
              minWidth: "90px",
            }}
          >
            <div
              style={{
                color: "#708675",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              TOTAL
            </div>

            <div
              style={{
                color: "#214d40",
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              {assignments.length}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0eb",
              color: "#a34d37",
              padding: "14px 17px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "15px",
              padding: "45px 20px",
              textAlign: "center",
              color: "#718278",
            }}
          >
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e9e1",
              borderRadius: "16px",
              padding: "55px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "38px", marginBottom: "15px" }}>
              📝
            </div>

            <h3 style={{ color: "#23483b", margin: "0 0 9px" }}>
              No Assignments Yet
            </h3>

            <p
              style={{
                color: "#849087",
                fontSize: "13px",
                margin: "0 0 22px",
              }}
            >
              You haven't created any {subject.toUpperCase()} subjective
              assignments for Unit {unit}.
            </p>

            <button
              type="button"
              onClick={() => navigate(createPath)}
              style={{
                background: "#214d40",
                color: "#ffffff",
                border: "none",
                borderRadius: "9px",
                padding: "12px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Create Assignment
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "19px",
            }}
          >
            {assignments.map((assignment, index) => (
              <div
                key={assignment._id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e9e1",
                  borderRadius: "15px",
                  padding: "23px",
                  boxShadow: "0 5px 18px rgba(30,65,48,0.045)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minWidth: 0,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "17px",
                    }}
                  >
                    <span
                      style={{
                        background: "#edf3ec",
                        borderRadius: "9px",
                        padding: "9px 12px",
                        fontSize: "19px",
                      }}
                    >
                      📝
                    </span>

                    <span
                      style={{
                        color: "#8a9b85",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    style={{
                      color: "#23483b",
                      fontSize: "16px",
                      lineHeight: 1.5,
                      margin: "0 0 18px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {assignment.question}
                  </h3>

                  <div
                    style={{
                      borderTop: "1px solid #edf1ec",
                      paddingTop: "15px",
                      display: "grid",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#87938a" }}>
                        Maximum Marks
                      </span>

                      <strong style={{ color: "#315b4d" }}>
                        {assignment.maxMarks ?? "—"}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#87938a" }}>Deadline</span>

                      <strong style={{ color: "#315b4d" }}>
                        {formatDate(assignment.deadline)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#87938a" }}>Unit</span>

                      <strong style={{ color: "#315b4d" }}>
                        Unit {assignment.unit ?? unit}
                      </strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "23px",
                    paddingTop: "17px",
                    borderTop: "1px solid #edf1ec",
                  }}
                >
                  <button
                    type="button"
                    disabled
                    title="Editing is not currently connected"
                    style={{
                      flex: 1,
                      padding: "11px",
                      border: "1px solid #dce5dc",
                      borderRadius: "8px",
                      background: "#f5f7f3",
                      color: "#9aa69b",
                      fontWeight: 600,
                      cursor: "not-allowed",
                      fontSize: "12px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(assignment._id)}
                    disabled={deletingId === assignment._id}
                    style={{
                      flex: 1,
                      padding: "11px",
                      border: "none",
                      borderRadius: "8px",
                      background:
                        deletingId === assignment._id
                          ? "#b98d83"
                          : "#a84f43",
                      color: "#ffffff",
                      fontWeight: 700,
                      cursor:
                        deletingId === assignment._id
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {deletingId === assignment._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#9aa69b",
            fontSize: "12px",
            marginTop: "35px",
          }}
        >
          FUSION · Teaching and Assessment Workspace
        </p>
      </div>
    </div>
  );
}
