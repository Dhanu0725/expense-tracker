const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const reportsController = require('../controllers/reportsController');

const router = express.Router();

router.get('/monthly', authMiddleware, reportsController.getMonthlyReport);
router.get('/annual', authMiddleware, reportsController.getAnnualReport);
router.get('/analytics', authMiddleware, reportsController.getAnalyticsReport);


module.exports = router;
