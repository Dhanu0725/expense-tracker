import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reports.css'; // Ensure this file exists with correct name

const Reports = () => {
    const navigate = useNavigate(); // Replacing useHistory with useNavigate
    const [reportType, setReportType] = useState('');

    const handleReportSelection = (type) => {
        setReportType(type);
        if (type === 'monthly') {
            navigate('/reports/monthly'); // Redirect to Monthly Report
        } else if (type === 'annual') {
            navigate('/reports/annual'); // Redirect to Annual Report
        }else if (type === 'analytics') {
            navigate('/reports/analytics');
        }
    };

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <div className="report-selection">
                <button onClick={() => handleReportSelection('monthly')}>Monthly Report</button>
                <button onClick={() => handleReportSelection('annual')}>Annual Report</button>
                <button onClick={() => handleReportSelection('analytics')}>Spending Trends</button>
            </div>
        </div>
    );
};

export default Reports;
