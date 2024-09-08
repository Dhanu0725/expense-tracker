// src/pages/Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Track your expenses like never before</h1>
        <p>Take control of your finances with our expense tracker</p>
        <a href="/register" className="home-register-button">Register now</a>
      </div>
      <div className="home-sections">
        <div className="home-section">
          <i className="fas fa-wallet section-icon"></i>
          <h2>Manage Your Budget</h2>
          <p>Keep track of your spending with ease.</p>
        </div>
        <div className="home-section">
          <i className="fas fa-chart-line section-icon"></i>
          <h2>Analyze Your Expenses</h2>
          <p>Get detailed insights into your spending patterns.</p>
        </div>
        <div className="home-section">
          <i className="fas fa-mobile section-icon"></i>
          <h2>Access Anywhere</h2>
          <p>Manage your finances from any device.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
