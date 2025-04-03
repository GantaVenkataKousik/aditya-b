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

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete all references to this user from other collections
        await Promise.all([
            // Delete login tracking data
            LoginTracking.deleteMany({ userId: id }),

            // Remove user from classes (either delete or update references)
            Class.updateMany({ instructor: id }, { $unset: { instructor: 1 } }),

            // Delete proctoring records
            Proctoring.deleteMany({ faculty: id }),

            // Delete feedback records
            Feedback.deleteMany({ faculty: id }),

            // Delete research entries
            Research.deleteMany({ faculty: id }),

            // Delete workshop records
            Workshop.deleteMany({ faculty: id }),

            // Delete other model records
            Others.deleteMany({ faculty: id }),

            // Delete articles
            Article.deleteMany({ author: id }),

            // Delete responsibilities
            Responsibility.deleteMany({ faculty: id }),

            // Delete contributions
            Contribution.deleteMany({ faculty: id }),

            // Delete awards
            Award.deleteMany({ faculty: id })
        ]);

        // Finally, delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User and all associated records deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user and associated records',
            error: error.message
        });
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