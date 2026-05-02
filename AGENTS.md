# Agents

## Dev Commands
- `npm run start:dev` — watch mode (port 5000 from .env)
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier write
- `npm run test` — Jest unit tests
- `npm run test:e2e` — Jest e2e tests
- `npm run test:cov` — coverage
- `npm run build` — `nest build`

## Stack
- NestJS + TypeORM + PostgreSQL (Neon DB)
- JWT auth via `@nestjs/passport` + `passport-jwt`
- Validation: `class-validator` + `class-transformer` with global **whitelist pipe** (main.ts:7-11)
- Entities auto-loaded; `synchronize: true` (dev only!)

## Key Config (.env)
- `PORT=5000` (main.ts defaults to 3000 if missing)
- `DATABASE_URL` — Neon PostgreSQL
- `JWT_SECRET` — auth secret

## Modules
`src/auth/`, `src/users/`, `src/commerces/`, `src/products/`, `src/orders/`, `src/dashboard/`

## Architecture
- Entry: `src/main.ts` → `AppModule`
- Auth guard: `src/auth/guards/jwt-auth.guard.ts`
- JWT strategy: `src/auth/strategies/jwt.strategy.ts`
- DTOs: `src/auth/dto/`, `src/**/dto/`

## Gotchas
- All DTOs/entities must use class-validator decorators for whitelist to work
- Guards are applied per-controller or per-route, not globally
- TypeORM `synchronize: true` — never use in production (auto-migrates schema)
- e2e tests require Neon DB to be accessible
- **All entity IDs are integer (auto-increment), not UUID** — controllers parse params with `+id`
- User roles: `client`, `merchant`, `admin` (not USER/OWNER/ADMIN)
- Product status: `active`, `sold_out`, `expired`
- Order has paymentMethod, paymentStatus, deliveryStatus fields