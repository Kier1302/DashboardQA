import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";  
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleContainerClick = (section) => {
    if (section === "upload") {
      navigate("/user-dashboard/upload");
    } else if (section === "files") {
      navigate("/user-dashboard/files");
  };
}

  return (
    <>
      <Navbar /> {/* Navbar for consistent navigation */}

      <div className="user-dashboard">
        {/* Clickable Container for file upload */}
        <div className="dashboard-sections">
          <div
            className="dashboard-container"
            onClick={() => handleContainerClick("upload")} // Trigger the click handler
          >
            <h3>📤 Upload Files / Links</h3>

          </div>
          <div
            className="dashboard-container"
            onClick={() => handleContainerClick("files")}
          >
            <h3>📄 View All Uploaded Files</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
