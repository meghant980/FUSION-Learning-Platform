
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function SubjectiveResults() {
  const location = useLocation();

  const supportedSubjects = [
    "c",
    "cpp",
    "java",
    "python",
    "javascript",
  ];

  // New language-specific routes:
  // /teacher/java/unit/2/subjective/results
  // /teacher/python/unit/2/subjective/results
  // /teacher/javascript/unit/2/subjective/results

  const languageMatch = location.pathname.match(
    /^\/teacher\/(c|cpp|java|python|javascript)\/unit\/(\d+)/i
  );

  // Existing C routes:
  // /teacher/unit/2/subjective/results
  // /teacher/unit2/subjective/results

  const legacyUnitMatch =
    location.pathname.match(/\/unit\/?(\d+)/i) ||
    location.pathname.match(/\/unit(\d+)/i);

  const searchParams = new URLSearchParams(location.search);
  const querySubject = searchParams.get("subject")?.trim().toLowerCase();

  const subject = languageMatch
    ? languageMatch[1].toLowerCase()
    : supportedSubjects.includes(querySubject)
      ? querySubject
      : "c";

  const UNIT_NUMBER = languageMatch
    ? languageMatch[2]
    : legacyUnitMatch?.[1] || searchParams.get("unit") || "1";

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [openingPdfId, setOpeningPdfId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [gradeInputs, setGradeInputs] = useState({});

  const getAuthConfig = () => {
    let storedUser = {};

    try {
      storedUser = JSON.parse(
        localStorage.getItem("fusionUser") || "{}"
      );
    } catch {
      storedUser = {};
    }

    const token =
      storedUser.token ||
      storedUser.accessToken ||
      localStorage.getItem("token");

    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    };
  };

  const getAssignmentId = (result) => {
    if (typeof result.assignmentId === "object") {
      return result.assignmentId?._id;
    }

    return result.assignmentId;
  };

  const getStudent = (result) => {
    return result.userId || result.studentId || {};
  };

  const getStudentName = (result) => {
    const student = getStudent(result);

    return student.name || result.studentName || "Student";
  };

  const getRollNumber = (result) => {
    const student = getStudent(result);

    return student.rollNumber || result.rollNumber || "Not available";
  };

  const getSection = (result) => {
    const student = getStudent(result);

    return result.section || student.section || "Not available";
  };

  const getAssignmentTitle = (result) => {
    if (
      result.assignmentId &&
      typeof result.assignmentId === "object"
    ) {
      return result.assignmentId.title || "Subjective Assignment";
    }

    return (
      assignments.find(
        (assignment) =>
          String(assignment._id) ===
          String(getAssignmentId(result))
      )?.title || "Subjective Assignment"
    );
  };

  // Load assignments for the selected language and unit.
  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/assignments/unit/${UNIT_NUMBER}`,
        {
          ...getAuthConfig(),
          params: {
            subject,
          },
        }
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.assignments || data.data || [];

      const subjectiveAssignments = list.filter(
        (assignment) =>
          String(assignment.type || "").toLowerCase() === "subjective" &&
          String(assignment.subject || "c").toLowerCase() === subject
      );

      setAssignments(subjectiveAssignments);

      if (subjectiveAssignments.length > 0) {
        setSelectedAssignment(subjectiveAssignments[0]._id);
      } else {
        setSelectedAssignment("");
        setResults([]);
      }
    } catch (err) {
      console.error("Error loading subjective assignments:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load subjective assignments."
      );

      setAssignments([]);
      setSelectedAssignment("");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Load student submissions for the selected assignment.
  const loadResults = async (assignmentId) => {
    if (!assignmentId) {
      setResults([]);
      return;
    }

    try {
      setResultsLoading(true);
      setError("");
      setMessage("");

      const response = await axios.get(
        `${API_URL}/api/assignments/subjective/results`,
        {
          ...getAuthConfig(),
          params: {
            assignmentId,
            unit: UNIT_NUMBER,
            subject,
          },
        }
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.results || data.submissions || data.data || [];

      setResults(list);

      const initialGrades = {};

      list.forEach((result) => {
        initialGrades[result._id] = {
          marks:
            result.marks === null || result.marks === undefined
              ? ""
              : result.marks,
          feedback: result.feedback || "",
        };
      });

      setGradeInputs(initialGrades);
    } catch (err) {
      console.error("Error loading subjective results:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load student submissions."
      );

      setResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();

    // Load again if the language or unit in the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UNIT_NUMBER, subject]);

  useEffect(() => {
    if (selectedAssignment) {
      loadResults(selectedAssignment);
    } else {
      setResults([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssignment, subject]);

  const updateGradeInput = (resultId, field, value) => {
    setGradeInputs((previous) => ({
      ...previous,
      [resultId]: {
        ...previous[resultId],
        [field]: value,
      },
    }));
  };

  const saveGrade = async (result) => {
    const grade = gradeInputs[result._id];

    if (!grade || grade.marks === "") {
      setError("Please enter marks before saving.");
      return;
    }

    const marks = Number(grade.marks);

    const assignment = assignments.find(
      (item) =>
        String(item._id) === String(getAssignmentId(result))
    );

    const maxMarks =
      result.assignmentId?.maxMarks ||
      assignment?.maxMarks ||
      100;

    if (
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > Number(maxMarks)
    ) {
      setError(`Marks must be between 0 and ${maxMarks}.`);
      return;
    }

    try {
      setSavingId(result._id);
      setError("");
      setMessage("");

      await axios.put(
        `${API_URL}/api/assignments/subjective/submissions/${result._id}/grade`,
        {
          marks,
          feedback: grade.feedback || "",
        },
        getAuthConfig()
      );

      setMessage("Marks and feedback saved successfully.");

      await loadResults(selectedAssignment);
    } catch (err) {
      console.error("Error saving subjective grade:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save marks and feedback."
      );
    } finally {
      setSavingId("");
    }
  };

  const viewPdf = async (result) => {
    try {
      setOpeningPdfId(result._id);
      setError("");
      setMessage("");

      const response = await axios.get(
        `${API_URL}/api/assignments/subjective/submissions/${result._id}/file`,
        {
          ...getAuthConfig(),
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const newTab = window.open(pdfUrl, "_blank");

      if (!newTab) {
        const link = document.createElement("a");

        link.href = pdfUrl;
        link.download = result.fileName || "student-answer.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
    } catch (err) {
      console.error("Error opening student PDF:", err);

      setError(
        err.response?.data?.message ||
          "Unable to open this PDF. Please check the backend server and login."
      );
    } finally {
      setOpeningPdfId("");
    }
  };

  const totalSubmissions = results.length;

  const evaluatedSubmissions = results.filter(
    (result) => result.status === "evaluated"
  ).length;

  const pendingSubmissions =
    totalSubmissions - evaluatedSubmissions;

  const evaluatedMarks = results
    .filter(
      (result) =>
        result.marks !== null &&
        result.marks !== undefined &&
        result.status === "evaluated"
    )
    .map((result) => Number(result.marks));

  const averageMarks =
    evaluatedMarks.length > 0
      ? (
          evaluatedMarks.reduce((sum, mark) => sum + mark, 0) /
          evaluatedMarks.length
        ).toFixed(1)
      : "—";

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f5f7f3",
      padding: "32px",
      fontFamily: "DM Sans, Arial, sans-serif",
      color: "#183c35",
    },
    container: {
      maxWidth: "1150px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "28px",
      fontWeight: 800,
      margin: "0 0 8px",
    },
    subtitle: {
      color: "#718078",
      marginBottom: "26px",
    },
    select: {
      width: "100%",
      maxWidth: "500px",
      padding: "13px",
      border: "1px solid #dce5dc",
      borderRadius: "10px",
      background: "#fff",
      color: "#183c35",
      fontSize: "15px",
      marginBottom: "25px",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
      gap: "16px",
      marginBottom: "26px",
    },
    statCard: {
      background: "#fff",
      border: "1px solid #dce5dc",
      borderRadius: "14px",
      padding: "20px",
    },
    statLabel: {
      color: "#718078",
      fontSize: "13px",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "27px",
      fontWeight: 800,
    },
    card: {
      background: "#fff",
      border: "1px solid #dce5dc",
      borderRadius: "15px",
      padding: "22px",
      marginBottom: "18px",
      boxShadow: "0 3px 12px rgba(24,60,53,0.04)",
    },
    studentName: {
      fontSize: "18px",
      fontWeight: 800,
      marginBottom: "7px",
    },
    detail: {
      color: "#718078",
      fontSize: "13px",
      marginBottom: "5px",
    },
    label: {
      display: "block",
      fontWeight: 700,
      fontSize: "13px",
      margin: "17px 0 7px",
    },
    input: {
      width: "100%",
      maxWidth: "180px",
      padding: "11px",
      border: "1px solid #dce5dc",
      borderRadius: "8px",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      minHeight: "85px",
      padding: "12px",
      border: "1px solid #dce5dc",
      borderRadius: "8px",
      fontSize: "14px",
      resize: "vertical",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    button: {
      border: "none",
      borderRadius: "8px",
      padding: "11px 17px",
      background: "#214d40",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "15px",
      marginRight: "10px",
    },
    secondaryButton: {
      border: "1px solid #214d40",
      borderRadius: "8px",
      padding: "10px 15px",
      background: "#fff",
      color: "#214d40",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "15px",
    },
    status: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "20px",
      background: "#edf3ed",
      color: "#214d40",
      fontSize: "12px",
      fontWeight: 700,
      marginTop: "10px",
    },
    alert: {
      padding: "12px 15px",
      borderRadius: "9px",
      marginBottom: "18px",
      background: "#fff0ed",
      color: "#a33b2c",
    },
    success: {
      padding: "12px 15px",
      borderRadius: "9px",
      marginBottom: "18px",
      background: "#eaf4e9",
      color: "#245b35",
    },
    empty: {
      background: "#fff",
      border: "1px dashed #cbd8cc",
      borderRadius: "13px",
      padding: "35px",
      textAlign: "center",
      color: "#718078",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          Loading {subject.toUpperCase()} subjective assignments...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          {subject.toUpperCase()} Subjective Assignment Results
        </h1>

        <p style={styles.subtitle}>
          Unit {UNIT_NUMBER} · Review student answers, view uploaded PDFs,
          assign marks and provide feedback.
        </p>

        {error && <div style={styles.alert}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        {assignments.length === 0 ? (
          <div style={styles.empty}>
            No {subject.toUpperCase()} subjective assignments found for
            Unit {UNIT_NUMBER}.
          </div>
        ) : (
          <>
            <label
              style={{
                fontWeight: 700,
                display: "block",
                marginBottom: "9px",
              }}
            >
              Select Assignment
            </label>

            <select
              style={styles.select}
              value={selectedAssignment}
              onChange={(event) =>
                setSelectedAssignment(event.target.value)
              }
            >
              {assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title || "Untitled Assignment"}
                </option>
              ))}
            </select>

            <div style={styles.stats}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Submissions</div>
                <div style={styles.statValue}>{totalSubmissions}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>Evaluated</div>
                <div style={styles.statValue}>{evaluatedSubmissions}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>Pending Evaluation</div>
                <div style={styles.statValue}>{pendingSubmissions}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>Average Marks</div>
                <div style={styles.statValue}>{averageMarks}</div>
              </div>
            </div>

            {resultsLoading ? (
              <div style={styles.empty}>
                Loading student submissions...
              </div>
            ) : results.length === 0 ? (
              <div style={styles.empty}>
                No students have submitted this assignment yet.
              </div>
            ) : (
              results.map((result) => {
                const grade = gradeInputs[result._id] || {
                  marks: "",
                  feedback: "",
                };

                const assignment = assignments.find(
                  (item) =>
                    String(item._id) ===
                    String(getAssignmentId(result))
                );

                const maxMarks =
                  result.assignmentId?.maxMarks ||
                  assignment?.maxMarks ||
                  100;

                return (
                  <div style={styles.card} key={result._id}>
                    <div style={styles.studentName}>
                      {getStudentName(result)}
                    </div>

                    <div style={styles.detail}>
                      Roll Number: {getRollNumber(result)}
                    </div>

                    <div style={styles.detail}>
                      Section: {getSection(result)}
                    </div>

                    <div style={styles.detail}>
                      Assignment: {getAssignmentTitle(result)}
                    </div>

                    <div style={styles.detail}>
                      Submitted:{" "}
                      {result.createdAt
                        ? new Date(result.createdAt).toLocaleString()
                        : "Date not available"}
                    </div>

                    <div style={styles.status}>
                      {result.status === "evaluated"
                        ? "Evaluated"
                        : "Pending Evaluation"}
                    </div>

                    {result.answer && (
                      <>
                        <label style={styles.label}>
                          Written Answer
                        </label>

                        <div
                          style={{
                            background: "#f5f7f3",
                            borderRadius: "9px",
                            padding: "14px",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {result.answer}
                        </div>
                      </>
                    )}

                    {result.fileId && (
                      <div>
                        <label style={styles.label}>
                          Uploaded PDF
                        </label>

                        <div style={styles.detail}>
                          {result.fileName || "Student answer PDF"}
                        </div>

                        <button
                          type="button"
                          style={styles.secondaryButton}
                          onClick={() => viewPdf(result)}
                          disabled={openingPdfId === result._id}
                        >
                          {openingPdfId === result._id
                            ? "Opening PDF..."
                            : "View PDF"}
                        </button>
                      </div>
                    )}

                    <label style={styles.label}>
                      Marks (out of {maxMarks})
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      step="0.5"
                      style={styles.input}
                      value={grade.marks}
                      onChange={(event) =>
                        updateGradeInput(
                          result._id,
                          "marks",
                          event.target.value
                        )
                      }
                      placeholder="Enter marks"
                    />

                    <label style={styles.label}>
                      Teacher Feedback
                    </label>

                    <textarea
                      style={styles.textarea}
                      value={grade.feedback}
                      onChange={(event) =>
                        updateGradeInput(
                          result._id,
                          "feedback",
                          event.target.value
                        )
                      }
                      placeholder="Write feedback for the student..."
                    />

                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        opacity:
                          savingId === result._id ? 0.65 : 1,
                      }}
                      onClick={() => saveGrade(result)}
                      disabled={savingId === result._id}
                    >
                      {savingId === result._id
                        ? "Saving..."
                        : "Save Marks & Feedback"}
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
