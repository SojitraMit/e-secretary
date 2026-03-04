const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  text: String,
  name: String,
  flatNo: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
