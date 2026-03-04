const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Update", UpdateSchema);
