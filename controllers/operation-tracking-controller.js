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
        if (userId) {
            try {
                matchCondition.userId = new mongoose.Types.ObjectId(userId);
            } catch (err) {
                console.error('Invalid userId format, ignoring filter');
            }
        }
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

// Enhance getFieldLabel with more field mappings
const getFieldLabel = (fieldName) => {
    const fieldLabels = {
        fullName: "Full Name",
        email: "Email",
        EmpID: "Employee ID",
        designation: "Designation",
        department: "Department",
        JoiningDate: "Joining Date",
        Qualification: "Qualification",
        UG: "UG Institution",
        UGYear: "UG Year",
        PG: "PG Institution",
        PGYear: "PG Year",
        Phd: "PhD",
        PhdYear: "PhD Year",
        Industry: "Industry Experience",
        TExp: "Teaching Experience",
        title: "Title",
        description: "Description",
        courseName: "Course Name",
        semester: "Semester",
        section: "Section",
        branch: "Branch",
        numberOfStudents: "Number of Students",
        passPercentage: "Pass Percentage",
        activityDetails: "Activity Details",
        Responsibility: "Responsibility",
        AssignedBy: "Assigned By",
        contributionDetails: "Contribution Details",
        Benefit: "Benefit",
        Award: "Award Name",
        AwardedBy: "Awarded By",
        Level: "Level",
        // Add all other relevant field mappings
    };

    return fieldLabels[fieldName] || fieldName;
};

// Ensure formatValue handles all data types properly
const formatValue = (value) => {
    if (value === undefined || value === null) return 'null';

    if (Array.isArray(value)) {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '[Array]';
        }
    }

    if (typeof value === 'object' && value !== null) {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '[Object]';
        }
    }

    // Handle Date objects
    if (value instanceof Date) {
        return value.toISOString();
    }

    return String(value);
};

// In the logCreateOperation function
const logCreateOperation = async (userId, entityId, modelName, newEntityData) => {
    try {
        // Filter out sensitive or unnecessary fields
        const filteredData = { ...newEntityData };
        if (filteredData.password) delete filteredData.password;
        if (filteredData.__v) delete filteredData.__v;

        const operation = new OperationTracking({
            userId,
            entityId,
            modelName,
            operation: 'CREATE',
            details: {
                newEntity: filteredData
            }
        });

        await operation.save();
    } catch (error) {
        console.error("Error logging create operation:", error);
    }
};

// In the logUpdateOperation function
const logUpdateOperation = async (userId, entityId, modelName, originalData, newData) => {
    try {
        const changedFields = {};

        Object.keys(newData).forEach(key => {
            // Skip userId, password and internal fields
            if (key === 'userId' || key === 'password' || key === '_id' || key === '__v') return;

            // Check for different types and handle comparisons
            let valuesAreDifferent = false;

            if (Array.isArray(originalData[key]) && Array.isArray(newData[key])) {
                valuesAreDifferent = JSON.stringify(originalData[key]) !== JSON.stringify(newData[key]);
            } else if (
                typeof originalData[key] === 'object' && originalData[key] !== null &&
                typeof newData[key] === 'object' && newData[key] !== null
            ) {
                valuesAreDifferent = JSON.stringify(originalData[key]) !== JSON.stringify(newData[key]);
            } else {
                valuesAreDifferent = originalData[key] !== newData[key];
            }

            if (valuesAreDifferent) {
                changedFields[key] = {
                    from: formatValue(originalData[key]),
                    to: formatValue(newData[key])
                };
            }
        });

        // Only log if there are actual changes
        if (Object.keys(changedFields).length > 0) {
            const operation = new OperationTracking({
                userId,
                entityId,
                modelName,
                operation: 'UPDATE',
                details: {
                    changedFields
                }
            });

            await operation.save();
        }
    } catch (error) {
        console.error("Error logging update operation:", error);
    }
};

// In the logDeleteOperation function
const logDeleteOperation = async (userId, entityId, modelName, entityData) => {
    try {
        // Filter out sensitive or unnecessary fields
        const filteredData = { ...entityData };
        if (filteredData.password) delete filteredData.password;
        if (filteredData.__v) delete filteredData.__v;

        const operation = new OperationTracking({
            userId,
            entityId,
            modelName,
            operation: 'DELETE',
            details: {
                deletedEntity: filteredData
            }
        });

        await operation.save();
    } catch (error) {
        console.error("Error logging delete operation:", error);
    }
};

module.exports = {
    logOperation,
    getOperationsByDay,
    logCreateOperation,
    logUpdateOperation,
    logDeleteOperation
}; 