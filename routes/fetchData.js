const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const Departments = require('../models/departments');
const Proctoring = require('../models/ProctoringModel');
const Class = require('../models/class-model'); // Adjust path as needed
const Research = require('../models/research'); // Adjust path as needed
const Feedback = require('../models/Feedback');
const Workshop = require('../models/workshops');
const mongoose = require('mongoose');

// this is for profile.jsx
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/faculty', async (req, res) => {
  try {
    const facultyData = await User.find({});
    res.status(200).json(facultyData);
  }
  catch (error) {
    console.log("Unable to fetch the data:", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
});



router.get('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {

    const proctoringData = await Proctoring.find({ teacher: id });
    const classData = await Class.find({ teacher: id });
    const researchData = await Research.find({ userId: id });
    const feedbackData = await Feedback.find({ teacher: id });
    const workshopData = await Workshop.find({ User: id });
    // Log the results of each query

    res.json({
      success: true,
      data: {
        proctoring: proctoringData,
        classes: classData,
        research: researchData,
        feedback: feedbackData,
        workshop: workshopData,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;