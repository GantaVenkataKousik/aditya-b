const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const WorkshopData = require('../models/workshops');
const { logCreateOperation, logUpdateOperation, logDeleteOperation } = require('../utils/operationLogger');


router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const workshops = await WorkshopData.find({ User: userId });

    res.status(200).json({
      success: true,
      Workshops: workshops
    });
  } catch (error) {
    console.error("Error fetching workshops:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch workshops"
    });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const workshopData = {
      ...req.body,
      User: userId,
      date: new Date(req.body.date).toISOString().split('T')[0]
    };

    const newWorkshop = new WorkshopData(workshopData);
    await newWorkshop.save();

    // Log create operation
    await logCreateOperation(userId, newWorkshop._id, 'Workshop', {
      title: newWorkshop.title || 'New workshop',
      date: newWorkshop.date,
      organizer: newWorkshop.organizer
    });

    res.status(201).json({
      success: true,
      message: "Workshop added successfully",
      workshop: newWorkshop
    });
  } catch (error) {
    console.error("Error adding workshop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add workshop"
    });
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

router.delete("/:userId/:workshopId", async (req, res) => {
  try {
    const { userId, workshopId } = req.params;

    const workshop = await WorkshopData.findOne({
      _id: workshopId,
      User: userId
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found"
      });
    }

    await WorkshopData.findByIdAndDelete(workshopId);

    // Log delete operation
    await logDeleteOperation(userId, workshopId, 'Workshop', {
      title: workshop.title,
      date: workshop.date,
      organizer: workshop.organizer
    });

    res.status(200).json({
      success: true,
      message: "Workshop deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete workshop"
    });
  }
});

router.put("/:userId/:workshopId", async (req, res) => {
  try {
    const { userId, workshopId } = req.params;
    const updateData = {
      ...req.body,
      date: new Date(req.body.date).toISOString().split('T')[0]
    };

    const workshop = await WorkshopData.findOne({
      _id: workshopId,
      User: userId
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found"
      });
    }

    const updatedWorkshop = await WorkshopData.findByIdAndUpdate(
      workshopId,
      updateData,
      { new: true }
    );

    // Log update operation
    await logUpdateOperation(userId, workshopId, 'Workshop', workshop.toObject(), updateData);

    res.status(200).json({
      success: true,
      message: "Workshop updated successfully",
      workshop: updatedWorkshop
    });
  } catch (error) {
    console.error("Error updating workshop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workshop"
    });
  }
});

// Optional: Add route for handling image uploads if needed
router.post("/:workshopId/upload-image", async (req, res) => {
  try {
    const { workshopId } = req.params;
    // Add your image upload logic here
    // Update the imagePath field in the workshop document

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image"
    });
  }
});

module.exports = router;