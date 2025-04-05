const mongoose = require('mongoose');
const OperationTracking = require('../models/operation-tracking-model');

// Create a new operation record
const logOperation = async (userId, targetId, modelName, operation, details = {}) => {
    try {
        await OperationTracking.create({
            userId,
            targetId,
            modelName,
            operation,
            details
        });
        console.log(`Operation logged: ${operation} on ${modelName}`);
        return true;
    } catch (error) {
        console.error('Error logging operation:', error);
        return false;
    }
};

// Get operations by day with optional filters
const getOperationsByDay = async (req, res) => {
    try {
        const { date, userId, operation, modelName } = req.query;

        // Generate date range for the query
        let targetDate;
        if (date) {
            targetDate = new Date(date);
        } else {
            // Get current time in UTC
            const nowUTC = new Date();

            // Convert to IST by adding 5 hours and 30 minutes
            const istTime = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

            // Get just the date part in IST
            const istDateString = istTime.toISOString().split('T')[0];
            console.log('Current IST date:', istDateString);

            // Create date object for the IST date
            targetDate = new Date(istDateString);
        }

        // Calculate start and end time in UTC for the target IST date
        const startDate = new Date(targetDate);
        startDate.setUTCHours(0, 0, 0, 0);
        startDate.setTime(startDate.getTime() - (5.5 * 60 * 60 * 1000));

        const endDate = new Date(targetDate);
        endDate.setUTCHours(23, 59, 59, 999);
        endDate.setTime(endDate.getTime() - (5.5 * 60 * 60 * 1000));

        console.log('Target date:', targetDate.toISOString());
        console.log('Query start (UTC):', startDate.toISOString());
        console.log('Query end (UTC):', endDate.toISOString());

        // Build match condition
        const matchCondition = {
            timestamp: { $gte: startDate, $lte: endDate }
        };

        // Add optional filters
        if (userId) matchCondition.userId = mongoose.Types.ObjectId(userId);
        if (operation) matchCondition.operation = operation;
        if (modelName) matchCondition.modelName = modelName;

        // Fetch operations with user information
        const operations = await OperationTracking.find(matchCondition)
            .populate('userId', 'fullName email designation department')
            .sort({ timestamp: -1 });

        // Group by model and operation
        const groupedOperations = operations.reduce((acc, op) => {
            const key = `${op.modelName}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(op);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            date: targetDate.toISOString().split('T')[0],
            operations: groupedOperations
        });
    } catch (error) {
        console.error('Error fetching operations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching operations',
            error: error.message
        });
    }
};

module.exports = {
    logOperation,
    getOperationsByDay
}; 