import React, { useState } from "react";
import toast from "react-hot-toast";
import { useData, formatINR, monthKey, monthLabel } from "../DataContext";
import ReceiptModal from "./ReceiptModal";

const AdminPanel = () => {
  const {
    logout,
    funds,
    users,
    complaints,
    updateFunds,
    addUpdate,
    suggestions,
    poll,
    savePoll,
    bills,
    addBill,
    maintenance,
    updateMaintenanceStatus,
    updateComplaintStatus,
  } = useData();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [fundInput, setFundInput] = useState("");
  const [updateText, setUpdateText] = useState("");

  // Poll State
  const [pollQ, setPollQ] = useState("");
  const [pollOpts, setPollOpts] = useState(["", ""]);

  // Bill State
  const [billName, setBillName] = useState("");
  const [billFile, setBillFile] = useState(null);

  // Maintenance View
  // Fix: Use maintenance object directly as it now represents the current month
  const currentMaint = maintenance || { amount: 2500, records: {} };
  // Ensure records exists to prevent crash if data is loading
  if (!currentMaint.records) currentMaint.records = {};

  // Member Search
  const [memberSearch, setMemberSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const handleFundSave = () => {
    const val = parseInt(fundInput.replace(/,/g, ""), 10);
    if (isNaN(val) || val < 0) return toast.error("Invalid amount");
    updateFunds(val, "Admin");
    setFundInput("");
    toast.success("Funds Updated");
  };

  const handlePostUpdate = () => {
    if (!updateText.trim()) return;
    addUpdate(updateText);
    setUpdateText("");
    toast.success("Update Posted");
  };

  const handlePollSave = () => {
    const cleanOpts = pollOpts.filter((o) => o.trim() !== "");
    if (!pollQ || cleanOpts.length < 2)
      return toast.error("Need question and 2+ options");

    if (poll && poll.isActive) {
      if (!window.confirm("Replace active poll? Votes will reset.")) return;
    }

    const newPoll = {
      question: pollQ,
      options: cleanOpts.map((t) => ({ text: t })), // Remove manual ID generation, let Backend/Mongo handle it
      isActive: true,
    };
    savePoll(newPoll);
    toast.success("Poll is live!");
  };

  const closePoll = () => {
    if (!poll) return;
    // We don't manually spread poll here because backend handles closing logic mostly,
    // but passing the object ensures consistency if your DataContext expects it.
    // Ideally use the closePoll method from context if available, or update status manually.
    // Using the update pattern from your previous context:
    savePoll({ ...poll, isActive: false });
    toast.success("Poll closed");
  };

  const handleBillUpload = () => {
    if (!billName) return toast.error("Enter event name");
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

  const filteredMembers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (u.flatNo && u.flatNo.toLowerCase().includes(memberSearch.toLowerCase())),
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-center mb-8">
            <i className="fas fa-user-shield text-3xl text-blue-500"></i>
            <h2 className="text-2xl font-bold mt-2 text-white">Admin Panel</h2>
            <p className="text-sm text-gray-400">e-Secretary</p>
          </div>
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: "tachometer-alt", label: "Dashboard" },
              { id: "updates", icon: "bullhorn", label: "Updates" },
              { id: "events", icon: "calendar-alt", label: "Events" },
              { id: "billing", icon: "file-invoice-dollar", label: "Billing" },
              { id: "maintenance", icon: "credit-card", label: "Maintenance" },
              { id: "members", icon: "users", label: "Members" },
              {
                id: "complaints",
                icon: "exclamation-triangle",
                label: "Complaints",
              },
            ].map((item) => (
              <button
                key={item.id} // Fixed: Static items use 'id', not '_id'
                onClick={() => setActiveTab(item.id)}
                className={`nav-link w-full text-left ${
                  activeTab === item.id ? "active" : ""
                }`}>
                <i className={`fas fa-${item.icon} w-6`}></i> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="w-full btn bg-red-600 text-white hover:bg-red-700 mt-4">
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
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
          </div>
        )}

        {/* Updates */}
        {activeTab === "updates" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Share an Update</h1>
            <div className="section-card">
              <textarea
                className="w-full form-input h-32"
                placeholder="Type announcement..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}></textarea>
              <button
                onClick={handlePostUpdate}
                className="btn btn-primary mt-4">
                Post Update
              </button>
            </div>
          </div>
        )}

        {/* Events & Polls */}
        {activeTab === "events" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Event Management</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="section-card">
                <h2 className="text-xl font-semibold mb-4">Suggestions Box</h2>
                {suggestions.length === 0 ? (
                  <p className="text-gray-400">No suggestions yet.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-auto">
                    {suggestions.map((s) => (
                      <div key={s._id} className="p-3 bg-gray-700 rounded-lg">
                        <p>"{s.text}"</p>
                        <p className="text-xs text-gray-400 mt-1">
                          - {s.name} ({s.flatNo})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="section-card">
                <h2 className="text-xl font-semibold mb-2">Poll Management</h2>
                <p className="text-sm text-gray-400 mb-3">
                  {poll?.isActive ? "Active poll live." : "No active poll."}
                </p>
                <input
                  type="text"
                  placeholder="Poll question"
                  className="form-input w-full mb-3"
                  value={pollQ}
                  onChange={(e) => setPollQ(e.target.value)}
                />
                <div className="space-y-2 mb-3">
                  {pollOpts.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className="form-input w-full"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...pollOpts];
                          newOpts[idx] = e.target.value;
                          setPollOpts(newOpts);
                        }}
                      />
                      <button
                        className="btn bg-red-600 text-white"
                        onClick={() =>
                          setPollOpts(pollOpts.filter((_, i) => i !== idx))
                        }>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPollOpts([...pollOpts, ""])}
                    className="btn bg-gray-700 text-gray-200">
                    Add Option
                  </button>
                  <button onClick={handlePollSave} className="btn btn-primary">
                    Save/Update
                  </button>
                  <button
                    onClick={closePoll}
                    className="btn bg-yellow-500 text-yellow-900">
                    Close Poll
                  </button>
                </div>
                {poll && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Results: {poll.question}
                    </h3>
                    {poll.options.map((o) => {
                      const total = poll.options.reduce(
                        (sum, x) => sum + (x.votes || 0),
                        0,
                      );
                      const pct = total
                        ? Math.round((o.votes / total) * 100)
                        : 0;
                      return (
                        <div key={o._id} className="mb-2">
                          <div className="flex justify-between text-sm">
                            <span>{o.text}</span>
                            <span>
                              {o.votes || 0} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Billing */}
        {activeTab === "billing" && (
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
                        <p className="text-xs text-gray-300 truncate">
                          {b.fileName}
                        </p>
                      </div>
                      {b.fileData ? (
                        <button
                          onClick={() => openReceipt(b)}
                          className="btn bg-gray-600 text-xs">
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No receipt
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance */}
        {activeTab === "maintenance" && (
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
                                  isPaid
                                    ? {}
                                    : { txnId: "ADMIN-" + Date.now() },
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
        )}

        {/* Members */}
        {activeTab === "members" && (
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
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((u) => (
                    <tr key={u.email} className="border-b border-gray-700">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.flatNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
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
        )}
      </main>
      <ReceiptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default AdminPanel;
