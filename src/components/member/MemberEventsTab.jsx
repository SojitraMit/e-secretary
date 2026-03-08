import React, { useState } from "react";
import toast from "react-hot-toast";
import { useData } from "../../DataContext";

const MemberEventsTab = () => {
  const { currentUser, poll, addSuggestion, votePoll } = useData();
  const [suggestionText, setSuggestionText] = useState("");
  const [pollSelection, setPollSelection] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleSuggestionSubmit = () => {
    if (!suggestionText.trim()) return;
    addSuggestion(suggestionText, currentUser);
    setSuggestionText("");
    toast.success("Suggestion Sent");
  };

  const handleVote = async () => {
    if (pollSelection === null) return toast.error("Select an option");

    if (hasVoted) {
      return toast.error("You already voted");
    }

    setIsVoting(true);
    const success = await votePoll(pollSelection, currentUser.email);
    if (success) {
      setPollSelection(null); // Reset selection
    }
    setIsVoting(false);
  };

  const hasVoted = poll?.votesBy?.[btoa(currentUser.email)] !== undefined;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Events & Suggestions</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card">
          <h2 className="text-xl font-semibold mb-4">Submit Suggestion</h2>
          <textarea
            className="w-full form-input h-24"
            placeholder="Share your idea..."
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}></textarea>
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
                    const pct = total ? Math.round((o.votes / total) * 100) : 0;
                    const isSelected =
                      String(poll?.votesBy?.[btoa(currentUser.email)]) ===
                      String(idx);
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
                    <label
                      key={o._id || o.id || idx}
                      className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name="poll"
                        checked={pollSelection === idx}
                        onChange={() => setPollSelection(idx)}
                        disabled={isVoting}
                        className="form-radio bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2">{o.text}</span>
                    </label>
                  ))}
                  <button
                    onClick={handleVote}
                    disabled={isVoting || hasVoted}
                    className="btn btn-primary mt-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isVoting ? "Voting..." : "Vote"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberEventsTab;
