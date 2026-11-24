
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function AdminDashboard() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const [token] = useState(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("fusionUser") || "{}"
      );

      return savedUser.token || "";
    } catch {
      return "";
    }
  });

  // Memoize the authentication configuration.
  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // Fetch teacher records.
  const loadTeachers = useCallback(async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(
          `${API_URL}/api/auth/pending-teachers`,
          authConfig
        ),
        axios.get(
          `${API_URL}/api/auth/approved-teachers`,
          authConfig
        ),
      ]);

      setPendingTeachers(
        Array.isArray(pendingRes.data) ? pendingRes.data : []
      );

      setApprovedTeachers(
        Array.isArray(approvedRes.data) ? approvedRes.data : []
      );
    } catch (error) {
      console.error("Admin dashboard error:", error);

      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("fusionUser");
        navigate("/login", { replace: true });
        return;
      }

      setMsg(
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Unable to load teacher records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [token, navigate, authConfig]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Approve teacher.
  const approveTeacher = async (id) => {
    try {
      setActionLoading(true);
      setMsg("");

      const response = await axios.put(
        `${API_URL}/api/auth/approve/${id}`,
        {},
        authConfig
      );

      await loadTeachers();

      setMsg(
        response.data?.msg || "Teacher approved successfully."
      );
    } catch (error) {
      console.error("Approve teacher error:", error);

      setMsg(
        error.response?.data?.msg ||
        "Unable to approve teacher."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Disapprove teacher.
  const disapproveTeacher = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to disapprove this teacher?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setMsg("");

      const response = await axios.put(
        `${API_URL}/api/auth/disapprove/${id}`,
        {},
        authConfig
      );

      await loadTeachers();

      setMsg(
        response.data?.msg ||
        "Teacher approval revoked successfully."
      );
    } catch (error) {
      console.error("Disapprove teacher error:", error);

      setMsg(
        error.response?.data?.msg ||
        "Unable to disapprove teacher."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Logout.
  const handleLogout = () => {
    localStorage.removeItem("fusionUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-container">

      <div className="admin-header">
        <span>🎓 FUSION Admin Panel</span>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div style={{padding:"16px 20px"}}>
        <button type="button" onClick={() => navigate("/admin-feedback")} style={{border:0,borderRadius:9,padding:"11px 16px",background:"#253b80",color:"#fff",fontWeight:700,cursor:"pointer"}}>
          View Student Feedback →
        </button>
      </div>

      {msg && (
        <p
          role="alert"
          style={{
            padding: "12px",
            margin: "16px",
            borderRadius: "8px",
            background: "#f3f4f6",
            color: "#333",
          }}
        >
          {msg}
        </p>
      )}

      {loading ? (
        <div className="section">
          <p>Loading teacher records...</p>
        </div>
      ) : (
        <>
          <div className="section">
            <h2>Pending Teachers</h2>

            {pendingTeachers.length === 0 ? (
              <div className="empty-state">
                No pending teachers
              </div>
            ) : (
              <div className="teacher-grid">
                {pendingTeachers.map((teacher) => (
                  <div className="teacher-card" key={teacher._id}>
                    <h3>{teacher.name}</h3>
                    <p>{teacher.email}</p>

                    <button
                      className="approve-btn"
                      onClick={() => approveTeacher(teacher._id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Please wait..." : "✔ Approve"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <h2>Approved Teachers</h2>

            {approvedTeachers.length === 0 ? (
              <div className="empty-state">
                No approved teachers yet
              </div>
            ) : (
              <div className="teacher-grid">
                {approvedTeachers.map((teacher) => (
                  <div
                    className="teacher-card approved"
                    key={teacher._id}
                  >
                    <h3>{teacher.name}</h3>
                    <p>{teacher.email}</p>

                    <p>
                      <strong>Branch:</strong>{" "}
                      {teacher.sections?.join(", ") ||
                        teacher.extraField ||
                        "Not specified"}
                    </p>

                    <p className="approved-text">
                      ✔ Approved
                    </p>

                    <button
                      className="disapprove-btn"
                      onClick={() => disapproveTeacher(teacher._id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Please wait..." : "Disapprove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
