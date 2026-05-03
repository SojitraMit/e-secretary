const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  fileName: String,
  fileData: String,
  fileType: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);
