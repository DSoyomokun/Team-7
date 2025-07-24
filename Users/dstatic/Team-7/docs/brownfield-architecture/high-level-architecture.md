# High Level Architecture

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