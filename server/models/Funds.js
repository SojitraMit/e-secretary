const mongoose = require("mongoose");

const FundsSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  updatedBy: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Funds", FundsSchema);
