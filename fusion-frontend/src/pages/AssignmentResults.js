
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PageStyles.css";

export default function AssignmentResults() {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [nameFilter, setNameFilter] = useState("");
  const [rollFilter, setRollFilter] = useState("");
  const [accuracyFilter, setAccuracyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  const location = useLocation();

  const unit = Number(
    location.pathname.match(/unit(\d+)/)?.[1] || 1
  );

  // Detect whether this page belongs to C or C++.
  const subject = location.pathname.startsWith("/teacher/cpp/")
    ? "cpp"
    : "c";

  const courseName = subject === "cpp" ? "C++" : "C";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const rawUser = JSON.parse(
          localStorage.getItem("fusionUser") || "{}"
        );

        const user = rawUser?.user || rawUser;

        if (!user || !(user.id || user._id)) {
          console.error("Teacher information not found.");
          return;
        }

        const section =
          user.sections?.[0] || user.section || "";

        if (!section) {
          console.error("Teacher section not found.");
          return;
        }

        const params = {
          teacherId: user.id || user._id,
          section,
          unit,
          type: "quiz",
          subject,
        };

        console.log("Fetching assignment results:", params);

        const response = await axios.get(
          "http://localhost:5001/api/assignments/performance",
          { params }
        );

        console.log("Assignment results response:", response.data);

        let dataArray = [];

        if (Array.isArray(response.data.performances)) {
          dataArray = response.data.performances;
        } else if (Array.isArray(response.data)) {
          dataArray = response.data;
        }

        dataArray = dataArray
          .filter((item) => item.assignmentId)
          .map((item) => ({
            ...item,
            date: item.date
              ? new Date(item.date).toISOString()
              : null,
          }));

        setResults(dataArray);
        setFiltered(dataArray);
      } catch (error) {
        console.error(
          "Error fetching assignment results:",
          error.response?.data || error.message
        );

        setResults([]);
        setFiltered([]);
      }
    };

    fetchResults();
  }, [unit, subject]);

  // ================= APPLY FILTERS =================

  const applyFilters = () => {
    let data = [...results];

    if (nameFilter.trim() !== "") {
      data = data.filter((result) =>
        result.studentName
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase())
      );
    }

    if (rollFilter.trim() !== "") {
      data = data.filter((result) =>
        String(result.rollNumber || "")
          .toLowerCase()
          .includes(rollFilter.toLowerCase())
      );
    }

    if (accuracyFilter === "above80") {
      data = data.filter((result) => result.accuracy >= 80);
    }

    if (accuracyFilter === "50to80") {
      data = data.filter(
        (result) => result.accuracy >= 50 && result.accuracy < 80
      );
    }

    if (accuracyFilter === "below50") {
      data = data.filter((result) => result.accuracy < 50);
    }

    if (dateFilter !== "") {
      const selectedDate = new Date(dateFilter).toDateString();

      data = data.filter(
        (result) =>
          result.date &&
          new Date(result.date).toDateString() === selectedDate
      );
    }

    if (unitFilter !== "") {
      const selectedUnit = unitFilter.replace("Unit ", "");

      data = data.filter(
        (result) =>
          String(result.unit).replace("Unit ", "") === selectedUnit
      );
    }

    setFiltered(data);
  };

  // ================= RESET FILTERS =================

  const resetFilters = () => {
    setNameFilter("");
    setRollFilter("");
    setAccuracyFilter("");
    setDateFilter("");
    setUnitFilter("");
    setFiltered(results);
  };

  // ================= UI =================

  return (
    <div className="learn-container">
      <h1 className="learn-title">
        📊 {courseName} Unit {unit} – Assignment Results
      </h1>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="Search by Roll No"
          value={rollFilter}
          onChange={(e) => setRollFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={accuracyFilter}
          onChange={(e) => setAccuracyFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Accuracy</option>
          <option value="above80">Above 80%</option>
          <option value="50to80">50–80%</option>
          <option value="below50">Below 50%</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Select Unit</option>
          <option value="Unit 1">Unit 1</option>
          <option value="Unit 2">Unit 2</option>
          <option value="Unit 3">Unit 3</option>
          <option value="Unit 4">Unit 4</option>
        </select>

        <button
          className="view-btn"
          onClick={applyFilters}
          type="button"
        >
          Apply Filters
        </button>

        <button
          className="back-btn"
          onClick={resetFilters}
          type="button"
        >
          Reset
        </button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          No {courseName} Unit {unit} assignment results found.
        </p>
      ) : (
        filtered.map((result, index) => (
          <div
            key={result._id || index}
            className="file-card"
          >
            <h3>
              🧑 {result.studentName || "Unknown Student"}
            </h3>

            <p>🎓 Roll: {result.rollNumber}</p>
            <p>📘 Course: {courseName}</p>
            <p>📘 Unit: {result.unit}</p>
            <p>✅ Correct: {result.correct}</p>
            <p>❌ Wrong: {result.wrong}</p>
            <p>🎯 Accuracy: {result.accuracy}%</p>

            <p>
              📅 Date:{" "}
              {result.date
                ? new Date(result.date).toLocaleString()
                : "Not available"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
