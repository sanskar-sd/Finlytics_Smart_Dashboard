import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../services/auth";
import NavBar from "../components/NavBar";

export default function Register(){
  const [form,setForm] = useState({name:'',email:'',password:'',organizationName:''});
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) =>{
    e.preventDefault();
    try{
      const data = await registerAdmin(form);
      // store token and user
      localStorage.setItem('zorvyn_auth', JSON.stringify({token:data.token, user:data.user}));
      navigate('/admin');
    }catch(error){
      setErr(error?.response?.data?.message || error.message);
    }
  }

  return (
    <div>
      <NavBar />
      <div className="container">
        <h2>Register Admin</h2>
        <form onSubmit={submit} className="card">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <input placeholder="Organization Name" value={form.organizationName} onChange={e=>setForm({...form,organizationName:e.target.value})} required />
          <button className="btn" type="submit">Create Admin</button>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  )
}
