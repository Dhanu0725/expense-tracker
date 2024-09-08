const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const allowedCategories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Education',
    'Other'
];

const createExpense = async (req, res) => {
    const { date, category, amount, description } = req.body;

    // Validate category
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    try {
        // Create expense
        const newExpense = new Expense({
            user: req.user._id,
            date,
            category,
            amount,
            description
        });
        
        // Save expense to database
        await newExpense.save();

        // Update the budget spent amount
        await updateSpentAmount(newExpense);

        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id })
                                      .sort({ date: 1 });
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        // Find the expense by ID
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Remove the expense
        await expense.remove();

        // Find the related budget
        const budget = await Budget.findOne({
            user: req.user._id,
            startDate: { $lte: expense.date },
            endDate: { $gte: expense.date },
            'categories.name': expense.category
        });

        if (budget) {
            // Update spentAmount for the relevant category
            const budgetCategory = budget.categories.find(cat => cat.name === expense.category);
            if (budgetCategory) {
                budgetCategory.spentAmount -= expense.amount;
                // Ensure spentAmount does not go below 0
                budgetCategory.spentAmount = Math.max(budgetCategory.spentAmount, 0);
                await budget.save();
            }
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: error.message });
    }
};

  

// Function to update the spent amount in the budget
const updateSpentAmount = async (expense) => {
    try {
        if (!expense || !expense.date) {
            console.error('Expense or expense date is missing');
            return;
        }

        console.log('Updating spent amount for expense date:', expense.date);

        // Get the budgets associated with the expense date
        const budgets = await Budget.find({
            startDate: { $lte: expense.date },
            endDate: { $gte: expense.date }
        });

        if (budgets.length === 0) {
            console.error('No budgets found for date:', expense.date);
            return;
        }

        for (const budget of budgets) {
            let totalSpent = await Expense.aggregate([
                { $match: { 
                    date: { $gte: budget.startDate, $lte: budget.endDate },
                    category: { $in: budget.categories.map(cat => cat.name) } // Match expenses by category
                }},
                { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
            ]);

            totalSpent = totalSpent.length > 0 ? totalSpent[0].totalSpent : 0;

            const result = await Budget.findByIdAndUpdate(budget._id, { spentAmount: totalSpent }, { new: true });

            if (result) {
                console.log(`Updated budget ${budget._id} with spent amount: ${totalSpent}`);
            } else {
                console.error(`Failed to update budget ${budget._id}`);
            }
        }
    } catch (error) {
        console.error('Error updating spent amount:', error);
    }
};
  

module.exports = {
    createExpense,
    getExpenses,
    deleteExpense
};
