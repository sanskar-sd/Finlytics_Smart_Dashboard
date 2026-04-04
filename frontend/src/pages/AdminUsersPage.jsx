import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UsersManager from '../components/UsersManager';

export default function AdminUsersPage(){
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2>Manage Users</h2>
          <button className="btn" onClick={()=>navigate('/admin')}>Back to Dashboard</button>
        </div>
        <UsersManager />
      </div>
    </div>
  )
}
