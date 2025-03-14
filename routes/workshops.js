const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const WorkshopData = require('../models/workshops');

router.post("/add", async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
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


router.get("/data", async (req, res) => {
  try {
    const UserId = req.user._id;
    const user = await User.findById(UserId);
    const Workshops = await WorkshopData.find({ User: UserId });
    const TotalMarks = Workshops.length * 5;
    if (TotalMarks > 0) {
      user.WorkshopMarks = TotalMarks;
      await user.save();
    }
    res.status(200).json({ Workshops, TotalMarks });

  } catch (error) {
    console.log("Unable to fetch the data:", error);
    res.status(500).json({ message: "Unable to fetch the data" });
  }
})


module.exports = router;