const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sectionType: {
        type: String,
        enum: ['feedback', 'proctoring', 'research', 'workshops', 'outreach',
            'activities', 'responsibilities', 'contribution', 'awards', 'headLogo'],
        required: true
    },
    sectionId: {
        type: String,  // This will store the ID of the document the image is related to
        required: true
    },
    itemIndex: {
        type: Number,  // For array items, stores the index position (-1 for non-array items)
        default: -1
    },
    cloudinaryId: {
        type: String,  // Cloudinary public ID
        required: true
    },
    url: {
        type: String,  // Cloudinary URL
        required: true
    },
    caption: {
        type: String,  // Optional description
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema); 