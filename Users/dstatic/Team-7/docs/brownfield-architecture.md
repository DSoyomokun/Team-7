# Financial Tracker Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the Financial Tracker application codebase, including technical debt, missing components, and real-world patterns. It serves as a reference for AI agents working on enhancements to complete the missing functionality and improve the existing system.

### Document Scope

Comprehensive documentation focused on completing missing backend components and enhancing existing functionality for the financial tracker/budgeting application.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| Current | 1.0 | Initial brownfield analysis | Architect |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `backend/src/index.ts` - Server initialization
- **Configuration**: `backend/src/config/database.ts`, `backend/src/.env`
- **Core Business Logic**: `backend/src/services/`, `backend/src/controllers/`
- **API Definitions**: `backend/src/routes/` - Express.js routes
- **Database Models**: `backend/src/models/` - TypeScript models
- **Database Schema**: `backend/src/config/schema.sql` - PostgreSQL schema

### Enhancement Impact Areas

The following areas will be heavily modified/created for the missing functionality:
- `backend/src/controllers/` - New controllers for accounts, categories, goals
- `backend/src/repositories/` - New repositories for accounts, categories, goals  
- `backend/src/routes/` - New route definitions for missing endpoints
- `backend/src/models/` - New models for Account, Category, Goal
- `backend/src/services/` - Enhanced services for core business logic

## High Level Architecture

### Technical Summary

The Financial Tracker is a Node.js/Express backend with Supabase PostgreSQL database, designed as a RESTful API service. Currently implements authentication and basic transaction management, but requires significant enhancement to support the full feature set including account management, categorization, goals tracking, and financial analytics. The system follows a layered architecture with controllers, services, repositories, and models, but has inconsistent implementation patterns that need standardization.

### Actual Tech Stack (from package.json analysis)

| Category | Technology | Version | Notes |
|----------|------------|---------|--------|
| Runtime | Node.js | ^18.x | Current LTS version |
| Framework | Express | ^4.18.x | RESTful API framework |
| Database | Supabase/PostgreSQL | Latest | Hosted PostgreSQL with auth |
| Language | TypeScript | ^5.x | Primary development language |
| Testing | Jest | ^29.x | Unit testing framework |
| Auth | Supabase Auth | Latest | Built-in authentication |
| ORM/Client | @supabase/supabase-js | ^2.x | Database client |

### Repository Structure Reality Check

- Type: Monorepo (backend + mobile)
- Package Manager: npm
- Notable: Backend and mobile are separate but related projects

## Source Tree and Module Organization

### Project Structure (Actual)

```text
backend/
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── authController.ts       # ✅ Complete
│   │   ├── transactionController.ts # ✅ Complete  
│   │   ├── budgetController.ts     # ❌ EMPTY FILE
│   │   ├── userController.ts       # ❌ EMPTY FILE
│   │   ├── reportController.ts     # ❌ EMPTY FILE
│   │   └── MISSING: accountController.ts, categoryController.ts, goalController.ts
│   ├── services/             # Business logic layer
│   │   ├── auth_service.ts         # ✅ Complete
│   │   ├── transaction_service.ts  # ✅ Complete
│   │   ├── user_service.ts         # ❌ EMPTY FILE or minimal
│   │   └── MISSING: account_service.ts, category_service.ts, goal_service.ts
│   ├── repositories/         # Data access layer
│   │   ├── transaction.repository.ts # ✅ Complete
│   │   ├── user.repository.ts      # ✅ Complete
│   │   └── MISSING: account.repository.ts, category.repository.ts, goal.repository.ts
│   ├── models/               # Data models
│   │   ├── Transaction.ts          # ❌ EMPTY FILE
│   │   ├── User.ts                 # ✅ Complete
│   │   └── MISSING: Account.ts, Category.ts, Goal.ts, RecurringPayment.ts
│   ├── routes/               # Express route definitions
│   │   ├── auth.ts                 # ✅ Complete
│   │   ├── transactions.ts         # ✅ Complete
│   │   ├── budget.ts               # ✅ Complete (routes to empty controller)
│   │   ├── users.ts                # ✅ Complete (routes to empty controller)
│   │   ├── reports.ts              # ❌ EMPTY FILE
│   │   └── MISSING: accounts.ts, categories.ts, goals.ts, recurringPayments.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts                 # ✅ Complete - Authentication middleware
│   │   └── validation.ts           # ✅ Complete - Request validation
│   ├── config/               # Configuration files
│   │   ├── database.ts             # ✅ Complete - Supabase config
│   │   └── schema.sql              # ✅ Complete - Database schema
│   ├── adapters/             # External service adapters
│   │   ├── authAdapter.ts          # ✅ Complete
│   │   ├── transactionAdapter.ts   # ✅ Complete
│   │   └── userAdapter.ts          # ✅ Complete
│   └── types/                # TypeScript type definitions
│       ├── index.ts                # ✅ Complete
│       └── express.d.ts            # ✅ Complete
├── __tests__/                # Test files
│   ├── auth.test.ts                # ✅ Complete
│   ├── expense.test.ts             # ✅ Complete
│   ├── income.test.ts              # ✅ Complete
│   └── budget-summary.test.ts      # ✅ Complete
└── package.json              # Dependencies and scripts
```

