import React from "react";
import { useData, formatINR, monthLabel } from "../../DataContext";

const MemberPayTab = () => {
  const { currentUser, maintenance, updateMaintenanceStatus } = useData();

  const records = maintenance.records || {};
  const myMaint = records[currentUser.email] || { status: "Pending" };
  const maintAmount = maintenance.amount || 2500;

  const handlePay = () => {
    // Demo payment
    const txn = "UPI-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    updateMaintenanceStatus(currentUser.email, "Paid", { txnId: txn });
    alert("Payment Recorded!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pay Maintenance</h1>
      <div className="section-card text-center max-w-lg mx-auto">
        <p className="text-lg">
          Maintenance for <span className="font-semibold">{monthLabel()}</span>{" "}
          is{" "}
          <span
            className={`font-bold ${
              myMaint.status === "Paid" ? "text-green-400" : "text-yellow-400"
            }`}>
            {myMaint.status === "Paid" ? "PAID" : "DUE"}
          </span>
        </p>
        <p className="text-3xl font-bold my-3">{formatINR(maintAmount)}</p>
        {myMaint.status !== "Paid" ? (
          <button
            onClick={handlePay}
            className="btn btn-primary btn-lg w-full sm:w-auto">
            <i className="fas fa-qrcode mr-2"></i> Pay via UPI
          </button>
        ) : (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded">
            <p className="text-green-400">
              <i className="fas fa-check-circle mr-2"></i> Payment Complete
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Txn ID: {myMaint.txnId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPayTab;
