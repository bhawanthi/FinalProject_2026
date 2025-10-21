const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Update Profile Route
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
