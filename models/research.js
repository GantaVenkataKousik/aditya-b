const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  SciArticles: [{
    articleDetails: { type: String, required: true },
    ISSN: { type: String, required: true },
    authorPosition: { type: String, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  WosArticles: [{
    articleDetails: { type: String, required: true },
    ISSN: { type: Number, required: true },
    authorPosition: { type: String, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Proposals: [{
    proposalDetails: { type: String, required: true },
    fundingAgency: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Papers: [{
    paperDetails: { type: String, required: true },
    authorPosition: { type: String, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Books: [{
    bookDetails: { type: String, required: true },
    ISBN: { type: Number, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Chapters: [{
    chapterDetails: { type: String, required: true },
    Publisher: { type: String, required: true },
    ISBN: { type: Number, required: true },
    authorPosition: { type: String, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  PGranted: [{
    PTitle: { type: String, required: true },
    PNumber: { type: Number, required: true },
    CountryGranted: { type: String, required: true },
    GrantedDate: { type: Date, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  PFiled: [{
    PTitle: { type: String, required: true },
    PNumber: { type: Number, required: true },
    FiledinCountry: { type: String, required: true },
    PublishedDate: { type: Date, required: true },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
})

module.exports = mongoose.model("Research", researchSchema); 