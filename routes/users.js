const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const LoginTracking = require('../models/login-tracking-model');
const Class = require('../models/class-model');
const Proctoring = require('../models/ProctoringModel');
const Feedback = require('../models/Feedback');
const Research = require('../models/research');
const Workshop = require('../models/workshops');
const Others = require('../models/othersModel');
const Article = require('../models/articles');
const Responsibility = require('../models/responsibilities');
const Contribution = require('../models/contributions');
const Award = require('../models/awards');
const { logCreateOperation, logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ designation: 1, department: 1 });

        // Group users by designation
        const groupedUsers = users.reduce((acc, user) => {
            const group = user.designation || 'Other';
            if (!acc[group]) acc[group] = [];
            acc[group].push(user);
            return acc;
        }, {});

        res.json(groupedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.query.userId; // Get userId from body or query

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Get original user data
        const originalUser = await User.findById(id);
        if (!originalUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        // Log the update operation
        await logUpdateOperation(userId, id, 'User', originalUser.toObject(), req.body);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId; // Get userId from query

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }

        // Get user details for logging
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete user
        await User.findByIdAndDelete(id);

        // Log the delete operation
        await logDeleteOperation(userId, id, 'User', {
            fullName: user.fullName,
            email: user.email,
            designation: user.designation,
            department: user.department,
            EmpID: user.EmpID,
            // Include any other relevant user details you want to see
        });

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

// Keep your existing route but make it a HTTP DELETE for consistency
router.delete("/old/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});

module.exports = router;