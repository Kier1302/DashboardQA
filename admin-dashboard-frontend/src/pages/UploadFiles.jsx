import { useState } from "react";
import axios from "axios";

const UploadFiles = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (selectedFile) {
      formData.append("name", selectedFile.name);
      formData.append("type", "file");
      formData.append("file", selectedFile);
    } else if (uploadUrl) {
      formData.append("name", uploadUrl);
      formData.append("type", "link");
      formData.append("url", uploadUrl);
    } else {
      alert("⚠️ Please select a file or enter a URL.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/files/upload", formData);
      alert("✅ Upload successful!");
      setSelectedFile(null);
      setUploadUrl("");
    } catch (error) {
      alert("❌ Upload failed!");
    }
  };

  return (
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
  );
};

export default UploadFiles;
