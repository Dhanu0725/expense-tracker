const express = require('express');
const router = express.Router();
const {
    createBudget,
    getBudgets,
    updateBudget,   
    deleteBudget,
} = require('../controllers/manageBudgetsController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth middleware applied to all routes
router.use(authMiddleware);

router.post('/', createBudget);
router.get('/', getBudgets);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
