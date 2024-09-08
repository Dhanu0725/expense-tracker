const Budget = require('../models/Budget');
const fixedCategories = [
    'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other'
];

// Create a new budget
const createBudget = async (req, res) => {
    try {
        const { name, monthlyIncome, startDate, endDate, categories } = req.body;
        const user = req.user._id; // Get the user ID from the request

        // Validate required fields
        if (!name || !monthlyIncome || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure that categories contain only the fixed categories
        for (const category of Object.keys(categories)) {
            if (!fixedCategories.includes(category)) {
                return res.status(400).json({ message: `Invalid category: ${category}` });
            }
        }

        // Create and save the new budget
        const newBudget = new Budget({
            name,
            monthlyIncome,
            startDate,
            endDate,
            user, // Include the user ID
            categories: fixedCategories.map(category => ({
                name: category,
                allocatedAmount: categories[category] || 0,
                spentAmount: 0 // Initialize spentAmount to 0
            }))
        });

        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        console.error('Error creating budget:', error);
        res.status(500).json({ message: 'Error creating budget' });
    }
};


// Get all budgets
const getBudgets = async (req, res) => {
    try {
        // Sort budgets by name in ascending order
        const budgets = await Budget.find().sort({ name: 1 });
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Error fetching budgets', error });
    }
};


// Update a budget
const updateBudget = async (req, res) => {
    try {
        console.log('Updating budget with ID:', req.params.id);
        console.log('Update Data:', req.body);

        const { id } = req.params;
        const updatedBudget = await Budget.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        console.log('Updated Budget:', updatedBudget);
        res.json(updatedBudget);
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a budget by ID
const deleteBudget = async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);

        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Error deleting budget', error });
    }
};

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };
