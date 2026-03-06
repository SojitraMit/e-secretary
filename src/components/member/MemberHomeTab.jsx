import React from "react";
import { useData } from "../../DataContext";

const MemberHomeTab = () => {
  const { updates } = useData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>
      <div className="section-card space-y-4">
        {updates.length === 0 ? (
          <p className="text-gray-400">No announcements yet.</p>
        ) : (
          updates.map((u) => (
            <div
              key={u._id}
              className="pb-4 border-b border-gray-700 last:border-none">
              <h3 className="font-semibold text-lg">{u.text}</h3>
              <p className="text-sm text-gray-400">
                Posted by Admin • {new Date(u.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberHomeTab;
