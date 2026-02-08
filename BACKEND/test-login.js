// Test login
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usernameOrEmail: 'bhawanthiwathsara65@gmail.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Login failed:', error.response.data.msg || error.response.data);
      console.log('\nResponse status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Make sure backend is running: npm run start:memory\n');
    }
  }
}

testLogin();
