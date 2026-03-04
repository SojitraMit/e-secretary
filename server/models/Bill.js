const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  eventName: String,
  fileName: String,
  fileData: String,
  fileType: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);
