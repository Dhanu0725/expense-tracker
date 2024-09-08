// routes/dashboardRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Apply authMiddleware to routes that need authentication
router.get('/dashboard', authMiddleware, dashboardController.getDashboardData);

module.exports = router;
