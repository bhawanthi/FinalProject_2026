const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { triggerTestNotification } = require('../services/schedulerService');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Fix: use decoded directly
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get notification settings
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationSettings email');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If notification email is not set, use user's email
    const notificationSettings = user.notificationSettings || {};
    if (!notificationSettings.email) {
      notificationSettings.email = user.email;
    }

    res.json(notificationSettings);
  } catch (err) {
    console.error('Error fetching notification settings:', err.message);
    res.status(500).send('Server error');
  }
});

// Update notification settings
router.put('/settings', auth, async (req, res) => {
  try {
    const {
      enabled,
      email,
      frequency,
      includeSalaryTips,
      includeGoals,
      includeBudgets
    } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate frequency
    if (frequency && !['daily', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({ msg: 'Invalid frequency. Must be daily, weekly, or monthly.' });
    }

    // Update notification settings
    user.notificationSettings = {
      enabled: enabled !== undefined ? enabled : user.notificationSettings?.enabled || false,
      email: email || user.email,
      frequency: frequency || user.notificationSettings?.frequency || 'weekly',
      includeSalaryTips: includeSalaryTips !== undefined ? includeSalaryTips : true,
      includeGoals: includeGoals !== undefined ? includeGoals : true,
      includeBudgets: includeBudgets !== undefined ? includeBudgets : true,
      lastSent: user.notificationSettings?.lastSent || null
    };

    await user.save();

    res.json({
      msg: 'Notification settings updated successfully',
      notificationSettings: user.notificationSettings
    });
  } catch (err) {
    console.error('Error updating notification settings:', err.message);
    res.status(500).send('Server error');
  }
});

// Test notification endpoint - send test email
router.post('/test', auth, async (req, res) => {
  try {
    const result = await triggerTestNotification(req.user.id);
    
    if (result.success) {
      res.json({ msg: 'Test email sent successfully!', messageId: result.messageId });
    } else {
      res.status(400).json({ msg: result.message || 'Failed to send test email', error: result.error });
    }
  } catch (err) {
    console.error('Error sending test notification:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
