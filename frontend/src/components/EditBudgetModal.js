import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddBudgetModal.css'; // Ensure this file has modal styling

const fixedCategories = [
    'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other'
];

function EditBudgetModal({ onClose, onBudgetUpdated, budget }) {
    const [formData, setFormData] = useState({
        name: '',
        monthlyIncome: '',
        startDate: '',
        endDate: '',
        categories: fixedCategories.reduce((acc, category) => {
            acc[category] = { allocatedAmount: 0 };
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
                categories: budget.categories.reduce((acc, cat) => {
                    acc[cat.name] = {
                        allocatedAmount: cat.allocatedAmount || 0,
                    };
                    return acc;
                }, {})
            });
        }
    }, [budget]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (fixedCategories.includes(name)) {
            // Log the value change for allocatedAmount
            console.log(`Changing ${name} allocatedAmount to:`, value);
    
            setFormData(prevState => ({
                ...prevState,
                categories: {
                    ...prevState.categories,
                    [name]: {
                        ...prevState.categories[name],
                        allocatedAmount: parseFloat(value) || 0  // Capture allocatedAmount as number
                    }
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
            const updatedBudgetData = {
                name: formData.name,
                monthlyIncome: parseFloat(formData.monthlyIncome),
                startDate: formData.startDate,
                endDate: formData.endDate,
                categories: fixedCategories.map(categoryName => ({
                    name: categoryName,
                    allocatedAmount: parseFloat(formData.categories[categoryName]?.allocatedAmount || 0),
                }))
            };
    
            console.log('Sending updated budget data:', updatedBudgetData);
    
            await axios.put(`http://localhost:5000/api/budgets/${budget._id}`, updatedBudgetData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            onBudgetUpdated(); // Notify parent component
            onClose(); // Close modal
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };    
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Budget</h2>
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
                                                value={formData.categories[category]?.allocatedAmount || 0}
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className='save-button' type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}

export default EditBudgetModal;
