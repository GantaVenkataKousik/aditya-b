const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    semester: {
        type: String,
    },
    courseName: {
        type: String,
    },
    numberOfStudents: {
        type: Number,
    },
    feedbackPercentage: {
        type: Number,
    },
    averagePercentage: {
        type: Number,
    },
    selfAssessmentMarks: {
        type: Number,
    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imagePath: { type: String }
});


module.exports = mongoose.model("Feedback", feedbackSchema);