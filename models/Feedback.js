const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    semester: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    numberOfStudents: {
        type: Number,
        required: true,
    },
    feedbackPercentage: {
        type: Number,
        required: true,
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