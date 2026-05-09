# AGENTS.md

## Project Overview

NestJS 11 + TypeScript backend for "Eco Bocado" — a food waste reduction platform. PostgreSQL via TypeORM.

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run start:dev` | Dev server with watch (port from env, defaults to 3000) |
| `npm run start:prod` | Production: `node dist/main` |
| `npm run build` | Build (performs typecheck; alias: `nest build`) |
| `npm run lint` | ESLint with --fix |
| `npm run test` | Jest unit tests (rootDir: src) |
| `npm run test -- <file>` | Run single test file |
| `npm run test:e2e` | Jest e2e tests |

Always run build after changes to verify compilation.

## Environment

Copy `.env.example` to `.env`. Required: `DATABASE_URL`, `JWT_SECRET` (throws on startup if missing). `PORT` defaults to 3000 in code, 5000 in example. PostgreSQL required.

## Source Structure

```
src/
├── main.ts                 # Entry point, ValidationPipe
├── app.module.ts           # Root module (ConfigModule, TypeOrmModule)
├── app.controller.ts      # GET / → "Test para Nestjs"
├── app.service.ts
├── auth/                   # JWT auth module
├── users/                  # User entities (no controller)
├── commerces/              # Restaurants module
├── products/               # Products/excedentes module
└── orders/                 # Orders module
```

## Module Details

### auth/ — `/auth`

| File | Description |
|------|-------------|
| `auth.controller.ts` | POST register, POST login, POST register-commerce, GET me, POST logout |
| `auth.service.ts` | register, login, registerCommerce, getProfile, logout |
| `auth.module.ts` | Imports: PassportModule, UsersModule, CommercesModule |
| `dto/auth.dto.ts` | RegisterDto, LoginDto |
| `dto/register-commerce.dto.ts` | RegisterCommerceDto |
| `guards/jwt-auth.guard.ts` | JwtAuthGuard (extends Passport AuthGuard) |
| `strategies/jwt.strategy.ts` | Passport JWT Strategy |

**Endpoints:**
- `POST /auth/register` — Register client (name, email, password, role?)
- `POST /auth/register-commerce` — Register merchant (ownerName, email, password, commerceName, description, latitude, longitude, nit)
- `POST /auth/login` — Login (email, password)
- `GET /auth/me` — Get current user profile (protected)
- `POST /auth/logout` — Logout (protected)

### users/ — Entities only (no controller)

| Entity | Table | Fields |
|--------|-------|--------|
| `User` | `users` | id, email, password (select:false), role (enum: client/merchant/admin), resetToken |
| `Profile` | `profiles` | id, userId (unique), fullName, phone, avatarUrl |
| `Review` | `reviews` | id, orderId (unique), clientId, restaurantId, stars, comment |
| `Notification` | `notifications` | id, userId, title, content, type (enum: alert/reservation_confirmed), isRead |

**Exports:** `TypeOrmModule`, `UsersService`

### commerces/ — `/commerces`

| File | Description |
|------|-------------|
| `commerces.controller.ts` | CRUD + products |
| `commerces.service.ts` | create, findAll, findOne, update, remove, findProductsByCommerce |
| `dto/commerce.dto.ts` | CreateCommerceDto, UpdateCommerceDto |

**Entities:**
- `Commerce` (table: `restaurants`) — id, owner(User), name, description, latitude, longitude, rating, imageUrl, nit
- `Location` (table: `locations`) — id, restaurantId, name, latitude, longitude, description, phone

**Endpoints:**
- `GET /commerces` — List all
- `GET /commerces/:id` — Get one
- `GET /commerces/:id/products` — Get products by commerce
- `POST /commerces` — Create (protected)
- `PATCH /commerces/:id` — Update (protected, owner only)
- `DELETE /commerces/:id` — Delete (protected, owner only)

### products/ — `/products`

| File | Description |
|------|-------------|
| `products.controller.ts` | Full CRUD + categories + search + stats |
| `products.service.ts` | create, findAll, findOne, update, remove, categories, search, getCommerceStats |
| `dto/product.dto.ts` | CreateProductDto, UpdateProductDto |

**Entities:**
- `Product` (table: `product_excedente`) — id, title, description, originalPrice, price, quantity, imageUrl, pickupStart, pickupEnd, status (enum: active/sold_out/expired), commerce, category
- `Category` (table: `categories`) — id, name, slug (unique)

**Endpoints:**
- `GET /products` — List (query: categoryId, commerceId)
- `GET /products/all` — List with category
- `GET /products/categories` — All categories
- `GET /products/search?q=` — Search products
- `GET /products/category/:categoryId` — By category (query: commerceId)
- `GET /products/commerce/:commerceId` — By commerce (query: status, categoryId)
- `GET /products/commerce/:commerceId/stats` — Dashboard stats (protected, owner/admin)
- `GET /products/:id` — Get one
- `POST /products` — Create (protected)
- `PATCH /products/:id` — Update (protected, owner only)
- `DELETE /products/:id` — Remove → sets status to SOLD_OUT (protected, owner only)

**Stats returned:** activeOffers, todayOffers, todayOrders, todaySales, totalUnitsSold, nearExpiryOffers[], nearExpiryCount

### orders/ — `/orders`

| File | Description |
|------|-------------|
| `orders.controller.ts` | create, my-orders, cancel |
| `orders.service.ts` | create, findMyOrders, cancelOrder |
| `dto/order.dto.ts` | CreateOrderDto |

**Entity:**
- `Order` (table: `orders`) — id, buyer(User), product(Product), quantity, paymentMethod (enum: cash/online), paymentStatus (enum: pending/paid/rejected), deliveryStatus (enum: pending/delivered/qr_code_validation), totalPrice, status (enum: confirmed/cancelled), review(Review)

**Endpoints (all protected):**
- `POST /orders` — Create order
- `GET /orders/my-orders` — Get user's orders
- `PATCH /orders/:id/cancel` — Cancel order

**Order flow:** Create → Decrements product quantity → If quantity=0 sets product SOLD_OUT. Cancel → Restores quantity → Sets product ACTIVE.

## Key Conventions

- **No migrations** — `synchronize: true` + `autoLoadEntities: true`. Schema auto-syncs.
- **Loose types** — `strictNullChecks: false`, `noImplicitAny: false`. Expect `any`.
- **DTO validation** — All endpoints use `class-validator` DTOs with global pipe.
- **Module exports** — `UsersModule`, `CommercesModule`, `ProductsModule`, `OrdersModule` export `TypeOrmModule` for cross-module access.
- **Ownership checks** — Commerces: owner can edit/delete own. Products: owner can edit/delete own. Stats: owner or admin.
- **Tests** — Only 2 unit test files: `auth.service.spec.ts`, `app.controller.spec.ts`
- **Deploy** — Vercel target (`vercel-build` script)

## Resources

- `AUTH_FLOW.md` — Authentication flow diagrams
- `database/` — SQL scripts (`create_database.sql`, `seed.sql`)
- `api/*.http` — REST client files (VS Code REST Client)