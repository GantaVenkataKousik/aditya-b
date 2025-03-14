const mongoose = require("mongoose");

const responsibilitiesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responsibility: { type: String, required: true },
    assignedBy: { type: String, required: true },
    imagePath: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Responsibilities = mongoose.model("Responsibilities", responsibilitiesSchema);

module.exports = Responsibilities;