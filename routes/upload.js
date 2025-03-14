const express = require('express');
const upload = require('../middlewares/upload');
const Class = require('../models/class-model'); // Import your models
// Import other models as needed
const router = express.Router();

router.post('/upload/:model/:id', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { model, id } = req.params;
    const imagePath = req.file.path;

    try {
        let updatedDocument;
        switch (model) {
            case 'class':
                updatedDocument = await Class.findByIdAndUpdate(id, { imagePath }, { new: true });
                break;
            // Add cases for other models
            default:
                return res.status(400).json({ error: 'Invalid model type' });
        }

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ message: 'Image uploaded successfully', updatedDocument });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;