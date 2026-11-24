
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/teacher-unit-dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherUnit3Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCpp = location.pathname.toLowerCase().includes("cpp");
  const subject = isCpp ? "cpp" : "c";

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/assignments/unit/3`,
          {
            params: {
              type: "quiz",
              subject,
            },
          }
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
        setError("Unable to load assignments. Please try again.");
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [subject]);

  useEffect(() => {
    if (!selectedAssignment?._id) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/assignments/performance/${selectedAssignment._id}`
        );

        const data = response.data?.performances || [];

        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching assignment results:", err);
        setError("Unable to load results for this assignment.");
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [selectedAssignment]);

  const exportToExcel = () => {
    if (!selectedAssignment || results.length === 0) return;

    const exportData = results.map((result) => ({
      Name: result.studentName || "",
      "Roll Number": result.rollNumber || "",
      Subject: (result.subject || subject).toUpperCase(),
      Unit: result.unit || "Unit 3",
      Correct: result.correct ?? 0,
      Wrong: result.wrong ?? 0,
      Accuracy: `${result.accuracy ?? 0}%`,
      "Submitted At": result.date
        ? new Date(result.date).toLocaleString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    XLSX.writeFile(
      workbook,
      `${selectedAssignment.title || "Unit_3"}_results.xlsx`
    );
  };

  const exportToPDF = () => {
    if (!selectedAssignment || results.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(
      `Results - ${selectedAssignment.title || "Unit 3 Assignment"}`,
      14,
      15
    );

    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Name",
          "Roll Number",
          "Correct",
          "Wrong",
          "Accuracy",
          "Submitted At",
        ],
      ],
      body: results.map((result) => [
        result.studentName || "-",
        result.rollNumber || "-",
        result.correct ?? 0,
        result.wrong ?? 0,
        `${result.accuracy ?? 0}%`,
        result.date ? new Date(result.date).toLocaleDateString() : "-",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [24, 60, 53],
      },
    });

    doc.save(
      `${selectedAssignment.title || "Unit_3"}_results.pdf`
    );
  };

  const assignmentsPath = isCpp
    ? "/teacher/cpp/unit3/assignments"
    : "/teacher/unit3/assignments";

  return (
    <div className="fusion-unit-dashboard">
      <header className="fusion-unit-hero">
        <div className="fusion-unit-brand">FUSION</div>
        <h1>Assignment Results</h1>
        <p>
          Review Unit 3 {isCpp ? "C++" : "C"} student performance and export
          assessment reports.
        </p>
      </header>

      <main className="fusion-unit-main">
        {!selectedAssignment ? (
          <section className="fusion-unit-section">
            <div className="fusion-unit-section-heading">
              <span>UNIT 03 / {(subject).toUpperCase()}</span>
              <h2>Select an Assignment</h2>
              <p>
                Choose an MCQ assignment to view its student results.
              </p>
            </div>

            {loadingAssignments ? (
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
                      No Unit 3 MCQ assignments are available for{" "}
                      {subject.toUpperCase()} yet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fusion-unit-card-grid">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="fusion-unit-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAssignment(assignment)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedAssignment(assignment);
                      }
                    }}
                  >
                    <div className="fusion-unit-card-content">
                      <div className="fusion-unit-card-icon">📄</div>
                      <div className="fusion-unit-card-text">
                        <h3>
                          {assignment.title || "Untitled Assignment"}
                        </h3>
                        <p>
                          {assignment.description ||
                            "View student performance"}
                        </p>
                      </div>
                    </div>
                    <div className="fusion-unit-card-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="fusion-unit-section">
            <div className="fusion-unit-section-heading">
              <span>UNIT 03 / RESULTS</span>
              <h2>{selectedAssignment.title}</h2>
              <p>
                {selectedAssignment.description ||
                  "Student performance for this assignment."}
              </p>
            </div>

            {loadingResults ? (
              <div className="fusion-unit-card">
                <p>Loading student results...</p>
              </div>
            ) : error ? (
              <div className="fusion-unit-card">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="fusion-unit-card-grid">
                  <div className="fusion-unit-card">
                    <div className="fusion-unit-card-content">
                      <div className="fusion-unit-card-icon">👥</div>
                      <div className="fusion-unit-card-text">
                        <h3>{results.length}</h3>
                        <p>Student result records</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fusion-unit-section-heading">
                  <h2>Performance Report</h2>
                  <p>
                    Download the results in Excel or PDF format.
                  </p>
                </div>

                <div className="manage-actions">
                  <button
                    className="fusion-unit-back-button"
                    onClick={exportToExcel}
                    disabled={results.length === 0}
                  >
                    📘 Export Excel
                  </button>

                  <button
                    className="fusion-unit-back-button"
                    onClick={exportToPDF}
                    disabled={results.length === 0}
                  >
                    📄 Export PDF
                  </button>
                </div>

                {results.length === 0 ? (
                  <div className="fusion-unit-card">
                    <p>
                      No student results are available for this assignment.
                    </p>
                  </div>
                ) : (
                  <div
                    className="fusion-unit-card"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Roll Number</th>
                          <th>Correct</th>
                          <th>Wrong</th>
                          <th>Accuracy</th>
                          <th>Submitted At</th>
                        </tr>
                      </thead>

                      <tbody>
                        {results.map((result, index) => (
                          <tr key={result._id || index}>
                            <td>{result.studentName || "-"}</td>
                            <td>{result.rollNumber || "-"}</td>
                            <td>{result.correct ?? 0}</td>
                            <td>{result.wrong ?? 0}</td>
                            <td>{result.accuracy ?? 0}%</td>
                            <td>
                              {result.date
                                ? new Date(result.date).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            <div className="fusion-unit-back-area">
              <button
                className="fusion-unit-back-button"
                onClick={() => {
                  setSelectedAssignment(null);
                  setResults([]);
                  setError("");
                }}
              >
                ← Back to Assignments
              </button>
            </div>
          </section>
        )}
      </main>

      <div className="fusion-unit-back-area">
        <button
          className="fusion-unit-back-button"
          onClick={() => navigate(assignmentsPath)}
        >
          ← Back to Unit 3 Assignments
        </button>
      </div>
    </div>
  );
}
