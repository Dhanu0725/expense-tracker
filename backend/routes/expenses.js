const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createExpense,
    getExpenses,
    deleteExpense
} = require('../controllers/expenseController');

// Add Expense route
router.post('/add', authMiddleware, createExpense);

// Get all Expenses route
router.get('/', authMiddleware, getExpenses);

// Delete Expense route
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
