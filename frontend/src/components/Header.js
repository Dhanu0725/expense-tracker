import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // Make sure this CSS file is correctly set up

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className={`header-left ${isHomePage ? 'center-align' : 'left-align'}`}>
        <Link to="/" className="header-title">Expense Tracker</Link>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="header-link">Dashboard</Link>
            <Link to="/manage-expenses" className="header-link">Manage Expenses</Link>
            <Link to="/manage-budgets" className="header-link">Manage Budgets</Link>
            <Link to="/reports" className="header-link">Reports</Link>
            <Link to="/insights" className="header-link">Insights</Link>
            <a href="#" onClick={handleLogout} className="header-link">Logout</a>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">Login</Link>
            <Link to="/register" className="header-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
