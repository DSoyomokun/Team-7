# Team-7 Budget Backend API

A Node.js/Express backend API for the Team-7 Budget tracking application.

## Features

- **User Authentication** - Registration and login with JWT tokens
- **Income Management** - Add and track income transactions
- **Expense Management** - Add and track expense transactions  
- **Budget Summary** - View financial overview and analytics
- **Category Management** - Organize transactions by categories
- **RESTful API** - Clean, documented endpoints

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic for API endpoints
│   ├── models/         # Data models and database interactions
│   ├── routes/         # API route definitions
│   ├── middlewares/    # Authentication, validation, error handling
│   ├── utils/          # Helper functions and utilities
│   ├── __tests__/      # Unit tests
│   └── index.js        # Main server file
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## Testing

This project includes comprehensive unit tests covering four main scenarios:

### **Test Scenarios**

#### **Scenario 1: User Registration and Login**
- User creates a new account with email and password
- User successfully logs in and receives authentication token
- System validates credentials and handles errors

**Test Files:** `src/__tests__/auth.test.js`

#### **Scenario 2: User Adds Income Transaction**
- User logs in and adds income transaction with amount and category
- System validates transaction data and updates user's income summary
- User can view their income history and totals

**Test Files:** `src/__tests__/income.test.js`

#### **Scenario 3: User Adds Expense Transaction**
- User logs in and adds expense transaction with amount and category
- System validates transaction data and updates user's expense summary
- User can filter expenses by category and view summaries

**Test Files:** `src/__tests__/expense.test.js`

#### **Scenario 4: User Views Budget Summary**
- User logs in and views complete financial overview
- System calculates total income, expenses, and remaining balance
- User can view category breakdowns and monthly progress

**Test Files:** `src/__tests__/budget-summary.test.js`

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### **Test Coverage**

The tests cover:
-  **Authentication flows** (registration, login, validation)
-  **Income transaction management** (add, validate, summarize)
-  **Expense transaction management** (add, validate, filter)
-  **Budget summary calculations** (totals, categories, progress)
-  **Error handling** (invalid data, authentication failures)
-  **API response formats** (consistent JSON structure)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Income Transactions
- `POST /api/transactions/income` - Add income transaction
- `GET /api/transactions/income/summary` - Get income summary

### Expense Transactions
- `POST /api/transactions/expense` - Add expense transaction
- `GET /api/transactions/expense/summary` - Get expense summary
- `GET /api/transactions/expense?category=Food` - Filter by category

### Budget Summary
- `GET /api/budget/summary` - Complete budget overview
- `GET /api/budget/categories` - Category breakdown
- `GET /api/budget/monthly-progress` - Monthly spending progress

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Environment Variables
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=your_database_url_here
```


MIT License 
