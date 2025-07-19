// Scenario 1: User Registration and Login
import request from 'supertest';
import app from '../index';
import { users } from '../shared/data';

describe('Authentication Tests', () => {
  // Clear users array before each test
  beforeEach(() => {
    users.length = 0;
  });

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
    expect(response.body.data).toHaveProperty('email', userData.email);
    expect(response.body.data).toHaveProperty('name', userData.name);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).not.toHaveProperty('password');
  });

  // Test 2: User Login
  test('should login user with valid credentials', async () => {
    // First register a user
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

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
    expect(response.body.data.user).toHaveProperty('name');
  });

  // Test 3: Invalid Login
  test('should reject login with invalid credentials', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  // Test 4: Duplicate Registration
  test('should reject registration with existing email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    // First registration should succeed
    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Second registration with same email should fail
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'User already exists');
  });
});