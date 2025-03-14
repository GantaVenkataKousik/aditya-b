const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, getImagesForSection, getAllUserImages, deleteImage } = require('../controllers/imageController');
const auth = require('../middleware/auth'); // Your auth middleware

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Routes
router.post('/upload', auth, upload.single('image'), uploadImage);
router.get('/section', auth, getImagesForSection);
router.get('/all', auth, getAllUserImages);
router.delete('/:id', auth, deleteImage);

module.exports = router; 