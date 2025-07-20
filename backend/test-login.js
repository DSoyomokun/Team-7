const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test login with confirmed user
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testLogin() {
  console.log('🔑 Testing Login...\n');
  console.log(`📝 User: ${testUser.email}`);

  try {
    // Test login
    console.log('  🔑 Attempting login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    console.log('  ✅ Login successful:', loginResponse.data.message);
    
    // Get session
    console.log('  📋 Getting session...');
    const sessionResponse = await axios.get(`${BASE_URL}/auth/session`);
    console.log('  ✅ Session retrieved successfully');

  } catch (error) {
    if (error.response) {
      console.log(`  ❌ Login Error: ${error.response.data.error}`);
      console.log('  💡 Make sure you confirmed your email first!');
    } else {
      console.log(`  ❌ Network error: ${error.message}`);
    }
  }
}

testLogin().catch(console.error); 