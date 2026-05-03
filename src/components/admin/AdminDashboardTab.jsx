import React, { useState } from "react";
import toast from "react-hot-toast";
import { useData, formatINR } from "../../DataContext";

const AdminDashboardTab = () => {
  const { funds, users, complaints, updateFunds } = useData();
  const [fundInput, setFundInput] = useState("");
  const transactions = funds.transactions || [];

  const handleFundSave = () => {
    const val = parseInt(fundInput.replace(/,/g, ""), 10);
    if (isNaN(val) || val < 0) return toast.error("Invalid amount");
    updateFunds(val, "Admin");
    setFundInput("");
    toast.success("Funds Updated");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="section-card text-center">
          <i className="fas fa-wallet text-3xl text-green-400 mb-2"></i>
          <p className="text-gray-400">Total Funds</p>
          <p className="text-2xl font-bold">{formatINR(funds.balance)}</p>
        </div>
        <div className="section-card text-center">
          <i className="fas fa-users text-3xl text-purple-400 mb-2"></i>
          <p className="text-gray-400">Total Members</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="section-card text-center">
          <i className="fas fa-exclamation-triangle text-3xl text-yellow-400 mb-2"></i>
          <p className="text-gray-400">Open Complaints</p>
          <p className="text-2xl font-bold">
            {complaints.filter((c) => c.status !== "Resolved").length}
          </p>
        </div>
      </div>
      <div className="section-card mt-6">
        <h2 className="text-xl font-semibold mb-4">Manage Funds</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Enter balance in INR"
            className="form-input w-full sm:w-80"
            value={fundInput}
            onChange={(e) => setFundInput(e.target.value)}
          />
          <button onClick={handleFundSave} className="btn btn-primary">
            Save Funds
          </button>
        </div>
      </div>
      <div className="section-card mt-6">
        <h2 className="text-xl font-semibold mb-4">Fund Activity</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">No fund activity yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-700 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {tx.type} {tx.amount > 0 ? "Credit" : "Debit"}
                  </span>
                  <span className="text-sm text-gray-300">
                    {new Date(tx.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{tx.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{tx.source}</span>
                  <span
                    className={
                      tx.amount > 0 ? "text-green-400" : "text-red-400"
                    }>
                    {formatINR(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardTab;
