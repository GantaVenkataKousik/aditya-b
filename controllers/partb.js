const Feedback = require('../models/Feedback');
const Proctoring = require('../models/ProctoringModel');
const Research = require('../models/research');
const Workshops = require('../models/workshops');
const User = require('../models/user-model');
const Others = require('../models/othersModel.js');
const { logDeleteOperation, logUpdateOperation, logCreateOperation } = require('../utils/operationLogger');

//Feedback Controllers
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId || req.body.userId;

        // Get the original feedback data
        const originalFeedback = await Feedback.findById(id);
        if (!originalFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(id,
            { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks },
            { new: true }
        );

        // Log the update operation with complete data
        if (userId) {
            await logUpdateOperation(userId, id, 'Feedback', originalFeedback.toObject(), updatedFeedback.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get the feedback data before deletion
        const feedbackToDelete = await Feedback.findById(id);
        if (!feedbackToDelete) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        // Log the delete operation with complete data
        if (userId) {
            await logDeleteOperation(userId, id, 'Feedback', feedbackToDelete.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get original proctoring data
        const originalProctoring = await Proctoring.findById(id);
        if (!originalProctoring) {
            return res.status(404).json({ message: 'Proctoring data not found' });
        }

        const { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedProctoring = await Proctoring.findByIdAndUpdate(id,
            { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks },
            { new: true }
        );

        // Log the update operation with complete data
        if (userId) {
            await logUpdateOperation(userId, id, 'Proctoring', originalProctoring.toObject(), updatedProctoring.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get proctoring data before deletion
        const proctoringToDelete = await Proctoring.findById(id);
        if (!proctoringToDelete) {
            return res.status(404).json({ message: 'Proctoring data not found' });
        }

        const deletedProctoring = await Proctoring.findByIdAndDelete(id);

        // Log the delete operation with complete data
        if (userId) {
            await logDeleteOperation(userId, id, 'Proctoring', proctoringToDelete.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get original research data
        const originalResearch = await Research.findById(id);
        if (!originalResearch) {
            return res.status(404).json({ message: 'Research data not found' });
        }

        const { title, description, publishedDate, userId: researchUserId, sciArticles, wosArticles, proposals, papers } = req.body;
        const updatedResearch = await Research.findByIdAndUpdate(id,
            { title, description, publishedDate, userId: researchUserId, sciArticles, wosArticles, proposals, papers },
            { new: true }
        );

        // Log the update operation with complete data
        if (userId) {
            await logUpdateOperation(userId, id, 'Research', originalResearch.toObject(), updatedResearch.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get research data before deletion
        const researchToDelete = await Research.findById(id);
        if (!researchToDelete) {
            return res.status(404).json({ message: 'Research data not found' });
        }

        const deletedResearch = await Research.findByIdAndDelete(id);

        // Log the delete operation with complete data
        if (userId) {
            await logDeleteOperation(userId, id, 'Research', researchToDelete.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get original workshop data
        const originalWorkshop = await Workshops.findById(id);
        if (!originalWorkshop) {
            return res.status(404).json({ message: 'Workshop data not found' });
        }

        const { title, description, category, date, startTime, endTime, venue, mode, organizedBy } = req.body;
        const updatedWorkshops = await Workshops.findByIdAndUpdate(id,
            { title, description, category, date, startTime, endTime, venue, mode, organizedBy },
            { new: true }
        );

        // Log the update operation with complete data
        if (userId) {
            await logUpdateOperation(userId, id, 'Workshop', originalWorkshop.toObject(), updatedWorkshops.toObject());
        }

        res.status(200).json({
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
        const userId = req.query.userId || req.body.userId;

        // Get workshop data before deletion
        const workshopToDelete = await Workshops.findById(id);
        if (!workshopToDelete) {
            return res.status(404).json({ message: 'Workshop data not found' });
        }

        const deletedWorkshops = await Workshops.findByIdAndDelete(id);

        // Log the delete operation with complete data
        if (userId) {
            await logDeleteOperation(userId, id, 'Workshop', workshopToDelete.toObject());
        }

        res.status(200).json({
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
        res.status(200).json({
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
        res.status(200).json({
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
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { activityDetails } = req.body;

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Activities.length) {
            return res.status(400).json({ message: 'Invalid activity index' });
        }

        // Store original data for logging
        const originalActivity = { ...record.Activities[indexNum] };

        // Update the activity
        record.Activities[indexNum].activityDetails = activityDetails;
        await record.save();

        // Log the update operation
        if (userId) {
            await logUpdateOperation(
                userId,
                record._id,
                'Others.Activity',
                { index: indexNum, ...originalActivity },
                { index: indexNum, activityDetails }
            );
        }

        res.status(200).json({
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
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);

        // FIXED: Use findOne with userId instead of findById
        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Activities.length) {
            return res.status(400).json({ message: 'Invalid activity index' });
        }

        // Store activity before deletion for logging
        const deletedActivity = record.Activities[indexNum];

        // Remove the activity
        record.Activities.splice(indexNum, 1);
        await record.save();

        // Log the deletion if userId provided in query
        const logUserId = req.query.userId;
        if (logUserId) {
            await logDeleteOperation(logUserId, record._id, 'Others.Activity', deletedActivity);
        }

        res.status(200).json({
            success: true,
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Responsibilities Controllers
const updateResponsibilityByIndex = async (req, res) => {
    try {
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { Responsibility, assignedBy, UploadFiles } = req.body;

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Responsibilities.length) {
            return res.status(400).json({ message: 'Invalid responsibility index' });
        }

        // Store original data for logging
        const originalResponsibility = { ...record.Responsibilities[indexNum] };

        // Update the responsibility
        record.Responsibilities[indexNum].Responsibility = Responsibility;
        record.Responsibilities[indexNum].assignedBy = assignedBy;
        if (UploadFiles) {
            record.Responsibilities[indexNum].UploadFiles = UploadFiles;
        }

        await record.save();

        // Log the update operation
        if (userId) {
            await logUpdateOperation(
                userId,
                record._id,
                'Others.Responsibility',
                { index: indexNum, ...originalResponsibility },
                { index: indexNum, Responsibility, assignedBy, UploadFiles }
            );
        }

        res.status(200).json({
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
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { contributionDetails, Benefit, UploadFiles } = req.body;

        // FIXED: Using findOne with userId
        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Contribution.length) {
            return res.status(400).json({ message: 'Invalid contribution index' });
        }

        // Get original data for logging
        const originalData = { ...record.Contribution[indexNum] };

        // FIXED: Use indexNum consistently
        record.Contribution[indexNum].contributionDetails = contributionDetails;
        record.Contribution[indexNum].Benefit = Benefit;
        if (UploadFiles) {
            record.Contribution[indexNum].UploadFiles = UploadFiles;
        }

        await record.save();

        // FIXED: Log the update with both userId and record._id
        if (userId) {
            await logUpdateOperation(
                userId,
                record._id,
                'Others.Contribution',
                { index: indexNum, ...originalData },
                { index: indexNum, contributionDetails, Benefit, UploadFiles }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Contribution updated successfully',
            updatedContribution: record.Contribution[indexNum]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAwardByIndex = async (req, res) => {
    try {
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);
        const { Award, AwardedBy, Level, Description, UploadFiles } = req.body;

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Awards.length) {
            return res.status(400).json({ message: 'Invalid award index' });
        }

        // Store original data for logging
        const originalAward = { ...record.Awards[indexNum] };

        // Update the award
        record.Awards[indexNum].Award = Award;
        record.Awards[indexNum].AwardedBy = AwardedBy;
        record.Awards[indexNum].Level = Level;
        record.Awards[indexNum].Description = Description;
        if (UploadFiles) {
            record.Awards[indexNum].UploadFiles = UploadFiles;
        }

        await record.save();

        // Log the update operation
        if (userId) {
            await logUpdateOperation(
                userId,
                record._id,
                'Others.Award',
                { index: indexNum, ...originalAward },
                { index: indexNum, Award, AwardedBy, Level, Description, UploadFiles }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Award updated successfully',
            updatedAward: record.Awards[indexNum]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteAwardByIndex = async (req, res) => {
    try {
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Awards.length) {
            return res.status(400).json({ message: 'Invalid award index' });
        }

        // Store award before deletion for logging
        const deletedAward = record.Awards[indexNum];

        // Remove the award
        record.Awards.splice(indexNum, 1);
        await record.save();

        // Log the deletion
        if (userId) {
            await logDeleteOperation(userId, record._id, 'Others.Award', deletedAward);
        }

        res.status(200).json({
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
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Contribution.length) {
            return res.status(400).json({ message: 'Invalid contribution index' });
        }

        // Store contribution before deletion for logging
        const deletedContribution = record.Contribution[indexNum];

        // Remove the contribution
        record.Contribution.splice(indexNum, 1);
        await record.save();

        // Log the deletion
        if (userId) {
            await logDeleteOperation(userId, record._id, 'Others.Contribution', deletedContribution);
        }

        res.status(200).json({
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
        const { userId, index } = req.params;
        const indexNum = parseInt(index, 10);

        const record = await Others.findOne({ userId: userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (indexNum < 0 || indexNum >= record.Responsibilities.length) {
            return res.status(400).json({ message: 'Invalid responsibility index' });
        }

        // Store responsibility before deletion for logging
        const deletedResponsibility = record.Responsibilities[indexNum];

        // Remove the responsibility
        record.Responsibilities.splice(indexNum, 1);
        await record.save();

        // Log the deletion
        if (userId) {
            await logDeleteOperation(userId, record._id, 'Others.Responsibility', deletedResponsibility);
        }

        res.status(200).json({
            success: true,
            message: 'Responsibility deleted successfully',
            updatedResponsibilities: record.Responsibilities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Add Activity
const addActivity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { activityDetails, uploadFiles } = req.body;

        const record = await Others.findOne({ userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const newActivity = { activityDetails, UploadFiles: uploadFiles };
        record.Activities.push(newActivity);
        await record.save();

        // Log the create operation
        await logCreateOperation(userId, record._id, 'Others.Activity', newActivity);

        res.status(200).json({ success: true, message: 'Activity added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Award
const addAward = async (req, res) => {
    try {
        const { userId } = req.params;
        const { Award, AwardedBy, Level, Description } = req.body;

        const record = await Others.findOne({ userId });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const newAward = { Award, AwardedBy, Level, Description };
        record.Awards.push(newAward);
        await record.save();

        // Log the create operation
        await logCreateOperation(userId, record._id, 'Others.Award', newAward);

        res.status(200).json({ success: true, message: 'Award added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Contribution
const addContribution = async (req, res) => {
    try {
        const { userId } = req.params;
        const { contributionDetails, Benefit } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        const newContribution = { contributionDetails, Benefit };
        record.Contribution.push(newContribution);
        await record.save();

        // Add logging
        if (userId) {
            await logCreateOperation(userId, record._id, 'Others.Contribution', newContribution);
        }

        res.status(200).json({ success: true, message: 'Contribution added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addBooks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { bookDetails, ISBN, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });


        record.Books.push({ bookDetails, ISBN, UploadFiles: uploadFiles });
        await record.save();

        res.status(200).json({ success: true, message: 'Books added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addChapters = async (req, res) => {
    try {
        const { userId } = req.params;
        const { chapterDetails, publisher, ISBN, authorPosition, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });
        record.Chapters.push({ chapterDetails, Publisher: publisher, ISBN, authorPosition, UploadFiles: uploadFiles });
        await record.save();

        res.status(200).json({ success: true, message: 'Chapters added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addPapers = async (req, res) => {
    try {
        const { userId } = req.params;
        const { paperDetails, authorPosition, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        record.Papers.push({ paperDetails, authorPosition, UploadFiles: uploadFiles });
        await record.save();

        res.status(200).json({ success: true, message: 'Papers added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const addArticle = async (req, res) => {
    try {
        const { userId } = req.params;
        const { articleDetails, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        record.Articles.push({ articleDetails, UploadFiles: uploadFiles });
        await record.save();

        res.status(200).json({ success: true, message: 'Article added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const addResponsibility = async (req, res) => {
    try {
        const { userId } = req.params;
        const { Responsibility, AssignedBy } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        const newResponsibility = { Responsibility, AssignedBy };
        record.Responsibilities.push(newResponsibility);
        await record.save();

        // Add logging
        if (userId) {
            await logCreateOperation(userId, record._id, 'Others.Responsibility', newResponsibility);
        }

        res.status(200).json({ success: true, message: 'Responsibility added successfully' });
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
    deleteAwardByIndex,
    addActivity,
    addAward,
    addContribution,
    addBooks,
    addChapters,
    addPapers,
    addArticle,
    addResponsibility
};   
