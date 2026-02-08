require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedUser() {
  try {
    // Connect to the running MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_tracker';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'bhawanthiwathsara65@gmail.com' });
    
    if (existingUser) {
      console.log('User already exists! You can log in now.');
      process.exit(0);
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newUser = new User({
      name: 'Bhawanthi Wathsara',
      email: 'bhawanthiwathsara65@gmail.com',
      password: hashedPassword,
    });

    await newUser.save();
    
    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: bhawanthiwathsara65@gmail.com');
    console.log('🔑 Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now log in to your Finance Tracker!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n💡 TIP: Make sure your backend server is running!');
    console.log('Run: npm run start:memory\n');
    process.exit(1);
  }
}

seedUser();
