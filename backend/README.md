# Team-7 Budget Backend API

A TypeScript Node.js/Express backend API for the Team-7 Budget tracking application.

## Features

- **User Authentication** - Registration and login with JWT tokens
- **Income Management** - Add and track income transactions
- **Expense Management** - Add and track expense transactions  
- **Budget Summary** - View financial overview and analytics
- **Category Management** - Organize transactions by categories
- **RESTful API** - Clean, documented endpoints
- **TypeScript** - Full type safety and modern development experience
- **Adapter Pattern** - Clean data access layer for easy database integration

## Project Structure

```
backend/
├── src/
│   ├── adapters/       # Data access layer with transaction management
│   ├── controllers/    # Business logic for API endpoints
│   ├── routes/         # API route definitions
│   ├── shared/         # Shared data stores and utilities
│   ├── types/          # TypeScript type definitions
│   ├── __tests__/      # Unit tests
│   └── index.ts        # Main server file
├── dist/               # Compiled TypeScript output
├── tsconfig.json       # TypeScript configuration
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

**Test Files:** `src/__tests__/auth.test.ts`

#### **Scenario 2: User Adds Income Transaction**
- User logs in and adds income transaction with amount and category
- System validates transaction data and updates user's income summary
- User can view their income history and totals

**Test Files:** `src/__tests__/income.test.ts`

#### **Scenario 3: User Adds Expense Transaction**
- User logs in and adds expense transaction with amount and category
- System validates transaction data and updates user's expense summary
- User can filter expenses by category and view summaries

**Test Files:** `src/__tests__/expense.test.ts`

#### **Scenario 4: User Views Budget Summary**
- User logs in and views complete financial overview
- System calculates total income, expenses, and remaining balance
- User can view category breakdowns and monthly progress

**Test Files:** `src/__tests__/budget-summary.test.ts`

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

## Architecture

### Adapter Pattern Implementation

This project implements the **Adapter Pattern** for data access, providing a clean abstraction layer between business logic and data storage.

#### Benefits
- **Database Independence** - Easy migration from in-memory storage to any database
- **Consistent API** - Standardized methods for data operations
- **Testability** - Simple to mock and test data operations
- **Maintainability** - Centralized data access logic

#### Current Implementation
```typescript
// src/adapters/transactionAdapter.ts
const transactionAdapter = {
  addTransaction: (transaction) => Transaction,
  getUserTransactions: (userId, type?) => Transaction[],
  getUserIncome: (userId) => IncomeData,
  getUserExpenses: (userId, category?) => ExpenseData,
  updateTransaction: (id, updates) => Transaction | null,
  deleteTransaction: (id) => Transaction | null
};
```

#### Usage in Controllers
```typescript
// Controllers use adapter instead of direct data access
const transaction = transactionAdapter.addTransaction(transactionData);
const incomeData = transactionAdapter.getUserIncome(req.userId);
```

#### Future Database Integration
The adapter pattern makes it easy to switch from in-memory storage to any database:
```typescript
// Easy to replace implementation without changing controllers
const transactionAdapter = {
  addTransaction: async (transaction) => {
    return await db.transactions.create(transaction);
  },
  // ... other methods
};
```

## TypeScript Development

This project is built with TypeScript for enhanced developer experience and type safety.

### Key TypeScript Features
- **Strict type checking** - Catches errors at compile time
- **Interface definitions** - Clear data structure contracts
- **ES6+ modules** - Modern import/export syntax
- **Express typing** - Full type support for requests and responses
- **Test typing** - Type-safe test development with Jest

### Building and Running
```bash
# Development (with auto-reload)
npm run dev

# Build for production
npm run build

# Run built application
npm start
```

## Development

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build)
- `npm run dev` - Start development server with ts-node-dev
- `npm run dev:js` - Start development server with JavaScript fallback
- `npm test` - Run tests with Jest and ts-jest
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
