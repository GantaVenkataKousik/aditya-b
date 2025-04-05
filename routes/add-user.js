const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const { logCreateOperation, logUpdateOperation } = require('../utils/operationLogger');

// Create new user
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        const userId = req.body.createdBy || req.query.userId; // Get userId from body or query

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Create new user
        const newUser = await User.create(userData);

        // Log the create operation
        await logCreateOperation(userId, newUser._id, 'User', {
            fullName: newUser.fullName,
            email: newUser.email,
            designation: newUser.designation,
            department: newUser.department
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT route for updating user
router.put('/', async (req, res) => {
    try {
        const userData = req.body;
        const userId = req.body.updatedBy || req.query.userId; // Get userId from body or query
        const id = userData._id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Find existing user
        const originalUser = await User.findById(id);
        if (!originalUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        // Log update operation
        await logUpdateOperation(userId, id, 'User', originalUser.toObject(), userData);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;