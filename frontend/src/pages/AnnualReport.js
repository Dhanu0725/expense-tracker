import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './AnnualReport.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnnualReport() {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [chartData, setChartData] = useState(null); // Change to null for better data checking
    const [noDataMessage, setNoDataMessage] = useState('');

    useEffect(() => {
        // Dynamically generate years (for example, last 5 years)
        const currentYear = new Date().getFullYear();
        const yearRange = Array.from({ length: 5 }, (e, i) => currentYear - i);
        setYears(yearRange);
    }, []);

    const fetchAnnualData = async (year) => {
        try {
            const token = localStorage.getItem('token'); // Assuming you store token in local storage
            const response = await axios.get(`http://localhost:5000/api/reports/annual?year=${year}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to headers
                },
            });

            console.log(response.data);
            const data = response.data;

            // Check if data is available and valid
            if (data && data.category && Array.isArray(data.category)) {
                const categories = data.category;
                const allocatedAmounts = data.allocatedAmount;
                const spentAmounts = data.spentAmount;

                // Check if both allocatedAmounts and spentAmounts are effectively empty
                const isDataEmpty = 
                    categories.length === 0 ||
                    allocatedAmounts.every(amount => amount === 0) ||
                    spentAmounts.every(amount => amount === 0);

                if (isDataEmpty) {
                    setNoDataMessage('No data found for this year');
                    setChartData(null); // Set to null to ensure no chart is shown
                } else {
                    setNoDataMessage('');
                    setChartData({
                        labels: categories,
                        datasets: [
                            {
                                label: 'Allocated Amount',
                                data: allocatedAmounts,
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            },
                            {
                                label: 'Spent Amount',
                                data: spentAmounts,
                                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            },
                        ],
                    });
                }
            } else {
                setNoDataMessage('No data found for this year');
                setChartData(null);
            }
        } catch (error) {
            console.error('Error fetching annual data:', error);
            setNoDataMessage('An error occurred while fetching data');
            setChartData(null);
        }
    };

    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        setSelectedYear(selectedYear);
        fetchAnnualData(selectedYear);
    };

    return (
        <div className="report-container">
            <h1>Annual Report</h1>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">-- Select a year --</option>
                {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>

            {noDataMessage ? (
                <p>{noDataMessage}</p>
            ) : (
                chartData && chartData.labels && (
                    <div className="annual-chart-container">
                        <Bar
                            data={chartData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                )
            )}
        </div>
    );
}

export default AnnualReport;
