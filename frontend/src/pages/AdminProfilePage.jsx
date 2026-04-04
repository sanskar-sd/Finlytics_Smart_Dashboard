import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Profile from '../components/Profile';

export default function AdminProfilePage(){
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2>My Profile</h2>
          <button className="btn" onClick={()=>navigate('/admin')}>Back to Dashboard</button>
        </div>
        <Profile />
      </div>
    </div>
  )
}
