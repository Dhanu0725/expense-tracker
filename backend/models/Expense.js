const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {   
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
