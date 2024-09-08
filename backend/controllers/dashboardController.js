// controllers/dashboardController.js

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure req.user has the correct user ID
        console.log('User ID:', userId); // Debugging log

        // Define date ranges
        const lastWeekStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last30DaysStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Fetch total income from all budgets
        const budgets = await Budget.find({ user: userId });
        const totalIncome = budgets.reduce((sum, budget) => sum + budget.monthlyIncome, 0);
        console.log('Total Income:', totalIncome); // Debugging log

        // Fetch total expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: new Date('2000-01-01') } } }, // Adjust date range if needed
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        console.log('Total Expenses:', totalExpenses); // Debugging log

        // Fetch expenses for the last week
        const lastWeekExpenses = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: lastWeekStartDate } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        console.log('Last Week Expenses:', lastWeekExpenses); // Debugging log

        // Fetch expenses for the last 30 days
        const last30DaysExpenses = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: last30DaysStartDate } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        console.log('Last 30 Days Expenses:', last30DaysExpenses); // Debugging log

        // Respond with data
        res.json({
            totalIncome,
            totalExpenses: totalExpenses[0] ? totalExpenses[0].total : 0,
            lastWeekExpenses: lastWeekExpenses[0] ? lastWeekExpenses[0].total : 0,
            last30DaysExpenses: last30DaysExpenses[0] ? last30DaysExpenses[0].total : 0,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message); // Debugging log
        res.status(500).json({ error: error.message });
    }
};
