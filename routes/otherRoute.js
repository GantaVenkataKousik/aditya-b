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
const { logCreateOperation, logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');

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

// Fixed routes with complete logging

router.post('/add-article/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const articleData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Articles: [] });
        }

        otherData.Articles.push(articleData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Article',
            articleData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding article:", error);
        res.status(500).json({ message: "Error adding article" });
    }
});

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

router.post('/add-award/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const awardData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Awards: [] });
        }

        otherData.Awards.push(awardData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Award',
            awardData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding award:", error);
        res.status(500).json({ message: "Error adding award" });
    }
});

router.post('/add-books/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Books: [] });
        }

        otherData.Books.push(bookData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Book',
            bookData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Error adding book" });
    }
});

router.post('/add-chapters/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const chapterData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Chapters: [] });
        }

        otherData.Chapters.push(chapterData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Chapter',
            chapterData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding chapter:", error);
        res.status(500).json({ message: "Error adding chapter" });
    }
});

router.post('/add-contribution/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const contributionData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Contribution: [] });
        }

        otherData.Contribution.push(contributionData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Contribution',
            contributionData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding contribution:", error);
        res.status(500).json({ message: "Error adding contribution" });
    }
});

router.post('/add-papers/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const paperData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Papers: [] });
        }

        otherData.Papers.push(paperData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Paper',
            paperData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding paper:", error);
        res.status(500).json({ message: "Error adding paper" });
    }
});

router.post('/add-responsibility/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const responsibilityData = req.body;

        let otherData = await Others.findOne({ userId });
        if (!otherData) {
            otherData = new Others({ userId, Responsibilities: [] });
        }

        otherData.Responsibilities.push(responsibilityData);
        await otherData.save();

        // Log the create operation
        await logCreateOperation(
            userId,
            otherData._id,
            'Others.Responsibility',
            responsibilityData
        );

        res.status(201).json({ success: true, data: otherData });
    } catch (error) {
        console.error("Error adding responsibility:", error);
        res.status(500).json({ message: "Error adding responsibility" });
    }
});

module.exports = router;