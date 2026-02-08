const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');  
const User = require('../models/User');

// Helper functions
const getRandomColor = () => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#06b6d4', '#f97316', '#ec4899', '#6366f1', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// GET /api/reports/analytics - Comprehensive financial analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { dateRange = '30d' } = req.query;
    const userId = req.user.id;
    
    console.log(`Generating analytics for user: ${userId}, period: ${dateRange}`);

    // DEV MODE: Return mock data when database is not connected
    if (process.env.DEV_MODE === 'true' && mongoose.connection.readyState !== 1) {
      console.log('🚀 DEV MODE: Returning mock analytics data');
      
      return res.json({
        summary: {
          totalIncome: 8500.00,
          totalExpenses: 5250.75,
          netSavings: 3249.25,
          savingsRate: '38.2',
          transactionCount: 42,
          period: dateRange
        },
        monthlyTrends: [
          { month: 'Jan', income: 7500, expenses: 4200, savings: 3300 },
          { month: 'Feb', income: 8000, expenses: 4800, savings: 3200 },
          { month: 'Mar', income: 7800, expenses: 5100, savings: 2700 },
          { month: 'Apr', income: 8200, expenses: 4900, savings: 3300 },
          { month: 'May', income: 8500, expenses: 5000, savings: 3500 },
          { month: 'Jun', income: 8500, expenses: 5250.75, savings: 3249.25 }
        ],
        categoryBreakdown: [
          { category: 'Food & Dining', name: 'Food & Dining', amount: 1250.50, percentage: 23.8, color: '#ef4444' },
          { category: 'Transportation', name: 'Transportation', amount: 850.25, percentage: 16.2, color: '#3b82f6' },
          { category: 'Shopping', name: 'Shopping', amount: 720.00, percentage: 13.7, color: '#10b981' },
          { category: 'Entertainment', name: 'Entertainment', amount: 580.00, percentage: 11.0, color: '#f59e0b' },
          { category: 'Utilities', name: 'Utilities', amount: 450.00, percentage: 8.6, color: '#8b5cf6' },
          { category: 'Healthcare', name: 'Healthcare', amount: 380.00, percentage: 7.2, color: '#06b6d4' },
          { category: 'Other', name: 'Other', amount: 1020.00, percentage: 19.5, color: '#ec4899' }
        ],
        budgetPerformance: [
          { category: 'Food & Dining', budgeted: 1500, spent: 1250.50, remaining: 249.50, percentage: 83.4, status: 'under' },
          { category: 'Transportation', budgeted: 800, spent: 850.25, remaining: -50.25, percentage: 106.3, status: 'over' },
          { category: 'Shopping', budgeted: 1000, spent: 720.00, remaining: 280.00, percentage: 72.0, status: 'under' },
          { category: 'Entertainment', budgeted: 500, spent: 580.00, remaining: -80.00, percentage: 116.0, status: 'over' },
          { category: 'Utilities', budgeted: 500, spent: 450.00, remaining: 50.00, percentage: 90.0, status: 'under' }
        ],
        insights: [
          {
            type: 'positive',
            title: 'Excellent Savings Rate! 🎉',
            description: "You're saving 38.2% of your income, which exceeds the recommended 20%. Keep up the great work!",
            icon: '💰',
            priority: 'high'
          },
          {
            type: 'warning',
            title: '2 Budget(s) Exceeded 📈',
            description: "You're over budget by $130.25 across 2 categories.",
            icon: '💸',
            priority: 'high'
          },
          {
            type: 'info',
            title: 'Top Expense: Food & Dining',
            description: 'Food & Dining accounts for 23.8% of your total expenses ($1,250.50).',
            icon: '🍽️',
            priority: 'medium'
          },
          {
            type: 'info',
            title: 'Active Financial Life 📱',
            description: 'You have 42 transactions this period. Your financial activity is well documented!',
            icon: '📊',
            priority: 'low'
          }
        ],
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: userId,
          userName: 'Demo User',
          period: dateRange
        }
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '12m':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    console.log('Date range:', { startDate, endDate });

    // First try to fetch user data
    const user = await User.findById(userId);
    console.log('User found:', user ? user.name : 'Not found');

    // Fetch transactions with error handling
    let transactions = [];
    try {
      transactions = await Transaction.find({ 
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });
      console.log('Transactions found:', transactions.length);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }

    // Fetch budgets with error handling
    let budgets = [];
    try {
      budgets = await Budget.find({ userId: userId });
      console.log('Budgets found:', budgets.length);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }

    // Fetch goals with error handling
    let goals = [];
    try {
      goals = await Goal.find({ userId: userId });
      console.log('Goals found:', goals.length);
    } catch (err) {
      console.error('Error fetching goals:', err);
    }

    // Calculate financial summary
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    console.log('Financial summary calculated:', { totalIncome, totalExpenses, netSavings });

    // Monthly trends analysis (simplified for debugging)
    const monthlyTrends = [];
    try {
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - i, 1);
        monthStart.setHours(0, 0, 0, 0);
        
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthStart.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);

        const monthTransactions = transactions.filter(t => 
          t.date && t.date >= monthStart && t.date <= monthEnd
        );

        const monthIncome = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const monthExpenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        monthlyTrends.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          income: monthIncome,
          expenses: monthExpenses,
          savings: monthIncome - monthExpenses
        });
      }
      console.log('Monthly trends calculated:', monthlyTrends.length, 'months');
    } catch (err) {
      console.error('Error calculating monthly trends:', err);
    }

    // Category spending analysis
    let categoryBreakdown = [];
    try {
      const categoryMap = {};
      transactions
        .filter(t => t.type === 'expense' && t.category && t.amount)
        .forEach(t => {
          if (!categoryMap[t.category]) {
            categoryMap[t.category] = 0;
          }
          categoryMap[t.category] += t.amount;
        });

      categoryBreakdown = Object.entries(categoryMap)
        .map(([category, amount]) => ({
          category,
          name: category, // Add name field for frontend compatibility
          amount,
          percentage: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0,
          color: getRandomColor()
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      console.log('Category breakdown calculated:', categoryBreakdown.length, 'categories');
    } catch (err) {
      console.error('Error calculating category breakdown:', err);
    }

    // Budget performance analysis
    const budgetPerformance = [];
    
    console.log('Processing budgets for performance:', budgets.length, 'budgets found');
    console.log('Budget sample:', budgets[0] ? JSON.stringify(budgets[0], null, 2) : 'No budgets');
    
    // Process each budget and its categories
    budgets.forEach(budget => {
      console.log('Processing budget:', budget.name, 'with categories:', budget.categories?.length || 0);
      
      if (budget.categories && budget.categories.length > 0) {
        budget.categories.forEach(categoryBudget => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.category === categoryBudget.category)
            .reduce((sum, t) => sum + t.amount, 0);
          
          const budgeted = categoryBudget.budgetedAmount || 0;
          const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 100 : 0);
          
          console.log(`Category ${categoryBudget.category}: budgeted=${budgeted}, spent=${spent}, percentage=${percentage}`);
          
          budgetPerformance.push({
            category: categoryBudget.category,
            budgeted: budgeted,
            spent: spent,
            remaining: budgeted - spent,
            percentage: Number(percentage.toFixed(1)),
            status: percentage > 100 || (budgeted === 0 && spent > 0) ? 'over' : 'under'
          });
        });
      } else {
        // If no categories, create a default entry for the budget
        const spent = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const budgeted = budget.totalBudget || 0;
        const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 100 : 0);
        
        console.log(`Total budget: budgeted=${budgeted}, spent=${spent}, percentage=${percentage}`);
        
        budgetPerformance.push({
          category: budget.name || 'Total Budget',
          budgeted: budgeted,
          spent: spent,
          remaining: budgeted - spent,
          percentage: Number(percentage.toFixed(1)),
          status: percentage > 100 || (budgeted === 0 && spent > 0) ? 'over' : 'under'
        });
      }
    });
    
    console.log('Budget performance calculated:', budgetPerformance.length, 'items');
    
    // If no budget performance data, create a sample entry to show the user what it would look like
    if (budgetPerformance.length === 0 && transactions.length > 0) {
      // Calculate total expenses by category
      const expensesByCategory = {};
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          const category = t.category || 'Uncategorized';
          expensesByCategory[category] = (expensesByCategory[category] || 0) + t.amount;
        });

      // Create budget performance entries for categories with expenses
      Object.entries(expensesByCategory).forEach(([category, spent]) => {
        budgetPerformance.push({
          category: category,
          budgeted: 0,
          spent: spent,
          remaining: -spent,
          percentage: 100, // Show as 100% to indicate spending without budget
          status: 'no-budget'
        });
      });
    }

    // Financial insights generation
    const insights = [];

    // Savings rate insight
    if (savingsRate >= 20) {
      insights.push({
        type: 'positive',
        title: 'Excellent Savings Rate! 🎉',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income, which exceeds the recommended 20%. Keep up the great work!`,
        icon: '💰',
        priority: 'high'
      });
    } else if (savingsRate >= 10) {
      insights.push({
        type: 'info',
        title: 'Good Savings Progress 📈',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Try to reach the recommended 20% savings rate.`,
        icon: '💡',
        priority: 'medium'
      });
    } else if (savingsRate >= 0) {
      insights.push({
        type: 'warning',
        title: 'Improve Your Savings ⚠️',
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reducing expenses or increasing income to save more.`,
        icon: '📊',
        priority: 'high'
      });
    } else {
      insights.push({
        type: 'error',
        title: 'Spending More Than Earning! 🚨',
        description: `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than you earn. Immediate budget review needed.`,
        icon: '⚠️',
        priority: 'critical'
      });
    }

    // Category spending insights
    if (categoryBreakdown.length > 0) {
      const topCategory = categoryBreakdown[0];
      if (topCategory.percentage > 40) {
        insights.push({
          type: 'warning',
          title: `High ${topCategory.category} Spending 🔍`,
          description: `${topCategory.category} accounts for ${topCategory.percentage}% of your expenses. Consider reviewing this category.`,
          icon: '📊',
          priority: 'medium'
        });
      }
    }

    // Budget performance insights
    const overBudgetCategories = budgetPerformance.filter(b => b.status === 'over');
    if (overBudgetCategories.length > 0) {
      const totalOverBudget = overBudgetCategories.reduce((sum, b) => sum + Math.abs(b.remaining), 0);
      insights.push({
        type: 'warning',
        title: `${overBudgetCategories.length} Budget(s) Exceeded 📈`,
        description: `You're over budget by ${formatCurrency(totalOverBudget)} across ${overBudgetCategories.length} categories.`,
        icon: '💸',
        priority: 'high'
      });
    }

    // Transaction volume insight
    if (transactions.length > 100) {
      insights.push({
        type: 'info',
        title: 'Active Financial Life 📱',
        description: `You have ${transactions.length} transactions this period. Your financial activity is well documented!`,
        icon: '📊',
        priority: 'low'
      });
    }

    // Income growth insight (if we have previous data)
    if (monthlyTrends.length >= 2) {
      const currentMonth = monthlyTrends[monthlyTrends.length - 1];
      const previousMonth = monthlyTrends[monthlyTrends.length - 2];
      const incomeGrowth = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
      
      if (incomeGrowth > 5) {
        insights.push({
          type: 'positive',
          title: 'Income Growth Detected! 📈',
          description: `Your income increased by ${incomeGrowth.toFixed(1)}% compared to last month. Great progress!`,
          icon: '💰',
          priority: 'medium'
        });
      } else if (incomeGrowth < -5) {
        insights.push({
          type: 'warning',
          title: 'Income Decrease Noticed 📉',
          description: `Your income decreased by ${Math.abs(incomeGrowth).toFixed(1)}% compared to last month. Monitor this trend.`,
          icon: '⚠️',
          priority: 'medium'
        });
      }
    }

    // Add helper function for currency formatting
    function formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }

    // Sort insights by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    insights.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    if (insights.length < 3) {
      insights.push({
        type: 'info',
        title: 'Good Savings Habit',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for better financial security.`
      });
    } else if (savingsRate > 0) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `You're only saving ${savingsRate.toFixed(1)}% of your income. Try to increase savings to at least 10-20%.`
      });
    } else {
      insights.push({
        type: 'alert',
        title: 'Negative Savings',
        description: 'You are spending more than you earn. Consider reviewing your expenses and creating a budget.'
      });
    }

    // Top spending category insight
    if (categoryBreakdown.length > 0) {
      const topCategory = categoryBreakdown[0];
      insights.push({
        type: 'info',
        title: `Top Expense: ${topCategory.category}`,
        description: `${topCategory.category} accounts for ${topCategory.percentage}% of your total expenses ($${topCategory.amount.toFixed(2)}).`
      });
    }

    // Budget alerts
    const overspendingCategories = budgetPerformance.filter(b => b.status === 'over');
    if (overspendingCategories.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Budget Overspend Alert',
        description: `You're over budget in ${overspendingCategories.length} categories: ${overspendingCategories.map(b => b.category).join(', ')}.`,
        icon: '⚠️',
        priority: 'high'
      });
    }

    // Goals progress insight
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
    if (activeGoals.length > 0) {
      const totalGoalProgress = activeGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / activeGoals.length * 100;
      insights.push({
        type: 'info',
        title: 'Goals Progress',
        description: `You have ${activeGoals.length} active goals with an average progress of ${totalGoalProgress.toFixed(1)}%.`
      });
    }

    console.log('Preparing response data...');

    // Response data
    const analyticsData = {
      summary: {
        totalIncome: totalIncome || 0,
        totalExpenses: totalExpenses || 0,
        netSavings: netSavings || 0,
        savingsRate: (savingsRate || 0).toFixed(1),
        transactionCount: transactions.length || 0,
        period: dateRange
      },
      monthlyTrends: monthlyTrends || [],
      categoryBreakdown: categoryBreakdown || [],
      budgetPerformance: budgetPerformance || [],
      insights: insights || [],
      metadata: {
        generatedAt: new Date().toISOString(),
        userId: userId,
        userName: user?.name || 'User',
        period: dateRange
      }
    };

    console.log('Sending response with data:', {
      summaryKeys: Object.keys(analyticsData.summary),
      monthlyTrendsCount: analyticsData.monthlyTrends.length,
      categoryCount: analyticsData.categoryBreakdown.length,
      insightsCount: analyticsData.insights.length
    });

    res.json(analyticsData);

  } catch (error) {
    console.error('Error generating analytics:', error);
    console.error('Error stack:', error.stack);
    
    // Ensure we always send a response
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error generating financial analytics',
        error: error.message,
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          savingsRate: '0.0',
          transactionCount: 0,
          period: '30d'
        },
        monthlyTrends: [],
        categoryBreakdown: [],
        budgetPerformance: [],
        insights: [{
          type: 'error',
          title: 'Data Loading Error',
          description: 'Unable to load your financial data. Please try again.'
        }],
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: req.user?.id || 'unknown',
          userName: 'User',
          period: '30d'
        }
      });
    }
  }
});

