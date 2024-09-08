import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import './Insights.css'; // Ensure this file is used for styling

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const Insights = () => {
    const [topCategories, setTopCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('7days');

    const fetchTopCategories = async (period) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/insights/top-categories?period=${period}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            // Check API response structure
            console.log('API Response:', data);

            setTopCategories({
                labels: data.topCategories.map(item => item.category) || [],
                datasets: [{
                    label: 'Total Amount',
                    data: data.topCategories.map(item => item.totalSpent) || [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                }],
            });

            setLoading(false);
        } catch (error) {
            setError('Error fetching top expense categories');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopCategories(selectedPeriod);
    }, [selectedPeriod]);

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const periodLabels = {
        '7days': 'Last 7 Days',
        '30days': 'Last 30 Days',
        '60days': 'Last 60 Days',
        '90days': 'Last 90 Days'
    };

    return (
        <div className="insights-container">
            <h2>Insights</h2>

            <div className="insights-dropdown-container">
                <select id="period-select" value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="60days">Last 60 Days</option>
                    <option value="90days">Last 90 Days</option>
                </select>
            </div>

            <div className="chart-container">
                <h3>Top Expense Categories</h3>
                {topCategories.labels && topCategories.labels.length > 0 ? (
                    <Pie data={topCategories} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                    <p>No data available for Top Expense Categories</p>
                )}
                <h4>{periodLabels[selectedPeriod]}</h4>
            </div>
        </div>
    );
};

export default Insights;
