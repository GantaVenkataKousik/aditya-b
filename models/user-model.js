const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String},
    type:{type:String},
    EmpID:String,
    JoiningDate:String,
    Qualification:String,
    YearOfpass:String,
    UG:String,
    UGYear:String,
    PG:String,
    PGYear:String,
    Phd:String,
    PhdYear:String,
    OtherInst:String,
    OtherYear:String,
    Industry:String,
    TExp:Number,


    AvgSelfAsses:{ type: Number, default: 10 },
    feedSelfAsses:{ type: Number, default: 10 },
    ProctorSelfAsses:{ type: Number, default: 10 },
    ResearchSelfAsses:{ type: Number, default: 10 },
    WorkSelfAsses:{ type: Number, default: 10 },
    OutreachSelfAsses:{ type: Number, default: 0 },
    AddSelfAsses:{ type: Number, default: 10 },
    SpeacialSelfAsses: { type: Number, default: 10 },
    ProposalMarks:{ type: Number, default: 10 }, 
    SciMarks:{ type: Number, default: 10 },
    WosMarks:{ type: Number, default: 10 },
    WorkshopMarks:{ type: Number, default: 20 },
 


    CoufeedMarks: { type: Number, default: 0 },
    couAvgPerMarks: { type: Number, default: 0 },
    ProctoringMarks: { type: Number, default: 0 },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});

module.exports = mongoose.model("User", userSchema); 
