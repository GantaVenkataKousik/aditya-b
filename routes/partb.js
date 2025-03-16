const express = require("express");
const router = express.Router();
const { updateFeedback, deleteFeedback, updateProctoring, deleteProctoring, updateResearch, deleteResearch, updateWorkshops, deleteWorkshops, updateOutreach, deleteOutreach, updateActivityByIndex, deleteActivityByIndex, updateResponsibilityByIndex, deleteResponsibilityByIndex, updateContributionByIndex, deleteContributionByIndex, updateAwardByIndex, deleteAwardByIndex } = require('../controllers/partb');

//FEEDBACK Controllers
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);

//PROCTORING Controllers
router.put('/proctoring/:id', updateProctoring);
router.delete('/proctoring/:id', deleteProctoring);

//Research Controllers
router.put('/research/:id', updateResearch);
router.delete('/research/:id', deleteResearch);

//workshops Controllers
router.put('/workshops/:id', updateWorkshops);
router.delete('/workshops/:id', deleteWorkshops);

//OUrreach  Controllers
router.put('/outreach/:id', updateOutreach);
router.delete('/outreach/:id', deleteOutreach);

//activities Controllers
router.put('/activities/:id/:index', updateActivityByIndex);
router.delete('/activities/:id/:index', deleteActivityByIndex);

//Responsibilities Controllers
router.put('/responsibilities/:id/:index', updateResponsibilityByIndex);
router.delete('/responsibilities/:id/:index', deleteResponsibilityByIndex);

//Contribution Controllers
router.put('/contribution/:id/:index', updateContributionByIndex);
router.delete('/contribution/:id/:index', deleteContributionByIndex);

//Awards Controllers
router.put('/awards/:id/:index', updateAwardByIndex);
router.delete('/awards/:id/:index', deleteAwardByIndex);

router.get("/workshop/data", async (req, res) => {
    try {
        const userId = req.query.userId;
        const data = await Workshop.findOne({ teacher: userId });
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Unable to fetch workshops" });
    }
});

module.exports = router;