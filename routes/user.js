const express = require("express");
const User = require("../models/user-model");
const router = express.Router();

// Get users grouped by designation and department
router.get("/", async (req, res) => {
    try {
        const users = await User.find({}, "fullName email designation department EmpID JoiningDate Qualification YearOfpass UG UGYear PG PGYear Phd PhdYear OtherInst OtherYear Industry TExp");

        // Group users by designation and department
        const groupedUsers = {};
        users.forEach(user => {
            const key = `${user.designation || "Unknown"} - ${user.department || "Unknown"}`;
            if (!groupedUsers[key]) groupedUsers[key] = [];
            groupedUsers[key].push(user);
        });

        res.status(200).json(groupedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update user data
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,  // Update all provided fields
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
