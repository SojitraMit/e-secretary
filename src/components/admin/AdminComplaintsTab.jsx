import React from "react";
import { useData } from "../../DataContext";

const AdminComplaintsTab = () => {
  const { complaints, updateComplaintStatus } = useData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Member Complaints</h1>
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <p className="text-gray-400">No complaints.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="section-card flex justify-between items-start">
              <div>
                <p className="font-bold">
                  {c.text}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    - {c.name} ({c.flatNo})
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                {c.status !== "Resolved" ? (
                  <button
                    onClick={() =>
                      updateComplaintStatus(
                        c._id,
                        c.status === "Open" ? "In Progress" : "Resolved",
                      )
                    }
                    className="btn bg-yellow-500 text-yellow-900 text-sm">
                    Advance
                  </button>
                ) : (
                  <button
                    onClick={() => updateComplaintStatus(c._id, "Open")}
                    className="btn bg-gray-700 text-gray-300 text-sm">
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsTab;
