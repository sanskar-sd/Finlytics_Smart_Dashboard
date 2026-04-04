import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const authRaw = localStorage.getItem("zorvyn_auth");
  const auth = authRaw ? JSON.parse(authRaw) : null;
  const role = auth?.user?.role;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("zorvyn_auth");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-left">Zorvyn</div>
      <div className="nav-right">
        {role === "admin" && <Link to="/admin">Admin</Link>}
        {role === "analyst" && <Link to="/analyst">Analyst</Link>}
        {role === "viewer" && <Link to="/viewer">Viewer</Link>}
        {auth ? (
          <button onClick={logout} className="btn">Logout</button>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
