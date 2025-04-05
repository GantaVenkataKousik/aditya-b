const { logOperation } = require('../controllers/operation-tracking-controller');

// Default user ID to use when no authentication is available
const DEFAULT_USER_ID = '000000000000000000000000';

// Utility functions for logging operations
const logCreateOperation = async (targetId, modelName, entityData) => {
    try {
        await logOperation(
            DEFAULT_USER_ID,
            targetId,
            modelName,
            'CREATE',
            {
                newEntity: entityData
            }
        );
        return true;
    } catch (error) {
        console.error(`Error logging CREATE operation for ${modelName}:`, error);
        return false;
    }
};

const logUpdateOperation = async (targetId, modelName, originalData, newData) => {
    try {
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
                DEFAULT_USER_ID,
                targetId,
                modelName,
                'UPDATE',
                {
                    originalName: originalData.fullName || originalData.title || 'Unknown',
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

const logDeleteOperation = async (targetId, modelName, deletedData) => {
    try {
        await logOperation(
            DEFAULT_USER_ID,
            targetId,
            modelName,
            'DELETE',
            {
                deletedEntity: deletedData
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