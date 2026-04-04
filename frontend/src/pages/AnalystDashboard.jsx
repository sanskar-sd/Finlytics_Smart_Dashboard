import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

export default function AnalystDashboard(){
  const [recordsCount,setRecordsCount] = useState(0);
  const [insights,setInsights] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    Promise.all([
      api.get('/api/records').catch(()=>({data:[]})),
      api.get('/api/dashboard').catch(()=>({data:null})),
    ]).then(([rRes,dRes])=>{
      const recs = rRes.data.records || rRes.data || [];
      setRecordsCount(Array.isArray(recs)?recs.length:(recs?.length||0));
      setInsights(dRes?.data?.data || dRes?.data || dRes);
    }).finally(()=>setLoading(false));
  },[]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h2>Analyst Dashboard</h2>

        {loading ? (
          <div className="card" style={{textAlign:'center'}}>
            <Spinner size={48} />
            <div>Loading dashboard…</div>
          </div>
        ) : (
          <>
            <div className="stats">
              <div className="stat"><div className="num">{recordsCount}</div><div>Records</div></div>
              <div className="stat"><div className="num">{insights?.summary?.totalIncome ?? '-'}</div><div>Total Income</div></div>
            </div>

            <div className="action-grid">
              <Link className="action-card records-card" to="/analyst/records">
                <div>
                  <div className="title">Records</div>
                  <div className="desc">Create and manage records relevant to your analysis.</div>
                </div>
                <button className="cta">Open</button>
              </Link>

              <Link className="action-card insights-card" to="/analyst/insights">
                <div>
                  <div className="title">Insights</div>
                  <div className="desc">View formatted insights and trends.</div>
                </div>
                <button className="cta">Open</button>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
