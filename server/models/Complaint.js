const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  text: String,
  name: String,
  flatNo: String,
  userEmail: String,
  status: { type: String, default: "Open" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
