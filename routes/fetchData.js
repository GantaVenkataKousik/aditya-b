const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const Departments = require('../models/departments');
const Proctoring = require('../models/ProctoringModel');
const Class = require('../models/class-model'); // Adjust path as needed
const Research = require('../models/research'); // Adjust path as needed
const Feedback = require('../models/Feedback');
const Workshop = require('../models/workshops');
const Others = require('../models/othersModel');
const mongoose = require('mongoose');
const { logUpdateOperation } = require('../utils/operationLogger');

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
  const id = req.params.id;
  console.log(id);
  try {
    const proctoringData = await Proctoring.find({ teacher: id });
    const classData = await Class.find({ teacher: id });
    const researchData = await Research.find({ userId: id });
    const feedbackData = await Feedback.find({ teacher: id });
    const workshopData = await Workshop.find({ User: id });
    const othersData = await Others.find({ userId: id });

    res.json({
      success: true,
      data: {
        proctoring: proctoringData,
        classes: classData,
        research: researchData,
        feedback: feedbackData,
        workshop: workshopData,
        others: othersData,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.put("/update-field/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Get current user data before updating
    const originalUser = await User.findById(userId);
    if (!originalUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if email is being updated and already exists
    if (updateData.email && updateData.email !== originalUser.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId } // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another user"
        });
      }
    }

    // Check if EmpID is being updated and already exists
    if (updateData.EmpID && updateData.EmpID !== originalUser.EmpID) {
      const existingUser = await User.findOne({
        EmpID: updateData.EmpID,
        _id: { $ne: userId } // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Employee ID already in use by another user"
        });
      }
    }

    // Update user with the provided data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Log the update operation with complete original and updated data
    await logUpdateOperation(
      userId, // The user making the change
      userId, // The target user being updated
      'User',
      originalUser.toObject(),
      updatedUser.toObject()
    );

    return res.status(200).json({
      success: true,
      message: "User data updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user data:", error);

    // More descriptive error response
    if (error.code === 11000) {
      // Extract the duplicate key field name from the error message
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists. Please use a different value.`
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating user data",
      error: error.message
    });
  }
});

router.patch("/update-field/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { field, value } = req.body;

    const allowedFields = [
      'fullName', 'EmpID', 'designation', 'department',
      'JoiningDate', 'UG', 'UGYear', 'PG', 'PGYear',
      'Phd', 'PhdYear', 'OtherInstitution', 'OtherYear',
      'Industry', 'TExp'
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field name'
      });
    }

    const updateData = { [field]: value };
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Field updated successfully',
      user
    });
  } catch (error) {
    console.error("Error updating field:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;