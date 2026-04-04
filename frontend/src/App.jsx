import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminRecordsPage from "./pages/AdminRecordsPage";
import AdminInsightsPage from "./pages/AdminInsightsPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AnalystInsightsPage from "./pages/AnalystInsightsPage";
import AnalystRecordsPage from "./pages/AnalystRecordsPage";
import ViewerInsightsPage from "./pages/ViewerInsightsPage";

export default function App() {
  useEffect(()=>{
    console.log('Zorvyn: App rendered');
    try{ localStorage.setItem('zorvyn_stage','app_rendered'); }catch(e){}
  },[]);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/records" element={<ProtectedRoute allowedRoles={["admin"]}><AdminRecordsPage /></ProtectedRoute>} />
      <Route path="/admin/insights" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInsightsPage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProfilePage /></ProtectedRoute>} />

      <Route
        path="/analyst/*"
        element={<ProtectedRoute allowedRoles={["analyst"]}><AnalystDashboard /></ProtectedRoute>}
      />
      <Route path="/analyst/insights" element={<ProtectedRoute allowedRoles={["analyst"]}><AnalystInsightsPage /></ProtectedRoute>} />
      <Route path="/analyst/records" element={<ProtectedRoute allowedRoles={["analyst"]}><AnalystRecordsPage /></ProtectedRoute>} />

      <Route
        path="/viewer/*"
        element={<ProtectedRoute allowedRoles={["viewer"]}><ViewerDashboard /></ProtectedRoute>}
      />
      <Route path="/viewer/insights" element={<ProtectedRoute allowedRoles={["viewer"]}><ViewerInsightsPage /></ProtectedRoute>} />

      <Route path="*" element={<div style={{padding:20}}>Not Found</div>} />
    </Routes>
  );
}
