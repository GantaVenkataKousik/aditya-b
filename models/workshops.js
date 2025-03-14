const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String },
  Date: { type: Date, required: true },
  StartTime: { type: String, required: true },
  EndTime: { type: String, required: true },
  Venue: { type: String },
  Mode: { type: String, required: true },
  OrganizedBy: { type: String, required: true },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagePath: { type: String }
});

module.exports = mongoose.model("Workshops", workshopSchema);