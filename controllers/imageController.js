const Image = require('../models/ImageModel');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

// Upload image to specific section
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const { sectionType, sectionId, itemIndex = -1, caption = '' } = req.body;
        const userId = req.user.id; // Assuming you have user in req from auth middleware

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path, `faculty_images/${sectionType}`);

        // Remove temporary file
        fs.unlinkSync(req.file.path);

        // Create image document
        const newImage = new Image({
            userId,
            sectionType,
            sectionId,
            itemIndex: parseInt(itemIndex),
            cloudinaryId: result.public_id,
            url: result.url,
            caption
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newImage
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
    }
};

// Get all images for a specific section and item
const getImagesForSection = async (req, res) => {
    try {
        const { sectionType, sectionId, itemIndex = -1 } = req.query;
        const userId = req.user.id;

        const query = {
            userId,
            sectionType
        };

        if (sectionId) {
            query.sectionId = sectionId;
        }

        if (itemIndex !== -1) {
            query.itemIndex = parseInt(itemIndex);
        }

        const images = await Image.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: images.length,
            images
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images', error: error.message });
    }
};

// Get all images for a user across all sections
const getAllUserImages = async (req, res) => {
    try {
        const userId = req.user.id;

        const images = await Image.find({ userId }).sort({ createdAt: -1 });

        // Group by section type
        const groupedImages = images.reduce((acc, image) => {
            if (!acc[image.sectionType]) {
                acc[image.sectionType] = [];
            }
            acc[image.sectionType].push(image);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            count: images.length,
            images: groupedImages
        });
    } catch (error) {
        console.error('Error fetching all images:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images', error: error.message });
    }
};

// Delete an image
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const image = await Image.findOne({ _id: id, userId });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(image.cloudinaryId);

        // Delete from database
        await Image.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
    }
};

module.exports = {
    uploadImage,
    getImagesForSection,
    getAllUserImages,
    deleteImage
}; 