const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String }
});

module.exports = mongoose.model("departments", departmentSchema); 