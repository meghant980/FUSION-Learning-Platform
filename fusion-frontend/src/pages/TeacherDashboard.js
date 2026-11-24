
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/teacher-dashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const teacherData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("fusionUser") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!teacherData || teacherData.user?.role !== "teacher") {
      navigate("/login", { replace: true });
    }
  }, [teacherData, navigate]);

  const teacherName =
    teacherData?.user?.name ||
    teacherData?.user?.username ||
    "Teacher";

  const firstName = teacherName.trim().split(/\s+/)[0] || "Teacher";
  const initial = teacherName.charAt(0).toUpperCase() || "T";

  const languages = [
    {
      name: "C Programming",
      code: "C",
      description: "Manage fundamentals, practice problems and student exercises.",
      level: "FOUNDATION",
      path: "/teacher/manage-c",
      color: "green",
      topics: "Programming fundamentals",
      number: "01",
    },
    {
      name: "C++ Programming",
      code: "C++",
      description: "Organise C++ concepts, problem-solving and coding practice.",
      level: "INTERMEDIATE",
      path: "/teacher/manage-cpp",
      color: "blue",
      topics: "Object-oriented programming",
      number: "02",
    },
    {
      name: "Java",
      code: "J",
      description: "Create Java lessons, coding questions and practical exercises.",
      level: "CORE LANGUAGE",
      path: "/teacher/java",
      color: "orange",
      topics: "Classes, objects and more",
      number: "03",
    },
    {
      name: "Python",
      code: "Py",
      description: "Manage Python learning topics and programming assignments.",
      level: "CORE LANGUAGE",
      path: "/teacher/python",
      color: "purple",
      topics: "Logic and problem-solving",
      number: "04",
    },
    {
      name: "JavaScript",
      code: "JS",
      description: "Build JavaScript learning material and coding assessments.",
      level: "CORE LANGUAGE",
      path: "/teacher/javascript",
      color: "yellow",
      topics: "Web programming",
      number: "05",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("fusionUser");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("jwtToken");
    navigate("/login", { replace: true });
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!teacherData || teacherData.user?.role !== "teacher") {
    return null;
  }

  return (
    <div className="td-page">
      {/* SIDEBAR */}
      <aside className="td-sidebar">
        <div className="td-brand">
          <div className="td-brand-icon">F</div>

          <div className="td-brand-copy">
            <h2>FUSION</h2>
            <span>LEARN. CODE. GROW.</span>
          </div>
        </div>

        <div className="td-sidebar-label">WORKSPACE</div>

        <button
          type="button"
          className="td-nav-item active"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <span className="td-nav-icon">⌂</span>
          <span>Dashboard</span>
          <span className="td-nav-indicator"></span>
        </button>

        <div className="td-sidebar-label td-sidebar-label-second">
          TEACHING
        </div>

        <button
          type="button"
          className="td-sidebar-note"
          onClick={() => scrollToSection("td-courses")}
        >
          <span className="td-note-icon">▤</span>
          <span className="td-sidebar-note-copy">
            <strong>My Courses</strong>
            <small>5 programming languages</small>
          </span>
          <span className="td-sidebar-chevron">›</span>
        </button>

        <button
          type="button"
          className="td-sidebar-note"
          onClick={() => scrollToSection("td-results")}
        >
          <span className="td-note-icon">⌘</span>
          <span className="td-sidebar-note-copy">
            <strong>Assessments</strong>
            <small>Manage coding practice</small>
          </span>
          <span className="td-sidebar-chevron">›</span>
        </button>

        <div className="td-sidebar-spacer"></div>

        <div className="td-sidebar-help">
          <span className="td-help-icon">✦</span>
          <strong>Keep inspiring learners.</strong>
          <p>
            Every concept you teach builds a stronger programmer.
          </p>
        </div>

        <div className="td-sidebar-bottom">
          <div className="td-profile">
            <div className="td-avatar">{initial}</div>

            <div className="td-profile-info">
              <strong>{teacherName}</strong>
              <small>Teacher account</small>
            </div>
          </div>

          <button
            className="td-logout"
            type="button"
            onClick={handleLogout}
          >
            <span>↗</span>
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="td-main">
        <header className="td-topbar">
          <div className="td-topbar-heading">
            <span className="td-breadcrumb">
              FUSION <span>/</span> WORKSPACE
            </span>
            <h2>Teacher Dashboard</h2>
          </div>

          <div className="td-topbar-right">
            <div className="td-workspace-status">
              <span className="td-online-dot"></span>
              Teacher workspace
            </div>

            <div className="td-topbar-avatar">{initial}</div>
          </div>
        </header>

        <div className="td-content">
          {/* WELCOME SECTION */}
          <section className="td-welcome">
            <div className="td-welcome-content">
              <div className="td-eyebrow">
                <span className="td-eyebrow-line"></span>
                YOUR TEACHING SPACE
              </div>

              <h1>
                Welcome back,
                <br />
                <span>{firstName}.</span>
              </h1>

              <p>
                Manage your programming courses, prepare coding exercises
                and review student performance from one organised workspace.
              </p>

              <button
                className="td-primary-button"
                type="button"
                onClick={() => navigate("/teacher/coding/results")}
              >
                Explore student results
                <span>→</span>
              </button>

              <div className="td-welcome-note">
                <span className="td-welcome-note-dot"></span>
                Your classroom, your impact.
              </div>
            </div>

            <div className="td-welcome-art" aria-hidden="true">
              <div className="td-art-orbit td-art-orbit-one"></div>
              <div className="td-art-orbit td-art-orbit-two"></div>

              <div className="td-code-card">
                <div className="td-code-card-top">
                  <div className="td-code-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                  <span>teacher.js</span>
                </div>

                <div className="td-code-line">
                  <span>01</span> <b>function</b> teach()
                </div>
                <div className="td-code-line">
                  <span>02</span> {"{"}
                </div>
                <div className="td-code-line td-code-indent">
                  <span>03</span> inspireStudents();
                </div>
                <div className="td-code-line td-code-indent">
                  <span>04</span> buildSkills();
                </div>
                <div className="td-code-line">
                  <span>05</span> {"}"}
                </div>

                <div className="td-code-status">
                  <span></span> Ready to create
                </div>
              </div>

              <div className="td-art-floating td-art-floating-one">
                {"{ }"}
              </div>

              <div className="td-art-floating td-art-floating-two">
                {"</>"}
              </div>
            </div>
          </section>

          {/* OVERVIEW */}
          <section className="td-overview" id="td-overview">
            <div className="td-section-heading">
              <div>
                <div className="td-eyebrow">
                  <span className="td-eyebrow-line"></span>
                  AT A GLANCE
                </div>

                <h2>Your teaching overview</h2>

                <p>
                  A quick look at the learning areas available to you.
                </p>
              </div>
            </div>

            <div className="td-overview-grid">
              <article className="td-overview-card">
                <div className="td-overview-card-top">
                  <div className="td-overview-icon sage">▤</div>
                  <span className="td-overview-index">01</span>
                </div>

                <strong>05</strong>

                <span className="td-overview-title">
                  Programming languages
                </span>

                <small>Available courses</small>
              </article>

              <article className="td-overview-card">
                <div className="td-overview-card-top">
                  <div className="td-overview-icon peach">⌘</div>
                  <span className="td-overview-index">02</span>
                </div>

                <strong>02</strong>

                <span className="td-overview-title">
                  Existing courses
                </span>

                <small>C and C++ modules</small>
              </article>

              <article className="td-overview-card">
                <div className="td-overview-card-top">
                  <div className="td-overview-icon lavender">＋</div>
                  <span className="td-overview-index">03</span>
                </div>

                <strong>03</strong>

                <span className="td-overview-title">
                  Integrated languages
                </span>

                <small>Java, Python and JavaScript</small>
              </article>
            </div>
          </section>

          {/* COURSE MANAGEMENT */}
          <section className="td-courses-section" id="td-courses">
            <div className="td-section-heading td-course-heading">
              <div>
                <div className="td-eyebrow">
                  <span className="td-eyebrow-line"></span>
                  COURSE MANAGEMENT
                </div>

                <h2>Programming languages</h2>

                <p>
                  Select a language to manage its learning content and
                  coding activities.
                </p>
              </div>

              <span className="td-course-count">05 COURSES</span>
            </div>

            <div className="td-language-grid">
              {languages.map((language) => (
                <button
                  className="td-language-card"
                  key={language.name}
                  type="button"
                  onClick={() => navigate(language.path)}
                >
                  <div className="td-card-top">
                    <div className={`td-language-icon ${language.color}`}>
                      {language.code}
                    </div>

                    <span className="td-card-number">
                      {language.number}
                    </span>

                    <span className="td-card-arrow-top">↗</span>
                  </div>

                  <span className="td-language-level">
                    {language.level}
                  </span>

                  <h3>{language.name}</h3>

                  <p>{language.description}</p>

                  <div className="td-card-topics">
                    <span>COURSE FOCUS</span>
                    <strong>{language.topics}</strong>
                  </div>

                  <div className="td-card-footer">
                    <span>Manage course</span>
                    <span className="td-card-arrow">→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* STUDENT RESULTS */}
          <section className="td-results-panel" id="td-results">
            <div className="td-results-icon">▥</div>

            <div className="td-results-text">
              <div className="td-eyebrow">
                STUDENT PERFORMANCE
              </div>

              <h2>Coding results and submissions</h2>

              <p>
                Review submitted solutions, check evaluation results and
                monitor students' coding practice.
              </p>
            </div>

            <button
              type="button"
              className="td-secondary-button"
              onClick={() => navigate("/teacher/coding/results")}
            >
              View results
              <span>→</span>
            </button>
          </section>

          {/* FOOTER */}
          <footer className="td-footer">
            <div className="td-footer-brand">
              <strong>FUSION</strong>
              <span>
                Faculty Student Interactive Online Network
              </span>
            </div>

            <span>© 2026 FUSION Learning Platform</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
