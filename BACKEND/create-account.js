// Register user through the API
const axios = require('axios');

async function registerUser() {
  try {
    console.log('Creating your account...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Bhawanthi Wathsara',
      email: 'bhawanthiwathsara9@gmail.com',
      age: 25,
      jobRole: 'Software Developer',
      monthlySalary: 5000,
      currency: 'USD',
      password: '123456',
      confirmPassword: '123456'
    });

    console.log('✅ Account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: bhawanthiwathsara9@gmail.com');
    console.log('🔑 Password: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now log in to your Finance Tracker!\n');
    
  } catch (error) {
    if (error.response) {
      if (error.response.data.msg === 'User already exists') {
        console.log('✅ Account already exists!\n');
        console.log('📧 Email: bhawanthiwathsara9@gmail.com');
        console.log('🔑 Password: 123456');
        console.log('\n💡 You can log in now!\n');
      } else {
        console.error('❌ Error:', error.response.data.msg || error.message);
      }
    } else {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Make sure backend is running: npm run start:memory\n');
    }
  }
}

registerUser();
