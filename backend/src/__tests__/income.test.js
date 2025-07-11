// Test file for income transaction scenarios
// Scenario 2: User Adds Income Transaction

const request = require('supertest');
const app = require('../index');

describe('Income Transaction Tests', () => {
  let authToken;
  let userId;

  // Setup: Login before running income tests
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;
    userId = loginResponse.body.data.user.id;
  });

  // Test 1: Add Income Transaction
  test('should add income transaction successfully', async () => {
    const incomeData = {
      amount: 2500.00,
      category: 'Salary',
      description: 'Monthly salary payment',
      date: new Date().toISOString()
    };

    const response = await request(app)
      .post('/api/transactions/income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(incomeData)
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Income transaction added successfully');
    expect(response.body.data).toHaveProperty('amount', incomeData.amount);
    expect(response.body.data).toHaveProperty('category', incomeData.category);
    expect(response.body.data).toHaveProperty('type', 'income');
    expect(response.body.data).toHaveProperty('userId', userId);
  });

  // Test 2: Add Income with Invalid Amount
  test('should reject income transaction with invalid amount', async () => {
    const incomeData = {
      amount: -100,
      category: 'Salary',
      description: 'Invalid negative amount'
    };

    const response = await request(app)
      .post('/api/transactions/income')
      .set('Authorization', `Bearer ${authToken}`)
      .send(incomeData)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Amount must be positive');
  });

  // Test 3: Add Income without Authentication
  test('should reject income transaction without authentication', async () => {
    const incomeData = {
      amount: 1000,
      category: 'Freelance',
      description: 'Freelance work'
    };

    const response = await request(app)
      .post('/api/transactions/income')
      .send(incomeData)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Authentication required');
  });

  // Test 4: Get User Income Summary
  test('should get user income summary after adding transaction', async () => {
    const response = await request(app)
      .get('/api/transactions/income/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('totalIncome');
    expect(response.body.data).toHaveProperty('incomeCount');
    expect(response.body.data).toHaveProperty('transactions');
    expect(Array.isArray(response.body.data.transactions)).toBe(true);
  });
}); 