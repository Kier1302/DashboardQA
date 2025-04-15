import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Handle container clicks
  const handleContainerClick = (section) => {
    if (section === "upload") {
      navigate("/admin-dashboard/upload");
    } else if (section === "files") {
      navigate("/admin-dashboard/files");
    } else if (section === "approval") {
      navigate("/admin-dashboard/approval");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>📂 Admin Dashboard</h2>

      {/* Logout Button */}
      <button onClick={() => navigate("/login")} className="logout-btn">
        Logout
      </button>

      {/* Clickable Containers */}
      <div className="dashboard-sections">
        <div
          className="dashboard-container"
          onClick={() => handleContainerClick("upload")}
        >
          <h3>📤 Upload Files / Links</h3>
        </div>
        <div
          className="dashboard-container"
          onClick={() => handleContainerClick("files")}
        >
          <h3>📄 View All Uploaded Files</h3>
        </div>
        <div
          className="dashboard-container"
          onClick={() => handleContainerClick("approval")}
        >
          <h3>✅ Approve / ❌ Reject Files</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
