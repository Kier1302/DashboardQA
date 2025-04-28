import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

  const DefineRequirement = () => {
    const [requirements, setRequirements] = useState([
      { name: "", description: "", type: "file", status: "pending" }, // Default row for requirements
    ]);

    const handleAddRequirement = () => {
      setRequirements([...requirements, { name: "", description: "", type: "file", status: "pending" }]);
    };

    const handleChangeRequirement = (index, field, value) => {
      const updated = [...requirements];
      updated[index][field] = value;
      setRequirements(updated);
    };

    const handleSaveRequirements = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/requirements", { requirements });
        alert("✅ Requirements saved!");
        window.location.reload();
      } catch (error) {
        console.error("Error saving requirements:", error);
        alert("❌ Failed to save requirements!");
      }
    };

    // Auto-resize textarea handler
    const handleAutoResize = (e) => {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    };

    return (
      <>
        <Navbar />
        <div className="define-requirement">
          <div className="page-container">
            <h3>📝 Define Requirements</h3>
            <table>
              <thead>
                <tr>
                  <th>Requirement Name</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((requirement, index) => (
                  <tr key={index}>
                    <td>
                      <textarea
                        value={requirement.name}
                        onChange={(e) => {
                          handleChangeRequirement(index, "name", e.target.value);
                          handleAutoResize(e);
                        }}
                        placeholder="Requirement Name"
                        style={{ resize: "none", overflow: "hidden", minHeight: "20px", width: "100%" }}
                      />
                    </td>
                    <td>
                      <textarea
                        value={requirement.description}
                        onChange={(e) => {
                          handleChangeRequirement(index, "description", e.target.value);
                          handleAutoResize(e);
                        }}
                        placeholder="Description"
                        style={{ resize: "none", overflow: "hidden", minHeight: "20px", width: "100%" }}
                      />
                    </td>
                    <td>
                      <select
                        value={requirement.type}
                        onChange={(e) => handleChangeRequirement(index, "type", e.target.value)}
                      >
                        <option value="file">File</option>
                        <option value="url">URL</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const updated = [...requirements];
                          updated.splice(index, 1);
                          setRequirements(updated);
                        }}
                        style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                        title="Delete Requirement"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleAddRequirement}>➕ Add Requirement</button>
            <button onClick={handleSaveRequirements} style={{ marginLeft: "10px" }}>
              💾 Save All
            </button>
          </div>
        </div>
      </>
    );
  };

export default DefineRequirement;
