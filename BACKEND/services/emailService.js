const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Using Mailtrap for testing emails
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate financial summary email HTML
const generateFinancialEmail = (userData, financialData) => {
  const { user, transactions, budgets, goals, settings } = financialData;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f4f4f4;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
          text-align: center;
          margin: -30px -30px 30px -30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .section {
          margin: 25px 0;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          border-left: 4px solid #2a5298;
        }
        .section h2 {
          color: #1e3c72;
          margin-top: 0;
          font-size: 20px;
        }
        .metric {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .metric:last-child {
          border-bottom: none;
        }
        .metric-label {
          font-weight: 600;
          color: #555;
        }
        .metric-value {
          font-weight: 700;
          color: #2a5298;
        }
        .positive {
          color: #4caf50;
        }
        .negative {
          color: #f44336;
        }
        .tip {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border-left: 4px solid #2196f3;
        }
        .tip-icon {
          font-size: 20px;
          margin-right: 10px;
        }
        .progress-bar {
          background: #e0e0e0;
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }
        .progress-fill {
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
          color: #888;
          font-size: 12px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #2a5298, #1e3c72);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 25px;
          margin: 20px 0;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 MoneyVue Financial Report</h1>
          <p>Hello ${user.name}! Here's your personalized financial summary.</p>
        </div>
  `;

  // Financial Overview
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  html += `
    <div class="section">
      <h2>📊 Financial Overview</h2>
      <div class="metric">
        <span class="metric-label">Total Income</span>
        <span class="metric-value positive">$${totalIncome.toLocaleString()}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Total Expenses</span>
        <span class="metric-value negative">$${totalExpenses.toLocaleString()}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Net Savings</span>
        <span class="metric-value ${netSavings >= 0 ? 'positive' : 'negative'}">$${netSavings.toLocaleString()}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Savings Rate</span>
        <span class="metric-value">${savingsRate}%</span>
      </div>
    </div>
  `;

  // Salary Management Tips
  if (settings.includeSalaryTips) {
    const monthlyIncome = user.monthlySalary || 0;
    const recommended50 = (monthlyIncome * 0.5).toFixed(0);
    const recommended30 = (monthlyIncome * 0.3).toFixed(0);
    const recommended20 = (monthlyIncome * 0.2).toFixed(0);

    html += `
      <div class="section">
        <h2>💡 Salary Management Tips</h2>
        <div class="tip">
          <span class="tip-icon">📝</span>
          <strong>50/30/20 Rule</strong><br>
          Based on your monthly salary of $${monthlyIncome.toLocaleString()}, consider:
          <ul>
            <li><strong>50% ($${Number(recommended50).toLocaleString()})</strong> - Needs (rent, groceries, utilities)</li>
            <li><strong>30% ($${Number(recommended30).toLocaleString()})</strong> - Wants (entertainment, dining)</li>
            <li><strong>20% ($${Number(recommended20).toLocaleString()})</strong> - Savings & Investments</li>
          </ul>
        </div>
        <div class="tip">
          <span class="tip-icon">💰</span>
          <strong>Smart Saving Tip:</strong> Automate your savings! Set up automatic transfers to your savings account right after payday.
        </div>
      </div>
    `;
  }

  // Goals Progress
  if (settings.includeGoals && goals.length > 0) {
    html += `
      <div class="section">
        <h2>🎯 Your Financial Goals</h2>
    `;

    goals.slice(0, 3).forEach(goal => {
      const progress = goal.targetAmount > 0 ? ((goal.savedAmount / goal.targetAmount) * 100).toFixed(1) : 0;
      const remaining = goal.targetAmount - goal.savedAmount;

      html += `
        <div style="margin: 15px 0;">
          <strong>${goal.name}</strong>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%">
              ${progress}%
            </div>
          </div>
          <div class="metric">
            <span class="metric-label">Saved</span>
            <span class="metric-value">$${goal.savedAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Remaining</span>
            <span class="metric-value">${remaining > 0 ? '$' + remaining.toLocaleString() : 'Goal Achieved! 🎉'}</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  }

  // Budget Status
  if (settings.includeBudgets && budgets.length > 0) {
    html += `
      <div class="section">
        <h2>📈 Budget Performance</h2>
    `;

    budgets.forEach(budget => {
      if (budget.categories && budget.categories.length > 0) {
        budget.categories.slice(0, 3).forEach(cat => {
          const spent = transactions
            .filter(t => t.type === 'expense' && t.category === cat.category)
            .reduce((sum, t) => sum + t.amount, 0);
          
          const percentage = cat.budgetedAmount > 0 ? ((spent / cat.budgetedAmount) * 100).toFixed(1) : 0;
          const status = percentage <= 100 ? '✅ On Track' : '⚠️ Over Budget';
          const statusClass = percentage <= 100 ? 'positive' : 'negative';

          html += `
            <div style="margin: 15px 0;">
              <strong>${cat.category}</strong>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${percentage > 100 ? 'linear-gradient(90deg, #f44336, #e91e63)' : 'linear-gradient(90deg, #4caf50, #8bc34a)'}">
                  ${percentage}%
                </div>
              </div>
              <div class="metric">
                <span class="metric-label">Spent / Budget</span>
                <span class="metric-value ${statusClass}">$${spent.toLocaleString()} / $${cat.budgetedAmount.toLocaleString()}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Status</span>
                <span class="${statusClass}">${status}</span>
              </div>
            </div>
          `;
        });
      }
    });

    html += `</div>`;
  }

  // Call to Action
  html += `
        <div style="text-align: center;">
          <a href="http://localhost:3000/home" class="cta-button">
            View Full Dashboard
          </a>
        </div>

        <div class="footer">
          <p>This email was sent by MoneyVue Financial Tracker</p>
          <p>You're receiving this because you enabled email notifications</p>
          <p>Update your notification preferences in your profile settings</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

// Send financial summary email
const sendFinancialSummaryEmail = async (user, financialData) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured in .env file');
      return { 
        success: false, 
        error: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file' 
      };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"MoneyVue Finance" <${process.env.EMAIL_USER}>`,
      to: financialData.settings.email,
      subject: `💰 Your ${getFrequencyLabel(financialData.settings.frequency)} Financial Summary - MoneyVue`,
      html: generateFinancialEmail(user, financialData)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    let errorMessage = error.message;
    
    // Provide more user-friendly error messages
    if (error.message.includes('Invalid login')) {
      errorMessage = 'Invalid email credentials. Please check EMAIL_USER and EMAIL_PASSWORD in .env';
    } else if (error.message.includes('EAUTH')) {
      errorMessage = 'Authentication failed. Please generate a Gmail App Password and update .env';
    } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      errorMessage = 'Cannot connect to email server. Please check your internet connection';
    }
    
    return { success: false, error: errorMessage };
  }
};

const getFrequencyLabel = (frequency) => {
  switch(frequency) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    default: return 'Weekly';
  }
};

module.exports = {
  sendFinancialSummaryEmail,
  generateFinancialEmail
};
