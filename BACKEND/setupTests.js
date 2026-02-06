const mongoose = require('mongoose');

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // MongoDB Memory Server is configured via jest-mongodb preset
  // Connection is established automatically
});

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Global test teardown
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

// Mock console methods to reduce test output noise (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
