const mongoose = require("mongoose");

// const MaintenanceSchema = new mongoose.Schema({
//   monthKey: String,
//   amount: Number,
//   records: { type: Map, of: Object },
// });
const MaintenanceSchema = new mongoose.Schema({
  monthKey: String,
  amount: Number,
  records: {
    type: Map,
    of: new mongoose.Schema({
      status: String,
      txnId: String,
      updatedAt: Date,
    }),
    default: {},
  },
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
