import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../services/api";
import Spinner from "../components/Spinner";
import RecordsManager from "../components/RecordsManager";
import UsersManager from "../components/UsersManager";
import Insights from "../components/Insights";
import Profile from "../components/Profile";
import { Link } from "react-router-dom";

export default function AdminDashboard(){
  const [users,setUsers] = useState([]);
  const [records,setRecords] = useState([]);
  const [insights,setInsights] = useState(null);
  const [loading,setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null); // 'users' | 'records' | 'insights' | 'profile'

  const load = async ()=>{
    setLoading(true);
    try{
      const [uRes,rRes,dRes] = await Promise.all([
        api.get('/api/users').catch(()=>({data:[]})),
        api.get('/api/records').catch(()=>({data:[]})),
        api.get('/api/dashboard').catch(()=>({data:null})),
      ]);
      setUsers(uRes.data.users || uRes.data || []);
      setRecords(rRes.data.records || rRes.data || []);
      // backend returns { success, message, data } -> prefer the inner `data` when present
      setInsights(dRes?.data?.data || dRes?.data || dRes);
    }catch(e){}
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h2>Admin Dashboard</h2>

        {loading ? (
          <div className="card" style={{textAlign:'center'}}>
            <Spinner size={48} />
            <div>Loading dashboard…</div>
          </div>
        ) : (
          <>
            <div className="stats">
              <div className="stat"><div className="num">{users.length}</div><div>Users</div></div>
              <div className="stat"><div className="num">{records.length}</div><div>Records</div></div>
              <div className="stat"><div className="num">{insights?.summary?.totalIncome ?? '-'}</div><div>Total Income</div></div>
            </div>

            <div className="action-grid">
              <Link className="action-card users-card" to="/admin/users">
                <div>
                  <div className="title">Manage Users</div>
                  <div className="desc">Create users (analyst/viewer), update role and status, view all users.</div>
                </div>
                <button className="cta">Open</button>
              </Link>

              <Link className="action-card records-card" to="/admin/records">
                <div>
                  <div className="title">Manage Records</div>
                  <div className="desc">Create, update, delete records and filter by type/category/date.</div>
                </div>
                <button className="cta">Open</button>
              </Link>

              <Link className="action-card insights-card" to="/admin/insights">
                <div>
                  <div className="title">View Insights</div>
                  <div className="desc">See formatted insights and top categories.</div>
                </div>
                <button className="cta">Open</button>
              </Link>

              <Link className="action-card profile-card" to="/admin/profile">
                <div>
                  <div className="title">My Profile</div>
                  <div className="desc">View your profile and people in your organization.</div>
                </div>
                <button className="cta">Open</button>
              </Link>
            </div>

            <div style={{marginTop:18}} className="panel">
              {!activePanel && <div style={{padding:28,textAlign:'center'}}>Select a card above to manage or view details.</div>}
              {activePanel === 'users' && <UsersManager />}
              {activePanel === 'records' && <RecordsManager />}
              {activePanel === 'insights' && <Insights data={insights || {}} />}
              {activePanel === 'profile' && <Profile />}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
