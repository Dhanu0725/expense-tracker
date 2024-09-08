const Expense = require('../models/Expense'); // Adjust path as necessary
const mongoose = require('mongoose');

const getTopCategories = async (req, res) => {
    const { period } = req.query;

    // Calculate start date based on period
    const today = new Date();
    let startDate = new Date(); // Initialize startDate

    switch (period) {
        case '7days':
            startDate.setDate(today.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(today.getDate() - 30);
            break;
        case '60days':
            startDate.setDate(today.getDate() - 60);
            break;
        case '90days':
            startDate.setDate(today.getDate() - 90);
            break;
        default:
            startDate.setDate(today.getDate() - 7); // Default to last 7 days
    }

    try {
        const userId = mongoose.Types.ObjectId(req.user.id); // Ensure userId is ObjectId
        const topCategories = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: startDate } } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 } // Limit to top 5 categories
        ]);

        // Format the response
        const formattedData = {
            topCategories: topCategories.map(item => ({
                category: item._id,
                totalSpent: item.totalSpent
            }))
        };

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching top expense categories:', error); // Log error details
        res.status(500).json({ message: 'Error fetching top expense categories' });
    }
};

module.exports = { getTopCategories };
