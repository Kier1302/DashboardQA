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
    } catch (error) {
      console.error("Error saving requirements:", error);
      alert("❌ Failed to save requirements!");
    }
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
                    <input
                      type="text"
                      value={requirement.name}
                      onChange={(e) => handleChangeRequirement(index, "name", e.target.value)}
                      placeholder="Requirement Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={requirement.description}
                      onChange={(e) => handleChangeRequirement(index, "description", e.target.value)}
                      placeholder="Description"
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
                    <button onClick={handleSaveRequirements}>💾 Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRequirement}>➕ Add Requirement</button>
        </div>
      </div>
    </>
  );
};

export default DefineRequirement;
