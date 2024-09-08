const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const authMiddleware = require('../middleware/authMiddleware');


// Route to get top expense categories
router.get('/top-categories', authMiddleware, insightsController.getTopCategories);

module.exports = router;
