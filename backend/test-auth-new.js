const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
  console.log('🧪 Testing Enhanced Authentication System...\n');

  try {
    // Test 1: Sign up a new user with realistic email
    console.log('1. Testing user signup...');
    const signupResponse = await axios.post(`${BASE_URL}/signup`, {
      email: 'testuser123@gmail.com',
      password: 'password123',
      name: 'Test User'
    });
    console.log('✅ Signup successful:', signupResponse.data.message);

    // Test 2: Login with the user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'testuser123@gmail.com',
      password: 'password123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('📋 Access token received:', loginResponse.data.data.access_token ? 'Yes' : 'No');

    // Test 3: Verify token
    console.log('\n3. Testing token verification...');
    const verifyResponse = await axios.post(`${BASE_URL}/verify`, {
      token: loginResponse.data.data.access_token
    });
    console.log('✅ Token verification successful:', verifyResponse.data.success);

    // Test 4: Get session
    console.log('\n4. Testing session retrieval...');
    const sessionResponse = await axios.get(`${BASE_URL}/session`);
    console.log('✅ Session retrieval successful:', sessionResponse.data.success);

    // Test 5: Logout
    console.log('\n5. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`);
    console.log('✅ Logout successful:', logoutResponse.data.message);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📊 Authentication System Status: ✅ READY');

  } catch (error) {
    console.error('\n❌ Authentication test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data.error);
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    console.log('\n📊 Authentication System Status: ❌ NEEDS FIXING');
  }
}

// Run the test
testAuth(); 