const express = require('express');
const router = express.Router();
const Others = require('../models/Others');

router.get('/data', async (req, res) => {
    try {
        const data = await Others.find();
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;