import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Insights from '../components/Insights';
import api from '../services/api';
import { useEffect, useState } from 'react';

export default function ViewerInsightsPage(){
  const navigate = useNavigate();
  const [data,setData] = useState(null);

  useEffect(()=>{
    api.get('/api/dashboard').then(r=>setData(r.data?.data || r.data || {})).catch(()=>setData({}));
  },[]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2>Insights</h2>
          <button className="btn" onClick={()=>navigate('/viewer')}>Back</button>
        </div>
        <Insights data={data || {}} readonly={true} />
      </div>
    </div>
  )
}
