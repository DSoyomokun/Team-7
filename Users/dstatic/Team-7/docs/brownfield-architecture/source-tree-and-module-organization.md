# Source Tree and Module Organization

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