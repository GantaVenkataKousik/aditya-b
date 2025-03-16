const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  SciArticles: [{
    articleDetails: { type: String, },
    ISSN: { type: String, },
    authorPosition: { type: String, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  WosArticles: [{
    articleDetails: { type: String, },
    ISSN: { type: Number, },
    authorPosition: { type: String, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Proposals: [{
    proposalDetails: { type: String, },
    fundingAgency: { type: String, },
    amount: { type: Number, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Papers: [{
    paperDetails: { type: String, },
    authorPosition: { type: String, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Books: [{
    bookDetails: { type: String, },
    ISBN: { type: Number, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  Chapters: [{
    chapterDetails: { type: String, },
    Publisher: { type: String, },
    ISBN: { type: Number, },
    authorPosition: { type: String, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  PGranted: [{
    PTitle: { type: String, },
    PNumber: { type: Number, },
    CountryGranted: { type: String, },
    GrantedDate: { type: Date, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
  PFiled: [{
    PTitle: { type: String, },
    PNumber: { type: Number, },
    FiledinCountry: { type: String, },
    PublishedDate: { type: Date, },
    status: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    UploadFiles: [{ Image: { type: String } }]
  }],
})

module.exports = mongoose.model("Research", researchSchema); 