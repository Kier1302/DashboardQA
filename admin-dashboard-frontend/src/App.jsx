import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import AdminDashboard from "./pages/AdminDashboard";
import UploadFiles from "./pages/UploadFiles";
import ApproveRejectFiles from "./pages/ApproveRejectFiles";
import DeleteFiles from "./pages/DeleteFiles";
import DefineRequirement from "./pages/DefineRequirement"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on load to check if the user is logged in and has a valid token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ id: res.data._id, role: res.data.role });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("token"); // Clear the token on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading indicator until user data is fetched

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Dashboard Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute user={user} role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/upload"
          element={
            <ProtectedRoute user={user} role="user">
              <UploadFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/files"
          element={
            <ProtectedRoute user={user} role="user">
              <DeleteFiles />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
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
        <Route
          path="/admin-dashboard/define-requirement"  // Route for Define Requirement page
          element={
            <ProtectedRoute user={user} role="admin">
              <DefineRequirement />
            </ProtectedRoute>
          }
        />
        
        {/* Dashboard Redirection */}
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

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
