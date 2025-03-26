import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Fetch uploaded files
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files");
      console.log("🔹 Files from backend:", response.data); // Debugging log
      setFiles(response.data);
    } catch (error) {
      console.error("❌ Error fetching files:", error.response?.data);
    }
  };

  // Handle file or link upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (selectedFile) {
      formData.append("name", selectedFile.name); // ✅ Ensure name is included
      formData.append("type", "file");
      formData.append("file", selectedFile);
    } else if (uploadUrl) {
      formData.append("name", uploadUrl); // ✅ Store URL as the name
      formData.append("type", "link");
      formData.append("url", uploadUrl);
    } else {
      alert("⚠️ Please select a file or enter a URL.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/files/upload", formData);
      console.log("✅ Upload Response:", response.data); // Debugging log
      alert("✅ Upload successful!");
      setSelectedFile(null);
      setUploadUrl("");
      fetchFiles(); // Refresh list
    } catch (error) {
      console.error("❌ Upload failed:", error.response?.data);
      alert("❌ Upload failed!");
    }
  };

  // Handle file approval/rejection
  const handleFileStatus = async (id, status) => {
    try {
      // ✅ Optimistically update UI before fetching
      setFiles((prevFiles) =>
        prevFiles.map((file) => (file._id === id ? { ...file, status } : file))
      );

      const response = await axios.put(`http://localhost:5000/api/files/${id}`, { status });
      console.log(`✅ File ${status} response:`, response.data); // Debugging log
      fetchFiles(); // Refresh list
    } catch (error) {
      console.error("❌ Error updating file status:", error.response?.data);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Remove the token from localStorage to clear the session
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <h2>📂 Admin Dashboard</h2>

      {/* 🔹 Logout Button */}
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      {/* 🔹 Upload Files / Links */}
      <div className="upload-section">
        <h3>📤 Upload Files / Links</h3>
        <form onSubmit={handleFileUpload}>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <input
            type="text"
            placeholder="Or enter a URL..."
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
          />
          <button type="submit">Upload</button>
        </form>
      </div>

      {/* 🔹 Display Uploaded Files */}
      <div className="files-list">
        <h3>📄 All Uploaded Files</h3>
        <table>
          <thead>
            <tr>
              <th>File Name / URL</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr key={file._id}>
                  <td>
                    {file.type === "file" ? (
                      <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                        {file.name}
                      </a>
                    ) : (
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.url}
                      </a>
                    )}
                  </td>
                  <td>{file.type}</td>
                  <td>{file.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">⚠️ No files uploaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Approve/Reject Files */}
      <div className="approval-section">
        <h3>✅ Approve / ❌ Reject Files</h3>
        <table>
          <thead>
            <tr>
              <th>File Name / URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.filter((file) => file.status === "pending").length > 0 ? (
              files
                .filter((file) => file.status === "pending")
                .map((file) => (
                  <tr key={file._id}>
                    <td>
                      {file.type === "file" ? (
                        <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      ) : (
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.url}
                        </a>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleFileStatus(file._id, "accepted")}>✅ Accept</button>
                      <button onClick={() => handleFileStatus(file._id, "rejected")}>❌ Reject</button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="2">⚠️ No pending files.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
