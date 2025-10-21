const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
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
          const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
          
          console.log(`Category ${categoryBudget.category}: budgeted=${budgeted}, spent=${spent}, percentage=${percentage}`);
          
          budgetPerformance.push({
            category: categoryBudget.category,
            budgeted: budgeted,
            spent: spent,
            remaining: budgeted - spent,
            percentage: Number(percentage.toFixed(1)),
            status: percentage <= 100 ? 'under' : 'over'
          });
        });
      } else {
        // If no categories, create a default entry for the budget
        const spent = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const budgeted = budget.totalBudget || 0;
        const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
        
        console.log(`Total budget: budgeted=${budgeted}, spent=${spent}, percentage=${percentage}`);
        
        budgetPerformance.push({
          category: budget.name || 'Total Budget',
          budgeted: budgeted,
          spent: spent,
          remaining: budgeted - spent,
          percentage: Number(percentage.toFixed(1)),
          status: percentage <= 100 ? 'under' : 'over'
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
    const [transactions, budgets, user] = await Promise.all([
      Transaction.find({ 
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 }),
      Budget.find({ userId: userId }),
      User.findById(userId)
    ]);

    console.log(`Found ${transactions.length} transactions, ${budgets.length} budgets for PDF`);

    // Validate user exists
    if (!user) {
      console.error('User not found for PDF generation');
      return res.status(404).json({ message: 'User not found' });
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    const netSavings = totalIncome - totalExpenses;

    console.log('PDF data calculated:', { totalIncome, totalExpenses, netSavings });

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="MoneyVue-Report-${new Date().toISOString().split('T')[0]}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    try {
      // Create professional header with company branding
      const pageWidth = 612; // Standard 8.5x11 page width in points
      const centerX = pageWidth / 2;
      
      // Header background
      doc.rect(0, 0, pageWidth, 120).fill('#1e3c72');
      
      // Company logo area (placeholder - you can add actual logo later)
      doc.circle(80, 60, 25).fill('#ffffff');
      doc.fontSize(14).fillColor('#1e3c72').text('MV', 72, 55);
      
      // Main title
      doc.fontSize(28).fillColor('#ffffff').text('MoneyVue', 120, 35, { align: 'left' });
      doc.fontSize(16).fillColor('#e8f4f8').text('Financial Report', 120, 65, { align: 'left' });
      
      // Header info box on the right
      const headerBox = {
        x: pageWidth - 200,
        y: 25,
        width: 170,
        height: 70
      };
      
      doc.rect(headerBox.x, headerBox.y, headerBox.width, headerBox.height)
         .stroke('#ffffff')
         .fillOpacity(0.1)
         .fill('#ffffff');
      
      doc.fillOpacity(1).fillColor('#1e3c72').fontSize(10);
      doc.text('Generated:', headerBox.x + 10, headerBox.y + 10);
      doc.text(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), headerBox.x + 10, headerBox.y + 22);
      
      doc.text('Period:', headerBox.x + 10, headerBox.y + 40);
      doc.text(getPeriodLabel(period), headerBox.x + 10, headerBox.y + 52);
      
      doc.text('User:', headerBox.x + 100, headerBox.y + 10);
      doc.text(user.name || 'User', headerBox.x + 100, headerBox.y + 22);

      let yPosition = 150;
      doc.fillColor('#333333'); // Reset to dark text

      // Executive Summary Section with background
      doc.rect(50, yPosition - 15, pageWidth - 100, 120).fill('#f8f9ff').stroke('#e0e7ff');
      
      doc.fontSize(20).fillColor('#1e3c72').text('📊 Executive Summary', 70, yPosition);
      yPosition += 35;

      // Create three columns for key metrics
      const col1X = 70, col2X = 240, col3X = 410;
      const colWidth = 150;
      
      // Income box
      doc.rect(col1X, yPosition, colWidth - 20, 60).fill('#e6f7ff').stroke('#40a9ff');
      doc.fontSize(12).fillColor('#0050b3').text('💰 Total Income', col1X + 10, yPosition + 10);
      doc.fontSize(18).fillColor('#0050b3').text(`$${totalIncome.toLocaleString()}`, col1X + 10, yPosition + 30);
      
      // Expenses box
      doc.rect(col2X, yPosition, colWidth - 20, 60).fill('#fff2e6').stroke('#ff7a45');
      doc.fontSize(12).fillColor('#d46b08').text('💸 Total Expenses', col2X + 10, yPosition + 10);
      doc.fontSize(18).fillColor('#d46b08').text(`$${totalExpenses.toLocaleString()}`, col2X + 10, yPosition + 30);
      
      // Net Savings box
      const savingsColor = netSavings >= 0 ? '#52c41a' : '#ff4d4f';
      const savingsIcon = netSavings >= 0 ? '💚' : '⚠️';
      doc.rect(col3X, yPosition, colWidth - 20, 60).fill(netSavings >= 0 ? '#f6ffed' : '#fff2f0').stroke(savingsColor);
      doc.fontSize(12).fillColor(savingsColor).text(`${savingsIcon} Net Savings`, col3X + 10, yPosition + 10);
      doc.fontSize(18).fillColor(savingsColor).text(`$${netSavings.toLocaleString()}`, col3X + 10, yPosition + 30);
      
      yPosition += 90;

      // Category Analysis Section
      const categoryMap = {};
      transactions.filter(t => t.type === 'expense' && t.category && t.amount).forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

      const topCategories = Object.entries(categoryMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

      if (topCategories.length > 0) {
        doc.fontSize(18).fillColor('#1e3c72').text('📈 Top Expense Categories', 50, yPosition);
        yPosition += 35;

        // Table header with background
        doc.rect(50, yPosition - 5, pageWidth - 100, 25).fill('#f0f0f0').stroke('#d9d9d9');
        doc.fontSize(12).fillColor('#333333');
        doc.text('Category', 70, yPosition + 5);
        doc.text('Amount', 280, yPosition + 5);
        doc.text('Percentage', 400, yPosition + 5);
        doc.text('Visual', 480, yPosition + 5);
        yPosition += 30;

        topCategories.forEach(([category, amount], index) => {
          const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100) : 0;
          const isEven = index % 2 === 0;
          
          // Alternating row colors
          if (isEven) {
            doc.rect(50, yPosition - 5, pageWidth - 100, 20).fill('#fafafa');
          }
          
          doc.fontSize(11).fillColor('#333333');
          doc.text(category || 'Unknown', 70, yPosition);
          doc.text(`$${amount.toLocaleString()}`, 280, yPosition);
          doc.text(`${percentage.toFixed(1)}%`, 400, yPosition);
          
          // Visual bar chart
          const barWidth = Math.max(2, (percentage / 100) * 80);
          doc.rect(480, yPosition + 3, barWidth, 8).fill('#40a9ff');
          
          yPosition += 20;
        });
        yPosition += 20;
      }

      // Budget Performance Section
      if (budgets.length > 0) {
        doc.fontSize(18).fillColor('#1e3c72').text('🎯 Budget Performance', 50, yPosition);
        yPosition += 35;

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
          const status = percentage <= 100 ? 'On Track' : 'Over Budget';
          const statusColor = percentage <= 100 ? '#52c41a' : '#ff4d4f';
          const statusIcon = percentage <= 100 ? '✅' : '⚠️';
          
          // Budget item container
          doc.rect(50, yPosition - 5, pageWidth - 100, 45).fill('#fafbfc').stroke('#e8e8e8');
          
          doc.fontSize(13).fillColor('#333333').text(`${statusIcon} ${categoryName}`, 70, yPosition + 5);
          doc.fontSize(10).fillColor('#666666');
          doc.text(`Budgeted: $${budgeted.toLocaleString()}`, 70, yPosition + 20);
          doc.text(`Spent: $${spent.toLocaleString()}`, 200, yPosition + 20);
          doc.text(`Status: ${status}`, 330, yPosition + 20);
          doc.fillColor(statusColor).text(`${percentage.toFixed(1)}%`, 450, yPosition + 20);
          
          // Progress bar
          const progressBarWidth = 100;
          const filledWidth = Math.min(progressBarWidth, (percentage / 100) * progressBarWidth);
          doc.rect(70, yPosition + 32, progressBarWidth, 6).fill('#f0f0f0');
          doc.rect(70, yPosition + 32, filledWidth, 6).fill(statusColor);
          
          yPosition += 50;
        });
      }

      // Add new page if needed for footer
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      // Professional Footer
      doc.rect(0, 750, pageWidth, 50).fill('#f8f9fa');
      doc.fontSize(9).fillColor('#666666');
      doc.text('MoneyVue Financial Tracker - Confidential Report', 50, 765);
      doc.text(`Report ID: MV-${Date.now()}`, 50, 780);
      doc.text(`Generated: ${new Date().toISOString()}`, pageWidth - 200, 765);
      doc.text('Page 1 of 1', pageWidth - 200, 780);

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
    const userId = req.user.id;
    
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

    const [transactions, budgets, goals, user] = await Promise.all([
      Transaction.find({ 
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 }),
      Budget.find({ userId: userId }),
      Goal.find({ userId: userId }),
      User.findById(userId)
    ]);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MoneyVue Finance Tracker';
    workbook.created = new Date();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Financial Summary');
    summarySheet.addRow(['MoneyVue Financial Report']);
    summarySheet.addRow(['Generated:', new Date().toLocaleDateString()]);
    summarySheet.addRow(['Period:', getPeriodLabel(dateRange)]);
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
    res.setHeader('Content-Disposition', `attachment; filename="MoneyVue-Report-${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: 'Error generating Excel report' });
  }
});

module.exports = router;