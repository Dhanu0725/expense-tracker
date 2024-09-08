// src/components/AddExpenseModal.js

import React, { useState } from 'react';
import './AddExpenseModal.css';

const categories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Education',
    'Other'
];

function AddExpenseModal({ onClose, onExpenseAdded }) {
    const [date, setDate] = useState('');
    const [category, setCategory] = useState(''); // Default to first category
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/expenses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    date,
                    category,
                    amount,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add expense');
            }

            const newExpense = await response.json();
            onExpenseAdded(newExpense);
            onClose(); // Close modal after successful submission
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="expense-modal-content">
            <span className="modal-close" onClick={onClose}>&times;</span>
                <h2>Add Expense</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <select
                        value={category}
                        placeholder="Category"
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <textarea
                        value={description}
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    />
                    <button className='add-expense' type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
}

export default AddExpenseModal;