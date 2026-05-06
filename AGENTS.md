# AGENTS.md

## Project Overview

NestJS 11 + TypeScript backend for "Eco Bocado" — a food waste reduction platform. PostgreSQL database via TypeORM.

## Developer Commands

```
npm install              # Install dependencies
npm run start:dev        # Dev server with watch (port from env, default 3000)
npm run start:debug      # Dev server with debugging enabled
npm run start:prod       # Production: node dist/main
npm run build            # Build via nest build (also vercel-build)
npm run lint             # ESLint with --fix (flat config: eslint.config.mjs)
npm run format           # Prettier on src/ and test/
npm run test             # Jest unit tests (rootDir: src, pattern: *.spec.ts)
npm run test -- <file>   # Run single test file (e.g., npm run test -- auth.service.spec.ts)
npm run test:e2e         # Jest e2e tests (config: test/jest-e2e.json, pattern: *.e2e-spec.ts)
```

No dedicated typecheck script — `nest build` performs type checking.

## Environment Setup

Copy `.env.example` to `.env`. Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL (required) |
| `JWT_SECRET` | JWT signing key (required; throws on startup if missing) |
| `PORT` | Server port (default: 3000 in code, 5000 in example) |

`.env` is gitignored. A running PostgreSQL instance is required.

## Architecture

**Entry point**: `src/main.ts` — bootstraps `AppModule` with a global `ValidationPipe` (whitelist + transform + forbidNonWhitelisted).

**Feature modules** (all in `src/`):

| Module | Route | Entities | Auth |
|---|---|---|---|
| `auth/` | `/auth` | — | JWT login, register, register-commerce, me, logout |
| `users/` | none (no controller) | User, Profile, Review, Notification | — |
| `commerces/` | `/commerces` | Commerce, Location | Write routes guarded |
| `products/` | `/products` | Product, Category | Write routes guarded |
| `orders/` | `/orders` | Order | All routes guarded |
| `dashboard/` | `/dashboard` | — (reads products, orders, commerces) | — |

**Auth flow**: Passport JWT strategy extracts Bearer token from `Authorization` header. Payload provides `{ userId, email, role }` via `req.user`. Password hashing via `bcrypt`.

**Cross-module dependencies**: `AuthModule` imports `UsersModule` and `CommercesModule`. `DashboardModule` reads across products, orders, and commerces.

## Key Conventions & Gotchas

- **No migrations** — `synchronize: true` + `autoLoadEntities: true` in TypeORM config. Schema auto-syncs on startup. Do not generate migration files.
- **Strict types disabled** — `strictNullChecks: false`, `noImplicitAny: false` in tsconfig. Expect `any` usage.
- **Role-based access** — JWT payload includes a `role` field. Guards rely on `JwtAuthGuard` from `auth/guards/jwt-auth.guard.ts`.
- **DTO validation** — All endpoints use `class-validator` DTOs. The global pipe strips unknown fields and transforms payloads.
- **Module exports** — `UsersModule` and `CommercesModule` export their `TypeOrmModule` alongside their services, so other modules can access their repositories.
- **Only 2 unit test files exist** — `auth.service.spec.ts` and `app.controller.spec.ts`. Most modules have no tests.
- **Deploy target**: Vercel (`vercel-build` script defined).
