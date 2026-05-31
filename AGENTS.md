# AGENTS.md

NestJS 11 + TypeScript backend for "Eco Bocado" — a food waste reduction platform. PostgreSQL via TypeORM. Base branch: `develop`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Build (`deleteOutDir: true`, dist is wiped) |
| `npm run lint` | ESLint flat config (tseslint recommendedTypeChecked, `--fix`) |
| `npm run test` | Jest (rootDir: `src`, `*.spec.ts`) |
| `npm run test -- <file>` | Single test file |
| `npm run test:e2e` | Jest e2e (`test/jest-e2e.json`) |
| `npm run test:cov` | Jest with coverage |
| `npm run format` | Prettier `src/` + `test/` (singleQuote, trailingComma: all) |

Run `npm run build` after any change to verify compilation.

## Environment

`.env.example` → `.env`. Required: `DATABASE_URL` (PostgreSQL with `sslmode=require`), `JWT_SECRET`. Optional: `JWT_EXPIRATION` (default `24h`), `PORT` (default `3000` in code, `.env.example` uses `5000`). DB SSL uses `rejectUnauthorized: false`.

## Schema

`synchronize: false` — no auto-sync. Run `database/seed.sql` or `database/create_database.sql` manually.

## Key Conventions

- **No strict types** — `strictNullChecks: false`, `noImplicitAny: false`. Use `any` freely.
- **Global ValidationPipe** — `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` in `main.ts`.
- **Modules export `TypeOrmModule` + service** — UsersModule, CommercesModule, ProductsModule, OrdersModule all do this for cross-module access.
- **Product DELETE** — Sets status `SOLD_OUT`, does not remove the row.
- **Order create** — Decrements quantity; at 0 sets `SOLD_OUT`, auto-creates notification. **Cancel** restores quantity + sets `ACTIVE`.
- **Order cash flow** — Merchant calls `PATCH /orders/:id/mark-paid-delivered` (single step). `POST /orders/:id/pay` rejects cash orders.
- **Order online flow** — Client calls `POST /orders/:id/pay`, then merchant calls `PATCH /orders/:id/deliver`.
- **Order not picked up** — `PATCH /orders/:id/mark-not-picked-up` sets `deliveryStatus=not_picked_up` + `status=cancelled`. Does **not** restore stock.
- **DeliveryStatus enum** — `pending`, `delivered`, `qr_code_validation`, `not_picked_up`.
- **FK naming drift** — Older entities (Profile: `user_id`, Location: `restaurant_id`, Review: `client_id`/`restaurant_id`/`order_id`, Notification: `user_id`) use `snake_case`. Newer ones (Commerce: `ownerId`, Product: `commerceId`/`locationId`/`categoryId`, Order: `buyerId`/`productId`) use `camelCase`. Both coexist.
- **E2E test expects `"Hello World!"`** — but `src/app.service.ts` returns `"Test para Nestjs"`. E2E will fail.
- **AuthService** uses `DataSource.getRepository()` directly for Profile/Commerce (not injected repos).

## Auth

JWT via Passport. Payload: `{ sub, email, role }`. `JwtStrategy` validates user exists in DB by `payload.sub`. Guard: `JwtAuthGuard`.

| Endpoint | Auth | Notes |
|----------|------|-------|
| `POST /auth/register` | Public | Role defaults to `CLIENT` |
| `POST /auth/register-commerce` | Public | Creates user (MERCHANT) + commerce in one step |
| `POST /auth/login` | Public | Returns JWT (includes commerce data for MERCHANT) |
| `GET /auth/me` | JWT | Returns profile (with commerce data for MERCHANT) |
| `POST /auth/logout` | JWT | Client-side token removal only (stateless JWT) |

## Table Mappings (non-obvious names)

| Entity | Table | Notes |
|--------|-------|-------|
| `User` | `users` | PK column: `user_id`, role column default `'client'` |
| `Profile` | `profiles` | FK: `user_id` (snake_case) |
| `Commerce` | `restaurants` | FK: `ownerId` (camelCase) |
| `Location` | `locations` | FK: `restaurant_id` (snake_case) |
| `Product` | `product_excedente` | FK: `commerceId`, `locationId`, `categoryId` (camelCase) |
| `Order` | `orders` | FK: `buyerId`, `productId` (camelCase) |
| `Category` | `categories` | |
| `Review` | `reviews` | FK: `order_id`, `client_id`, `restaurant_id` (snake_case) |
| `Notification` | `notifications` | FK: `user_id` (snake_case) |

## Source Layout

```
src/
├── main.ts                        # ValidationPipe, listen 0.0.0.0:{PORT}
├── app.module.ts                  # ConfigModule (global), TypeOrm async (autoLoadEntities)
├── app.controller.ts              # GET / → "Test para Nestjs"
├── auth/                          # auth.controller, auth.service, guards/, strategies/
├── users/                         # entities/ (User, Profile, Review, Notification), users.service
├── commerces/                     # commerces.controller, restaurants.controller, commerces.service
├── products/                      # products.controller, products.service, entities/ (Product, Category)
└── orders/                        # orders.controller, orders.service (all endpoints @UseGuards(JwtAuthGuard) at class level)
```

## Resources

- `api/*.http` — REST client files covering all endpoints
- `database/seed.sql` — seed data with test users, commerces, products, orders
- `database/create_database.sql` — full DDL with constraints and indexes
- `AUTH_FLOW.md` — Auth flow documentation with sequence diagram
