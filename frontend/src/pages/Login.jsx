import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import NavBar from "../components/NavBar";

export default function Login(){
  const [form,setForm] = useState({email:'',password:''});
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) =>{
    e.preventDefault();
    try{
      const data = await login(form);
      localStorage.setItem('zorvyn_auth', JSON.stringify({token:data.token, user:data.user}));
      const role = data.user.role;
      if(role === 'admin') navigate('/admin');
      else if(role === 'analyst') navigate('/analyst');
      else navigate('/viewer');
    }catch(error){
      setErr(error?.response?.data?.message || error.message);
    }
  }

  return (
    <div>
      <NavBar />
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={submit} className="card">
          <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <button className="btn" type="submit">Login</button>
          {err && <div className="error">{err}</div>}
        </form>
        <div style={{textAlign:'center',marginTop:8}}>
          <small>Need to create the first admin? <a href="/register">Register as Admin</a></small>
        </div>
      </div>
    </div>
  )
}
