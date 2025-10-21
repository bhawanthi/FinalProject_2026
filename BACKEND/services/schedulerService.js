const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const { sendFinancialSummaryEmail } = require('./emailService');

// Helper function to get date range for transactions
const getDateRange = (frequency) => {
  const now = new Date();
  let startDate;

  switch(frequency) {
    case 'daily':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'weekly':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
  }

  return { startDate, endDate: now };
};

// Function to send notifications to users
const sendScheduledNotifications = async (frequency) => {
  try {
    console.log(`Running ${frequency} notification job...`);

    // Find all users with notifications enabled for this frequency
    const users = await User.find({
      'notificationSettings.enabled': true,
      'notificationSettings.frequency': frequency
    });

    console.log(`Found ${users.length} users with ${frequency} notifications enabled`);

    for (const user of users) {
      try {
        // Get date range based on frequency
        const { startDate, endDate } = getDateRange(frequency);

        // Fetch user's financial data
        const transactions = await Transaction.find({
          user: user._id,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        const budgets = await Budget.find({ user: user._id });
        const goals = await Goal.find({ user: user._id });

        // Prepare financial data
        const financialData = {
          user,
          transactions,
          budgets,
          goals,
          settings: user.notificationSettings
        };

        // Send email
        const result = await sendFinancialSummaryEmail(user, financialData);

        if (result.success) {
          // Update last sent timestamp
          user.notificationSettings.lastSent = new Date();
          await user.save();
          console.log(`Email sent successfully to ${user.email}`);
        } else {
          console.error(`Failed to send email to ${user.email}:`, result.error);
        }

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error sending notification to user ${user.email}:`, error);
      }
    }

    console.log(`${frequency} notification job completed`);
  } catch (error) {
    console.error(`Error in ${frequency} notification job:`, error);
  }
};

// Initialize cron jobs
const initializeScheduler = () => {
  console.log('Initializing notification scheduler...');

  // Daily notifications - Every day at 8:00 AM
  cron.schedule('0 8 * * *', () => {
    sendScheduledNotifications('daily');
  }, {
    timezone: "America/New_York" // Change to your timezone
  });

  // Weekly notifications - Every Monday at 8:00 AM
  cron.schedule('0 8 * * 1', () => {
    sendScheduledNotifications('weekly');
  }, {
    timezone: "America/New_York" // Change to your timezone
  });

  // Monthly notifications - 1st of every month at 8:00 AM
  cron.schedule('0 8 1 * *', () => {
    sendScheduledNotifications('monthly');
  }, {
    timezone: "America/New_York" // Change to your timezone
  });

  console.log('Notification scheduler initialized successfully');
  console.log('- Daily: Every day at 8:00 AM');
  console.log('- Weekly: Every Monday at 8:00 AM');
  console.log('- Monthly: 1st of each month at 8:00 AM');
};

// Manual trigger for testing (can be called via API)
const triggerTestNotification = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.notificationSettings.enabled) {
      return { success: false, message: 'User not found or notifications not enabled' };
    }

    // Get recent transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      user: user._id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    const budgets = await Budget.find({ user: user._id });
    const goals = await Goal.find({ user: user._id });

    const financialData = {
      user,
      transactions,
      budgets,
      goals,
      settings: user.notificationSettings
    };

    const result = await sendFinancialSummaryEmail(user, financialData);

    if (result.success) {
      user.notificationSettings.lastSent = new Date();
      await user.save();
    }

    return result;
  } catch (error) {
    console.error('Error triggering test notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeScheduler,
  sendScheduledNotifications,
  triggerTestNotification
};
