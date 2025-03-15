const mongoose = require("mongoose");

const othersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Activities: [{
    activityDetails: { type: String, required: true },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Responsibilities: [{
    Responsibility: { type: String, required: true },
    assignedBy: { type: String, required: true },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Contribution: [{
    contributionDetails: { type: String, required: true },
    Benefit: { type: String, required: true },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Awards: [{
    Award: { type: String, required: true },
    IssuingOrg: { type: String, required: true },
    UploadFiles: [{ Image: { type: String } }]
  }],
})

module.exports = mongoose.models.Others || mongoose.model("Others", othersSchema);