import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Spinner from './Spinner';

export default function Profile(){
  const [me, setMe] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true);
      try{
        // fetch current user from stored auth
        const raw = localStorage.getItem('zorvyn_auth');
        const auth = raw ? JSON.parse(raw) : null;
        if(auth && auth.user){
          setMe(auth.user);
          const usersRes = await api.get('/api/users');
          setTeam(usersRes.data.users || usersRes.data || []);
        }
      }catch(e){}
      setLoading(false);
    }
    load();
  },[]);

  if(loading) return <div className="card" style={{textAlign:'center'}}><Spinner /><div>Loading profile…</div></div>

  return (
    <div className="card panel">
      <h3>My Profile</h3>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <div style={{width:84,height:84,borderRadius:12,background:'#eaf1ff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#183a9b'}}>
          {me?.name ? me.name.split(' ').map(s=>s[0]).slice(0,2).join('') : 'U'}
        </div>
        <div>
          <div style={{fontWeight:700}}>{me?.name}</div>
          <div style={{opacity:0.8}}>{me?.email}</div>
          <div style={{marginTop:8}}>Role: <strong>{me?.role}</strong></div>
        </div>
      </div>

      <h4 style={{marginTop:16}}>People in your organization</h4>
      <div style={{maxHeight:220,overflow:'auto'}}>
        {team.length===0 ? <div>No colleagues found</div> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{textAlign:'left'}}>
                <th style={{padding:8,borderBottom:'1px solid #eef2ff'}}>Name</th>
                <th style={{padding:8,borderBottom:'1px solid #eef2ff'}}>Role</th>
                <th style={{padding:8,borderBottom:'1px solid #eef2ff'}}>Email</th>
              </tr>
            </thead>
            <tbody>
              {team.map(u=> (
                <tr key={u._id} style={{borderTop:'1px solid #f7f9ff'}}>
                  <td style={{padding:8}}>{u.name}</td>
                  <td style={{padding:8}}>{u.role}</td>
                  <td style={{padding:8}}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
