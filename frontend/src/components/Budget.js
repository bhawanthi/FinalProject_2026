import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData, formatCurrency } from '../utils/auth';
import './styles/Budget.css';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    monthlySalary: '',
    currency: 'USD'
  });
  const navigate = useNavigate();

  const fetchBudgets = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/budgets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [fetchBudgets, fetchCategories]);

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
      setEditFormData({
        name: userData.name || '',
        email: userData.email || '',
        monthlySalary: userData.monthlySalary || '',
        currency: userData.currency || 'USD'
      });
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Close profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    setShowEditProfile(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        localStorage.setItem('userData', JSON.stringify(updatedUser.user));
        setShowEditProfile(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          category: '',
          amount: '',
          period: 'monthly',
          description: ''
        });
        fetchBudgets();
        alert('Budget created successfully!');
      } else {
        const errorData = await response.text();
        alert(`Failed to create budget: ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert(`Error creating budget: ${error.message}`);
    }
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchBudgets();
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleEditBudget = (budget) => {
    // Open edit modal with budget data
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      description: budget.description || ''
    });
    setShowCreateModal(true);
  };

  const handleViewAnalytics = (budget) => {
    // Show budget analytics or navigate to detailed view
    alert(`Analytics for ${budget.name}\n\nSpent: ${formatCurrency(budget.spent || 0)}\nBudget: ${formatCurrency(budget.amount)}\nRemaining: ${formatCurrency(budget.amount - (budget.spent || 0))}\nUsage: ${Math.round(getBudgetProgressWidth(budget))}%`);
  };

  const getBudgetProgressWidth = (budget) => {
    if (!budget.spent || budget.amount === 0) return 0;
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getBudgetStatus = (budget) => {
    const percentage = getBudgetProgressWidth(budget);
    if (percentage >= 100) return 'over-budget';
    if (percentage >= 80) return 'near-limit';
    return 'on-track';
  };

  if (loading) {
    return (
      <div className="loading-dashboard">
        <div className="loading-spinner"></div>
        <p>Loading your budgets...</p>
      </div>
    );
  }

  return (
    <div className="goals-container">
      {/* Modern Navigation Header */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">
            <span className="logo-text">MONIVUE</span>
          </div>
        </div>
        <div className="nav-actions">
          <div className="nav-links">
            <button 
              className="nav-link"
              onClick={() => navigate('/home')}
            >
              <span className="nav-icon">🏠</span>
              Home
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/transactions')}
            >
              <span className="nav-icon">💰</span>
              Transactions
            </button>
            <button 
              className="nav-link active"
              onClick={() => navigate('/budgets')}
            >
              <span className="nav-icon">📊</span>
              Budgets
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/goals')}
            >
              <span className="nav-icon">🎯</span>
              Goals
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/reports')}
            >
              <span className="nav-icon">📈</span>
              Reports
            </button>
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-greeting">{getTimeOfDayGreeting()}, {user?.name}!</span>
              <div className="current-time">{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="profile-container">
            <button onClick={toggleProfileDropdown} className="profile-button">
              <div className="profile-avatar">
                <span className="avatar-text">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="profile-chevron">▼</span>
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <span className="dropdown-avatar-text">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="dropdown-info">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleEditProfile} className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  <span>Edit Profile</span>
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <span className="dropdown-icon">⏻</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="goals-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📊</span>
            Budget Management
          </h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="btn-icon">➕</span>
            Set New Budget
          </button>
        </div>

        {/* Budget Overview */}
        <div className="goals-overview">
          <div className="overview-card">
            <div className="overview-icon">📈</div>
            <div className="overview-content">
              <div className="overview-label">Active Budgets</div>
              <div className="overview-value">{budgets.length}</div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">🎯</div>
            <div className="overview-content">
              <div className="overview-label">Total Allocated</div>
              <div className="overview-value">
                {formatCurrency(budgets.reduce((sum, budget) => sum + budget.amount, 0))}
              </div>
            </div>
          </div>
          
          <div className="stat-card spent">
            <div className="stat-icon">
              <span className="icon">�</span>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">{formatCurrency(budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0))}</div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">✅</div>
            <div className="overview-content">
              <div className="overview-label">On Track</div>
              <div className="overview-value">
                {budgets.filter(budget => getBudgetStatus(budget) === 'good').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="goals-grid">
        {budgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Budgets Created Yet</h3>
            <p>Create your first budget to start tracking your spending limits</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="plus-icon">+</span>
              Create Your First Budget
            </button>
          </div>
        ) : (
          budgets.map(budget => (
            <div key={budget._id} className={`goal-card ${getBudgetStatus(budget)}`}>
              <div className="goal-header-card">
                <h3 className="goal-name">{budget.name}</h3>
                <div className="goal-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditBudget(budget)}
                    title="Edit Budget"
                  >
                    💎
                  </button>
                  <button 
                    className="action-btn analytics"
                    onClick={() => handleViewAnalytics(budget)}
                    title="View Analytics"
                  >
                    💰
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(budget._id)}
                    title="Delete Budget"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="goal-amount">
                <span className="current-amount">
                  {formatCurrency(budget.spent || 0)}
                </span>
                <span className="target-amount">
                  / {formatCurrency(budget.amount)}
                </span>
              </div>

              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${getBudgetStatus(budget)}`}
                    style={{ width: `${Math.min(getBudgetProgressWidth(budget), 100)}%` }}
                  ></div>
                </div>
                <span className="progress-percent">
                  {Math.round(getBudgetProgressWidth(budget))}% used
                </span>
              </div>

              <div className="goal-meta">
                <div className="goal-category">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{budget.category}</span>
                </div>
                <div className="goal-deadline">
                  <span className="meta-label">Period:</span>
                  <span className="meta-value">{budget.period}</span>
                </div>
              </div>

              <div className="goal-remaining">
                <span className={`remaining-amount ${getBudgetStatus(budget)}`}>
                  {formatCurrency(budget.amount - (budget.spent || 0))} remaining
                </span>
              </div>

              {budget.description && (
                <div className="goal-description">
                  {budget.description}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Budget</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="budget-form">
              <div className="form-group">
                <label>Budget Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Monthly Groceries"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Budget Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this budget..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseEditProfile()}>
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                className="close-button" 
                onClick={handleCloseEditProfile}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="edit-profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="monthlySalary">Monthly Salary</label>
                <input
                  type="number"
                  id="monthlySalary"
                  name="monthlySalary"
                  value={editFormData.monthlySalary}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">💱 Preferred Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={editFormData.currency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="GBP">🇬🇧 GBP - British Pound</option>
                  <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                  <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
                  <option value="INR">🇮🇳 INR - Indian Rupee</option>
                  <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                  <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                  <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
                  <option value="MXN">🇲🇽 MXN - Mexican Peso</option>
                  <option value="BRL">🇧🇷 BRL - Brazilian Real</option>
                  <option value="ZAR">🇿🇦 ZAR - South African Rand</option>
                  <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
                  <option value="HKD">🇭🇰 HKD - Hong Kong Dollar</option>
                  <option value="KRW">🇰🇷 KRW - South Korean Won</option>
                  <option value="SEK">🇸🇪 SEK - Swedish Krona</option>
                  <option value="NOK">🇳🇴 NOK - Norwegian Krone</option>
                  <option value="DKK">🇩🇰 DKK - Danish Krone</option>
                  <option value="PLN">🇵🇱 PLN - Polish Zloty</option>
                  <option value="THB">🇹🇭 THB - Thai Baht</option>
                  <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
                  <option value="IDR">🇮🇩 IDR - Indonesian Rupiah</option>
                  <option value="PHP">🇵🇭 PHP - Philippine Peso</option>
                  <option value="TRY">🇹🇷 TRY - Turkish Lira</option>
                  <option value="RUB">🇷🇺 RUB - Russian Ruble</option>
                  <option value="AED">🇦🇪 AED - UAE Dirham</option>
                  <option value="SAR">🇸🇦 SAR - Saudi Riyal</option>
                  <option value="EGP">🇪🇬 EGP - Egyptian Pound</option>
                  <option value="NGN">🇳🇬 NGN - Nigerian Naira</option>
                  <option value="KES">🇰🇪 KES - Kenyan Shilling</option>
                  <option value="LKR">🇱🇰 LKR - Sri Lankan Rupee</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCloseEditProfile}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;