const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const { logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');

// Map parameter names to model field names
const parameterToFieldMap = {
    "Courses Average Pass %": "couAvgPerMarks",
    "Course Feedback": "CoufeedMarks",
    "Proctoring Students Average Pass %": "ProctoringMarks",
    "Research - SCI papers": "SciMarks",
    "Research - Scopus/WoS Papers": "WosMarks",
    "Research – Proposals Submitted/funded": "ProposalMarks",
    "Research - Others": "ResearchSelfAsses",
    "Workshops, FDPs, STTP attended": "WorkSelfAsses",
    "Outreach Activities": "OutreachSelfAsses",
    "Additional responsibilities in the Department / College": "AddSelfAsses",
    "Special Contribution": "SpeacialSelfAsses"
};

// Map field names to max score values for validation
const fieldToMaxScoreMap = {
    "couAvgPerMarks": 20,
    "CoufeedMarks": 20,
    "ProctoringMarks": 20,
    "SciMarks": 60,
    "WosMarks": 60,
    "ProposalMarks": 10,
    "ResearchSelfAsses": 10,
    "WorkSelfAsses": 20,
    "OutreachSelfAsses": 10,
    "AddSelfAsses": 20,
    "SpeacialSelfAsses": 10
};

// Update a faculty score parameter
router.put('/update-score', async (req, res) => {
    try {
        const { userId, field, value, parameter } = req.body;
        const adminId = req.query.userId || req.body.adminId; // Person making the change

        // Validate inputs
        if (!userId || !field) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate value is within max score range
        const maxScore = fieldToMaxScoreMap[field] || 100;
        const normalizedValue = Math.min(Math.max(0, parseInt(value) || 0), maxScore);

        // Find user and get original data for logging
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get original value for logging
        const originalValue = user[field];

        // Update the field in user document
        const updateObj = { [field]: normalizedValue };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateObj,
            { new: true }
        );

        // Log the update operation if admin ID is provided
        if (adminId) {
            await logUpdateOperation(
                adminId,
                userId,
                'User.FacultyScore',
                { [field]: originalValue },
                { [field]: normalizedValue, parameter }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Score updated successfully',
            updatedScore: normalizedValue,
            parameter: parameter || field
        });
    } catch (error) {
        console.error('Error updating faculty score:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update score',
            error: error.message
        });
    }
});

// Reset/Delete a faculty score parameter (set to 0)
router.delete('/reset-score', async (req, res) => {
    try {
        const { userId, field, parameter } = req.body;
        const adminId = req.query.userId || req.body.adminId; // Person making the change

        // Validate inputs
        if (!userId || !field) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Find user and get original data for logging
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get original value for logging
        const originalValue = user[field];

        // Reset the field to 0
        const updateObj = { [field]: 0 };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateObj,
            { new: true }
        );

        // Log the reset/delete operation if admin ID is provided
        if (adminId) {
            await logDeleteOperation(
                adminId,
                userId,
                'User.FacultyScore',
                { [field]: originalValue, parameter }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Score reset successfully',
            parameter: parameter || field
        });
    } catch (error) {
        console.error('Error resetting faculty score:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset score',
            error: error.message
        });
    }
});

module.exports = router; 