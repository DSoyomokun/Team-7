# Data Models and APIs

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