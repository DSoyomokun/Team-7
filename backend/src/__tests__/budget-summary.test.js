// Test file for budget summary scenarios
// Scenario 4: User Views Budget Summary

const request = require('supertest');
const app = require('../index');

describe('Budget Summary Tests', () => {
  let authToken;
  let userId;

  // Setup: Login and add some test data
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;
    userId = loginResponse.body.data.user.id;

    // Add test income
    await request(app)
      .post('/api/transactions/income')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 3000.00,
        category: 'Salary',
        description: 'Monthly salary'
      });

    // Add test expenses
    await request(app)
      .post('/api/transactions/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 500.00,
        category: 'Food',
        description: 'Grocery shopping'
      });

    await request(app)
      .post('/api/transactions/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 200.00,
        category: 'Transport',
        description: 'Gas and public transport'
      });
  });

  // Test 1: Get Complete Budget Summary
  test('should get complete budget summary with income, expenses, and balance', async () => {
    const response = await request(app)
      .get('/api/budget/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('totalIncome');
    expect(response.body.data).toHaveProperty('totalExpenses');
    expect(response.body.data).toHaveProperty('balance');
    expect(response.body.data).toHaveProperty('incomeCount');
    expect(response.body.data).toHaveProperty('expenseCount');
    expect(response.body.data).toHaveProperty('recentTransactions');
    
    // Verify calculations
    expect(response.body.data.totalIncome).toBe(3000.00);
    expect(response.body.data.totalExpenses).toBe(700.00);
    expect(response.body.data.balance).toBe(2300.00);
    expect(response.body.data.incomeCount).toBe(1);
    expect(response.body.data.expenseCount).toBe(2);
  });

  // Test 2: Get Budget Summary by Date Range
  test('should get budget summary for specific date range', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // 30 days ago
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days from now

    const response = await request(app)
      .get(`/api/budget/summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('totalIncome');
    expect(response.body.data).toHaveProperty('totalExpenses');
    expect(response.body.data).toHaveProperty('balance');
  });

  // Test 3: Get Budget Summary without Authentication
  test('should reject budget summary request without authentication', async () => {
    const response = await request(app)
      .get('/api/budget/summary')
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Authentication required');
  });

  // Test 4: Get Category Breakdown
  test('should get expense breakdown by category', async () => {
    const response = await request(app)
      .get('/api/budget/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('expenseCategories');
    expect(response.body.data).toHaveProperty('incomeCategories');
    
    // Check that our test categories are included
    const expenseCategories = response.body.data.expenseCategories;
    expect(expenseCategories).toHaveProperty('Food');
    expect(expenseCategories).toHaveProperty('Transport');
    expect(expenseCategories.Food).toBe(500.00);
    expect(expenseCategories.Transport).toBe(200.00);
  });

  // Test 5: Get Monthly Budget Progress
  test('should get monthly budget progress and remaining budget', async () => {
    const response = await request(app)
      .get('/api/budget/monthly-progress')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('monthlyIncome');
    expect(response.body.data).toHaveProperty('monthlyExpenses');
    expect(response.body.data).toHaveProperty('remainingBudget');
    expect(response.body.data).toHaveProperty('spendingPercentage');
    
    // Verify spending percentage calculation
    const spendingPercentage = (700 / 3000) * 100;
    expect(response.body.data.spendingPercentage).toBeCloseTo(spendingPercentage, 2);
  });
}); 