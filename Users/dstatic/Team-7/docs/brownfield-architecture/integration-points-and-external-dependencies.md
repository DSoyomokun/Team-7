# Integration Points and External Dependencies

### External Services

| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------||
| Supabase | Database + Auth | SDK | `src/lib/supabase.ts` |
| Plaid | Bank Integration | REST API | **NOT IMPLEMENTED** |

### Internal Integration Points

- **Authentication Flow**: Supabase Auth → Express middleware → Protected routes
- **Database Operations**: Supabase client → Repository pattern → Services → Controllers
- **Error Handling**: Centralized error responses through controller base patterns