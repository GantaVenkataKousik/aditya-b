const mongoose = require("mongoose");

const ProctoringSchema = new mongoose.Schema({
    totalStudents: { type: Number, required: true },
    semesterBranchSec: { type: String, required: true },
    eligibleStudents: { type: Number, required: true },
    passedStudents: { type: Number, required: true },
    averagePercentage: {
        type: Number,

    },
    selfAssessmentMarks: {
        type: Number,

    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imagePath: { type: String }
});

module.exports = mongoose.model("Proctoring", ProctoringSchema);
