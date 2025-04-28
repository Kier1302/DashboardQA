import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const [requirements, setRequirements] = useState([]);
  const [uploads, setUploads] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/requirements");
        setRequirements(response.data);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/files");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchRequirements();
    fetchFiles();
  }, []);

  const handleFileUpload = async (requirementId, fileOrUrl) => {
    try {
      const requirement = requirements.find(r => r._id === requirementId);

      if (!requirement) {
        alert("⚠️ Requirement not found.");
        return;
      }

      const requirementName = requirement.name;

      console.log("Uploading for:", requirementName);
      if (fileOrUrl instanceof File) {
        console.log("Uploading file object:", fileOrUrl);

        const formData = new FormData();
        formData.append("file", fileOrUrl);
        formData.append("name", requirementName);
        formData.append("type", "file");

        await axios.post("http://localhost:5000/api/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setUploads(prev => ({ ...prev, [requirementId]: "" }));
      } else if (typeof fileOrUrl === "string" && fileOrUrl.trim() !== "") {
        await axios.post("http://localhost:5000/api/files/upload", {
          name: requirementName,
          type: "link",
          url: fileOrUrl,
        });

        setUploads(prev => ({ ...prev, [requirementId]: "" }));
      } else {
        alert("⚠️ Please provide a valid file or URL.");
        return;
      }

      alert("✅ File uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload file";
      alert(`❌ ${errorMessage}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-dashboard">
        <div className="page-container">
          <h3>📋 User Dashboard</h3>
          {requirements.length > 0 ? (
            <table className="requirements-table">
              <thead>
                <tr>
                  <th>Requirement Name</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Upload</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((requirement) => {
                  const file = files.find(f => f.name === requirement.name);
                  return (
                    <tr key={requirement._id}>
                      <td>{requirement.name}</td>
                      <td>{requirement.description}</td>
                      <td>{requirement.type}</td>
                      <td>
                        {file ? (
                          requirement.type === "file" ? (
                            <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                              Download File
                            </a>
                          ) : (
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              {file.url}
                            </a>
                          )
                        ) : (
                          requirement.type === "file" ? (
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(requirement._id, e.target.files[0])}
                            />
                          ) : (
                            <>
                              <input
                                type="url"
                                placeholder="Enter URL"
                                value={uploads[requirement._id] || ""}
                                onChange={(e) => setUploads({ ...uploads, [requirement._id]: e.target.value })}
                              />
                              <button onClick={() => handleFileUpload(requirement._id, uploads[requirement._id])}>
                                Upload URL
                              </button>
                            </>
                          )
                        )}
                      </td>
                      <td>
                        {file?.status === "accepted" && <span style={{ color: "green" }}>✅ Accepted</span>}
                        {file?.status === "rejected" && <span style={{ color: "red" }}>❌ Rejected</span>}
                        {!file?.status && file && <span style={{ color: "orange" }}>⏳ Pending</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>❌ No requirements defined yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
