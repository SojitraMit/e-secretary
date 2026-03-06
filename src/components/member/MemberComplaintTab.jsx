import React, { useState } from "react";
import { useData } from "../../DataContext";

const MemberComplaintTab = () => {
  const { currentUser, complaints, addComplaint } = useData();
  const [complaintText, setComplaintText] = useState("");

  const handleComplaintSubmit = () => {
    if (!complaintText.trim()) return;
    addComplaint(complaintText, currentUser);
    setComplaintText("");
    alert("Complaint Submitted");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Complaint Box</h1>
      <div className="section-card">
        <h2 className="text-xl font-semibold mb-4">Lodge New Complaint</h2>
        <textarea
          className="w-full form-input h-32"
          placeholder="Describe issue..."
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}></textarea>
        <button
          onClick={handleComplaintSubmit}
          className="btn btn-primary mt-4">
          Submit
        </button>
      </div>
      <div className="section-card mt-6">
        <h2 className="text-xl font-semibold mb-4">My Complaints</h2>
        <div className="space-y-3">
          {complaints
            .filter(
              (c) =>
                c.userEmail === currentUser.email ||
                (c.name === currentUser.name &&
                  c.flatNo === currentUser.flatNo),
            )
            .map((c) => (
              <div
                key={c._id}
                className="p-3 bg-gray-700 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.text}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(c.createdAt).toLocaleString()} •{" "}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        c.status === "Open"
                          ? "bg-red-500 text-red-900"
                          : c.status === "In Progress"
                            ? "bg-yellow-500 text-yellow-900"
                            : "bg-green-500 text-green-900"
                      }`}>
                      {c.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MemberComplaintTab;
