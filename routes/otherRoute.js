const express = require('express');
const router = express.Router();
const {
    updateActivityByIndex,
    deleteActivityByIndex,
    updateResponsibilityByIndex,
    deleteResponsibilityByIndex,
    updateContributionByIndex,
    deleteContributionByIndex,
    updateAwardByIndex,
    deleteAwardByIndex,
    updateOutreach,
    deleteOutreach,
    addArticle,
    addActivity,
    addAward,
    addBooks,
    addChapters,
    addContribution,
    addPapers,
    addResponsibility
} = require('../controllers/partb.js');
const Others = require('../models/othersModel');
const { logCreateOperation } = require('../utils/logger');

// Activities Routes
router.put('/activities/:id/:index', updateActivityByIndex);
router.delete('/activities/:id/:index', deleteActivityByIndex);

// Responsibilities Routes
router.put('/responsibilities/:id/:index', updateResponsibilityByIndex);
router.delete('/responsibilities/:id/:index', deleteResponsibilityByIndex);

// Contributions Routes
router.put('/contribution/:id/:index', updateContributionByIndex);
router.delete('/contribution/:id/:index', deleteContributionByIndex);

// Awards Routes
router.put('/awards/:id/:index', updateAwardByIndex);
router.delete('/awards/:id/:index', deleteAwardByIndex);

// Outreach Routes
router.put('/outreach/:id', updateOutreach);
router.delete('/outreach/:id', deleteOutreach);


router.get('/others-data', async (req, res) => {
    try {
        const userId = req.query.userId;
        const others = await Others.findOne({ userId });
        res.status(200).json({
            success: true,
            others,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/add-article/:userId', addArticle);
router.post('/add-activity/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const activityData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, activities: [] });
        }

        otherData.activities.push(activityData);
        await otherData.save();

        // Log the created activity
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Activity',
            activityData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).json({ message: "Error adding activity" });
    }
});

router.post('/add-award/:userId', addAward);
router.post('/add-books/:userId', addBooks);
router.post('/add-chapters/:userId', addChapters);
router.post('/add-contribution/:userId', addContribution);
router.post('/add-papers/:userId', addPapers);
router.post('/add-responsibility/:userId', addResponsibility);
module.exports = router;