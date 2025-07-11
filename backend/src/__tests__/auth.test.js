// Test file for authentication scenarios
// Scenario 1: User Registration and Login

const request = require('supertest');
const app = require('../index');

describe('Authentication Tests', () => {
  // Test 1: User Registration
  test('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body.data).toHaveProperty('email', userData.email);
    expect(response.body.data).toHaveProperty('name', userData.name);
    expect(response.body.data).not.toHaveProperty('password'); // Password should not be returned
  });

  // Test 2: User Login
  test('should login user with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('email', loginData.email);
  });

  // Test 3: Login with invalid credentials
  test('should reject login with invalid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  // Test 4: Registration with existing email
  test('should reject registration with existing email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Another User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Email already exists');
  });
}); 