const mongoose = require('mongoose');

const loginTrackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    loginCount: {
        type: Number,
        default: 1
    },
    // Optional additional fields
    ipAddress: String,
    userAgent: String,
    device: String
});

// Create indexes for better query performance
loginTrackingSchema.index({ date: 1 });
loginTrackingSchema.index({ designation: 1 });
loginTrackingSchema.index({ userId: 1 });

const LoginTracking = mongoose.model('LoginTracking', loginTrackingSchema);

module.exports = LoginTracking; 