import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './ManageExpenses.css';
import AddExpenseModal from '../components/AddExpenseModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const fixedCategories = [
    'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other'
];

function ManageExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [filter, setFilter] = useState('all'); // Default filter

    useEffect(() => {
        fetchExpenses();
        fetchBudgets();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [expenses, filter]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const sortedExpenses = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setExpenses(sortedExpenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/budgets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const handleAddExpenseClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleExpenseAdded = async (expense) => {
        try {
            const budget = budgets.find(b => 
                new Date(expense.date) >= new Date(b.startDate) &&
                new Date(expense.date) <= new Date(b.endDate) &&
                b.categories.some(cat => cat.name === expense.category)
            );

            if (budget) {
                const updatedCategories = budget.categories.map(cat => {
                    if (cat.name === expense.category) {
                        return {
                            ...cat,
                            spentAmount: (cat.spentAmount || 0) + expense.amount,
                        };
                    }
                    return cat;
                });

                const updatedBudget = {
                    ...budget,
                    categories: updatedCategories
                };

                await axios.put(`http://localhost:5000/api/budgets/${budget._id}`, updatedBudget, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                await fetchBudgets();
                await fetchExpenses();

                handleCloseModal();
            } else {
                console.error('No budget found for expense:', expense);
            }
        } catch (error) {
            console.error('Error updating budget after adding expense:', error);
        }
    };

    const handleDeleteExpenseClick = (expenseId) => {
        setExpenseToDelete(expenseId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setExpenseToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${expenseToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== expenseToDelete));

            await fetchBudgets();

            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const applyFilter = () => {
        const now = new Date();
        let filtered = [...expenses];

        switch (filter) {
            case '7 days':
                filtered = filtered.filter(expense => new Date(expense.date) >= new Date(now.setDate(now.getDate() - 1)));
                break;
            case '30 days':
                filtered = filtered.filter(expense => new Date(expense.date) >= new Date(now.setDate(now.getDate() - 3)));
                break;
            case '60 days':
                filtered = filtered.filter(expense => new Date(expense.date) >= new Date(now.setDate(now.getDate() - 60)));
                break;
            case '90 days':
                filtered = filtered.filter(expense => new Date(expense.date) >= new Date(now.setDate(now.getDate() - 90)));
                break;
            default:
                // No filter applied
                break;
        }

        setFilteredExpenses(filtered);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1); // Reset to the first page when filter changes
    };

    // Pagination
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="manage-expenses-container">
            <h1>Expenses</h1>
            <div className="filters">
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="7 days">Last 7 Days</option>
                    <option value="30 days">Last 30 Days</option>
                    <option value="60 days">Last 60 Days</option>
                    <option value="90 days">Last 90 Days</option>
                </select>
            </div>
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedExpenses.map((expense) => (
                        <tr key={expense._id}>
                            <td>{moment(expense.date).utc().format('MM/DD/YYYY')}</td>
                            <td>{expense.category}</td>
                            <td>${expense.amount.toFixed(2)}</td>
                            <td>{expense.description}</td>
                            <td>
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDeleteExpenseClick(expense._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add-expense-button" onClick={handleAddExpenseClick}>Add Expense</button>
            {showModal && (
                <AddExpenseModal 
                    onClose={handleCloseModal} 
                    onExpenseAdded={handleExpenseAdded} 
                />
            )}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <a 
                        key={index + 1} 
                        href="#!" 
                        onClick={() => handlePageClick(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default ManageExpenses;
