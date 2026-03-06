import React from "react";
import { useData, monthLabel } from "../../DataContext";

const AdminMaintenanceTab = () => {
  const { users, maintenance, updateMaintenanceStatus } = useData();

  const currentMaint = maintenance || { amount: 2500, records: {} };
  if (!currentMaint.records) currentMaint.records = {};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Monthly Maintenance</h1>
      <p className="text-sm text-gray-400 mb-4">
        {monthLabel()} • Default: ₹{maintenance.defaultAmount}
      </p>
      <div className="section-card overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-3">Flat</th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => a.flatNo.localeCompare(b.flatNo))
              .map((u) => {
                const rec = currentMaint.records[u.email] || {
                  status: "Pending",
                };
                const isPaid = rec.status === "Paid";
                return (
                  <tr key={u.email} className="border-b border-gray-700">
                    <td className="p-3">{u.flatNo}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isPaid
                            ? "bg-green-500 text-green-900"
                            : "bg-red-500 text-red-900"
                        }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          updateMaintenanceStatus(
                            u.email,
                            isPaid ? "Pending" : "Paid",
                            isPaid ? {} : { txnId: "ADMIN-" + Date.now() },
                          )
                        }
                        className="text-blue-400 hover:underline text-sm">
                        {isPaid ? "Mark Pending" : "Mark Paid"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMaintenanceTab;
