import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "./PageStyles.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function getAuthToken() {
  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");
    return localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("jwtToken") || user.token || user.accessToken || "";
  } catch {
    return localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("jwtToken") || "";
  }
}

export default function CUnit2CodingQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(`#include <stdio.h>

int main() {
    // Write your C code here
    return 0;
}`);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/coding/question/${id}`, { headers: { Authorization: `Bearer ${getAuthToken()}` } })
      .then((res) => setQuestion(res.data.question))
      .catch((err) => console.error(err));
  }, [id]);

  const runCode = async () => {
    try {
      const token = getAuthToken();
      if (!token) { alert("Please log in again."); return; }
      const res = await axios.post(`${API_URL}/api/coding/run`, {
        code,
        language: "c",
        testcases: question.testcases,
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("OUTPUT:\n" + res.data.output.join("\n"));
    } catch (err) {
      alert("Error running code!");
    }
  };

  if (!question) return <h2>Loading...</h2>;

  return (
    <div className="coding-question-container">
      <div className="left-section">
        <h1>{question.title}</h1>
        <p>{question.description}</p>

        <h3>📘 Testcases</h3>

        {question.testcases.map((tc, idx) => (
          <div key={idx} className="testcase-box">
            <p><b>Input:</b> {tc.input}</p>
            <p><b>Expected Output:</b> {tc.expected}</p>
          </div>
        ))}

        <button className="back-btn" onClick={() => navigate("/learn-c/unit2/coding")}>
          ⬅ Back
        </button>
      </div>

      <div className="right-section">
        <Editor
          height="380px"
          language="c"
          value={code}
          onChange={(value) => setCode(value)}
        />

        <button className="run-btn" onClick={runCode}>▶ Run Code</button>
      </div>
    </div>
  );
}
