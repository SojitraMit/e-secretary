import React, { useState } from "react";
import { useData } from "../../DataContext";

const AdminMembersTab = () => {
  const { users } = useData();
  const [memberSearch, setMemberSearch] = useState("");

  const filteredMembers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (u.flatNo && u.flatNo.toLowerCase().includes(memberSearch.toLowerCase())),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Members</h1>
      <div className="section-card overflow-x-auto">
        <input
          type="text"
          placeholder="Search..."
          className="form-input w-full md:w-1/2 mb-4"
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
        />
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Flat</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((u) => (
              <tr key={u.email} className="border-b border-gray-700">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.flatNo}</td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembersTab;
