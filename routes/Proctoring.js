const express = require("express");
const router = express.Router();
const Proctoring = require("../models/ProctoringModel");
const User = require("../models/user-model");
// Fetch all proctoring data
router.get("/proctoring-data", async (req, res) => {
    try {
        const userId = req.query.userId;  // Get userId from logged-in user
        const data = await Proctoring.find({ teacher: userId });
        const totalPassPercentage = data.reduce((sum, item) => sum + (item.passedStudents / item.eligibleStudents) * 100, 0) / data.length;
        res.json({ data, averagePercentage: totalPassPercentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Add new proctoring data
router.post("/proctoring-data", async (req, res) => {
    try {
        // Fetch the logged-in user
        const userId = req.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract data from the request body
        const { totalStudents, semesterBranchSec, eligibleStudents, passedStudents } = req.body;

        if (!totalStudents || !semesterBranchSec || !eligibleStudents || !passedStudents) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Fetch all existing proctoring records
        const proctoringRecords = await Proctoring.find();

        // Calculate the total pass percentage
        const totalPassPercentage =
            proctoringRecords.length > 0
                ? proctoringRecords.reduce((sum, record) => sum + (record.passedStudents / record.eligibleStudents) * 100, 0) /
                proctoringRecords.length
                : (passedStudents / eligibleStudents) * 100;

        // Determine self-assessment marks based on the percentage
        let selfAssessmentMarks = 0;
        if (totalPassPercentage >= 95) {
            selfAssessmentMarks = 20;
        } else if (totalPassPercentage >= 85) {
            selfAssessmentMarks = 15;
        } else if (totalPassPercentage >= 75) {
            selfAssessmentMarks = 10;
        } else {
            selfAssessmentMarks = 10;
        }

        // Create and save new proctoring data, including computed values
        const newProctoring = new Proctoring({
            totalStudents,
            semesterBranchSec,
            eligibleStudents,
            passedStudents,
            averagePercentage: totalPassPercentage.toFixed(2),
            selfAssessmentMarks,
            teacher: user._id, // Linking the record to the logged-in user
        });

        await newProctoring.save();

        user.ProctorSelfAsses = selfAssessmentMarks;
        await user.save();

        // Respond with saved data
        res.status(201).json({ newProctoring });

    } catch (error) {
        console.error("Error processing proctoring data:", error);
        res.status(500).json({ error: "Failed to process data" });
    }
});

router.delete('/proctoring/:id', async (req, res) => {
    try {
        const proctoringId = req.params.id;
        const deletedProctoring = await Proctoring.findByIdAndDelete(proctoringId);
        res.status(200).json({ message: "Proctoring data deleted successfully" });
    } catch (error) {
        console.error('Error deleting proctoring data:', error);
        res.status(400).json({ error: error.message });
    }
});

router.put('/proctoring/:id', async (req, res) => {
    try {
        const proctoringId = req.params.id;
        const { totalStudents, semesterBranchSec, eligibleStudents, passedStudents } = req.body;
        const updatedProctoring = await Proctoring.findByIdAndUpdate(proctoringId, { totalStudents, semesterBranchSec, eligibleStudents, passedStudents }, { new: true });
        res.status(200).json(updatedProctoring);
    } catch (error) {
        console.error('Error updating proctoring data:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
