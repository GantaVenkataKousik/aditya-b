const mongoose = require("mongoose");

const globalSettingsSchema = new mongoose.Schema({
  updateButtonDisabled: { type: Boolean, default: false },
});

const GlobalSettings = mongoose.model("GlobalSettings", globalSettingsSchema);
module.exports = GlobalSettings;