### Key Modules and Their Purpose

- **Authentication System**: `authController.ts`, `auth_service.ts` - Handles user registration, login, session management (✅ COMPLETE)
- **Transaction Management**: `transactionController.ts`, `transaction_service.ts` - Core financial transaction operations (✅ COMPLETE)
- **Budget Analysis**: `budgetController.ts` - EMPTY FILE - needs implementation
- **User Management**: `userController.ts`, `user_service.ts` - EMPTY FILES - need implementation  
- **Report Generation**: `reportController.ts` - EMPTY FILE - needs implementation

## Data Models and APIs

### Data Models

**Existing Models:**
- **User Model**: See `src/models/User.ts` - User profiles and authentication
- **Transaction Model**: See `src/models/Transaction.ts` - Financial transactions

**Missing Models (CRITICAL):**
- **Account Model**: Bank accounts, wallets, investment accounts
- **Category Model**: Transaction categorization system
- **Goal Model**: Financial goals and tracking
- **RecurringPayment Model**: Subscription and recurring payment tracking

### API Specifications

**Current API Coverage:**
- **Authentication**: ✅ Complete - Registration, login, session management
- **Transactions**: ✅ Complete - CRUD operations with filtering
- **Budget**: ❌ Routes exist but controller is empty - No functionality
- **Users**: ❌ Routes exist but controller is empty - No functionality  
- **Reports**: ❌ Empty route file - No functionality

**Missing API Endpoints (HIGH PRIORITY):**
- **Account Management**: 7 endpoints missing (GET, POST, PUT, DELETE accounts)
- **Category Management**: 6 endpoints missing (CRUD + defaults)
- **Goals Management**: 7 endpoints missing (CRUD + progress tracking)
- **Enhanced Analytics**: 4 endpoints missing (dashboard, trends analysis)

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Massive Implementation Gap**: 80% of functionality missing - Only auth and transactions actually work
2. **Empty Controller Files**: budgetController.ts, userController.ts, reportController.ts exist but are empty shells
3. **Missing Transaction Model**: Transaction.ts file exists but is empty, breaking the data layer
4. **Broken Route Mappings**: Routes point to non-existent controller methods
5. **No Core Business Logic**: Account, Category, Goal, User management completely missing
6. **Inconsistent Architecture**: Some routes exist without controllers, some controllers exist without implementation

### Workarounds and Gotchas

- **Transaction Creation**: Currently works without proper account validation since account management is missing
- **Category References**: Transactions can reference categories that don't exist in the system
- **Balance Calculations**: No automated account balance updates when transactions are created
- **Goal Progress**: No mechanism to update goal progress when relevant transactions occur

## Integration Points and External Dependencies

### External Services

| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------|
| Supabase | Database + Auth | SDK | `src/lib/supabase.ts` |
| Plaid | Bank Integration | REST API | **NOT IMPLEMENTED** |

### Internal Integration Points

- **Authentication Flow**: Supabase Auth → Express middleware → Protected routes
- **Database Operations**: Supabase client → Repository pattern → Services → Controllers
- **Error Handling**: Centralized error responses through controller base patterns

## Development and Deployment

### Local Development Setup

1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `src/.env`
4. Run development server: `npm run dev`
5. Run tests: `npm test`

### Build and Deployment Process

- **Development**: `npm run dev` (nodemon with TypeScript compilation)
- **Build**: `npm run build` (TypeScript compilation)
- **Testing**: `npm test` (Jest test suite)
- **Environment**: Local development only (no deployment setup)

## Testing Reality

### Current Test Coverage

- Unit Tests: 20% coverage (Jest) - Only auth and transactions tested
- Integration Tests: Limited to working endpoints only
- E2E Tests: None
- Manual Testing: Not possible for 80% of planned functionality

### Running Tests

```bash
cd backend
npm test                    # Runs all tests
npm test -- --coverage     # Runs tests with coverage report
```

## Enhancement Impact Analysis

Based on the missing functionality, these areas require significant development:

### Files That Will Need Creation

**New Models (CRITICAL - BLOCKS EVERYTHING):**
- `src/models/Transaction.ts` - Currently empty, needed for all transaction operations
- `src/models/Account.ts` - Account TypeScript model
- `src/models/Category.ts` - Category TypeScript model
- `src/models/Goal.ts` - Goal TypeScript model
- `src/models/RecurringPayment.ts` - Recurring payment model

**New Controllers (HIGH PRIORITY):**
- Complete `src/controllers/budgetController.ts` - Currently empty
- Complete `src/controllers/userController.ts` - Currently empty  
- Complete `src/controllers/reportController.ts` - Currently empty
- `src/controllers/accountController.ts` - Account CRUD operations
- `src/controllers/categoryController.ts` - Category management
- `src/controllers/goalController.ts` - Goals tracking

**New Services (HIGH PRIORITY):**
- `src/services/account_service.ts` - Account business logic
- `src/services/category_service.ts` - Category business logic  
- `src/services/goal_service.ts` - Goals business logic

**New Repositories (HIGH PRIORITY):**
- `src/repositories/account.repository.ts` - Account data access
- `src/repositories/category.repository.ts` - Category data access
- `src/repositories/goal.repository.ts` - Goals data access

**New Models (HIGH PRIORITY):**
- `src/models/Account.ts` - Account TypeScript model
- `src/models/Category.ts` - Category TypeScript model
- `src/models/Goal.ts` - Goal TypeScript model
- `src/models/RecurringPayment.ts` - Recurring payment model

**New Routes (HIGH PRIORITY):**
- `src/routes/accounts.ts` - Account endpoint definitions
- `src/routes/categories.ts` - Category endpoint definitions
- `src/routes/goals.ts` - Goals endpoint definitions

### Files That Will Need Modification

**Transaction Integration (MEDIUM PRIORITY):**
- `src/controllers/transactionController.ts` - Add account balance updates
- `src/services/transaction_service.ts` - Integrate with account/category services
- `src/repositories/transaction.repository.ts` - Enhanced querying with joins

**Enhanced Analytics (MEDIUM PRIORITY):**
- `src/controllers/budgetController.ts` - Add dashboard and trend endpoints
- New: `src/controllers/analyticsController.ts` - Advanced analytics

### Integration Considerations

- All new components must integrate with existing Supabase authentication
- New endpoints must follow existing middleware patterns (`auth.ts`, `validation.ts`)
- Database operations must use established Supabase client patterns
- Error handling must match existing controller response formats

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
cd backend
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode
```

### Debugging and Troubleshooting

- **Logs**: Check console output during development
- **Database**: Use Supabase dashboard for direct database access
- **API Testing**: Use Postman or similar for endpoint testing
- **Common Issues**: Check `.env` file setup and Supabase connection