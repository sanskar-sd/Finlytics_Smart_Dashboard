import React from "react";
import { Navigate } from "react-router-dom";

const getStored = () => {
  try {
    const raw = localStorage.getItem("zorvyn_auth");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const auth = getStored();
  if (!auth || !auth.token) return <Navigate to="/login" replace />;
  const role = auth.user?.role;
  if (!allowedRoles.includes(role)) {
    // If user is admin but tries to access other dashboards, redirect appropriately
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "analyst") return <Navigate to="/analyst" replace />;
    if (role === "viewer") return <Navigate to="/viewer" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}
