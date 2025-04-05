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
const { logOperation } = require('../controllers/operation-tracking-controller');

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
        // Get admin ID from token or default to a placeholder
        const adminId = req.user ? req.user._id : '000000000000000000000000';

        // Get original user data for tracking changes
        const originalUser = await User.findById(id);
        if (!originalUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Identify changed fields
        const changedFields = {};
        Object.keys(req.body).forEach(key => {
            if (originalUser[key] !== req.body[key]) {
                changedFields[key] = {
                    from: originalUser[key],
                    to: req.body[key]
                };
            }
        });

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        // Log operation if fields were changed
        if (Object.keys(changedFields).length > 0) {
            await logOperation(
                adminId,
                id,
                'User',
                'UPDATE',
                {
                    userId: id,
                    userName: originalUser.fullName,
                    changedFields
                }
            );
        }

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
        // Get admin ID from token
        const adminId = req.user ? req.user._id : '000000000000000000000000';

        // Get user details to include in the log
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete user
        await User.findByIdAndDelete(id);

        // Log the operation
        await logOperation(
            adminId,
            id,
            'User',
            'DELETE',
            {
                deletedUser: {
                    fullName: user.fullName,
                    email: user.email,
                    designation: user.designation,
                    department: user.department
                }
            }
        );

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