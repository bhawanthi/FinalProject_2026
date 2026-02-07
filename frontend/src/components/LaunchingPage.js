import React, { useEffect, useState } from 'react';
import './styles/LaunchingPage.css';

const LaunchingPage = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out animation after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`launching-container ${!isVisible ? 'fade-out' : ''}`}>
      <div className="launching-content">
        <div className="logo-container">
          <div className="brand-text">
            <h1 className="brand-name">MONIVUE</h1>
            <p className="brand-tagline">TRACK. SAVE. GROW.</p>
            <p className="brand-subtitle">Your Personal Finance Command Center</p>
            <div className="brand-features">
              <span className="feature-badge">Smart Analytics</span>
              <span className="feature-badge">Goal Tracking</span>
              <span className="feature-badge">Budget Management</span>
            </div>
          </div>
        </div>
        
        <div className="loading-indicator">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Initializing your financial dashboard...</p>
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchingPage;