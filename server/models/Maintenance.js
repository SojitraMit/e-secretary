const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  monthKey: String,
  amount: Number,
  records: { type: Map, of: Object },
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
