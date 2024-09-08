// backend/models/Budget.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allocatedAmount: {
        type: Number,
        required: true
    },
    spentAmount: { 
        type: Number, 
        default: 0 
    }
});

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    monthlyIncome: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    categories: [categorySchema] // Array of categorySchema
});

module.exports = mongoose.model('Budget', budgetSchema);
