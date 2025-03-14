const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

    courseName: { type: String, required: true },
    semester: { type: String, required: true },

    numberOfStudents: { type: Number, required: true },

    passCount: { type: Number, required: true },
    passPercentage: { type: Number, required: true },
    averagePercentage: Number,
    selfAssessmentMarks: Number,
    above95: { type: Number, default: 0 },
    between85And95: { type: Number, default: 0 },
    between75And85: { type: Number, default: 0 },
    below75: { type: Number, default: 0 },

    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imagePath: { type: String }
});

module.exports = mongoose.model("Class", classSchema);