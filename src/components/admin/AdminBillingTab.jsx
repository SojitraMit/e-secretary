import React, { useState } from "react";
import toast from "react-hot-toast";
import { useData } from "../../DataContext";
import ReceiptModal from "../ReceiptModal";

const AdminBillingTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { bills, addBill } = useData();
  const [billName, setBillName] = useState("");
  const [billFile, setBillFile] = useState(null);

  const handleBillUpload = () => {
    if (!billName.trim()) return toast.error("Enter event name");
    if (billFile) {
      const reader = new FileReader();
      reader.onload = () => {
        addBill({
          eventName: billName,
          fileName: billFile.name,
          fileData: reader.result,
          fileType: billFile.type,
        });
        setBillName("");
        setBillFile(null);
        toast.success("Bill Uploaded");
      };
      reader.readAsDataURL(billFile);
    } else {
      addBill({ eventName: billName, fileName: "No File", fileData: null });
      setBillName("");
      toast.success("Bill Record Created");
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
        <div className="section-card">
          <h2 className="text-xl font-semibold mb-4">Upload New Bill</h2>
          <input
            type="text"
            placeholder="Event Name"
            className="form-input w-full mb-4"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
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
        <div className="section-card">
          <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
          <div className="space-y-3">
            {bills.map((b) => (
              <div
                key={b._id}
                className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{b.eventName}</p>
                  <p className="text-xs text-gray-300 truncate">{b.fileName}</p>
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
