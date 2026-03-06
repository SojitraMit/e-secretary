import React, { useState } from "react";
import { useData } from "../../DataContext";

const AdminEventsTab = () => {
  const { suggestions, poll, savePoll, closePoll } = useData();
  const [pollQ, setPollQ] = useState("");
  const [pollOpts, setPollOpts] = useState(["", ""]);

  const handlePollSave = () => {
    if (!pollQ.trim() || pollOpts.filter((o) => o.trim()).length < 2) {
      return alert("Poll needs a question and at least 2 options");
    }
    savePoll({
      question: pollQ,
      options: pollOpts
        .filter((o) => o.trim())
        .map((text) => ({ text, votes: 0 })),
    });
    setPollQ("");
    setPollOpts(["", ""]);
    alert("Poll Saved");
  };

  const closePollHandler = () => {
    if (!poll) return;
    closePoll();
    alert("Poll Closed");
  };

  return (
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
              onClick={closePollHandler}
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
                const pct = total ? Math.round((o.votes / total) * 100) : 0;
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
  );
};

export default AdminEventsTab;
