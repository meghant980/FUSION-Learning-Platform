import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
const styles = {
  page: { minHeight: "100vh", background: "#f5f7fb", padding: "32px 18px", color: "#172033", fontFamily: "Arial, sans-serif" },
  wrap: { maxWidth: 820, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 24 },
  card: { background: "#fff", border: "1px solid #e7eaf0", borderRadius: 18, padding: 28, boxShadow: "0 8px 30px rgba(25,40,70,.06)" },
  label: { display: "block", fontWeight: 600, margin: "18px 0 8px" },
  field: { width: "100%", boxSizing: "border-box", border: "1px solid #d8deea", borderRadius: 10, padding: "12px 13px", fontSize: 15, background: "#fff" },
  button: { border: 0, borderRadius: 10, padding: "12px 18px", background: "#253b80", color: "#fff", fontWeight: 700, cursor: "pointer" },
};
export default function StudentFeedback() {
  const navigate = useNavigate();
  const [userData] = useState(() => { try { return JSON.parse(localStorage.getItem("fusionUser") || "null"); } catch { return null; } });
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("Website Experience");
  const [message, setMessage] = useState("");
  const [mine, setMine] = useState([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const token = userData?.token || localStorage.getItem("token") || "";
  const user = userData?.user || {};
  useEffect(() => { if (!userData) { navigate("/login"); return; } loadMine(); }, []); // eslint-disable-line
  const loadMine = async () => {
    try { const r = await axios.get(`${API_URL}/api/feedback/mine`, { headers: { Authorization: `Bearer ${token}` } }); setMine(Array.isArray(r.data) ? r.data : []); }
    catch (e) { console.error(e); }
  };
  const submit = async (e) => {
    e.preventDefault(); setStatus("");
    if (!message.trim()) { setStatus("Please write your feedback before submitting."); return; }
    setBusy(true);
    try {
      const r = await axios.post(`${API_URL}/api/feedback`, { rating, category, message }, { headers: { Authorization: `Bearer ${token}` } });
      setStatus(r.data?.msg || "Feedback submitted successfully."); setMessage(""); setRating(5); await loadMine();
    } catch (e) { setStatus(e.response?.data?.msg || "Could not submit feedback. Please try again."); }
    finally { setBusy(false); }
  };
  return <div style={styles.page}><div style={styles.wrap}>
    <div style={styles.top}><div><div style={{color:"#68738a",fontSize:12,fontWeight:700,letterSpacing:1}}>FUSION / STUDENT SPACE</div><h1 style={{margin:"8px 0 0"}}>Share your feedback</h1></div><button style={{...styles.button,background:"#e8ecf5",color:"#253b80"}} onClick={()=>navigate("/dashboard")}>← Dashboard</button></div>
    <div style={styles.card}>
      <p style={{color:"#657087",lineHeight:1.6,marginTop:0}}>Your suggestions help us improve learning content, coding practice and the overall platform experience.</p>
      <form onSubmit={submit}>
        <label style={styles.label}>How would you rate your experience?</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setRating(n)} aria-label={`${n} star`} style={{border:"1px solid #e0e5ee",borderRadius:10,padding:"9px 13px",background:rating>=n?"#fff4d6":"#fff",color:rating>=n?"#d18a00":"#aab2c1",fontSize:25,cursor:"pointer"}}>★</button>)}</div>
        <label style={styles.label}>Feedback category</label><select value={category} onChange={e=>setCategory(e.target.value)} style={styles.field}><option>Website Experience</option><option>Learning Content</option><option>Coding Practice</option><option>Performance</option><option>Other</option></select>
        <label style={styles.label}>Tell us about your experience</label><textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={1200} rows={5} placeholder="What is working well? What can we improve?" style={{...styles.field,resize:"vertical"}} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginTop:8,flexWrap:"wrap"}}><small style={{color:"#7b8497"}}>{message.length}/1200 characters · Submitted as {user.name || "your account"}</small><button disabled={busy} style={{...styles.button,opacity:busy ? 0.65 : 1}}>{busy?"Submitting...":"Submit feedback →"}</button></div>
      </form>
      {status && <p role="status" style={{padding:12,borderRadius:9,background:"#eef4ff",color:"#253b80",marginBottom:0}}>{status}</p>}
    </div>
    <div style={{...styles.card,marginTop:20}}><h2 style={{marginTop:0}}>Your previous feedback</h2>{mine.length===0?<p style={{color:"#778196"}}>You have not submitted any feedback yet.</p>:mine.map(item=><div key={item._id} style={{borderTop:"1px solid #edf0f5",padding:"14px 0"}}><div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><strong>{item.category} · {"★".repeat(item.rating)}</strong><small style={{color:"#7b8497"}}>{new Date(item.createdAt).toLocaleDateString()}</small></div><p style={{marginBottom:0,color:"#59657b"}}>{item.message}</p></div>)}</div>
  </div></div>;
}
