const { logOperation } = require('../controllers/operation-tracking-controller');

// Utility functions for logging operations
const logCreateOperation = async (userId, targetId, modelName, entityData) => {
    try {
        await logOperation(
            userId,
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

const logUpdateOperation = async (userId, targetId, modelName, originalData, newData) => {
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
                userId,
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

const logDeleteOperation = async (userId, targetId, modelName, deletedData) => {
    try {
        await logOperation(
            userId,
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