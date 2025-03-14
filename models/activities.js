const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    detail: { type: String },
    imagePath: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Activities = mongoose.model("Activities", activitiesSchema);

module.exports = Activities;
