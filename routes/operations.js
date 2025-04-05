const express = require('express');
const router = express.Router();
const { getOperationsByDay } = require('../controllers/operation-tracking-controller');

// Route for operation statistics by day with optional filters
router.get('/operations-statistics', getOperationsByDay);

module.exports = router; 