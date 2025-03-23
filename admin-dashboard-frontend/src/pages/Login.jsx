import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      console.log("Login Response:", data); // Debugging log
      localStorage.setItem("token", data.token);

      setUser({ id: data.id, role: data.role }); // Update user state

      // Redirect based on role
      navigate(data.role === "admin" ? "/admin-dashboard" : "/user-dashboard");

    } catch (err) {
      console.error("Login Error:", err.response?.data?.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
