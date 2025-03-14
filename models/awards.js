const mongoose = require("mongoose");

const awardsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    award: { type: String, required: true },
    issuingOrg: { type: String, required: true },
    imgPath: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Awards = mongoose.model("Awards", awardsSchema);

module.exports = Awards;

