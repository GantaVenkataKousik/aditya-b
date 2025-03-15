const Feedback = require('../models/Feedback');
const Proctoring = require('../models/ProctoringModel');
const Research = require('../models/research');
const Workshops = require('../models/workshops');
const User = require('../models/user-model');
const Others = require('../models/othersModel');



//Feedback Controllers
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(id, { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks }, { new: true });
        res.json({
            success: true,
            message: 'Feedback updated successfully',
            updatedFeedback
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFeedback = await Feedback.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Feedback deleted successfully',
            deletedFeedback
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





//Proctoring Controllers
const updateProctoring = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedProctoring = await Proctoring.findByIdAndUpdate(id, { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks }, { new: true });
        res.json({
            success: true,
            message: 'Proctoring updated successfully',
            updatedProctoring
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProctoring = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProctoring = await Proctoring.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Proctoring deleted successfully',
            deletedProctoring
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Research Controllers
const updateResearch = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, publishedDate, userId, sciArticles, wosArticles, proposals, papers } = req.body;
        const updatedResearch = await Research.findByIdAndUpdate(id, { title, description, publishedDate, userId, sciArticles, wosArticles, proposals, papers }, { new: true });
        res.json({
            success: true,
            message: 'Research updated successfully',
            updatedResearch
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteResearch = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedResearch = await Research.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Research deleted successfully',
            deletedResearch
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



//Workshops Controllers
const updateWorkshops = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, date, startTime, endTime, venue, mode, organizedBy } = req.body;
        const updatedWorkshops = await Workshops.findByIdAndUpdate(id, { title, description, category, date, startTime, endTime, venue, mode, organizedBy }, { new: true });
        res.json({
            success: true,
            message: 'Workshops updated successfully',
            updatedWorkshops
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteWorkshops = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkshops = await Workshops.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Workshops deleted successfully',
            deletedWorkshops
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




//ourreach Controllers
const updateOutreach = async (req, res) => {
    try {
        const { id } = req.params;
        const { Activities } = req.body;
        const updatedOutreach = await Others.findByIdAndUpdate(id, { Activities }, { new: true });
        res.json({
            success: true,
            message: 'Outreach updated successfully',
            updatedOutreach
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const deleteOutreach = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Others.findById(id);
        record.Activities = [];
        await record.save();
        res.json({
            success: true,
            message: 'Outreach deleted successfully',
            record
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//Activities Controllers
const updateActivityByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { activityDetails } = req.body;

        // Find the record for this user
        const record = await Others.findOne({ userId: id });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Activities.length) {
            return res.status(400).json({ message: 'Invalid activity index' });
        }

        record.Activities[indexNum].activityDetails = activityDetails;

        await record.save();

        res.json({
            success: true,
            message: 'Activity updated successfully',
            updatedActivity: record.Activities[indexNum]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteActivityByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check if the index is valid
        if (index < 0 || index >= record.Activities.length) {
            return res.status(400).json({ message: 'Invalid activity index' });
        }

        // Remove the specific activity
        record.Activities.splice(index, 1);

        // Save the updated document
        await record.save();

        res.json({
            success: true,
            message: 'Activity deleted successfully',
            updatedActivities: record.Activities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Responsibilities Controllers
const updateResponsibilityByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { Responsibility, assignedBy, UploadFiles } = req.body;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Responsibilities.length) {
            return res.status(400).json({ message: 'Invalid responsibility index' });
        }

        record.Responsibilities[indexNum].Responsibility = Responsibility;
        record.Responsibilities[indexNum].assignedBy = assignedBy;
        if (UploadFiles) {
            record.Responsibilities[indexNum].UploadFiles = UploadFiles;
        }

        await record.save();

        res.json({
            success: true,
            message: 'Responsibility updated successfully',
            updatedResponsibility: record.Responsibilities[indexNum]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateContributionByIndex = async (req, res) => {
    try {
        const { id } = req.params;
        const index = parseInt(req.params.index, 10);
        const { contributionDetails, Benefit, UploadFiles } = req.body;

        // Check if index is a valid number
        if (isNaN(index)) {
            return res.status(400).json({ message: 'Invalid index format' });
        }

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (index < 0 || index >= record.Contribution.length) {
            return res.status(400).json({ message: 'Invalid contribution index' });
        }

        record.Contribution[index].contributionDetails = contributionDetails;
        record.Contribution[index].Benefit = Benefit;
        if (UploadFiles) {
            record.Contribution[index].UploadFiles = UploadFiles;
        }

        await record.save();

        res.json({
            success: true,
            message: 'Contribution updated successfully',
            updatedContribution: record.Contribution[index]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAwardByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;
        const { Award, IssuingOrg, UploadFiles } = req.body;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (index < 0 || index >= record.Awards.length) {
            return res.status(400).json({ message: 'Invalid award index' });
        }

        record.Awards[index].Award = Award;
        record.Awards[index].IssuingOrg = IssuingOrg;
        if (UploadFiles) {
            record.Awards[index].UploadFiles = UploadFiles;
        }

        await record.save();

        res.json({
            success: true,
            message: 'Award updated successfully',
            updatedAward: record.Awards[index]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteAwardByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (index < 0 || index >= record.Awards.length) {
            return res.status(400).json({ message: 'Invalid award index' });
        }

        record.Awards.splice(index, 1);

        await record.save();

        res.json({
            success: true,
            message: 'Award deleted successfully',
            updatedAwards: record.Awards
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const deleteContributionByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (index < 0 || index >= record.Contribution.length) {
            return res.status(400).json({ message: 'Invalid contribution index' });
        }

        record.Contribution.splice(index, 1);

        await record.save();

        res.json({
            success: true,
            message: 'Contribution deleted successfully',
            updatedContributions: record.Contribution
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteResponsibilityByIndex = async (req, res) => {
    try {
        const { id, index } = req.params;

        // FIXED: Using userId instead of _id
        const record = await Others.findOne({ userId: id });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (index < 0 || index >= record.Responsibilities.length) {
            return res.status(400).json({ message: 'Invalid responsibility index' });
        }
        record.Responsibilities.splice(index, 1);
        await record.save();

        res.json({
            success: true,
            message: 'Responsibility deleted successfully',
            updatedResponsibilities: record.Responsibilities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    updateFeedback,
    deleteFeedback,
    updateProctoring,
    deleteProctoring,
    updateResearch,
    deleteResearch,
    updateWorkshops,
    deleteWorkshops,
    updateOutreach,
    deleteOutreach,
    updateActivityByIndex,
    deleteActivityByIndex,
    updateResponsibilityByIndex,
    deleteResponsibilityByIndex,
    updateContributionByIndex,
    deleteContributionByIndex,
    updateAwardByIndex,
    deleteAwardByIndex
};   
