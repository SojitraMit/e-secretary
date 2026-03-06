import React, { useState } from "react";
import { useData } from "../../DataContext";

const AdminUpdatesTab = () => {
  const { addUpdate } = useData();
  const [updateText, setUpdateText] = useState("");

  const handlePostUpdate = () => {
    if (!updateText.trim()) return;
    addUpdate(updateText);
    setUpdateText("");
    alert("Update Posted");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Share an Update</h1>
      <div className="section-card">
        <textarea
          className="w-full form-input h-32"
          placeholder="Type announcement..."
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}></textarea>
        <button onClick={handlePostUpdate} className="btn btn-primary mt-4">
          Post Update
        </button>
      </div>
    </div>
  );
};

export default AdminUpdatesTab;
