import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData, formatCurrency } from '../utils/auth';
import './styles/Reports.css';
import MoneyVueLogo from '../assets/Finance_Logo.png';

const Reports = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // Initialize user data
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch report data from backend
  const fetchReportData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/reports/analytics?period=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();
      console.log('Report data received:', data);
      console.log('Budget performance data:', data.budgetPerformance);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Failed to load report data');
      
      // Don't set fallback data - let user know there's an issue
      setReportData(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [dateRange]);

  // Fetch data when component mounts or dateRange changes
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Download PDF report
  const downloadPDF = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/reports/pdf?period=${dateRange}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('PDF report downloaded successfully!');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert(`Error generating PDF report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download Excel report
  const downloadExcel = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/reports/excel?period=${dateRange}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Excel generation failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${dateRange}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Excel report downloaded successfully!');
    } catch (err) {
      console.error('Error downloading Excel:', err);
      alert(`Error generating Excel report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate Financial Summary
  const generateSummary = async () => {
    try {
      if (!reportData || !reportData.summary) {
        alert('No report data available. Please wait for data to load or refresh the page.');
        return;
      }

      const periodLabel = dateRange === '30d' ? 'Last 30 Days' : 
                         dateRange === '90d' ? 'Last 90 Days' : 
                         dateRange === '12m' ? 'Last 12 Months' : 'Selected Period';

      const summaryContent = `FINANCIAL SUMMARY REPORT
==================================================
Period: ${periodLabel}
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
User: ${user?.name || 'User'}

FINANCIAL OVERVIEW:
==================================================
• Total Income: ${formatCurrency(reportData.summary.totalIncome || 0)}
• Total Expenses: ${formatCurrency(reportData.summary.totalExpenses || 0)}
• Net Savings: ${formatCurrency(reportData.summary.netSavings || 0)}
• Savings Rate: ${Number(reportData.summary.savingsRate || 0).toFixed(1)}%
• Total Transactions: ${reportData.summary.transactionCount || 0}

MONTHLY TRENDS:
==================================================
${reportData.monthlyTrends && reportData.monthlyTrends.length > 0 ? 
  reportData.monthlyTrends.map(trend => 
    `• ${trend.month}: Income ${formatCurrency(trend.income || 0)}, Expenses ${formatCurrency(trend.expenses || 0)}, Net ${formatCurrency(trend.savings || 0)}`
  ).join('\n') : 'No monthly trend data available for this period.'}

TOP SPENDING CATEGORIES:
==================================================
${reportData.categoryBreakdown && reportData.categoryBreakdown.length > 0 ? 
  reportData.categoryBreakdown.slice(0, 5).map(cat => 
    `• ${cat.name || 'Unknown'}: ${formatCurrency(cat.amount || 0)} (${typeof cat.percentage === 'number' ? cat.percentage.toFixed(1) : (cat.percentage || '0.0')}%)`
  ).join('\n') : 'No category spending data available for this period.'}

BUDGET PERFORMANCE:
==================================================
${reportData.budgetPerformance && reportData.budgetPerformance.length > 0 ? 
  reportData.budgetPerformance.map(budget => 
    `• ${budget.category}: Budgeted ${formatCurrency(budget.budgeted || 0)}, Spent ${formatCurrency(budget.spent || 0)} (${budget.status === 'over' ? 'Over Budget' : 'Under Budget'})`
  ).join('\n') : 'No budget performance data available.'}

==================================================
Report generated by MoneyVue Finance Tracker
Keep this information confidential and secure.
`;

      const blob = new Blob([summaryContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MoneyVue-Summary-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('✅ Financial summary downloaded successfully!');
    } catch (err) {
      console.error('Error generating summary:', err);
      alert(`❌ Error generating financial summary: ${err.message || 'Please try again.'}`);
    }
  };

  // Utility functions
  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  // Loading state
  if (loading && !reportData) {
    return (
      <div className="reports-container">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Loading your financial reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !reportData) {
    return (
      <div className="reports-container">
        <div className="error-container">
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button onClick={fetchReportData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Modern Navigation Header */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">
            <img src={MoneyVueLogo} alt="MoneyVue" className="logo-image" />
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
              <span>Home</span>
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/transactions')}
            >
              <span className="nav-icon">💳</span>
              <span>Transactions</span>
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/budgets')}
            >
              <span className="nav-icon">💼</span>
              <span>Budgets</span>
            </button>
            <button 
              className="nav-link"
              onClick={() => navigate('/goals')}
            >
              <span className="nav-icon">🎯</span>
              <span>Goals</span>
            </button>
            <button 
              className="nav-link active"
              onClick={() => navigate('/reports')}
            >
              <span className="nav-icon">📊</span>
              <span>Reports</span>
            </button>
          </div>
          
          <div className="profile-section">
            <div className="user-info">
              <span className="user-greeting">
                {getTimeOfDayGreeting()}, {user?.name}!
              </span>
              <span className="current-time">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="profile-dropdown-container">
              <button 
                className="profile-button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="profile-avatar">
                  <span className="profile-initial">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="profile-chevron">
                  {showProfileDropdown ? '▲' : '▼'}
                </span>
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
                <button onClick={() => alert('Edit Profile feature coming soon!')} className="dropdown-item">
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
        </div>
      </nav>

      {/* Reports Header */}
      <div className="reports-header">
        <h1 className="reports-title">📊 Reports & Analytics</h1>
        <p className="reports-subtitle">
          {getTimeOfDayGreeting()}, {user?.name}! Comprehensive financial analysis for better decision making.
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="date-range-selector">
        <button 
          className={`date-range-btn ${dateRange === '30d' ? 'active' : ''}`}
          onClick={() => setDateRange('30d')}
        >
          Last 30 Days
        </button>
        <button 
          className={`date-range-btn ${dateRange === '90d' ? 'active' : ''}`}
          onClick={() => setDateRange('90d')}
        >
          Last 90 Days
        </button>
        <button 
          className={`date-range-btn ${dateRange === '12m' ? 'active' : ''}`}
          onClick={() => setDateRange('12m')}
        >
          Last 12 Months
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="reports-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          📊 Charts & Graphs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          📄 Export Reports
        </button>
      </div>

      {/* Main Content */}
      <div className="reports-content">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Summary Cards */}
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card-icon">💰</div>
                <div className="summary-card-title">Total Income</div>
                <div className="summary-card-value">{formatCurrency(reportData?.summary?.totalIncome || 0)}</div>
                <div className="summary-card-change positive">+12.5% vs last period</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-icon">💸</div>
                <div className="summary-card-title">Total Expenses</div>
                <div className="summary-card-value">{formatCurrency(reportData?.summary?.totalExpenses || 0)}</div>
                <div className="summary-card-change negative">+5.2% vs last period</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-icon">💎</div>
                <div className="summary-card-title">Net Savings</div>
                <div className="summary-card-value">{formatCurrency(reportData?.summary?.netSavings || 0)}</div>
                <div className="summary-card-change positive">+18.3% vs last period</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-icon">📊</div>
                <div className="summary-card-title">Savings Rate</div>
                <div className="summary-card-value">{Number(reportData?.summary?.savingsRate || 0).toFixed(1)}%</div>
                <div className="summary-card-change positive">+2.1% vs last period</div>
              </div>
            </div>

            {/* Budget Performance */}
            <div className="chart-card">
              <div className="chart-title">🎯 Budget Performance</div>
              <div className="chart-content">
                <div className="budget-performance">
                  {reportData?.budgetPerformance?.length > 0 ? (
                    reportData.budgetPerformance.map((budget, index) => {
                      const spentPercentage = budget.budgeted > 0 ? 
                        Math.min((budget.spent / budget.budgeted) * 100, 100) : 0;
                      
                      return (
                        <div key={index} className={`budget-item ${budget.status}`}>
                          <div className="budget-category">{budget.category || 'Unknown Category'}</div>
                          <div className="budget-bars">
                            <div className="budget-bar budgeted">
                              <span>Budgeted: {budget.status === 'no-budget' ? 'Not Set' : formatCurrency(budget.budgeted || 0)}</span>
                            </div>
                            <div 
                              className={`budget-bar spent ${budget.status === 'no-budget' ? 'no-budget' : ''}`}
                              style={{ width: budget.status === 'no-budget' ? '100%' : `${spentPercentage}%` }}
                            >
                              <span>Spent: {formatCurrency(budget.spent || 0)}</span>
                            </div>
                          </div>
                          <div className={`budget-status ${budget.status}`}>
                            {budget.status === 'over' ? '⚠️ Over Budget' : 
                             budget.status === 'no-budget' ? '📝 No Budget Set' : '✅ Under Budget'}
                            <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>
                              {budget.status === 'no-budget' ? '(Create budget to track)' : `(${spentPercentage.toFixed(1)}%)`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-message">
                      <div className="no-data-icon">🎯</div>
                      <h4>No Budget Performance Data</h4>
                      <p>Create budgets and track expenses to see your budget performance!</p>
                      <button onClick={() => navigate('/budgets')} className="add-data-btn">
                        Create Budget
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="charts-tab">
            {/* Income vs Expenses Trend */}
            <div className="chart-card">
              <div className="chart-title">📈 Income vs Expenses Trend</div>
              <div className="chart-content">
                <div className="trend-chart">
                  {reportData?.monthlyTrends?.length > 0 ? (
                    reportData.monthlyTrends.map((trend, index) => {
                      const maxAmount = Math.max(
                        ...reportData.monthlyTrends.map(t => Math.max(t.income || 0, t.expenses || 0))
                      );
                      const incomeHeight = maxAmount > 0 ? ((trend.income || 0) / maxAmount) * 200 : 0;
                      const expensesHeight = maxAmount > 0 ? ((trend.expenses || 0) / maxAmount) * 200 : 0;
                      
                      return (
                        <div key={index} className="trend-bar-group">
                          <div className="trend-bars">
                            <div 
                              className="trend-bar income" 
                              style={{ height: `${incomeHeight}px` }}
                              title={`Income: ${formatCurrency(trend.income || 0)}`}
                            >
                              <span className="bar-label">Income: {formatCurrency(trend.income || 0)}</span>
                            </div>
                            <div 
                              className="trend-bar expenses" 
                              style={{ height: `${expensesHeight}px` }}
                              title={`Expenses: ${formatCurrency(trend.expenses || 0)}`}
                            >
                              <span className="bar-label">Expenses: {formatCurrency(trend.expenses || 0)}</span>
                            </div>
                          </div>
                          <div className="trend-month">{trend.month}</div>
                          <div className="trend-net" style={{ color: (trend.savings || 0) >= 0 ? '#10b981' : '#ef4444' }}>
                            Net: {formatCurrency(trend.savings || 0)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-message">
                      <div className="no-data-icon">📊</div>
                      <h4>No Transaction Data</h4>
                      <p>Start by adding some transactions to see your financial trends!</p>
                      <button onClick={() => navigate('/transactions')} className="add-data-btn">
                        Add Transactions
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Legend */}
                {reportData?.monthlyTrends?.length > 0 && (
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color income"></div>
                      <span>Income</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color expenses"></div>
                      <span>Expenses</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Spending Breakdown */}
            <div className="chart-card">
              <div className="chart-title">🏷️ Category Spending Breakdown</div>
              <div className="chart-content">
                {reportData?.categoryBreakdown?.length > 0 ? (
                  <div className="category-chart-container">
                    {/* Pie Chart Visualization */}
                    <div className="category-pie-chart">
                      <div className="pie-chart-wrapper">
                        <div className="pie-center">
                          <div className="pie-total">{formatCurrency(reportData.summary?.totalExpenses || 0)}</div>
                          <div className="pie-label">Total Spent</div>
                        </div>
                      </div>
                    </div>

                    {/* Category List */}
                    <div className="category-list">
                      {reportData.categoryBreakdown.slice(0, 6).map((category, index) => {
                        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
                        const maxAmount = Math.max(...reportData.categoryBreakdown.map(c => c.amount));
                        const fillPercentage = maxAmount > 0 ? (category.amount / maxAmount) * 100 : 0;
                        
                        return (
                          <div key={index} className="category-item">
                            <div className="category-dot" style={{ backgroundColor: colors[index % colors.length] }}></div>
                            <div className="category-info">
                              <div className="category-name">{category.name || category.category || 'Unknown Category'}</div>
                              <div className="category-stats">
                                <span className="category-amount">{formatCurrency(category.amount || 0)}</span>
                                <span className="category-percentage">{typeof category.percentage === 'number' ? category.percentage.toFixed(1) : (category.percentage || '0.0')}%</span>
                              </div>
                            </div>
                            <div className="category-bar">
                              <div 
                                className="category-fill" 
                                style={{ 
                                  width: `${fillPercentage}%`,
                                  backgroundColor: colors[index % colors.length]
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <div className="no-data-icon">🏷️</div>
                    <h4>No Category Data</h4>
                    <p>Add expense transactions with categories to see the breakdown!</p>
                    <button onClick={() => navigate('/transactions')} className="add-data-btn">
                      Add Expenses
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Savings Growth Tracker */}
            <div className="chart-card">
              <div className="chart-title">💎 Savings Growth Tracker</div>
              <div className="chart-content">
                <div className="savings-chart-container">
                  <div className="savings-chart">
                    {reportData?.monthlyTrends?.length > 0 ? (
                      reportData.monthlyTrends.map((trend, index) => {
                        const savings = (trend.income || 0) - (trend.expenses || 0);
                        const maxAmount = Math.max(
                          ...reportData.monthlyTrends.map(t => Math.abs((t.income || 0) - (t.expenses || 0)))
                        );
                        const dotPosition = maxAmount > 0 ? 
                          ((savings + maxAmount) / (2 * maxAmount)) * 100 : 50;
                        
                        return (
                          <div key={index} className="savings-point">
                            <div className="savings-line" style={{ height: `${100 - dotPosition}%` }}>
                              <div className="savings-dot-container" style={{ bottom: `${dotPosition}%` }}>
                                <div className={`savings-dot ${savings >= 0 ? 'positive' : 'negative'}`}>
                                  <div className="savings-tooltip">
                                    <div className="tooltip-amount">{formatCurrency(Math.abs(savings))}</div>
                                    <div className={`tooltip-trend ${savings >= 0 ? 'trend-up' : 'trend-down'}`}>
                                      {savings >= 0 ? '↗️ Saved' : '↘️ Deficit'}
                                      {index > 0 && (
                                        <>
                                          <br />
                                          {Math.abs(((savings - reportData.monthlyTrends[index - 1].savings) / Math.abs(reportData.monthlyTrends[index - 1].savings || 1)) * 100).toFixed(1)}%
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="savings-month">{trend.month}</div>
                            <div className={`savings-value ${savings >= 0 ? 'positive' : 'negative'}`}>
                              {formatCurrency(savings)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-data-message">
                        <div className="no-data-icon">💎</div>
                        <h4>No Savings Data</h4>
                        <p>Track your income and expenses to see savings growth!</p>
                        <button onClick={() => navigate('/transactions')} className="add-data-btn">
                          Start Tracking
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Savings Summary */}
                  {reportData?.monthlyTrends?.length > 0 && (
                    <div className="savings-summary">
                      <div className="summary-stat">
                        <div className="stat-label">Total Saved</div>
                        <div className={`stat-value ${(reportData.summary?.netSavings || 0) >= 0 ? 'positive' : ''}`}>
                          {formatCurrency(reportData.summary?.netSavings || 0)}
                        </div>
                      </div>
                      <div className="summary-stat">
                        <div className="stat-label">Average Monthly</div>
                        <div className="stat-value">
                          {formatCurrency((reportData.summary?.netSavings || 0) / (reportData.monthlyTrends?.length || 1))}
                        </div>
                      </div>
                      <div className="summary-stat">
                        <div className="stat-label">Best Month</div>
                        <div className="stat-value positive">
                          {formatCurrency(Math.max(...reportData.monthlyTrends.map(t => (t.income || 0) - (t.expenses || 0))))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Reports Tab */}
        {activeTab === 'export' && (
          <div className="export-tab">
            <div className="export-section">
              <div className="export-title">📄 Export Financial Reports</div>
              <div className="export-description">
                Generate comprehensive reports for personal record keeping, tax preparation, or financial analysis.
              </div>
              
              <div className="export-options">
                <div className="export-card">
                  <div className="export-icon">📄</div>
                  <h3>PDF Report</h3>
                  <p>Comprehensive financial summary with charts and analysis. Perfect for sharing with advisors or personal records.</p>
                  <button className="export-btn primary" onClick={downloadPDF}>
                    📄 Download PDF Report
                  </button>
                </div>
                
                <div className="export-card">
                  <div className="export-icon">📊</div>
                  <h3>Excel Spreadsheet</h3>
                  <p>Raw financial data in spreadsheet format. Ideal for detailed analysis and custom calculations.</p>
                  <button className="export-btn secondary" onClick={downloadExcel}>
                    📊 Export Excel Data
                  </button>
                </div>
                
                <div className="export-card">
                  <div className="export-icon">📈</div>
                  <h3>Financial Summary</h3>
                  <p>Quick overview report with key metrics. Great for monthly reviews.</p>
                  <button className="export-btn" onClick={generateSummary}>
                    📈 Generate Summary
                  </button>
                </div>
              </div>

              <div className="export-info">
                <h4>💡 Export Tips:</h4>
                <ul>
                  <li>PDF reports include all charts and visual analysis</li>
                  <li>Excel files contain raw transaction data for custom analysis</li>
                  <li>Reports include data for the selected time period: {dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : '12 months'}</li>
                  <li>All exported data is formatted for easy sharing and analysis</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;