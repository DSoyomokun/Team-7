# Quick Reference - Key Files and Entry Points

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