// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [lastWeekExpenses, setLastWeekExpenses] = useState(0);
    const [last30DaysExpenses, setLast30DaysExpenses] = useState(0);
    const firstName = localStorage.getItem('firstName');

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('API Response:', response.data);
            setTotalIncome(response.data.totalIncome);
            setTotalExpenses(response.data.totalExpenses);
            setLastWeekExpenses(response.data.lastWeekExpenses);
            setLast30DaysExpenses(response.data.last30DaysExpenses);
        } catch (error) {
            console.error('Error fetching summary data:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {firstName}!</h1>
            </header>
            <main className="dashboard-content">
                <div className="overview">
                    <div className="card">
                        <h2>Total Income</h2>
                        <p>${totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="card">
                        <h2>Total Expenses</h2>
                        <p>${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="card">
                    <h2>Last Week Expenses</h2>
                        <p>${lastWeekExpenses.toFixed(2)}</p>
                    </div>
                    <div className="card">
                        <h2>Last 30 Days Expenses</h2>
                        <p>${last30DaysExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </main>
            <div className="background-image"></div>
        </div>
    );
}

export default Dashboard;
