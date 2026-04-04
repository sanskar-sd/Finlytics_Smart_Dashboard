import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function ViewerDashboard(){
  const [insights,setInsights] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    api.get('/api/dashboard').then(r=>setInsights(r.data?.data || r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h2>Viewer Dashboard</h2>

        {loading ? (
          <div className="card" style={{textAlign:'center'}}>
            <Spinner size={48} />
            <div>Loading insights…</div>
          </div>
        ) : (
          <div className="action-grid">
            <a className="action-card insights-card" href="/viewer/insights">
              <div>
                <div className="title">View Insights</div>
                <div className="desc">Open insights dashboard (read-only).</div>
              </div>
              <button className="cta">Open</button>
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
