import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddBudgetModal.css'; // Ensure this file has modal styling

const fixedCategories = [
    'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other'
];

function AddBudgetModal({ onClose, onBudgetAdded, budget }) {
    const [formData, setFormData] = useState({
        name: '',
        monthlyIncome: '',
        startDate: '',
        endDate: '',
        categories: fixedCategories.reduce((acc, category) => {
            acc[category] = 0;
            return acc;
        }, {})
    });

    useEffect(() => {
        if (budget) {
            // Populate form with existing budget data
            setFormData({
                name: budget.name,
                monthlyIncome: budget.monthlyIncome,
                startDate: budget.startDate.substring(0, 10),
                endDate: budget.endDate.substring(0, 10),
                categories: budget.categories
            });
        }
    }, [budget]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (fixedCategories.includes(name)) {
            setFormData(prevState => ({
                ...prevState,
                categories: {
                    ...prevState.categories,
                    [name]: parseFloat(value) || 0
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (budget) {
                // Update existing budget
                await axios.put(`http://localhost:5000/api/budgets/${budget._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            } else {
                // Create new budget
                await axios.post('http://localhost:5000/api/budgets', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            }
            onBudgetAdded(); // Notify parent component
            onClose(); // Close modal
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{budget ? 'Edit Budget' : 'Add Budget'}</h2>
                <span className="modal-close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Budget Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="monthlyIncome"
                        placeholder="Monthly Income"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                    <div className="category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Allocated Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixedCategories.map(category => (
                                    <tr key={category}>
                                        <td>{category}</td>
                                        <td>
                                            <input
                                                type="number"
                                                name={category}
                                                placeholder="0"
                                                value={formData.categories[category]}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}

export default AddBudgetModal;
