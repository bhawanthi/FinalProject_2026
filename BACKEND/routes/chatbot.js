const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatbotController');

// POST /api/chatbot - Send message to chatbot
router.post('/', handleChatMessage);

module.exports = router;
