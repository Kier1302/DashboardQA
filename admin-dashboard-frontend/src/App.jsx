import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import AdminDashboard from "./pages/AdminDashboard";
import UploadFiles from "./pages/UploadFiles";
import ApproveRejectFiles from "./pages/ApproveRejectFiles";
import DeleteFiles from "./pages/DeleteFiles"; // ✅ This is your 3rd page
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("token"); // Remove invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        
        {/* Protected Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/upload"
          element={
            <ProtectedRoute user={user} role="admin">
              <UploadFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/files"
          element={
            <ProtectedRoute user={user} role="admin">
              <DeleteFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/approval"
          element={
            <ProtectedRoute user={user} role="admin">
              <ApproveRejectFiles />
            </ProtectedRoute>
          }
        />

        {/* Role-based Redirection */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "admin" ? <Navigate to="/admin-dashboard" /> : <Navigate to="/user-dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
