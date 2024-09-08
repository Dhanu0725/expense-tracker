import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageExpenses from './pages/ManageExpenses';
import ManageBudgets from './pages/ManageBudgets';
import MonthlyReport from './pages/MonthlyReport';
import AnnualReport from './pages/AnnualReport';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-expenses" element={<ManageExpenses />} />
            <Route path="/manage-budgets" element={<ManageBudgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/monthly" element={<MonthlyReport />} />
            <Route path="/reports/annual" element={<AnnualReport />} />
            <Route path="/reports/analytics" element={<Analytics />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
