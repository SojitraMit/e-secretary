import React, { useState } from "react";
import toast from "react-hot-toast";
import { useData } from "../../DataContext";
import ReceiptModal from "../ReceiptModal";

const AdminBillingTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { bills, addBill } = useData();
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billFile, setBillFile] = useState(null);

  const handleBillUpload = () => {
    const amount = parseInt(billAmount.replace(/,/g, ""), 10);
    if (!billName.trim()) return toast.error("Enter event name");
    if (isNaN(amount) || amount <= 0)
      return toast.error("Enter a valid bill amount");

    const payload = {
      eventName: billName,
      amount,
      fileName: billFile ? billFile.name : "No File",
      fileData: null,
      fileType: billFile ? billFile.type : null,
    };

    const submitBill = () => {
      addBill(payload);
      setBillName("");
      setBillAmount("");
      setBillFile(null);
      toast.success("Bill Record Created");
    };

    if (billFile) {
      const reader = new FileReader();
      reader.onload = () => {
        payload.fileData = reader.result;
        submitBill();
      };
      reader.readAsDataURL(billFile);
    } else {
      submitBill();
    }
  };

  const openReceipt = (bill) => {
    setSelectedBill(bill);
    setModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Event Billing</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card  h-fit">
          <h2 className="text-xl font-semibold mb-4">Upload New Bill</h2>
          <input
            type="text"
            placeholder="Event Name"
            className="form-input w-full mb-4"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bill Amount"
            className="form-input w-full mb-4"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,.pdf"
            className="w-full text-gray-400 mb-4"
            onChange={(e) => setBillFile(e.target.files[0])}
          />
          <button onClick={handleBillUpload} className="btn btn-primary">
            Upload Bill
          </button>
        </div>
        <div className="section-card ">
          <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
          <div className="space-y-3 max-h-[calc(100vh-206px)] overflow-auto">
            {bills.filter(Boolean).map((b) => (
              <div
                key={b._id || b.eventName || Math.random()}
                className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {b.eventName || "Untitled bill"}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {b.fileName || "No File"} •{" "}
                    {b.amount != null ? `₹${b.amount}` : "No amount"}
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
      </div>
      <ReceiptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default AdminBillingTab;
