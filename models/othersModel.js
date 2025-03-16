const mongoose = require("mongoose");

const othersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Activities: [{
    activityDetails: { type: String, },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Responsibilities: [{
    Responsibility: { type: String, },
    assignedBy: { type: String, },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Contribution: [{
    contributionDetails: { type: String, },
    Benefit: { type: String, },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Awards: [{
    Award: { type: String, },
    IssuingOrg: { type: String, },
    UploadFiles: [{ Image: { type: String } }]
  }],
})

module.exports = mongoose.models.Others || mongoose.model("Others", othersSchema);