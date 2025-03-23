import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }, // Ensure "Bearer" format
        });

        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data?.message || error.message);
        setUser(null);
        localStorage.removeItem("token"); // Remove invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>; // Prevent UI flicker

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes for Dashboards */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute user={user} role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect based on role */}
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
      </Routes>
    </Router>
  );
};

export default App;

