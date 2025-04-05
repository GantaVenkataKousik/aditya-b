const mongoose = require('mongoose');

const operationTrackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'modelName',
        required: true
    },
    modelName: {
        type: String,
        required: true,
        enum: ['User', 'Class', 'LoginTracking', 'Proctoring', 'Feedback', 'Research', 'Workshop', 'Others', 'Article', 'Responsibility', 'Contribution', 'Award']
    },
    operation: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE']
    },
    details: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create indexes for better query performance
operationTrackingSchema.index({ userId: 1 });
operationTrackingSchema.index({ timestamp: 1 });
operationTrackingSchema.index({ modelName: 1 });
operationTrackingSchema.index({ operation: 1 });

const OperationTracking = mongoose.model('OperationTracking', operationTrackingSchema);

module.exports = OperationTracking; 