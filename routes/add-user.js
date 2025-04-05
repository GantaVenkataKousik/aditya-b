const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const { logCreateOperation, logUpdateOperation } = require('../utils/operationLogger');

// Create new user
router.post('/', async (req, res) => {
    try {
        const userData = req.body;

        // Create new user
        const newUser = await User.create(userData);

        // Log the create operation
        await logCreateOperation(newUser._id, 'User', {
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
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        // Find existing user
        const originalUser = await User.findById(id);
        if (!originalUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        // Log update operation
        await logUpdateOperation(id, 'User', originalUser.toObject(), userData);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;