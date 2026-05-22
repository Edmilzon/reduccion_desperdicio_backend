# AGENTS.md

NestJS 11 + TypeScript backend for "Eco Bocado" — a food waste reduction platform. PostgreSQL via TypeORM.

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Build (`nest build`, `deleteOutDir: true`) |
| `npm run lint` | ESLint with `--fix` (flat config) |
| `npm run test` | Jest (rootDir: `src`, `*.spec.ts`) |
| `npm run test -- <file>` | Single test file |
| `npm run test:e2e` | Jest e2e (`test/jest-e2e.json`) |
| `npm run format` | Prettier `src/` + `test/` |

Run `npm run build` after changes to verify compilation.

## Environment

Copy `.env.example` → `.env`. Required: `DATABASE_URL` (PostgreSQL), `JWT_SECRET` (app throws on startup if missing). Optional: `JWT_EXPIRATION` (default `24h`), `PORT` (default `3000`).

## Schema

`synchronize: false` — no auto-sync. Run `database/seed.sql` or `database/create_database.sql` manually to set up schema.

## Key Conventions

- **No strict types** — `strictNullChecks: false`, `noImplicitAny: false`. Expect `any`.
- **DTO validation** — Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform`.
- **Prettier** — single quotes, trailing commas.
- **Modules export `TypeOrmModule`** — `UsersModule`, `CommercesModule`, `ProductsModule`, `OrdersModule` each export `TypeOrmModule` + their service for cross-module access.
- **Ownership checks** — Commerce owner can edit/delete own commerce and products. Stats accessible by owner or admin.
- **Product DELETE** — Sets status to `SOLD_OUT`, does not remove the row.
- **Order flow** — Create decrements product quantity (sold_out at 0). Cancel restores quantity + sets ACTIVE.
- **Notifications** — Created automatically on order confirmation via `OrdersService.create`.
- **E2E test expects `"Hello World!"`** — but app returns `"Test para Nestjs"`. Test will fail.
- **Base branch is `develop`** — do not commit to `main` directly.

## Auth

JWT with Passport. `POST /auth/register` (client), `POST /auth/register-commerce` (merchant), `POST /auth/login`, `GET /auth/me` (protected), `POST /auth/logout` (protected).

JWT payload: `{ sub, email, role }`. Strategy validates user exists in DB via `User` repository. Guard: `JwtAuthGuard`.

## Source Layout

```
src/
├── main.ts                          # ValidationPipe, listen 0.0.0.0
├── app.module.ts                    # ConfigModule (global), TypeOrmModule async
├── app.controller.ts                # GET / → "Test para Nestjs"
├── auth/                            # auth.controller.ts, auth.service.ts, guards/, strategies/
├── users/                           # Entities only (no controller)
│   └── entities/                    # User, Profile, Review, Notification
├── commerces/                       # commerces.controller.ts, restaurants.controller.ts
│   └── entities/                    # Commerce (table: restaurants), Location
├── products/                        # products.controller.ts, products.service.ts
│   └── entities/                    # Product (table: product_excedente), Category
└── orders/                          # orders.controller.ts, orders.service.ts
    └── entities/                    # Order
```

## Entities

### users/
- **User** (`users`) — id (user_id), email, password (select:false), role (enum: client/merchant/admin), resetToken, timestamps. Relations: comercios, profile, reviews, notifications.
- **Profile** (`profiles`) — id, userId (unique), fullName, phone, avatarUrl. Relation to User.
- **Review** (`reviews`) — id, stars, comment, timestamps. Relations: order, client (User), commerce.
- **Notification** (`notifications`) — id, userId, title, content, type (enum: alert/reservation_confirmed), isRead. Relation to User.

### commerces/
- **Commerce** (`restaurants`) — id (restaurant_id), owner (User), name, description, latitude, longitude, rating, imageUrl, nit, timestamps.
- **Location** (`locations`) — id, restaurantId, name, latitude, longitude, description, phone.

### products/
- **Product** (`product_excedente`) — id (product_excedente_id), title, description, originalPrice, price (column: discount_price), quantity, imageUrl, pickupStart, pickupEnd, status (enum: active/sold_out/expired), timestamps. Relations: commerce, category.
- **Category** (`categories`) — id, name, slug (unique).

### orders/
- **Order** (`orders`) — id (order_id), buyer (User), product (Product), quantity, paymentMethod (enum: cash/online), paymentStatus (pending/paid/rejected), deliveryStatus (pending/delivered/qr_code_validation), totalPrice, status (confirmed/cancelled), reservationCode, paidAt, receiptUrl, timestamps. Relation: review.

## Endpoints

### Auth (`/auth`)
- `POST /auth/register` — name, email, password, role? (optional, defaults to CLIENT)
- `POST /auth/register-commerce` — ownerName, email, password, commerceName, description?, latitude?, longitude?, nit?
- `POST /auth/login` — email, password → JWT
- `GET /auth/me` — protected, returns profile with commerce data for MERCHANT
- `POST /auth/logout` — protected, client-side token removal only

### Commerces (`/commerces`, `/restaurants`)
- `GET /commerces` — List all
- `GET /commerces/list/all` — List id + name only
- `GET /commerces/nearby?lat=&lng=&radius=` — Haversine distance filter
- `GET /commerces/by-address?address=&radius=` — Nominatim geocoding then distance
- `GET /commerces/:id` — Get one
- `GET /commerces/:id/products` — Active products by commerce
- `POST /commerces` — Protected, create
- `PATCH /commerces/:id` — Protected, owner only
- `DELETE /commerces/:id` — Protected, owner only
- `GET /restaurants/:id/detail` — Detail with active offers

### Products (`/products`)
- `GET /products` — List active (query: categoryId?, commerceId?)
- `GET /products/all` — List with category
- `GET /products/categories` — All categories
- `GET /products/search?q=` — ILIKE search on title, description, commerce name
- `GET /products/category/:categoryId` — By category (query: commerceId?)
- `GET /products/commerce/:commerceId` — By commerce (query: status?, categoryId?). Enriches with `isNearExpiry`.
- `GET /products/commerce/:commerceId/stats` — Protected (owner/admin): activeOffers, todayOffers, todayOrders, todaySales, totalUnitsSold, nearExpiryOffers[], nearExpiryCount
- `GET /products/:id` — Get one
- `POST /products` — Protected, create
- `PATCH /products/:id` — Protected, owner only
- `DELETE /products/:id` — Protected, owner only, sets SOLD_OUT

### Orders (`/orders`) — All protected (class-level guard)
- `POST /orders` — Create order (decrements quantity, sets SOLD_OUT if 0, creates notification)
- `GET /orders/my-orders` — User's orders, newest first
- `PATCH /orders/:id/cancel` — Cancel (restores quantity, sets ACTIVE)
- `POST /orders/:id/pay` — Pay online order (rejects cash or already-paid orders)

## Resources

- `api/*.http` — REST client files covering all endpoints with flows
- `database/` — SQL scripts (`create_database.sql`, `seed.sql`)
- `AUTH_FLOW.md` — Auth flow documentation
