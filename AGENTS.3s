# Agents
## Dev Commands
- `npm run start:dev` — watch mode
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier write
- `npm run test` — Jest unit tests
- `npm run test:e2e` — Jest e2e tests
- `npm run test:cov` — coverage
- `npm run build` — `nest build`
## Stack
- NestJS + TypeORM + PostgreSQL (Neon DB)
- JWT auth via `@nestjs/passport` + `passport-jwt`
- Validation: `class-validator` + `class-transformer` with global whitelist pipe
- Entities auto-loaded; `synchronize: true`
## Key Config
- **Port**: defaults to 3000 in `src/main.ts`, overridden by `PORT` env var (`.env` sets 5000)
## Modules
`src/auth/`, `src/users/`, `src/commerces/`, `src/products/`, `src/orders/`, `src/dashboard/`
## Architecture
- Entry: `src/main.ts` → `AppModule` → imports all feature modules
- ConfigModule is global; TypeORM configured async with `ConfigModule`
- Auth guards in `src/auth/guards/`, strategies in `src/auth/strategies/`, DTOs in `src/auth/dto/`
## Database Schema
### users
| Column | Type | Constraints |
|--------|------|------------|
| id | uuid | PK, auto |
| name | varchar | NOT NULL |
| email | varchar | UNIQUE, NOT NULL |
| password | varchar | NOT NULL, select:false |
| role | enum(USER,OWNER,ADMIN) | DEFAULT USER |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |
### comercios
| Column | Type | Constraints |
|--------|------|------------|
| id | uuid | PK, auto |
| name | varchar | NOT NULL |
| description | varchar | NULL |
| address | varchar | NOT NULL |
| phone | varchar | NULL |
| isActive | boolean | DEFAULT true |
| ownerId | uuid | FK → users |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |
### products
| Column | Type | Constraints |
|--------|------|------------|
| id | uuid | PK, auto |
| name | varchar | NOT NULL |
| description | varchar | NULL |
| originalPrice | decimal(10,2) | NOT NULL |
| price | decimal(10,2) | NOT NULL (oferta) |
| quantity | int | NOT NULL |
| expiryDate | timestamp | NULL |
| isActive | boolean | DEFAULT true |
| commerceId | uuid | FK → comercios |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |
### orders
| Column | Type | Constraints |
|--------|------|------------|
| id | uuid | PK, auto |
| productId | uuid | FK → products |
| buyerId | uuid | FK → users |
| quantity | int | NOT NULL |
| totalPrice | decimal(10,2) | NOT NULL |
| status | enum(confirmed,cancelled) | DEFAULT confirmed |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |
## Testing Notes
- Unit tests: `src/**/*.spec.ts`
- e2e tests: `test/`
- No test db needed for unit tests
