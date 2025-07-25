"use strict";
// Test file for budget summary scenarios
// Scenario 4: User Views Budget Summary
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const data_1 = require("../shared/data");
describe('Budget Summary Tests', () => {
    let authToken;
    let userId;
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };
    // Setup: Register and login before all tests
    beforeAll(async () => {
        // Register the test user
        await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(testUser);
        // Login to get the auth token
        const loginResponse = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.body.data.token;
        userId = loginResponse.body.data.user.id;
    });
    // Setup test data before each test
    beforeEach(async () => {
        // Clear transactions
        data_1.transactions.length = 0;
        // Add test income
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/income')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 3000.00,
            category: 'Salary',
            description: 'Monthly salary'
        });
        // Add test expenses
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 500.00,
            category: 'Food',
            description: 'Grocery shopping'
        });
        await (0, supertest_1.default)(index_1.default)
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
        const response = await (0, supertest_1.default)(index_1.default)
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
    // Test 2: Get Expense Breakdown by Category
    test('should get expense breakdown by category', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/budget/categories')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('expenseCategories');
        expect(response.body.data).toHaveProperty('incomeCategories');
        // Verify expense categories
        expect(response.body.data.expenseCategories).toHaveProperty('Food', 500.00);
        expect(response.body.data.expenseCategories).toHaveProperty('Transport', 200.00);
        // Verify income categories
        expect(response.body.data.incomeCategories).toHaveProperty('Salary', 3000.00);
    });
    // Test 3: Get Monthly Progress
    test('should get monthly budget progress and remaining budget', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/budget/monthly-progress')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('monthlyIncome', 3000.00);
        expect(response.body.data).toHaveProperty('monthlyExpenses', 700.00);
        expect(response.body.data).toHaveProperty('remainingBudget', 2300.00);
        expect(response.body.data).toHaveProperty('spendingPercentage');
        // Verify spending percentage calculation
        const expectedPercentage = (700 / 3000) * 100;
        expect(response.body.data.spendingPercentage).toBeCloseTo(expectedPercentage, 2);
    });
});
//# sourceMappingURL=budget-summary.test.js.map