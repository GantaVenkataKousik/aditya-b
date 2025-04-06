const express = require('express');
const router = express.Router();
const Class = require('../models/class-model');
const User = require('../models/user-model');
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');
const { logCreateOperation, logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');


router.post('/courses/addclass/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const {
            courseName,
            semester,
            numberOfStudents,
            passCount,

        } = req.body;

        if (!numberOfStudents || !passCount) {
            return res.status(400).json({ error: 'numberOfStudents and passCount are required fields' });
        }

        const passPercentage = ((passCount / numberOfStudents) * 100).toFixed(2);

        // Calculate average pass percentage for all classes of the user
        const classes = await Class.find({ teacher: user._id });
        const totalPassPercentage = classes.reduce((acc, cls) => acc + cls.passPercentage, 0);
        const averagePassPercentage = classes.length > 0 ? (totalPassPercentage / classes.length).toFixed(2) : 0;
        let totalMarks = 0;
        if (averagePassPercentage >= 95) {
            totalMarks += 20;
        } else if (averagePassPercentage >= 85) {
            totalMarks += 15;
        } else {
            totalMarks += 10;
        }
        // Create a new class document
        const newClass = new Class({
            courseName,
            semester,
            numberOfStudents,
            passCount,
            passPercentage, // Calculated value

            selfAssessmentMarks: totalMarks,
            averagePercentage: averagePassPercentage,
            teacher: user._id
        });

        // Save the new class to the database
        const savedClass = await newClass.save();
        user.AvgSelfAsses = totalMarks; // Update the user's average self-assessment marks
        await user.save(); // Save the updated user document

        // Log the complete entity data
        await logCreateOperation(userId, savedClass._id, 'Class', savedClass.toObject());

        // Respond with the saved class and average pass percentage
        res.status(200).json({ success: true, message: 'Class added successfully', data: savedClass, averagePassPercentage });
    } catch (error) {
        console.error('Error saving class:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId;

        // Fetch the complete class before deleting
        const courseToDelete = await Class.findById(id);
        if (!courseToDelete) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Delete the course
        await Class.findByIdAndDelete(id);

        // Log the complete entity data
        await logDeleteOperation(userId, id, 'Class', courseToDelete.toObject());

        return res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.put('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId;

        // Fetch the original data
        const originalCourse = await Class.findById(id);
        if (!originalCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Update the course
        const updatedCourse = await Class.findByIdAndUpdate(id, req.body, { new: true });

        // Log the complete original and updated data
        await logUpdateOperation(userId, id, 'Class', originalCourse.toObject(), updatedCourse.toObject());

        return res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get("/courses/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const data = await Class.find({ teacher: userId });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Unable to fetch classes" });
    }
});







router.put('/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        const { courseName, semester, numberOfStudents, passCount } = req.body;
        const userId = req.body.updatedBy || req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }
        const updatedClass = await Class.findByIdAndUpdate(classId, { courseName, semester, numberOfStudents, passCount }, { new: true });

        if (!updatedClass) {
            console.log("No class found with ID:", classId);
            return res.status(404).json({ message: 'Class not found' });
        }

        // Log update operation
        await logUpdateOperation(userId, classId, 'Class', updatedClass.toObject(), req.body);

        res.status(200).json({ success: true, message: 'Class updated successfully', data: updatedClass });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/feedback/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Destructure only the fields that match the schema
        const {
            courseName,
            semester,
            numberOfStudents,
            feedbackPercentage,
            averagePercentage,
            selfAssessmentMarks
        } = req.body;

        // Create feedback document matching schema exactly
        const feedbackData = {
            courseName,
            semester,
            numberOfStudents: Number(numberOfStudents),
            feedbackPercentage: Number(feedbackPercentage),
            averagePercentage: Number(averagePercentage),
            selfAssessmentMarks: Number(selfAssessmentMarks),
            teacher: user._id
        };

        const newFeedback = new Feedback(feedbackData);
        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback added successfully",
            feedback: newFeedback
        });

    } catch (error) {
        console.error('Error in feedback route:', error);
        res.status(500).json({
            success: false,
            message: "Error adding feedback",
            error: error.message
        });
    }
});

router.put('/feedback/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const { courseName, semester, numberOfStudents, feedbackPercentage, averagePercentage } = req.body;
        console.log(req.body);
        const userId = req.body.updatedBy || req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { courseName, semester, numberOfStudents, feedbackPercentage, averagePercentage }, { new: true });
        res.status(200).json({ success: true, message: 'Feedback updated successfully', data: updatedFeedback });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/feedback/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }
        res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get("/feedback/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        // Fetch Feedback for the logged-in teacher
        const data = await Feedback.find({ teacher: userId });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching Feedback:", error);
        res.status(500).json({ message: "Unable to fetch Feedback" });
    }
});








router.get("/raw", async (req, res) => {
    const userId = req.query.userId;

    try {
        const data = await Class.find({ teacher: userId });

        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: "Unable to fetch classes" });
    }
});

router.post('/courses/add', async (req, res) => {
    try {
        const { courseName, semester, numberOfStudents, passCount } = req.body;
        const userId = req.body.createdBy || req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required for tracking operations' });
        }
        const newCourse = new Class({ courseName, semester, numberOfStudents, passCount });
        await newCourse.save();
        res.status(200).json({ success: true, message: 'Course added successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get("/feedback/fdata/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await Feedback.find({ teacher: userId });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Unable to fetch feedback" });
    }
});

module.exports = router;