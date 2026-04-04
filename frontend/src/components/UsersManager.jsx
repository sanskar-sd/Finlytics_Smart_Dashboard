import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, changeUserRole, changeUserStatus } from '../services/users';
import Spinner from './Spinner';

export default function UsersManager(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({name:'',email:'',password:'',role:'viewer'});
  const [mode, setMode] = useState('fetch'); // fetch | create | updateRole | updateStatus
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [selectedStatus, setSelectedStatus] = useState('active');

  const load = async ()=>{
    setLoading(true);
    try{
      const data = await fetchUsers();
      setUsers(data || []);
    }catch(e){ }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await createUser(form);
      setForm({name:'',email:'',password:'',role:'viewer'});
      load();
      setMode('fetch');
    }catch(err){ alert(err?.response?.data?.message || err.message); }
  }

  const onRole = async (userId, role) =>{
    try{ await changeUserRole(userId, role); load(); }catch(e){ alert(e?.response?.data?.message || e.message); }
  }

  const onStatus = async (userId, status) =>{
    try{ await changeUserStatus(userId, status); load(); }catch(e){ alert(e?.response?.data?.message || e.message); }
  }

  return (
    <div className="card">
      <h3>Manage Users</h3>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <button className="btn" onClick={()=>setMode('fetch')}>Fetch Users</button>
        <button className="btn" onClick={()=>setMode('create')}>Create User</button>
        <button className="btn" onClick={()=>setMode('updateRole')}>Update Role</button>
        <button className="btn" onClick={()=>setMode('updateStatus')}>Update Status</button>
      </div>

      {mode === 'create' && (
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <div>
            <button className="btn" type="submit">Create User</button>
          </div>
        </form>
      )}

      {mode === 'updateRole' && (
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}>
            <option value="">Select user</option>
            {users.map(u=> <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}
          </select>
          <select value={selectedRole} onChange={e=>setSelectedRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn" onClick={async ()=>{ if(!selectedUser) return alert('Select user'); await changeUserRole(selectedUser, selectedRole); load(); setMode('fetch'); }}>Done</button>
        </div>
      )}

      {mode === 'updateStatus' && (
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}>
            <option value="">Select user</option>
            {users.map(u=> <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}
          </select>
          <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn" onClick={async ()=>{ if(!selectedUser) return alert('Select user'); await changeUserStatus(selectedUser, selectedStatus); load(); setMode('fetch'); }}>Done</button>
        </div>
      )}

      {loading ? <Spinner /> : (
        <div style={{maxHeight:260,overflow:'auto'}}>
          {users.length===0? <div>No users</div> : (
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u=> (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>
                      {/* when in fetch mode keep actions minimal; role/status edits happen via Update Role/Status modes */}
                      {mode === 'fetch' ? (
                        <span style={{opacity:0.85}}>Use Update Role / Update Status</span>
                      ) : (
                        <>
                          <select defaultValue={u.role} onChange={e=>onRole(u._id,e.target.value)}>
                            <option value="viewer">Viewer</option>
                            <option value="analyst">Analyst</option>
                            <option value="admin">Admin</option>
                          </select>
                          <select defaultValue={u.status} onChange={e=>onStatus(u._id,e.target.value)} style={{marginLeft:8}}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
