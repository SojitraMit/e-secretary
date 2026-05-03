import React, { useState } from "react";
import { useData, formatINR } from "../../DataContext";
import ReceiptModal from "../ReceiptModal";

const MemberFundsTab = () => {
  const { funds, bills } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const openReceipt = (bill) => {
    setSelectedBill(bill);
    setModalOpen(true);
  };

  const transactions = funds.transactions || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Society Funds</h1>
      <div className="section-card mb-6">
        <p className="text-gray-400 text-lg">Current Balance</p>
        <p className="text-4xl font-bold text-green-400">
          {formatINR(funds.balance)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {new Date(funds.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="section-card mb-6 ">
        <h2 className="text-xl font-semibold mb-4">Fund Activity</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">No fund activity yet.</p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-auto">
            {transactions.slice(0, 6).map((tx, idx) => (
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
      <div className="section-card">
        <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
        <div className="space-y-3 max-h-[300px] overflow-auto">
          {bills.map((b) => (
            <div
              key={b._id}
              className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
              <div className="min-w-0">
                <p className="font-semibold truncate">{b.eventName}</p>
                <p className="text-xs text-gray-300 truncate">
                  {b.fileName} •{" "}
                  {b.amount != null ? formatINR(b.amount) : "No amount"}
                </p>
              </div>
              {b.fileData ? (
                <button
                  onClick={() => openReceipt(b)}
                  className="btn bg-gray-600 text-xs">
                  View
                </button>
              ) : (
                <span className="text-xs text-gray-400">No receipt</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <ReceiptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default MemberFundsTab;
