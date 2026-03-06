import React, { useState } from "react";
import { useData, formatINR, monthKey, monthLabel } from "../DataContext";
import ReceiptModal from "./ReceiptModal";

const MemberPanel = () => {
  const {
    currentUser,
    logout,
    updates,
    funds,
    bills,
    complaints,
    addComplaint,
    suggestions,
    addSuggestion,
    poll,
    votePoll,
    maintenance,
    updateMaintenanceStatus,
  } = useData();

  const [activeTab, setActiveTab] = useState("home");
  const [complaintText, setComplaintText] = useState("");
  const [suggestionText, setSuggestionText] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Poll
  const hasVoted = poll?.votesBy && poll.votesBy.get(btoa(currentUser.email));
  const [pollSelection, setPollSelection] = useState(null);

  // Maintenance
  // Fix: Directly access records from the fetched maintenance object
  const records = maintenance.records || {};
  const myMaint = records[currentUser.email] || { status: "Pending" };
  const maintAmount = maintenance.amount || 2500;

  const handleComplaintSubmit = () => {
    if (!complaintText.trim()) return;
    addComplaint(complaintText, currentUser);
    setComplaintText("");
    alert("Complaint Submitted");
  };

  const handleSuggestionSubmit = () => {
    if (!suggestionText.trim()) return;
    addSuggestion(suggestionText, currentUser);
    setSuggestionText("");
    alert("Suggestion Sent");
  };

  const handleVote = () => {
    if (!pollSelection) return alert("Select an option");
    votePoll(pollSelection, currentUser.email);
  };

  const handlePay = () => {
    // Demo payment
    const txn = "UPI-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    updateMaintenanceStatus(currentUser.email, "Paid", { txnId: txn });
    alert("Payment Recorded!");
  };

  const openReceipt = (bill) => {
    setSelectedBill(bill);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="text-center mb-8">
            <i className="fas fa-user text-3xl text-blue-500"></i>
            <h2 className="text-2xl font-bold mt-2 text-white">Member Area</h2>
            <p className="text-sm text-gray-400">
              Welcome, {currentUser.name}!
            </p>
          </div>
          <nav className="space-y-2">
            {[
              { id: "home", icon: "home", label: "Home" },
              { id: "funds", icon: "wallet", label: "Society Funds" },
              { id: "events", icon: "calendar-check", label: "Events" },
              { id: "pay", icon: "money-bill-wave", label: "Pay Maintenance" },
              { id: "complaint", icon: "comment-dots", label: "Complaint Box" },
            ].map((item) => (
              <button
                key={item.id}
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
        {/* Home / Announcements */}
        {activeTab === "home" && (
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
        )}

        {/* Funds */}
        {activeTab === "funds" && (
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
                        {b.fileName} •{" "}
                        {new Date(b.createdAt).toLocaleDateString()}
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
        )}

        {/* Events & Polls */}
        {activeTab === "events" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Events & Suggestions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="section-card">
                <h2 className="text-xl font-semibold mb-4">
                  Submit Suggestion
                </h2>
                <textarea
                  className="w-full form-input h-24"
                  placeholder="Share your idea..."
                  value={suggestionText}
                  onChange={(e) =>
                    setSuggestionText(e.target.value)
                  }></textarea>
                <button
                  onClick={handleSuggestionSubmit}
                  className="btn btn-primary mt-4">
                  Submit
                </button>
              </div>
              <div className="section-card">
                <h2 className="text-xl font-semibold mb-4">Vote on Poll</h2>
                {!poll ? (
                  <p className="text-gray-400">No active poll.</p>
                ) : (
                  <div>
                    <p className="mb-3 font-semibold">{poll.question}</p>
                    {hasVoted || !poll.isActive ? (
                      <div className="space-y-2">
                        {poll.options.map((o, idx) => {
                          const key = o._id || o.id || idx;
                          const total = poll.options.reduce(
                            (sum, x) => sum + (x.votes || 0),
                            0,
                          );
                          const pct = total
                            ? Math.round((o.votes / total) * 100)
                            : 0;
                          const isSelected =
                            poll.votesBy.get(btoa(currentUser.email)) == idx;
                          return (
                            <div
                              key={key}
                              className={`p-2 rounded ${
                                isSelected
                                  ? "bg-blue-900 ring-1 ring-blue-500"
                                  : "bg-gray-700"
                              }`}>
                              <div className="flex justify-between text-sm">
                                <span>{o.text}</span>
                                <span>
                                  {o.votes} ({pct}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                        <p className="text-xs text-gray-400 mt-2">
                          {!poll.isActive ? "Poll Closed" : "You have voted."}
                        </p>
                      </div>
                    ) : (
                      <div>
                        {poll.options.map((o, idx) => (
                          // Use o._id if available (MongoDB), fallback to o.id, fallback to index
                          <label
                            key={o._id || o.id || idx}
                            className="flex items-center mb-2 cursor-pointer">
                            <input
                              type="radio"
                              name="poll"
                              value={o._id || o.id}
                              onChange={() => setPollSelection(o._id || o.id)}
                              className="form-radio bg-gray-700 border-gray-600"
                            />
                            <span className="ml-2">{o.text}</span>
                          </label>
                        ))}
                        <button
                          onClick={handleVote}
                          className="btn btn-primary mt-3">
                          Vote
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pay Maintenance */}
        {activeTab === "pay" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Pay Maintenance</h1>
            <div className="section-card text-center max-w-lg mx-auto">
              <p className="text-lg">
                Maintenance for{" "}
                <span className="font-semibold">{monthLabel()}</span> is{" "}
                <span
                  className={`font-bold ${
                    myMaint.status === "Paid"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}>
                  {myMaint.status === "Paid" ? "PAID" : "DUE"}
                </span>
              </p>
              <p className="text-3xl font-bold my-3">
                {formatINR(maintAmount)}
              </p>
              {myMaint.status !== "Paid" ? (
                <button
                  onClick={handlePay}
                  className="btn btn-primary btn-lg w-full sm:w-auto">
                  <i className="fas fa-qrcode mr-2"></i> Pay via UPI
                </button>
              ) : (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded">
                  <p className="text-green-400">
                    <i className="fas fa-check-circle mr-2"></i> Payment
                    Complete
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Txn ID: {myMaint.txnId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaint" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Complaint Box</h1>
            <div className="section-card">
              <h2 className="text-xl font-semibold mb-4">
                Lodge New Complaint
              </h2>
              <textarea
                className="w-full form-input h-32"
                placeholder="Describe issue..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}></textarea>
              <button
                onClick={handleComplaintSubmit}
                className="btn btn-primary mt-4">
                Submit
              </button>
            </div>
            <div className="section-card mt-6">
              <h2 className="text-xl font-semibold mb-4">My Complaints</h2>
              <div className="space-y-3">
                {complaints
                  .filter(
                    (c) =>
                      c.userEmail === currentUser.email ||
                      (c.name === currentUser.name &&
                        c.flatNo === currentUser.flatNo),
                  )
                  .map((c) => (
                    <div
                      key={c._id}
                      className="p-3 bg-gray-700 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{c.text}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          Submitted: {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
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
                    </div>
                  ))}
              </div>
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

export default MemberPanel;
