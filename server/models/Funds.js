const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    source: String,
    eventName: String,
    description: String,
    balanceAfter: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const FundsSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  updatedBy: String,
  updatedAt: { type: Date, default: Date.now },
  transactions: { type: [TransactionSchema], default: [] },
});

module.exports = mongoose.model("Funds", FundsSchema);
