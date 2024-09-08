const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

const getMonthlyReport = async (req, res) => {
    const { month } = req.query;
    const year = new Date().getFullYear();

    // Convert month name to month index (0-11)
    const monthIndex = new Date(Date.parse(month + " 1, 2012")).getMonth();
    
    // Start and end of the month in UTC
    const startOfMonth = new Date(Date.UTC(year, monthIndex, 1));
    const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

    console.log('Start of month:', startOfMonth);
    console.log('End of month:', endOfMonth);

    try {
        // Aggregate expenses by category
        const expenses = await Expense.aggregate([
            { $match: { date: { $gte: startOfMonth, $lte: endOfMonth }, user: mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
        ]);

        // Fetch budget information for the user
        const budget = await Budget.findOne({ user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found for the user' });
        }

        // Prepare categories and amounts
        const categories = budget.categories.map(cat => cat.name);
        const spentAmounts = categories.map(cat => {
            const expense = expenses.find(e => e._id.toString() === cat);
            return expense ? expense.totalSpent : 0;
        });

        const allocatedAmounts = categories.map(cat => {
            const category = budget.categories.find(c => c.name === cat);
            return category ? category.allocatedAmount : 0;
        });

        // Check if there's any data
        if (!spentAmounts.some(amount => amount > 0) && allocatedAmounts.every(amount => amount === 0)) {
            return res.status(404).json({ message: 'No data found for this month' });
        }

        console.log('Expenses:', expenses);
        console.log('Budget Categories:', budget.categories);
        console.log('Allocated Amounts:', allocatedAmounts);
        console.log('Spent Amounts:', spentAmounts);

        // Return the response with categories, allocated amounts, and spent amounts
        res.json({
            category: categories,
            allocatedAmount: allocatedAmounts,
            spentAmount: spentAmounts,
            monthlyIncome: budget.monthlyIncome
        });
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getAnnualReport = async (req, res) => {
    const { year } = req.query;

    // Start and end of the year in UTC
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    console.log('Start of year:', startOfYear);
    console.log('End of year:', endOfYear);

    try {
        // Aggregate expenses by category
        const expenses = await Expense.aggregate([
            { $match: { date: { $gte: startOfYear, $lte: endOfYear }, user: mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
        ]);

        // Fetch budget information for the user
        const budget = await Budget.findOne({ user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found for the user' });
        }

        // Prepare categories and amounts
        const categories = budget.categories.map(cat => cat.name);
        const spentAmounts = categories.map(cat => {
            const expense = expenses.find(e => e._id === cat);
            return expense ? expense.totalSpent : 0;
        });

        const allocatedAmounts = categories.map(cat => {
            const category = budget.categories.find(c => c.name === cat);
            return category ? category.allocatedAmount : 0;
        });

        // Check if data is available
        const isDataEmpty = 
            categories.length === 0 ||
            allocatedAmounts.every(amount => amount === 0) ||
            spentAmounts.every(amount => amount === 0);

        if (isDataEmpty) {
            return res.json({
                category: [],
                allocatedAmount: [],
                spentAmount: [],
                monthlyIncome: budget.monthlyIncome,
                message: 'No data found for this year'
            });
        }

        // Return the response with categories, allocated amounts, and spent amounts
        res.json({
            category: categories,
            allocatedAmount: allocatedAmounts,
            spentAmount: spentAmounts,
            monthlyIncome: budget.monthlyIncome
        });
    } catch (error) {
        console.error('Error fetching annual data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getAnalyticsReport = async (req, res) => {
    try {
        const userId = req.user.id;

        // Expenses by category
        const expensesByCategory = await Expense.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } },
            { $project: { category: '$_id', totalSpent: 1, _id: 0 } },
        ]);

        // Expenses over time
        const expensesOverTime = await Expense.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                    totalSpent: { $sum: '$amount' },
                },
            },
            { $project: { month: '$_id.month', year: '$_id.year', totalSpent: 1, _id: 0 } },
            { $sort: { year: 1, month: 1 } }, // Sort by date
        ]);

        res.json({
            expenseCategories: expensesByCategory,
            expensesOverTime: expensesOverTime,
        });
    } catch (error) {
        console.error('Error fetching analytics report:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


module.exports = {
    getMonthlyReport,
    getAnnualReport,
    getAnalyticsReport
};
