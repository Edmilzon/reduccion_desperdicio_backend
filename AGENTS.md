# AGENTS.md

NestJS 11 + TypeScript backend for "Eco Bocado" — a food waste reduction platform. PostgreSQL via TypeORM.

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Build (uses `deleteOutDir: true`, so dist is wiped) |
| `npm run lint` | ESLint flat config with `--fix` |
| `npm run test` | Jest (rootDir: `src`, `*.spec.ts`) |
| `npm run test -- <file>` | Single test file |
| `npm run test:e2e` | Jest e2e (`test/jest-e2e.json`) |
| `npm run test:cov` | Jest with coverage |
| `npm run format` | Prettier `src/` + `test/` |
| `npm run vercel-build` | Same as `build`, used by Vercel deploy |

Run `npm run build` after any change to verify compilation.

## Environment

`.env.example` → `.env`. Required: `DATABASE_URL` (PostgreSQL), `JWT_SECRET`. Optional: `JWT_EXPIRATION` (default `24h`), `PORT` (default `3000`, but `.env.example` uses `5000`).

## Schema

`synchronize: false` — no auto-sync. Run `database/seed.sql` or `database/create_database.sql` manually.

## Key Conventions

- **No strict types** — `strictNullChecks: false`, `noImplicitAny: false`. Use `any` freely.
- **Global ValidationPipe** — `whitelist`, `forbidNonWhitelisted`, `transform` in `main.ts`.
- **Modules export `TypeOrmModule` + service** — UsersModule, CommercesModule, ProductsModule, OrdersModule all do this for cross-module access.
- **Product DELETE** — Sets status `SOLD_OUT`, does not remove the row.
- **Order flow** — Create decrements quantity (sets `SOLD_OUT` at 0, auto-creates notification). Cancel restores quantity + sets `ACTIVE`.
- **Previously undocumented in AGENTS.md** — `GET /orders/merchant` (merchant sees their commerce orders) and `PATCH /orders/:id/mark-paid-delivered` (merchant marks cash orders paid+delivered) were missing from the old file. Both are in `api/orders.http`.
- **DeliveryStatus enum** — Values: `pending`, `delivered`, `qr_code_validation`, `not_picked_up`. AGENTS.md previously omitted the last variant.
- **FK naming drift** — Older entities (Profile, Location, Review, Notification) use `snake_case` FK columns; newer ones (Commerce → User `ownerId`, Product → Commerce/Location/Category, Order → User/Product) use `camelCase`. Both patterns coexist.
- **E2E test expects `"Hello World!"`** — but `src/app.service.ts` returns `"Test para Nestjs"`. E2E will fail.
- **Base branch is `develop`** — do not commit to `main` directly.

## Auth

JWT via Passport. Payload: `{ sub, email, role }`. Strategy validates user exists in DB by `payload.sub`. Guard: `JwtAuthGuard`.

| Endpoint | Auth | Notes |
|----------|------|-------|
| `POST /auth/register` | Public | role defaults to CLIENT |
| `POST /auth/register-commerce` | Public | Creates user + commerce |
| `POST /auth/login` | Public | Returns JWT |
| `GET /auth/me` | JWT | Returns profile (with commerce data for MERCHANT) |
| `POST /auth/logout` | JWT | Client-side token removal only |

## Source Layout

```
src/
├── main.ts                    # ValidationPipe, listen 0.0.0.0:{PORT}
├── app.module.ts              # ConfigModule (global), TypeOrm async
├── app.controller.ts          # GET / → "Test para Nestjs"
├── auth/                      # auth.controller, auth.service, guards/, strategies/
├── users/                     # Entities only: User, Profile, Review, Notification
├── commerces/                 # commerces.controller, restaurants.controller
├── products/                  # products.controller, products.service
└── orders/                    # orders.controller, orders.service
```

Table mappings: `User` → `users`, `Profile` → `profiles`, `Commerce` → `restaurants`, `Product` → `product_excedente`, `Order` → `orders`.

## Resources

- `api/*.http` — REST client files covering all endpoints
- `database/` — SQL scripts
- `AUTH_FLOW.md` — Auth flow documentation
