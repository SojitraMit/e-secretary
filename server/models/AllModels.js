const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  flatNo: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  createdAt: { type: Date, default: Date.now },
});

const ComplaintSchema = new mongoose.Schema({
  text: String,
  name: String,
  flatNo: String,
  userEmail: String,
  status: { type: String, default: "Open" },
  createdAt: { type: Date, default: Date.now },
});

const UpdateSchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const BillSchema = new mongoose.Schema({
  eventName: String,
  fileName: String,
  fileData: String, // Storing Base64 for simplicity in this demo (use AWS S3 for production)
  fileType: String,
  createdAt: { type: Date, default: Date.now },
});

const SuggestionSchema = new mongoose.Schema({
  text: String,
  name: String,
  flatNo: String,
  createdAt: { type: Date, default: Date.now },
});

const PollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  votesBy: { type: Map, of: String }, // Map email -> optionId
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

const FundsSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  updatedBy: String,
  updatedAt: { type: Date, default: Date.now },
});

const MaintenanceSchema = new mongoose.Schema({
  monthKey: String, // e.g., "2023-11"
  amount: Number,
  records: { type: Map, of: Object }, // Map email -> { status, txnId }
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  Complaint: mongoose.model("Complaint", ComplaintSchema),
  Update: mongoose.model("Update", UpdateSchema),
  Bill: mongoose.model("Bill", BillSchema),
  Suggestion: mongoose.model("Suggestion", SuggestionSchema),
  Poll: mongoose.model("Poll", PollSchema),
  Funds: mongoose.model("Funds", FundsSchema),
  Maintenance: mongoose.model("Maintenance", MaintenanceSchema),
};
