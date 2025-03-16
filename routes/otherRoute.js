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
    addPapers
} = require('../controllers/partb.js');
const Others = require('../models/othersModel');
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
        res.json({
            success: true,
            others,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/add-article', addArticle);
router.post('/add-activity', addActivity);
router.post('/add-award', addAward);
router.post('/add-books', addBooks);
router.post('/add-chapters', addChapters);
router.post('/add-contribution', addContribution);
router.post('/add-papers', addPapers);
module.exports = router;
