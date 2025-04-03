const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password comparison
const jwt = require('jsonwebtoken'); // For token generation
const User = require('../models/user-model'); // Adjust the path to your User model
const LoginTracking = require('../models/login-tracking-model'); // Add this import
const { generatetoken } = require('../utils/generatetoken'); // Adjust based on your token generation logic
const { getLoginsByDay } = require('../controllers/login-tracking-controller');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Validate passwordy 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate token
        const token = generatetoken(user);

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access (secure from XSS)
            secure: process.env.NODE_ENV === 'production', // Use only over HTTPS in production
            sameSite: 'strict', // Prevent CSRF (restrict cross-site requests)
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years in milliseconds
        });
        res.cookie.token;

        // Track login in the database with IST date
        const utcDate = new Date();
        const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST

        await LoginTracking.create({
            userId: user._id,
            designation: user.designation,
            date: istDate,  // Store date in IST
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        // IMPORTANT: Return user ID along with token
        const assesmentMarks = {
            CouAvgPerMarks: user.CouAvgPerMarks,
            CoufeedMarks: user.CoufeedMarks,
            ProctoringMarks: user.ProctoringMarks,
            SciMarks: user.SciMarks,
            WosMarks: user.WosMarks,
            ProposalMarks: user.ProposalMarks,
            ResearchSelfAssesMarks: user.ResearchSelfAsses,
            WorkSelfAssesMarks: user.WorkSelfAsses,
            OutreachSelfAssesMarks: user.OutreachSelfAsses,
            AddSelfAssesMarks: user.AddSelfAsses,
            SpecialSelfAssesMarks: user.SpeacialSelfAsses,
        };
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            userId: user._id,
            role: user.designation,
            assesmentMarks
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// Route for login statistics by hour with optional date and designation filters
router.get('/login-statistics', getLoginsByDay);

module.exports = router;
