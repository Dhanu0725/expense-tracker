import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import './Analytics.css'; // Create a new CSS file for styling

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const getMonthYearLabel = (monthNumber, year) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // JavaScript months are 0-indexed
    const monthName = date.toLocaleString('default', { month: 'long' }); // Returns full month name
    return `${monthName} ${year}`; // Combine month name and year
};

const Analytics = () => {
    const [categoryData, setCategoryData] = useState({});
    const [timeData, setTimeData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/reports/analytics', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;

                // Expenses by Category
                setCategoryData({
                    labels: data.expenseCategories?.map(item => item.category) || [], // Check if data exists, otherwise use empty array
                    datasets: [{
                        label: 'Toral Amount',
                        data: data.expenseCategories?.map(item => item.totalSpent) || [],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }],
                });

                // Expenses over Time
                setTimeData({
                    labels: data.expensesOverTime?.map(item => getMonthYearLabel(item.month, item.year)) || [], // Convert month and year to label
                    datasets: [{
                        label: 'Total Amount',
                        data: data.expensesOverTime?.map(item => item.totalSpent) || [],
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    }],
                });

                setLoading(false); // Data fetched successfully
            } catch (error) {
                setError('Error fetching analytics data');
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="analytics-container">
            <h2>Spending Trends</h2>

            <div className="chart-container">
                <h3>Expenses by Category</h3>
                {/* Render Bar chart only if categoryData has labels */}
                {categoryData.labels && categoryData.labels.length > 0 ? (
                    <Bar data={categoryData} />
                ) : (
                    <p>No data available for Expenses by Category</p>
                )}
            </div>

            <div className="chart-container">
                <h3>Expenses Over Time</h3>
                {/* Render Line chart only if timeData has labels */}
                {timeData.labels && timeData.labels.length > 0 ? (
                    <Line data={timeData} />
                ) : (
                    <p>No data available for Expenses Over Time</p>
                )}
            </div>
        </div>
    );
};

export default Analytics;
