import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import './styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle-btn ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <div className="toggle-track">
          <div className="toggle-icons">
            <span className="icon sun-icon">☀️</span>
            <span className="icon moon-icon">🌙</span>
          </div>
          <div className={`toggle-thumb ${theme === 'dark' ? 'dark' : 'light'}`}>
            {theme === 'dark' ? (
              <span className="thumb-icon">✨</span>
            ) : (
              <span className="thumb-icon">🌊</span>
            )}
          </div>
        </div>
      </button>
      <div className="theme-label">
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </div>
    </div>
  );
};

export default ThemeToggle;
