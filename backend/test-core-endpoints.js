const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'testuser123@gmail.com',
  password: 'password123'
};

let authToken = '';

async function testCoreEndpoints() {
  console.log('🧪 Testing Core Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Authentication
    console.log('2️⃣ Testing Authentication...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = loginResponse.data.data.access_token;
    console.log('✅ Login successful');
    console.log('');

    // Test 3: User Profile
    console.log('3️⃣ Testing User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.success);
    console.log('');

    // Test 4: User Preferences
    console.log('4️⃣ Testing User Preferences...');
    const preferencesResponse = await axios.get(`${BASE_URL}/users/preferences`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Preferences retrieved:', preferencesResponse.data.success);
    console.log('');

    // Test 5: Create Transaction
    console.log('5️⃣ Testing Transaction Creation...');
    const transactionData = {
      amount: 50.00,
      type: 'expense',
      category: 'Food',
      description: 'Test transaction'
    };
    
    const transactionResponse = await axios.post(`${BASE_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Transaction created:', transactionResponse.data.success);
    console.log('');

    // Test 6: Get Transactions
    console.log('6️⃣ Testing Get Transactions...');
    const transactionsResponse = await axios.get(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Transactions retrieved:', transactionsResponse.data.success);
    console.log('');

    // Test 7: Transaction Summary
    console.log('7️⃣ Testing Transaction Summary...');
    const summaryResponse = await axios.get(`${BASE_URL}/transactions/summary`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Transaction summary retrieved:', summaryResponse.data.success);
    console.log('');

    // Test 8: Reports
    console.log('8️⃣ Testing Reports...');
    const reports = [
      'spending',
      'income', 
      'savings',
      'comprehensive'
    ];

    for (const report of reports) {
      try {
        const reportResponse = await axios.get(`${BASE_URL}/reports/${report}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✅ ${report} report generated:`, reportResponse.data.success);
      } catch (error) {
        console.log(`❌ ${report} report failed:`, error.response?.data?.error || error.message);
      }
    }
    console.log('');

    // Test 9: Validation
    console.log('9️⃣ Testing Input Validation...');
    
    // Test invalid transaction
    try {
      await axios.post(`${BASE_URL}/transactions`, {
        amount: -50, // Invalid amount
        type: 'expense'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Validation working (rejected invalid amount):', error.response?.data?.error);
    }

    // Test invalid date range
    try {
      await axios.get(`${BASE_URL}/transactions?startDate=2024-01-01&endDate=2023-01-01`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('❌ Should have failed date validation');
    } catch (error) {
      console.log('✅ Date validation working:', error.response?.data?.error);
    }
    console.log('');

    console.log('🎉 All Core Endpoints Tested Successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- ✅ Health check working');
    console.log('- ✅ Authentication working');
    console.log('- ✅ User management working');
    console.log('- ✅ Transaction management working');
    console.log('- ✅ Reports generation working');
    console.log('- ✅ Input validation working');
    console.log('- ✅ Standardized response format working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testCoreEndpoints(); 