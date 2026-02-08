require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');

async function startMongoDB() {
  try {
    console.log('Starting in-memory MongoDB...');
    
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use standard MongoDB port
        dbName: 'finance_tracker',
      },
    });

    const uri = mongod.getUri();
    console.log('MongoDB Memory Server started successfully');
    console.log('Connection URI:', uri);
    console.log('This database runs in memory - perfect for development!\n');

    // Update environment variable for the server
    process.env.MONGO_URI = uri;

    // Now start the actual server
    require('./server.js');

    // Handle cleanup
    process.on('SIGINT', async () => {
      console.log('\n\nShutting down...');
      await mongod.stop();
      console.log('MongoDB stopped');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB Memory Server failed:', error.message);
    console.log('\nTIP: If this fails, follow QUICK_MONGODB_SETUP.md for MongoDB Atlas\n');
    process.exit(1);
  }
}

startMongoDB();
