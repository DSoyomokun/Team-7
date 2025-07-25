# Team-7 Budget API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { ... } // Optional pagination info
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "data": { ... } // Optional error details
}
```

---

## Authentication Endpoints

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/session
Get current session information.

**Response:**
```json
{
  "success": true,
  "data": {
    "session": { ... }
  }
}
```

### POST /api/auth/verify
Verify JWT token.

**Request Body:**
```json
{
  "token": "jwt_token"
}
```

### POST /api/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

---

## User Management Endpoints

### GET /api/users/profile
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user_id",
      "email": "user@example.com",
      "full_name": "John Doe",
      "currency_preference": "USD",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "full_name": "John Smith",
  "currency_preference": "EUR"
}
```

### GET /api/users/preferences
Get user preferences.

### PUT /api/users/preferences
Update user preferences.

### GET /api/users/stats
Get user statistics.

### PUT /api/users/password
Change password.

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### DELETE /api/users/account
Delete user account.

---

## Transaction Endpoints

### POST /api/transactions
Create a new transaction (unified income/expense).

**Request Body:**
```json
{
  "amount": 100.50,
  "type": "expense",
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/transactions/income
Create income transaction (legacy support).

### POST /api/transactions/expense
Create expense transaction (legacy support).

### GET /api/transactions
Get user transactions with optional filters.

**Query Parameters:**
- `type`: "income" | "expense"
- `category`: string
- `startDate`: ISO date string
- `endDate`: ISO date string
- `page`: number
- `limit`: number

**Response:**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "transaction_id",
        "amount": 100.50,
        "type": "expense",
        "category": "Food",
        "description": "Grocery shopping",
        "date": "2024-01-01T00:00:00.000Z",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET /api/transactions/summary
Get transaction summary.

**Response:**
```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully",
  "data": {
    "income": {
      "totalIncome": 5000,
      "incomeCount": 10,
      "transactions": [...]
    },
    "expenses": {
      "totalExpenses": 3000,
      "expenseCount": 15,
      "transactions": [...]
    },
    "netAmount": 2000
  }
}
```

---

## Budget Endpoints

### GET /api/budget
Get user budget information.

### POST /api/budget
Create or update budget.

### GET /api/budget/limits
Get budget limits.

### POST /api/budget/limits
Set budget limits.

---

## Goals Endpoints

### GET /api/goals
Get user financial goals.

### POST /api/goals
Create a new financial goal.

### PUT /api/goals/:id
Update a financial goal.

### DELETE /api/goals/:id
Delete a financial goal.

---

## Dashboard Endpoints

### GET /api/dashboard
Get dashboard overview data.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 5000,
      "totalExpenses": 3000,
      "netSavings": 2000,
      "savingsRate": 40
    },
    "recentTransactions": [...],
    "budgetStatus": [...],
    "goals": [...]
  }
}
```

---

## Reports Endpoints

### GET /api/reports/spending
Get spending report.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `category`: string

### GET /api/reports/income
Get income report.

### GET /api/reports/budget-vs-actual
Get budget vs actual report.

### GET /api/reports/savings
Get savings report.

### GET /api/reports/comprehensive
Get comprehensive financial report.

---

## Account Management Endpoints

### GET /api/accounts
Get user accounts.

### POST /api/accounts
Create a new account.

### PUT /api/accounts/:id
Update an account.

### DELETE /api/accounts/:id
Delete an account.

---

## Health Check

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses

---

## Security Features

- JWT token authentication
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Rate limiting
- Secure password hashing 