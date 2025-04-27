import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import UploadComponent from "../components/UploadComponent";

const UploadFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/files");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      alert("✅ Upload deleted successfully!");
      const response = await axios.get("http://localhost:5000/api/files");
      setFiles(response.data);
    } catch (error) {
      alert("❌ Failed to delete upload!");
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="page-container">
          <h3>🧾 Uploaded Requirements and Files</h3>
          {files.length === 0 ? (
            <p>❌ No uploaded requirements found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Requirement Name</th>
                  <th>File</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id}>
                    <td>{file.name}</td>
                    <td>
                      {file.type === "file" && file.url ? (
                        <a
                          href={`http://localhost:5000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {file.type === "link" && file.url ? (
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.url}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {file.status === "accepted" ? (
                        <span style={{ color: "green" }}>✅ Accepted</span>
                      ) : file.status === "rejected" ? (
                        <span style={{ color: "red" }}>❌ Rejected</span>
                      ) : (
                        <span style={{ color: "orange" }}>⏳ Pending</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(file._id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadFiles;
