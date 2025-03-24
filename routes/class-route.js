const express = require('express');
const router = express.Router();
const Class = require('../models/class-model');
const User = require('../models/user-model');
const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');


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

        // Respond with the saved class and average pass percentage
        res.status(200).json({ success: true, message: 'Class added successfully', data: savedClass, averagePassPercentage });
    } catch (error) {
        console.error('Error saving class:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete("/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await Class.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/courses/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        const { courseName, semester, numberOfStudents, passCount } = req.body;
        // Update the course    
        const updatedCourse = await Class.findByIdAndUpdate(
            classId,
            { courseName, semester, numberOfStudents, passCount },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            console.log("No course found with ID:", classId);
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ success: true, message: 'Course updated successfully', data: updatedCourse });

    } catch (error) {
        console.error('Error updating course:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
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
        const updatedClass = await Class.findByIdAndUpdate(classId, { courseName, semester, numberOfStudents, passCount }, { new: true });
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

        const {
            courseName,
            semester,
            numberOfStudents,
            feedbackpercent,
        } = req.body;

        // Convert and validate all input fields
        const feedbackPercentageNum = typeof feedbackpercent === 'string'
            ? parseFloat(feedbackpercent.replace(/[^\d.-]/g, ''))
            : parseFloat(feedbackpercent);

        const numberOfStudentsNum = typeof numberOfStudents === 'string'
            ? parseInt(numberOfStudents.replace(/[^\d]/g, ''))
            : parseInt(numberOfStudents);

        const cleanedSemester = typeof semester === 'string'
            ? semester.trim()
            : String(semester);

        const cleanedCourseName = typeof courseName === 'string'
            ? courseName.trim()
            : String(courseName);

        // Validate numeric values
        if (isNaN(feedbackPercentageNum)) {
            return res.status(400).json({
                success: false,
                message: "Invalid feedback percentage value",
                error: "Feedback percentage must be a valid number"
            });
        }

        if (isNaN(numberOfStudentsNum)) {
            return res.status(400).json({
                success: false,
                message: "Invalid number of students value",
                error: "Number of students must be a valid number"
            });
        }

        // Validate string values
        if (!cleanedCourseName) {
            return res.status(400).json({
                success: false,
                message: "Course name is required",
                error: "Course name cannot be empty"
            });
        }

        if (!cleanedSemester) {
            return res.status(400).json({
                success: false,
                message: "Semester is required",
                error: "Semester cannot be empty"
            });
        }

        // Prepare sanitized data
        const sanitizedData = {
            courseName: cleanedCourseName,
            semester: cleanedSemester,
            numberOfStudents: Math.max(0, numberOfStudentsNum), // Ensure non-negative
            feedbackPercentage: Math.min(100, Math.max(0, feedbackPercentageNum)) // Clamp between 0-100
        };

        const feedbacks = await Feedback.find({ teacher: user._id });

        const totalFeedbackPercentage = feedbacks.reduce((acc, fb) => {
            const fbPercent = parseFloat(fb.feedbackPercentage);
            return acc + (isNaN(fbPercent) ? 0 : fbPercent);
        }, 0);

        // Calculate average with validation
        const averageFeedbackPercentage = feedbacks.length > 0
            ? (totalFeedbackPercentage / feedbacks.length).toFixed(2)
            : "0.00";

        // Convert average to number with validation
        const avgPercentNum = parseFloat(averageFeedbackPercentage);
        if (isNaN(avgPercentNum)) {
            return res.status(400).json({
                success: false,
                message: "Error calculating average",
                error: "Invalid average calculation"
            });
        }

        // Calculate marks
        let totalMarks = 0;
        if (avgPercentNum >= 95) {
            totalMarks = 20;
        } else if (avgPercentNum >= 85) {
            totalMarks = 15;
        } else {
            totalMarks = 10;
        }

        // Validate final values before saving
        const feedbackData = {
            courseName: sanitizedData.courseName,
            semester: sanitizedData.semester,
            numberOfStudents: sanitizedData.numberOfStudents,
            feedbackPercentage: sanitizedData.feedbackPercentage,
            averagePercentage: Math.min(100, Math.max(0, avgPercentNum)), // Clamp between 0-100
            selfAssessmentMarks: totalMarks,
            teacher: user._id
        };

        // Update user's self assessment marks
        user.feedSelfAsses = totalMarks;
        await user.save();

        // Create and save new feedback
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
        const { courseName, semester, numberOfStudents, feedbackpercent } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { courseName, semester, numberOfStudents, feedbackpercent }, { new: true });
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