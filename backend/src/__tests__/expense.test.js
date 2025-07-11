// Test file for expense transaction scenarios
// Scenario 3: User Adds Expense Transaction

const request = require('supertest');
const app = require('../index');

describe('Expense Transaction Tests', () => {
  let authToken;
  let userId;

  // Setup: Login before running expense tests
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

  // Test 1: Add Expense Transaction
  test('should add expense transaction successfully', async () => {
    const expenseData = {
      amount: 150.00,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date().toISOString()
    };

    const response = await request(app)
      .post('/api/transactions/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(expenseData)
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Expense transaction added successfully');
    expect(response.body.data).toHaveProperty('amount', expenseData.amount);
    expect(response.body.data).toHaveProperty('category', expenseData.category);
    expect(response.body.data).toHaveProperty('type', 'expense');
    expect(response.body.data).toHaveProperty('userId', userId);
  });

  // Test 2: Add Expense with Invalid Amount
  test('should reject expense transaction with invalid amount', async () => {
    const expenseData = {
      amount: 0,
      category: 'Transport',
      description: 'Invalid zero amount'
    };

    const response = await request(app)
      .post('/api/transactions/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(expenseData)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Amount must be greater than 0');
  });

  // Test 3: Add Expense without Category
  test('should reject expense transaction without category', async () => {
    const expenseData = {
      amount: 50.00,
      description: 'Missing category'
    };

    const response = await request(app)
      .post('/api/transactions/expense')
      .set('Authorization', `Bearer ${authToken}`)
      .send(expenseData)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Category is required');
  });

  // Test 4: Get User Expense Summary
  test('should get user expense summary after adding transaction', async () => {
    const response = await request(app)
      .get('/api/transactions/expense/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('totalExpenses');
    expect(response.body.data).toHaveProperty('expenseCount');
    expect(response.body.data).toHaveProperty('transactions');
    expect(Array.isArray(response.body.data.transactions)).toBe(true);
  });

  // Test 5: Get Expenses by Category
  test('should get expenses filtered by category', async () => {
    const response = await request(app)
      .get('/api/transactions/expense?category=Food')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('transactions');
    expect(Array.isArray(response.body.data.transactions)).toBe(true);
    
    // All returned transactions should be in the Food category
    response.body.data.transactions.forEach(transaction => {
      expect(transaction.category).toBe('Food');
    });
  });
}); 