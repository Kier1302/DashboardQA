// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigating after logout

  useEffect(() => {
    // Fetch user details if logged in (for example, using token from localStorage or cookies)
    const token = localStorage.getItem("token");
    if (token) {
      // Simulate getting user details from API
      fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear user state and token from localStorage
    localStorage.removeItem("token");
    setUser(null);
    // Redirect to login page
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
