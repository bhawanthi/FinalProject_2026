require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeScheduler } = require('./services/schedulerService');

const app = express();

// CRITICAL: Disable buffering BEFORE any models are loaded
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 0);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// IMPORTANT: Check DB connection BEFORE loading routes
app.use((req, res, next) => {
  // Skip check for health endpoint
  if (req.path === '/health') {
    return next();
  }

  // Block all requests if DB not connected, but provide helpful message
  if (mongoose.connection.readyState !== 1) {
    console.warn(`⚠️ Request blocked - DB not connected (state: ${mongoose.connection.readyState})`);
    return res.status(503).json({ 
      msg: '🔧 Database connection needed! Please check MONGODB_SETUP_INSTRUCTIONS.md for help.',
      error: 'DB_NOT_CONNECTED',
      dbState: mongoose.connection.readyState,
      instructions: 'Go to https://cloud.mongodb.com/ → Resume cluster → Update network access → Get new connection string',
      helpFile: 'See MONGODB_SETUP_INSTRUCTIONS.md in project root'
    });
  }
  
  next();
});

// Health check endpoint (before routes)
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    server: 'running',
    database: stateMap[dbState] || 'unknown',
    ready: dbState === 1,
    timestamp: new Date().toISOString()
  });
});

// Routes (loaded AFTER middleware)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chatbot', require('./routes/chatbot'));

const PORT = process.env.PORT || 5000;

// MongoDB connection with retry logic
const connectMongoDB = async () => {
  const maxAttempts = 5;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      console.log(`🔄 Attempting MongoDB connection (${attempt + 1}/${maxAttempts})...`);
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB connected successfully');
      console.log(`📦 Database: ${mongoose.connection.name}`);
      console.log(`🔗 Host: ${mongoose.connection.host}`);
      
      // Initialize scheduler after successful connection
      try {
        initializeScheduler();
        console.log('✅ Scheduler initialized');
      } catch (err) {
        console.error('⚠️ Scheduler initialization failed:', err.message);
      }
      
      return true;
    } catch (err) {
      attempt++;
      console.error(`❌ Connection failed (${attempt}/${maxAttempts}): ${err.message}`);

      if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
        console.error('⚠️ DNS resolution failed. Cannot resolve MongoDB Atlas hostname.');
        console.error('   Fixes:');
        console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
        console.error('   2. Update .env: MONGO_URI=mongodb://localhost:27017/finance_tracker');
        console.error('   3. OR fix Atlas: Get new connection string from cloud.mongodb.com');
      }

      if (attempt < maxAttempts) {
        const delayMs = 3000;
        console.log(`⏳ Retrying in ${delayMs / 1000}s...\n`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  console.error('\n❌ CRITICAL: MongoDB connection failed\n');
  console.error('Your options:');
  console.error('A) Install MongoDB locally (recommended for development)');
  console.error('   Download: https://www.mongodb.com/try/download/community');
  console.error('   Then update .env: MONGO_URI=mongodb://localhost:27017/finance_tracker');
  console.error('');
  console.error('B) Fix MongoDB Atlas connection');
  console.error('   1. Go to https://cloud.mongodb.com/');
  console.error('   2. Ensure cluster is running (not paused)');
  console.error('   3. Network Access → Add 0.0.0.0/0');
  console.error('   4. Get new connection string from Connect button\n');
  
  return false;
};

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server started successfully');
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
  
  // Start DB connection in background
  connectMongoDB();
});
