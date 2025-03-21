const Feedback = require('../models/Feedback');
const Proctoring = require('../models/ProctoringModel');
const Research = require('../models/research');
const Workshops = require('../models/workshops');
const User = require('../models/user-model');
const Others = require('../models/othersModel.js');

//Feedback Controllers
const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(id, { semester, courseName, numberOfStudents, feedbackPercentage, averagePercentage, selfAssessmentMarks }, { new: true });
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
        const deletedFeedback = await Feedback.findByIdAndDelete(id);
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
        const { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks } = req.body;
        const updatedProctoring = await Proctoring.findByIdAndUpdate(id, { totalStudents, semesterBranchSec, eligibleStudents, passedStudents, averagePercentage, selfAssessmentMarks }, { new: true });
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
        const deletedProctoring = await Proctoring.findByIdAndDelete(id);
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
        const { title, description, publishedDate, userId, sciArticles, wosArticles, proposals, papers } = req.body;
        const updatedResearch = await Research.findByIdAndUpdate(id, { title, description, publishedDate, userId, sciArticles, wosArticles, proposals, papers }, { new: true });
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
        const deletedResearch = await Research.findByIdAndDelete(id);
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
        const { title, description, category, date, startTime, endTime, venue, mode, organizedBy } = req.body;
        const updatedWorkshops = await Workshops.findByIdAndUpdate(id, { title, description, category, date, startTime, endTime, venue, mode, organizedBy }, { new: true });
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
        const deletedWorkshops = await Workshops.findByIdAndDelete(id);
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

        res.status(200).json({
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

        res.status(200).json({
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
        const userId = req.params.userId;
        const { activityDetails, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });
        record.Activities.push({ activityDetails, UploadFiles: uploadFiles });
        await record.save();

        res.status(200).json({ success: true, message: 'Activity added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Award
const addAward = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { Award, AwardedBy, Level, Description } = req.body;
        const record = await Others.findOne({ userId });

        record.Awards.push({ Award, AwardedBy, Level, Description });
        await record.save();

        res.status(200).json({ success: true, message: 'Award added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Contribution
const addContribution = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { contributionDetails, benefit, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        record.Contribution.push({ contributionDetails, Benefit: benefit, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Contribution added successfully', contributions: record.Contribution });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addBooks = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { bookDetails, ISBN, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });


        record.Books.push({ bookDetails, ISBN, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Books added successfully', books: record.Books });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addChapters = async (req, res) => {
    try {
        const userId = req.query.userId;
        const { chapterDetails, publisher, ISBN, authorPosition, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });
        record.Chapters.push({ chapterDetails, Publisher: publisher, ISBN, authorPosition, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Chapters added successfully', chapters: record.Chapters });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addPapers = async (req, res) => {
    try {
        const userId = req.query.userId;
        const { paperDetails, authorPosition, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        record.Papers.push({ paperDetails, authorPosition, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Papers added successfully', papers: record.Papers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const addArticle = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { articleDetails, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        record.Articles.push({ articleDetails, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Article added successfully', articles: record.Articles });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const addResponsibility = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { responsibility, assignedBy, uploadFiles } = req.body;
        const record = await Others.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'User record not found' });
        }

        record.Responsibilities.push({ Responsibility: responsibility, assignedBy: assignedBy, UploadFiles: uploadFiles });
        await record.save();

        res.json({ success: true, message: 'Responsibility added successfully', responsibilities: record.Responsibilities });
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
