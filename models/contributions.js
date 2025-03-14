const mongoose = require("mongoose");

const contributionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contribution: { type: String, required: true },
    benefit: { type: String },
    imagePath: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Contributions = mongoose.model("Contributions", contributionsSchema);

module.exports = Contributions;