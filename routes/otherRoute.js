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
    deleteOutreach
} = require('../controllers/partb.js');
const Others = require('../models/othersModel');
// Activities Routes
router.put('/activities/:id/:index', updateActivityByIndex);
router.delete('/activities/:id/:index', deleteActivityByIndex);

// Responsibilities Routes
router.put('/responsibilities/:id/:index', updateResponsibilityByIndex);
router.delete('/responsibilities/:id/:index', deleteResponsibilityByIndex);

// Contributions Routes
router.put('/contributions/:id/:index', updateContributionByIndex);
router.delete('/contributions/:id/:index', deleteContributionByIndex);

// Awards Routes
router.put('/awards/:id/:index', updateAwardByIndex);
router.delete('/awards/:id/:index', deleteAwardByIndex);

// Outreach Routes
router.put('/outreach/:id', updateOutreach);
router.delete('/outreach/:id', deleteOutreach);


router.get('/others/data', async (req, res) => {
    try {
        const others = await Others.find();
        res.json({
            success: true,
            data: others
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;
