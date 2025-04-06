const { logOperation } = require('../controllers/operation-tracking-controller');

// Utility functions for logging operations
const logCreateOperation = async (userId, targetId, modelName, entityData) => {
    try {
        // Make a clean copy of data, removing sensitive fields
        const cleanData = { ...entityData };

        // Remove sensitive information if present
        if (cleanData.password) delete cleanData.password;

        await logOperation(
            userId,
            targetId,
            modelName,
            'CREATE',
            {
                newEntity: cleanData
            }
        );
        return true;
    } catch (error) {
        console.error(`Error logging CREATE operation for ${modelName}:`, error);
        return false;
    }
};

const logUpdateOperation = async (userId, targetId, modelName, originalData, newData) => {
    try {
        // Make clean copies of data
        const cleanOriginalData = { ...originalData };
        if (cleanOriginalData.password) delete cleanOriginalData.password;

        // Identify changed fields
        const changedFields = {};
        Object.keys(newData).forEach(key => {
            if (originalData[key] !== newData[key]) {
                changedFields[key] = {
                    from: originalData[key],
                    to: newData[key]
                };
            }
        });

        if (Object.keys(changedFields).length > 0) {
            await logOperation(
                userId,
                targetId,
                modelName,
                'UPDATE',
                {
                    originalName: originalData.fullName || originalData.title || 'Unknown',
                    originalEntity: cleanOriginalData, // Store complete original entity
                    changedFields
                }
            );
        }
        return true;
    } catch (error) {
        console.error(`Error logging UPDATE operation for ${modelName}:`, error);
        return false;
    }
};

const logDeleteOperation = async (userId, targetId, modelName, deletedData) => {
    try {
        // Log what's being received
        console.log(`DELETE operation on ${modelName}:`, {
            userId,
            targetId,
            deletedData
        });

        // Make a clean copy of data, removing sensitive fields
        const cleanData = { ...deletedData };

        // Remove sensitive information if present
        if (cleanData.password) delete cleanData.password;

        await logOperation(
            userId,
            targetId,
            modelName,
            'DELETE',
            {
                deletedEntity: cleanData
            }
        );
        return true;
    } catch (error) {
        console.error(`Error logging DELETE operation for ${modelName}:`, error);
        return false;
    }
};

module.exports = {
    logCreateOperation,
    logUpdateOperation,
    logDeleteOperation
}; 