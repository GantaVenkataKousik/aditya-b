const express = require("express");
const router = express.Router();
const Proctoring = require("../models/ProctoringModel");
const User = require("../models/user-model");
const { logCreateOperation, logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');

// Fetch all proctoring data
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;  // Get userId from logged-in user
        const data = await Proctoring.find({ teacher: userId });
        const totalPassPercentage = data.reduce((sum, item) => sum + (item.passedStudents / item.eligibleStudents) * 100, 0) / data.length;
        res.status(200).json({ success: true, message: 'Proctoring data fetched successfully', data, averagePercentage: totalPassPercentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Add new proctoring data
router.post("/:userId", async (req, res) => {
    try {
        // Fetch the logged-in user
        const userId = req.params.userId;
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

        // FIXED: Pass the complete entity
        await logCreateOperation(userId, newProctoring._id, 'Proctoring', newProctoring.toObject());

        // Respond with saved data
        res.status(200).json({ success: true, message: 'Proctoring data added successfully', data: newProctoring });

    } catch (error) {
        console.error("Error processing proctoring data:", error);
        res.status(500).json({ error: "Failed to process data" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId; // Get userId from query

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Get complete proctoring details
        const proctoringData = await Proctoring.findById(id);
        if (!proctoringData) {
            return res.status(404).json({ success: false, message: 'Proctoring data not found' });
        }

        // Delete proctoring
        await Proctoring.findByIdAndDelete(id);

        // FIXED: Pass the complete entity
        await logDeleteOperation(userId, id, 'Proctoring', proctoringData.toObject());

        res.json({ success: true, message: 'Proctoring data deleted successfully' });
    } catch (error) {
        console.error('Error deleting proctoring:', error);
        res.status(500).json({ success: false, message: 'Error deleting proctoring data' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.updatedBy || req.query.userId; // Get userId from body or query

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Get original proctoring data
        const originalProctoring = await Proctoring.findById(id);
        if (!originalProctoring) {
            return res.status(404).json({ success: false, message: 'Proctoring data not found' });
        }

        // Update proctoring
        const updatedProctoring = await Proctoring.findByIdAndUpdate(id, req.body, { new: true });

        // Log update operation
        await logUpdateOperation(userId, id, 'Proctoring', originalProctoring.toObject(), req.body);

        res.json(updatedProctoring);
    } catch (error) {
        console.error('Error updating proctoring:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
