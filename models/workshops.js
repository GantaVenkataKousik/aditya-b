const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  workshopTitle: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  organizer: { type: String, required: true },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagePath: { type: String }
});

module.exports = mongoose.model("Workshops", workshopSchema);