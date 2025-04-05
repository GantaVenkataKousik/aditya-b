const express = require('express');
const router = express.Router();
const { getOperationsByDay } = require('../controllers/operation-tracking-controller');
const OperationTracking = require('../models/operation-tracking-model');

// Route for operation statistics by day with optional filters
router.get('/operations-statistics', async (req, res) => {
    try {
        const { date, modelName, operation } = req.query;

        // Create a date range for the requested date
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Build the query
        let query = {
            timestamp: {
                $gte: targetDate,
                $lt: nextDay
            }
        };

        if (modelName && modelName !== 'All') {
            query.modelName = modelName;
        }

        if (operation && operation !== 'All') {
            query.operation = operation;
        }

        // Fetch operations with full details
        const operations = await OperationTracking.find(query)
            .populate('userId', 'fullName email designation')
            .sort({ timestamp: -1 });

        // Group operations by model
        const groupedOperations = {};

        operations.forEach(op => {
            if (!groupedOperations[op.modelName]) {
                groupedOperations[op.modelName] = [];
            }
            groupedOperations[op.modelName].push(op);
        });

        return res.status(200).json({
            success: true,
            operations: groupedOperations
        });
    } catch (error) {
        console.error("Error fetching operations:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching operations"
        });
    }
});

module.exports = router; 