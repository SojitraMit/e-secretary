const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  votesBy: { type: Map, of: String },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Poll", PollSchema);
