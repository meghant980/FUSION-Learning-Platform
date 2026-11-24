
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("fusionUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const user = userData?.user || {};
  const name = user.name || "Student";
  const firstName = name.trim().split(/\s+/)[0] || "Student";
  const initial = name.charAt(0).toUpperCase() || "S";

  useEffect(() => {
    if (!userData) navigate("/login");
  }, [userData, navigate]);

  if (!userData) return null;

  const languages = [
    {
      name: "C Programming",
      description: "Learn programming fundamentals and problem-solving.",
      level: "FOUNDATION",
      number: "01",
      color: "blue",
      route: "/learn-c",
      symbol: "C",
    },
    {
      name: "C++ Programming",
      description: "Explore object-oriented programming and data structures.",
      level: "INTERMEDIATE",
      number: "02",
      color: "purple",
      route: "/learn-cpp",
      symbol: "C++",
    },
    {
      name: "Java",
      description: "Learn Java syntax, OOP concepts and application development.",
      level: "BEGINNER",
      number: "03",
      color: "orange",
      route: "/learn/java",
      symbol: "J",
    },
    {
      name: "Python",
      description: "Build problem-solving skills with readable code.",
      level: "BEGINNER",
      number: "04",
      color: "green",
      route: "/learn/python",
      symbol: "Py",
    },
    {
      name: "JavaScript",
      description: "Learn JavaScript and create interactive web experiences.",
      level: "BEGINNER",
      number: "05",
      color: "yellow",
      route: "/learn/javascript",
      symbol: "JS",
    },
  ];

  const filteredLanguages = languages.filter((language) =>
    `${language.name} ${language.description} ${language.level}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const logout = () => {
    localStorage.removeItem("fusionUser");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div className="fusion-dashboard">
      <header className="fd-topbar">
        <div
          className="fd-brand"
          onClick={() => navigate("/dashboard")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") navigate("/dashboard");
          }}
        >
          <div className="fd-brand-icon">F</div>
          <div className="fd-brand-copy">
            <h2>FUSION</h2>
            <span>LEARN. CODE. GROW.</span>
          </div>
        </div>

        <div className="fd-topbar-right">
          <div className="fd-profile">
            <div className="fd-avatar">{initial}</div>
            <div className="fd-profile-details">
              <strong>{name}</strong>
              <span>Student account</span>
            </div>
          </div>

          <button className="fd-logout" onClick={logout} type="button">
            <span>↗</span> Logout
          </button>
        </div>
      </header>

      <main className="fd-main">
        <section className="fd-welcome">
          <div className="fd-welcome-content">
            <div className="fd-eyebrow">
              <span className="fd-eyebrow-line"></span>
              STUDENT DASHBOARD
            </div>

            <h1>
              Welcome back,
              <br />
              <span>{firstName}.</span>
            </h1>

            <p>
              Choose a programming language and continue your learning journey.
            </p>
          </div>

          <div className="fd-welcome-art" aria-hidden="true">
            <div className="fd-art-orbit fd-orbit-one"></div>
            <div className="fd-art-orbit fd-orbit-two"></div>
            <div className="fd-art-circle">
              <span>{"</>"}</span>
            </div>
            <div className="fd-art-small fd-art-code">{"{ }"}</div>
            <div className="fd-art-small fd-art-terminal">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <div>&gt;_</div>
            </div>
          </div>
        </section>

        <section className="fd-section">
          <div className="fd-section-heading">
            <div>
              <div className="fd-eyebrow">
                <span className="fd-eyebrow-line"></span>
                LEARNING PATHS
              </div>

              <h2>Choose a programming language.</h2>
              <p>Select a course to access its learning material and practice.</p>
            </div>

            <label className="fd-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search languages..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search programming languages"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>
          </div>

          <div className="fd-language-grid">
            {filteredLanguages.map((language) => (
              <button
                className="fd-language-card"
                key={language.name}
                type="button"
                onClick={() => navigate(language.route)}
              >
                <div className="fd-card-top">
                  <div className={`fd-language-icon ${language.color}`}>
                    {language.symbol}
                  </div>

                  <span className="fd-card-number">{language.number}</span>
                  <span className="fd-card-arrow">↗</span>
                </div>

                <span className="fd-level">{language.level}</span>
                <h3>{language.name}</h3>
                <p>{language.description}</p>

                <div className="fd-card-bottom">
                  <span>Explore course</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="fd-empty">
              <h3>No language found</h3>
              <p>Try another language name.</p>
              <button type="button" onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          )}
        </section>

        <section style={{marginTop:24, padding:"22px 26px", border:"1px solid #e4e8f0", borderRadius:16, background:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", gap:18, flexWrap:"wrap"}}>
          <div><div style={{fontSize:12,letterSpacing:1,fontWeight:700,color:"#68738a"}}>YOUR VOICE MATTERS</div><h2 style={{margin:"8px 0"}}>Help us improve FUSION</h2><p style={{margin:0,color:"#68738a"}}>Share suggestions about courses, coding practice and your learning experience.</p></div>
          <button type="button" onClick={() => navigate("/feedback")} style={{border:0,borderRadius:10,padding:"13px 18px",background:"#253b80",color:"#fff",fontWeight:700,cursor:"pointer"}}>Give feedback →</button>
        </section>

        <section className="fd-performance">
          <div className="fd-performance-content">
            <div className="fd-performance-icon">✦</div>
            <div>
              <h2>Check your performance</h2>
              <p>Explore coding rankings on the leaderboard.</p>
            </div>
          </div>

          <button
            className="fd-secondary-button"
            type="button"
            onClick={() => navigate("/leaderboard")}
          >
            View leaderboard <span>→</span>
          </button>
        </section>

        <footer className="fd-footer">
          <div className="fd-footer-brand">
            <strong>FUSION</strong>
            <span>Faculty Student Interactive Online Network</span>
          </div>
          <span>© 2026 FUSION Learning Platform</span>
        </footer>
      </main>
    </div>
  );
}
