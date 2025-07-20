const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test user data
const testUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123'
  },
  {
    email: 'jane.smith@example.com', 
    password: 'securepass456'
  },
  {
    email: 'admin@team7.com',
    password: 'admin123'
  }
];

async function testAuth() {
  console.log('Testing Authentication API...\n');

  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    console.log(` Testing user ${i + 1}: ${user.email}`);

    try {
      // Test signup
      console.log('   Testing signup...');
      const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, {
        email: user.email,
        password: user.password
      });
      console.log('   Signup successful:', signupResponse.data.message);

      // Test login
      console.log('   Testing login...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      console.log('  Login successful:', loginResponse.data.message);

      // Test session
      console.log('  Testing session...');
      const sessionResponse = await axios.get(`${BASE_URL}/auth/session`);
      console.log('  Session retrieved');

    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.error}`);
      } else {
        console.log(`  Network error: ${error.message}`);
      }
    }

    console.log(''); // Empty line for readability
  }

  console.log('🏁 Auth testing completed!');
}

// Run the test
testAuth().catch(console.error); 