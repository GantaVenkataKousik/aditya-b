const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const WorkshopData = require('../models/workshops');

router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newWorkshop = new WorkshopData({
      title: req.body.title,
      Description: req.body.Description,
      Category: req.body.Category,
      Date: req.body.Date,
      StartTime: req.body.StartTime,
      EndTime: req.body.EndTime,
      Venue: req.body.Venue,
      Mode: req.body.Mode,
      OrganizedBy: req.body.OrganizedBy,
      User: user._id,
    });
    await newWorkshop.save();

    res.status(201).json({ message: "Workshop added successfully" });

  } catch (error) {
    console.error("Error adding workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const Workshops = await WorkshopData.find({ User: userId });
    const TotalMarks = Workshops.length * 5;
    if (TotalMarks > 0) {
      user.WorkshopMarks = TotalMarks;
      await user.save();
    }
    res.status(200).json({ success: true, Workshops, TotalMarks });

  } catch (error) {
    console.log("Unable to fetch the data:", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const workshopId = req.params.id;
    const workshop = await WorkshopData.findByIdAndDelete(workshopId);
    res.status(200).json({ success: true, message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.put("/:id", async (req, res) => {
  try {
    const workshopId = req.params.id;
    const updatedWorkshop = await WorkshopData.findByIdAndUpdate(workshopId, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Workshop updated successfully', data: updatedWorkshop });
  } catch (error) {
    console.error("Error updating workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;