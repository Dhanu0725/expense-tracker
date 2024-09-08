import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import AddBudgetModal from '../components/AddBudgetModal'; // Adjust path if needed
import EditBudgetModal from '../components/EditBudgetModal'; // Adjust path if needed
import './ManageBudgets.css'; // Ensure the correct path for your CSS

const fixedCategories = [
    'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Other'
];

const ManageBudgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [budgetDetails, setBudgetDetails] = useState(null);
    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
    const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/budgets', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgetDetails = async (budgetId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/budgets/${budgetId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBudgetDetails(response.data);
        } catch (error) {
            console.error('Error fetching budget details:', error);
        }
    };

    useEffect(() => {
        if (budgetDetails) {
            fetchBudgetDetails(budgetDetails._id);
        }
    }, [budgetDetails]);

    const handleAddBudgetClick = () => {
        setShowAddBudgetModal(true);
    };

    const handleEditBudgetClick = (budget) => {
        setSelectedBudget(budget._id);
        setShowEditBudgetModal(true);
    };

    const handleSelectBudget = (budgetId) => {
        const selected = budgets.find(budget => budget._id === budgetId);
        setBudgetDetails(selected);
    };

    const handleDeleteBudgetClick = async (budgetId) => {
        try {
            await axios.delete(`http://localhost:5000/api/budgets/${budgetId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Update the list of budgets after deletion
            setBudgets(prevBudgets => prevBudgets.filter(budget => budget._id !== budgetId));
            setBudgetDetails(null); // Clear budget details if deleted
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const handleBudgetAdded = () => {
        setShowAddBudgetModal(false);
        fetchBudgets(); // Refetch budgets after adding a new one
    };

    const handleBudgetUpdated = () => {
        setShowEditBudgetModal(false);
        fetchBudgets(); // Refetch budgets after updating
    };

    const handleCloseModal = () => {
        setShowAddBudgetModal(false);
    };

    const handleCloseEditBudgetModal = () => {
        setShowEditBudgetModal(false);
    };

    // Pagination Logic
    const indexOfLastBudget = currentPage * itemsPerPage;
    const indexOfFirstBudget = indexOfLastBudget - itemsPerPage;
    const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);

    const totalPages = Math.ceil(budgets.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="manage-budgets-container">
            <h1>Budgets</h1>
            <button className="add-budget-button" onClick={handleAddBudgetClick}>Add Budget</button>
            <table className="budgets-table">
                <thead>
                    <tr>
                        <th>Budget Name</th>
                        <th>Monthly Income</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Select</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBudgets.map(budget => (
                        <tr key={budget._id}>
                            <td>{budget.name}</td>
                            <td>${(budget.monthlyIncome || 0).toFixed(2)}</td>
                            <td>{moment(budget.startDate).utc().format('MM/DD/YYYY')}</td>
                            <td>{moment(budget.endDate).utc().format('MM/DD/YYYY')}</td>
                            <td>
                                <input
                                    type="radio"
                                    name="selectedBudget"
                                    onChange={() => handleSelectBudget(budget._id)}
                                    checked={budgetDetails?._id === budget._id}
                                />
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleEditBudgetClick(budget)}>Edit</button>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteBudgetClick(budget._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <a 
                        key={index + 1} 
                        href="#"
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </a>
                ))}
            </div>
            {budgetDetails && (
                <div className="budget-details">
                    <h2>{budgetDetails.name} Details</h2>
                    <p>Monthly Income: ${(budgetDetails.monthlyIncome || 0).toFixed(2)}</p>
                    <p>Start Date: {moment(budgetDetails.startDate).utc().format('MM/DD/YYYY')}</p>
                    <p>End Date: {moment(budgetDetails.endDate).utc().format('MM/DD/YYYY')}</p>
                    <table className="budget-categories-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Allocated Amount</th>
                                <th>Spent Amount</th>
                                <th>Remaining Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fixedCategories.map(category => {
                                const cat = budgetDetails.categories.find(c => c.name === category);
                                return (
                                    <tr key={category}>
                                        <td>{category}</td>
                                        <td>${(cat?.allocatedAmount || 0).toFixed(2)}</td>
                                        <td>${(cat?.spentAmount || 0).toFixed(2)}</td>
                                        <td>${((cat?.allocatedAmount || 0) - (cat?.spentAmount || 0)).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {showAddBudgetModal && (
                <AddBudgetModal 
                    onClose={handleCloseModal} 
                    onBudgetAdded={handleBudgetAdded} 
                />
            )}
            {showEditBudgetModal && selectedBudget && (
                <EditBudgetModal
                    budget={budgets.find(budget => budget._id === selectedBudget)}
                    onClose={handleCloseEditBudgetModal}
                    onBudgetUpdated={handleBudgetUpdated}
                />
            )}
        </div>
    );
};

export default ManageBudgets;
