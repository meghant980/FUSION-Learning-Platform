import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
export default function AdminFeedback() {
  const navigate = useNavigate();
  const [data,setData] = useState({items:[],summary:{total:0,submitted:0,averageRating:0}});
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const saved = useMemo(()=>{try{return JSON.parse(localStorage.getItem("fusionUser")||"null")}catch{return null}},[]);
  const token = saved?.token || localStorage.getItem("token") || "";
  useEffect(()=>{ if(!token){navigate("/login");return;} axios.get(`${API_URL}/api/feedback/admin`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.msg || "Unable to load feedback.")).finally(()=>setLoading(false)); },[token,navigate]);
  return <div style={{minHeight:"100vh",background:"#f5f7fb",padding:28,fontFamily:"Arial,sans-serif",color:"#172033"}}><div style={{maxWidth:1100,margin:"auto"}}>
    <button onClick={()=>navigate("/admin-dashboard")} style={{border:0,padding:"10px 14px",borderRadius:9,cursor:"pointer"}}>← Admin dashboard</button>
    <h1>Student Feedback</h1><p style={{color:"#68738a"}}>Feedback submitted through the FUSION website.</p>
    {error&&<p role="alert">{error}</p>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,margin:"22px 0"}}>
      {[["Total records",data.summary.total],["Student submissions",data.summary.submitted],["Average rating",`${data.summary.averageRating} / 5`]].map(([label,value])=><div key={label} style={{background:"#fff",padding:20,borderRadius:14,border:"1px solid #e5e9f0"}}><small style={{color:"#748096"}}>{label}</small><h2 style={{margin:"8px 0 0"}}>{value}</h2></div>)}
    </div>
    <div style={{background:"#fff",padding:22,borderRadius:14,border:"1px solid #e5e9f0"}}><h2 style={{marginTop:0}}>Recent feedback</h2>
      {loading?<p>Loading feedback...</p>:data.items.length===0?<p style={{color:"#748096"}}>No feedback has been submitted yet.</p>:data.items.map(item=><article key={item._id} style={{padding:"16px 0",borderTop:"1px solid #edf0f5"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{item.name}</strong><div style={{fontSize:13,color:"#748096",marginTop:4}}>{item.email}{item.rollNumber?` · ${item.rollNumber}`:""} · {item.category}</div></div><div style={{textAlign:"right"}}><strong style={{color:"#c18413"}}>{"★".repeat(item.rating)}</strong><div style={{fontSize:12,color:"#748096"}}>{new Date(item.createdAt).toLocaleString()}</div></div></div>
        <p style={{lineHeight:1.6,marginBottom:6}}>{item.message}</p>
        <small style={{color:"#748096"}}>{item.source==="seeded_demo"?"Seeded demonstration record":"Student-submitted feedback"}</small>
      </article>)}
    </div>
  </div></div>;
}