// Helper function to get period label
const getPeriodLabel = (dateRange) => {
  switch (dateRange) {
    case '7d': return 'Last 7 Days';
    case '30d': return 'Last 30 Days';
    case '90d': return 'Last 90 Days';
    case '12m': return 'Last 12 Months';
    default: return 'Last 30 Days';
  }
};

// GET /api/reports/pdf - Generate PDF report
router.get('/pdf', authenticateToken, async (req, res) => {
  try {
    console.log('PDF generation requested by user:', req.user.id);
    const { period = '30d' } = req.query;
    const userId = req.user.id;
    
    // DEV MODE: Use mock data when database is not connected
    let transactions = [];
    let budgets = [];
    let user = { name: 'Demo User', email: 'demo@example.com' };
    
    if (process.env.DEV_MODE === 'true' && mongoose.connection.readyState !== 1) {
      console.log('🚀 DEV MODE: Using mock data for PDF generation');
      
      // Mock transactions
      transactions = [
        { type: 'income', amount: 3500, category: 'Salary', date: new Date('2026-02-01'), description: 'Monthly Salary' },
        { type: 'expense', amount: 850.25, category: 'Transportation', date: new Date('2026-02-05'), description: 'Gas and maintenance' },
        { type: 'expense', amount: 1250.50, category: 'Food & Dining', date: new Date('2026-02-10'), description: 'Groceries and restaurants' },
        { type: 'expense', amount: 720, category: 'Shopping', date: new Date('2026-02-12'), description: 'Clothes and essentials' },
        { type: 'income', amount: 500, category: 'Freelance', date: new Date('2026-02-15'), description: 'Freelance project' }
      ];
      
      // Mock budgets
      budgets = [
        { 
          name: 'Monthly Budget',
          categories: [
            { category: 'Food & Dining', budgetedAmount: 1500 },
            { category: 'Transportation', budgetedAmount: 800 },
            { category: 'Shopping', budgetedAmount: 1000 }
          ]
        }
      ];
    } else {
      // Get data for the specified period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '12m':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      console.log('Fetching data for PDF generation...');
      const results = await Promise.all([
        Transaction.find({ 
          userId: userId,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 }),
        Budget.find({ userId: userId }),
        User.findById(userId)
      ]);
      
      transactions = results[0];
      budgets = results[1];
      user = results[2];

      console.log(`Found ${transactions.length} transactions, ${budgets.length} budgets for PDF`);

      // Validate user exists
      if (!user) {
        console.error('User not found for PDF generation');
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    const netSavings = totalIncome - totalExpenses;

    console.log('PDF data calculated:', { totalIncome, totalExpenses, netSavings });

    // Create PDF document
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'LETTER',
      bufferPages: true
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="MONIVUE-Financial-Report-${new Date().toISOString().split('T')[0]}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    try {
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      
      // ==================== HEADER ====================
      // Gradient header background
      doc.rect(0, 0, pageWidth, 140).fill('#1e3c72');
      doc.rect(0, 0, pageWidth, 140).fillOpacity(0.1).fill('#2a5298');
      doc.fillOpacity(1);
      
      // Add Logo Image
      const logoPath = path.join(__dirname, '../../frontend/src/assets/Finance_Logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 60, height: 60 });
      }
      
      // Company Name and Title
      doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold').text('MONIVUE', 130, 45);
      doc.fontSize(14).fillColor('#e8f4f8').font('Helvetica').text('Financial Report', 130, 80);
      doc.fontSize(10).fillColor('#b8d4f1').text('Track. Save. Grow.', 130, 100);
      
      // Info box on right side
      const infoX = pageWidth - 220;
      doc.roundedRect(infoX, 30, 180, 80, 5).lineWidth(1.5).strokeOpacity(0.3).stroke('#ffffff');
      
      doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold');
      doc.text('REPORT DETAILS', infoX + 15, 40, { width: 150 });
      
      doc.fontSize(8).fillColor('#e8f4f8').font('Helvetica');
      doc.text('Generated:', infoX + 15, 58);
      doc.text(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }), infoX + 70, 58);
      
      doc.text('Period:', infoX + 15, 72);
      doc.text(getPeriodLabel(period), infoX + 70, 72);
      
      doc.text('User:', infoX + 15, 86);
      doc.text(user.name || 'User', infoX + 70, 86, { width: 95 });
      
      // ==================== SUMMARY SECTION ====================
      let yPos = 170;
      
      // Section title with underline
      doc.fontSize(18).fillColor('#1e3c72').font('Helvetica-Bold');
      doc.text('Financial Summary', margin, yPos);
      doc.moveTo(margin, yPos + 22).lineTo(pageWidth - margin, yPos + 22).lineWidth(2).strokeOpacity(0.3).stroke('#1e3c72');
      yPos += 40;
      
      // Three metric cards
      const cardWidth = (contentWidth - 40) / 3;
      const cardHeight = 75;
      const cardGap = 20;
      
      // Income Card
      const card1X = margin;
      doc.roundedRect(card1X, yPos, cardWidth, cardHeight, 8).fill('#e6f7ff');
      doc.roundedRect(card1X, yPos, cardWidth, cardHeight, 8).lineWidth(2).stroke('#40a9ff');
      doc.fontSize(11).fillColor('#0050b3').font('Helvetica-Bold').text('TOTAL INCOME', card1X + 15, yPos + 15, { width: cardWidth - 30 });
      doc.fontSize(24).fillColor('#0050b3').font('Helvetica-Bold').text(`$${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, card1X + 15, yPos + 40, { width: cardWidth - 30 });
      
      // Expenses Card
      const card2X = card1X + cardWidth + cardGap;
      doc.roundedRect(card2X, yPos, cardWidth, cardHeight, 8).fill('#fff2e6');
      doc.roundedRect(card2X, yPos, cardWidth, cardHeight, 8).lineWidth(2).stroke('#ff7a45');
      doc.fontSize(11).fillColor('#d46b08').font('Helvetica-Bold').text('TOTAL EXPENSES', card2X + 15, yPos + 15, { width: cardWidth - 30 });
      doc.fontSize(24).fillColor('#d46b08').font('Helvetica-Bold').text(`$${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, card2X + 15, yPos + 40, { width: cardWidth - 30 });
      
      // Savings Card
      const card3X = card2X + cardWidth + cardGap;
      const savingsColor = netSavings >= 0 ? '#52c41a' : '#ff4d4f';
      const savingsBg = netSavings >= 0 ? '#f6ffed' : '#fff2f0';
      doc.roundedRect(card3X, yPos, cardWidth, cardHeight, 8).fill(savingsBg);
      doc.roundedRect(card3X, yPos, cardWidth, cardHeight, 8).lineWidth(2).stroke(savingsColor);
      doc.fontSize(11).fillColor(savingsColor).font('Helvetica-Bold').text('NET SAVINGS', card3X + 15, yPos + 15, { width: cardWidth - 30 });
      doc.fontSize(24).fillColor(savingsColor).font('Helvetica-Bold').text(`$${netSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, card3X + 15, yPos + 40, { width: cardWidth - 30 });
      
      yPos += cardHeight + 40;

      // ==================== CATEGORY BREAKDOWN ====================
      const categoryMap = {};
      transactions.filter(t => t.type === 'expense' && t.category && t.amount).forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

      const topCategories = Object.entries(categoryMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

      if (topCategories.length > 0) {
        // Section title
        doc.fontSize(18).fillColor('#1e3c72').font('Helvetica-Bold').text('Expense Breakdown by Category', margin, yPos);
        doc.moveTo(margin, yPos + 22).lineTo(pageWidth - margin, yPos + 22).lineWidth(2).strokeOpacity(0.3).stroke('#1e3c72');
        yPos += 40;

        // Table header
        doc.roundedRect(margin, yPos, contentWidth, 30, 5).fill('#f5f7fa');
        doc.fontSize(11).fillColor('#1e3c72').font('Helvetica-Bold');
        doc.text('CATEGORY', margin + 20, yPos + 10, { width: 180 });
        doc.text('AMOUNT', margin + 210, yPos + 10, { width: 100 });
        doc.text('PERCENTAGE', margin + 320, yPos + 10, { width: 80 });
        doc.text('CHART', margin + 410, yPos + 10, { width: 100 });
        yPos += 35;

        topCategories.forEach(([category, amount], index) => {
          const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100) : 0;
          
          // Row background
          if (index % 2 === 0) {
            doc.rect(margin, yPos - 5, contentWidth, 28).fill('#fafbfc');
          }
          
          // Category name
          doc.fontSize(10).fillColor('#333333').font('Helvetica');
          doc.text(category || 'Unknown', margin + 20, yPos + 5, { width: 180 });
          
          // Amount
          doc.fontSize(10).fillColor('#d46b08').font('Helvetica-Bold');
          doc.text(`$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`, margin + 210, yPos + 5, { width: 100 });
          
          // Percentage
          doc.fontSize(10).fillColor('#666666').font('Helvetica');
          doc.text(`${percentage.toFixed(1)}%`, margin + 320, yPos + 5, { width: 80 });
          
          // Progress bar
          const maxBarWidth = 120;
          const barWidth = Math.max(3, (percentage / 100) * maxBarWidth);
          doc.roundedRect(margin + 410, yPos + 6, maxBarWidth, 12, 3).fill('#e6f7ff');
          doc.roundedRect(margin + 410, yPos + 6, barWidth, 12, 3).fill('#40a9ff');
          
          yPos += 28;
        });
        yPos += 30;
      }

      // ==================== BUDGET PERFORMANCE ====================
      if (budgets.length > 0) {
        // Check if we need a new page
        if (yPos > pageHeight - 250) {
          doc.addPage();
          yPos = 60;
        }
        
        // Section title
        doc.fontSize(18).fillColor('#1e3c72').font('Helvetica-Bold').text('Budget Performance', margin, yPos);
        doc.moveTo(margin, yPos + 22).lineTo(pageWidth - margin, yPos + 22).lineWidth(2).strokeOpacity(0.3).stroke('#1e3c72');
        yPos += 40;

        budgets.slice(0, 6).forEach(budget => {
          let spent = 0;
          let budgeted = 0;
          let categoryName = 'Unknown Category';
          
          if (budget.categories && budget.categories.length > 0) {
            const firstCategory = budget.categories[0];
            categoryName = firstCategory.category;
            budgeted = firstCategory.budgetedAmount || 0;
            spent = transactions
              .filter(t => t.type === 'expense' && t.category === firstCategory.category)
              .reduce((sum, t) => sum + (t.amount || 0), 0);
          } else {
            categoryName = budget.name || 'Total Budget';
            budgeted = budget.totalBudget || 0;
            spent = transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + (t.amount || 0), 0);
          }
          
          const percentage = budgeted > 0 ? (spent / budgeted * 100) : 0;
          const status = percentage <= 80 ? 'On Track' : percentage <= 100 ? 'Near Limit' : 'Over Budget';
          const statusColor = percentage <= 80 ? '#52c41a' : percentage <= 100 ? '#faad14' : '#ff4d4f';
          const statusBg = percentage <= 80 ? '#f6ffed' : percentage <= 100 ? '#fffbe6' : '#fff2f0';
          
          // Budget card
          doc.roundedRect(margin, yPos, contentWidth, 65, 8).fill('#ffffff');
          doc.roundedRect(margin, yPos, contentWidth, 65, 8).lineWidth(1).stroke('#e8e8e8');
          
          // Category name
          doc.fontSize(12).fillColor('#1e3c72').font('Helvetica-Bold').text(categoryName, margin + 20, yPos + 12);
          
          // Budget amounts in a row
          doc.fontSize(10).fillColor('#666666').font('Helvetica');
          doc.text('Budgeted:', margin + 20, yPos + 32);
          doc.fillColor('#0050b3').font('Helvetica-Bold').text(`$${budgeted.toLocaleString('en-US', {minimumFractionDigits: 2})}`, margin + 90, yPos + 32);
          
          doc.fillColor('#666666').font('Helvetica').text('Spent:', margin + 200, yPos + 32);
          doc.fillColor('#d46b08').font('Helvetica-Bold').text(`$${spent.toLocaleString('en-US', {minimumFractionDigits: 2})}`, margin + 250, yPos + 32);
          
          // Status badge
          const badgeX = pageWidth - margin - 120;
          doc.roundedRect(badgeX, yPos + 10, 100, 22, 4).fill(statusBg);
          doc.roundedRect(badgeX, yPos + 10, 100, 22, 4).lineWidth(1).stroke(statusColor);
          doc.fontSize(9).fillColor(statusColor).font('Helvetica-Bold').text(status, badgeX, yPos + 16, { width: 100, align: 'center' });
          
          // Progress bar
          const progressBarWidth = contentWidth - 40;
          const filledWidth = Math.min(progressBarWidth, (percentage / 100) * progressBarWidth);
          doc.roundedRect(margin + 20, yPos + 48, progressBarWidth, 10, 3).fill('#f0f2f5');
          
          // Color gradient based on percentage
          let barColor = '#52c41a';
          if (percentage > 100) barColor = '#ff4d4f';
          else if (percentage > 80) barColor = '#faad14';
          
          doc.roundedRect(margin + 20, yPos + 48, filledWidth, 10, 3).fill(barColor);
          
          // Percentage text on bar
          doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold');
          if (filledWidth > 30) {
            doc.text(`${percentage.toFixed(0)}%`, margin + 20, yPos + 50, { width: filledWidth, align: 'center' });
          }
          
          yPos += 75;
        });
        yPos += 20;
      }

      // ==================== FOOTER ====================
      // Add professional footer on each page
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        
        // Footer background
        doc.rect(0, pageHeight - 60, pageWidth, 60).fill('#f8f9fa');
        doc.moveTo(0, pageHeight - 60).lineTo(pageWidth, pageHeight - 60).lineWidth(1).strokeOpacity(0.2).stroke('#1e3c72');
        
        // Footer content
        doc.fontSize(8).fillColor('#666666').font('Helvetica');
        doc.text('MONIVUE Financial Tracker - Confidential Report', margin, pageHeight - 45);
        doc.text(`Report ID: MV-${Date.now()}`, margin, pageHeight - 30);
        
        doc.text(`Page ${i + 1} of ${range.count}`, pageWidth - margin - 80, pageHeight - 45, { width: 80, align: 'right' });
        doc.text(new Date().toLocaleDateString('en-US'), pageWidth - margin - 80, pageHeight - 30, { width: 80, align: 'right' });
      }

      // End the document
      doc.end();
      console.log('PDF generation completed successfully');

    } catch (pdfError) {
      console.error('Error during PDF creation:', pdfError);
      doc.end();
      throw pdfError;
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating PDF report', error: error.message });
    }
  }
});

// GET /api/reports/excel - Generate Excel report
router.get('/excel', authenticateToken, async (req, res) => {
  try {
    console.log('Excel generation requested by user:', req.user.id);
    const { period = '30d' } = req.query;
    const dateRange = period;
    const userId = req.user.id;
    
    // DEV MODE: Use mock data when database is not connected
    let transactions = [];
    let budgets = [];
    let goals = [];
    let user = { name: 'Demo User', email: 'demo@example.com' };
    
    if (process.env.DEV_MODE === 'true' && mongoose.connection.readyState !== 1) {
      console.log('🚀 DEV MODE: Using mock data for Excel generation');
      
      // Mock transactions
      transactions = [
        { type: 'income', amount: 3500, category: 'Salary', date: new Date('2026-02-01'), description: 'Monthly Salary' },
        { type: 'income', amount: 500, category: 'Freelance', date: new Date('2026-02-15'), description: 'Freelance project' },
        { type: 'expense', amount: 850.25, category: 'Transportation', date: new Date('2026-02-05'), description: 'Gas and maintenance' },
        { type: 'expense', amount: 1250.50, category: 'Food & Dining', date: new Date('2026-02-10'), description: 'Groceries and restaurants' },
        { type: 'expense', amount: 720, category: 'Shopping', date: new Date('2026-02-12'), description: 'Clothes and essentials' },
        { type: 'expense', amount: 580, category: 'Entertainment', date: new Date('2026-02-14'), description: 'Movies and games' },
        { type: 'expense', amount: 450, category: 'Utilities', date: new Date('2026-02-03'), description: 'Electricity and water' }
      ];
      
      // Mock budgets
      budgets = [
        { 
          name: 'Monthly Budget',
          categories: [
            { category: 'Food & Dining', budgetedAmount: 1500 },
            { category: 'Transportation', budgetedAmount: 800 },
            { category: 'Shopping', budgetedAmount: 1000 },
            { category: 'Entertainment', budgetedAmount: 500 },
            { category: 'Utilities', budgetedAmount: 500 }
          ]
        }
      ];
      
      // Mock goals
      goals = [
        { name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000, targetDate: new Date('2026-12-31') },
        { name: 'Vacation', targetAmount: 3000, currentAmount: 1200, targetDate: new Date('2026-07-01') }
      ];
    } else {
      // Get data for the specified period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '12m':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const results = await Promise.all([
        Transaction.find({ 
          userId: userId,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 }),
        Budget.find({ userId: userId }),
        Goal.find({ userId: userId }),
        User.findById(userId)
      ]);
      
      transactions = results[0];
      budgets = results[1];
      goals = results[2];
      user = results[3];
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MONIVUE Finance Tracker';
    workbook.created = new Date();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Financial Summary');
    summarySheet.addRow(['MONIVUE Financial Report']);
    summarySheet.addRow(['Generated:', new Date().toLocaleDateString()]);
    summarySheet.addRow(['Period:', getPeriodLabel(period)]);
    summarySheet.addRow(['User:', user?.name || 'User']);
    summarySheet.addRow([]);
    
    summarySheet.addRow(['Metric', 'Value']);
    summarySheet.addRow(['Total Income', totalIncome]);
    summarySheet.addRow(['Total Expenses', totalExpenses]);
    summarySheet.addRow(['Net Savings', totalIncome - totalExpenses]);
    summarySheet.addRow(['Total Transactions', transactions.length]);

    // Transactions Sheet
    const transactionsSheet = workbook.addWorksheet('Transactions');
    transactionsSheet.addRow(['Date', 'Description', 'Category', 'Type', 'Amount']);
    
    transactions.forEach(transaction => {
      transactionsSheet.addRow([
        transaction.date.toLocaleDateString(),
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.amount
      ]);
    });

    // Category Analysis Sheet
    const categoryMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const categoriesSheet = workbook.addWorksheet('Expense Categories');
    categoriesSheet.addRow(['Category', 'Amount', 'Percentage']);
    Object.entries(categoryMap)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, amount]) => {
        const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
        categoriesSheet.addRow([category, amount, `${percentage}%`]);
      });

    // Budget Performance Sheet
    if (budgets.length > 0) {
      const budgetSheet = workbook.addWorksheet('Budget Performance');
      budgetSheet.addRow(['Category', 'Budgeted', 'Spent', 'Remaining', 'Status']);
      
      budgets.forEach(budget => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const remaining = budget.amount - spent;
        const status = remaining >= 0 ? 'On Track' : 'Over Budget';
        
        budgetSheet.addRow([
          budget.category, 
          budget.amount, 
          spent, 
          remaining, 
          status
        ]);
      });
    }

    // Goals Sheet
    if (goals.length > 0) {
      const goalsSheet = workbook.addWorksheet('Goals');
      goalsSheet.addRow(['Goal Name', 'Target Amount', 'Current Amount', 'Progress %', 'Status']);
      
      goals.forEach(goal => {
        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount * 100).toFixed(1) : 0;
        const status = goal.currentAmount >= goal.targetAmount ? 'Completed' : 'In Progress';
        
        goalsSheet.addRow([
          goal.name,
          goal.targetAmount,
          goal.currentAmount,
          `${progress}%`,
          status
        ]);
      });
    }

    // Style headers
    workbook.worksheets.forEach(sheet => {
      if (sheet.getRow(1).cellCount > 0) {
        sheet.getRow(1).font = { bold: true };
      }
      sheet.columns.forEach(column => {
        column.width = 20;
      });
    });

    // Generate buffer and send
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="MONIVUE-Report-${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
    
    console.log('Excel report generated successfully');

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: 'Error generating Excel report' });
  }
});

module.exports = router;