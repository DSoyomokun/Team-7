const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test with a simple, valid email
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testSimpleAuth() {
  console.log(' Simple Authentication Test...\n');
  console.log(` Testing user: ${testUser.email}`);

  try {
    // Test signup
    console.log('   Testing signup...');
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, testUser);
    console.log('   Signup successful:', signupResponse.data.message);
    console.log('   Check your email for confirmation link');

  } catch (error) {
    if (error.response) {
      console.log(`   Signup Error: ${error.response.data.error}`);
    } else {
      console.log(`   Network error: ${error.message}`);
    }
  }

  console.log('\n To test login after email confirmation:');
  console.log('1. Check your email for the confirmation link');
  console.log('2. Click the link to confirm your email');
  console.log('3. Then run: node test-login.js');
}

testSimpleAuth().catch(console.error); 