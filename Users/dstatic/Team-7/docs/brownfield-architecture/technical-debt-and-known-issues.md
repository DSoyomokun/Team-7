# Technical Debt and Known Issues

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