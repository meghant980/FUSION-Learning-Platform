import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/additionalCodePractice.css";
import LanguageNotes from "./LanguageNotes";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const LANGUAGES = [
  { id: "c", label: "C", icon: "Ｃ", route: "/learn-c" },
  { id: "cpp", label: "C++", icon: "Ｃ＋＋", route: "/learn-cpp" },
  { id: "java", label: "Java", icon: "☕", route: "/learn/java" },
  { id: "python", label: "Python", icon: "🐍", route: "/learn/python" },
  { id: "javascript", label: "JavaScript", icon: "JS", route: "/learn/javascript" },
];
const UNITS = ["All units", "1", "2", "3", "4"];

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem("fusionUser") || "{}");
    return localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("jwtToken") || user.token || user.accessToken || "";
  } catch { return localStorage.getItem("token") || ""; }
}
function unitNumber(value) {
  const match = String(value || "").match(/\d+/);
  return match ? match[0] : "";
}

export default function AllLanguagePractice() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [unit, setUnit] = useState("All units");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [view, setView] = useState("practice");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError(""); setQuestions([]);
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const units = unit === "All units" ? ["1", "2", "3", "4"] : [unit];
        const responses = await Promise.all(units.map((u) => axios.get(`${API_URL}/api/coding/practice`, { params: { language, unit: u }, headers })));
        if (!active) return;
        const combined = responses.flatMap((r) => r.data?.questions || []);
        const unique = Array.from(new Map(combined.map((q) => [q._id || `${q.title}-${q.unit}`, q])).values());
        setQuestions(unique);
      } catch (e) {
        if (active) setError(e.response?.data?.message || "Could not load practice questions. Please check your connection and try again.");
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [language, unit, reload]);

  const filtered = useMemo(() => questions.filter((q) => `${q.title || q.questionTitle || ""} ${q.description || q.question || ""}`.toLowerCase().includes(search.toLowerCase())), [questions, search]);
  const selectedLanguage = LANGUAGES.find((l) => l.id === language);

  function openQuestion(q) {
    const u = unitNumber(q.unit) || "1";
    if (language === "c") navigate(`/learn-c/unit${u}/coding`);
    else if (language === "cpp") navigate(`/learn-cpp/unit${u}/coding`);
    else navigate(`/learn/${language}/unit/${u}/coding`);
  }

  return (
    <main className="ap-page" style={{ minHeight: "100vh", padding: "28px clamp(16px, 4vw, 56px)", background: "#f7f8fc" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} style={{ border: 0, background: "transparent", cursor: "pointer", marginBottom: 18 }}>← Back</button>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, alignItems: "end" }}>
          <div>
            <p style={{ color: "#6755c8", fontWeight: 800, letterSpacing: 2, fontSize: 12 }}>FUSION · COMPLETE LANGUAGE PRACTICE</p>
            <h1 style={{ margin: "6px 0", fontSize: "clamp(30px, 5vw, 46px)", color: "#172033" }}>Practice the full syllabus.</h1>
            <p style={{ color: "#667085", maxWidth: 680 }}>Choose any supported programming language and practise coding questions from all four learning units—not just the first unit.</p>
          </div>
          <span style={{ background: "#ece9ff", color: "#5744b5", padding: "9px 14px", borderRadius: 24, fontWeight: 700 }}>5 languages · 4 units each</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "24px 0 12px" }}>
          <button onClick={() => setView("notes")} style={{ padding: "11px 18px", borderRadius: 10, border: view === "notes" ? "2px solid #6755c8" : "1px solid #dfe3ec", background: view === "notes" ? "#eeebff" : "white", fontWeight: 800, cursor: "pointer" }}>📘 Topic Notes</button>
          <button onClick={() => setView("practice")} style={{ padding: "11px 18px", borderRadius: 10, border: view === "practice" ? "2px solid #6755c8" : "1px solid #dfe3ec", background: view === "practice" ? "#eeebff" : "white", fontWeight: 800, cursor: "pointer" }}>⌨ Coding Practice</button>
        </div>
        {view === "notes" ? <LanguageNotes /> : <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "26px 0 18px" }}>
          {LANGUAGES.map((l) => <button key={l.id} onClick={() => setLanguage(l.id)} style={{ padding: "12px 18px", borderRadius: 12, border: language === l.id ? "2px solid #6755c8" : "1px solid #e0e4ed", background: language === l.id ? "#eeebff" : "white", color: "#202b40", fontWeight: 700, cursor: "pointer" }}>{l.icon}　{l.label}</button>)}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <select aria-label="Filter by unit" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: 12, borderRadius: 10, border: "1px solid #d8dce7", background: "white", minWidth: 160 }}>
            {UNITS.map((u) => <option key={u} value={u}>{u === "All units" ? u : `Unit ${u}`}</option>)}
          </select>
          <input aria-label="Search questions" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions or topics..." style={{ flex: 1, minWidth: 220, padding: 12, borderRadius: 10, border: "1px solid #d8dce7", background: "white" }} />
          <button onClick={() => setReload((n) => n + 1)} style={{ padding: "12px 18px", borderRadius: 10, border: 0, background: "#242b42", color: "white", fontWeight: 700, cursor: "pointer" }}>Refresh</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, color: "#202b40" }}>{selectedLanguage?.label} questions</h2>
          <span style={{ color: "#667085", fontSize: 14 }}>{filtered.length} available</span>
        </div>
        {loading && <p style={{ padding: 24, background: "white", borderRadius: 14 }}>Loading questions from all selected units…</p>}
        {!loading && error && <div style={{ padding: 20, background: "#fff1f0", color: "#a12b24", borderRadius: 14 }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && <div style={{ padding: 26, background: "white", borderRadius: 14, color: "#667085" }}><h3 style={{ color: "#202b40", marginTop: 0 }}>No questions found for this selection yet.</h3><p>Try another unit or language. Questions added by your teacher to the selected language and unit will automatically appear here.</p><button onClick={() => navigate(selectedLanguage.route)} style={{ border: 0, background: "#6755c8", color: "white", padding: "11px 16px", borderRadius: 9, cursor: "pointer" }}>Open {selectedLanguage.label} course</button></div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {filtered.map((q, index) => <article key={q._id || index} style={{ background: "white", border: "1px solid #e8eaf0", borderRadius: 15, padding: 19, display: "flex", flexDirection: "column", minHeight: 190 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}><span style={{ color: "#6755c8", background: "#f0edff", borderRadius: 20, padding: "5px 10px", fontSize: 12, fontWeight: 800 }}>UNIT {unitNumber(q.unit) || "—"}</span><span style={{ color: "#98a2b3", fontSize: 12 }}>QUESTION {index + 1}</span></div>
            <h3 style={{ color: "#202b40", margin: "14px 0 8px" }}>{q.title || q.questionTitle || q.name || "Coding question"}</h3>
            <p style={{ color: "#667085", lineHeight: 1.55, flex: 1, margin: 0 }}>{q.description || q.question || q.problemStatement || "Open this question in the coding practice workspace."}</p>
            <button onClick={() => openQuestion(q)} style={{ marginTop: 16, padding: "11px 14px", border: 0, borderRadius: 9, background: "#242b42", color: "white", fontWeight: 700, cursor: "pointer" }}>Open coding practice ↗</button>
          </article>)}
        </div>
        </>}
      </div>
    </main>
  );
}
