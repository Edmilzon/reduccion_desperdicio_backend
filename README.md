# Eco Bocado — Backend

Manual de instalación y configuración del backend para la plataforma de reducción de desperdicio de alimentos.

**Stack:** NestJS 11 + TypeScript + PostgreSQL + TypeORM + JWT

---

## Índice

1. [Requisitos del Sistema](#1-requisitos-del-sistema)
2. [Instalación](#2-instalación)
3. [Configuración de Base de Datos](#3-configuración-de-base-de-datos)
4. [Variables de Entorno](#4-variables-de-entorno)
5. [Ejecución](#5-ejecución)
6. [Verificación de Funcionamiento](#6-verificación-de-funcionamiento)
7. [Pruebas](#7-pruebas)
8. [Estructura del Proyecto](#8-estructura-del-proyecto)
9. [Solución de Problemas Comunes](#9-solución-de-problemas-comunes)

---

## 1. Requisitos del Sistema

| Requisito | Versión Mínima |
|-----------|----------------|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| PostgreSQL | 14.x o superior |
| Git | Cualquier versión moderna |

### Verificar instalaciones

```bash
node --version    # v18.x o superior
npm --version     # 9.x o superior
psql --version    # 14.x o superior
git --version
```

---

## 2. Instalación

### 2.1 Clonar el repositorio

```bash
git clone <url-del-repositorio> reduccion_desperdicio_backend
cd reduccion_desperdicio_backend
```

### 2.2 Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`.

### 2.3 Verificar que se instaló correctamente

```bash
npm ls --depth=0
```

Debe mostrar los 19 paquetes runtime y 17 de desarrollo sin errores.

---

## 3. Configuración de Base de Datos

### 3.1 Opción A: Base de datos local

#### a) Crear la base de datos

Conéctate a PostgreSQL y crea la base de datos:

```bash
psql -U postgres
```

```sql
CREATE DATABASE ecobocado;
\q
```

#### b) Ejecutar el script de esquema

```bash
psql -U postgres -d ecobocado -f database/create_database.sql
```

Este script crea todas las tablas con sus constraints, checks e índices:

- `users` — Usuarios con roles (`client`, `merchant`, `admin`)
- `categories` — Categorías de productos
- `restaurants` — Comercios (vinculados a usuarios)
- `locations` — Sucursales de cada comercio
- `product_excedente` — Productos/excedentes con precio, cantidad, ventana de recogida
- `orders` — Pedidos con método de pago, estado, código de reserva
- `reviews` — Reseñas de clientes
- `profiles` — Perfiles extendidos de usuarios
- `notifications` — Notificaciones
- `password_history` — Historial de contraseñas

#### c) (Opcional) Cargar datos de prueba

```bash
psql -U postgres -d ecobocado -f database/seed.sql
```

Esto inserta:
- **16 usuarios** (1 admin, 6 merchants, 9 clients)
- **10 categorías** (Panadería, Repostería, Bebidas, etc.)
- **11 restaurantes** con 20 ubicaciones/sucursales
- **60 productos** activos + 2 agotados/vencidos
- **20 pedidos** en varios estados (pagados, pendientes, cancelados, no recogidos)
- **14 reseñas**
- **12 notificaciones**

### 3.2 Opción B: Base de datos remota (Railway, Render, Neon, etc.)

Si usas un servicio cloud, obtén la URL de conexión PostgreSQL. La URL típica es:

```
postgres://usuario:contraseña@host:5432/nombre_db?sslmode=require
```

Guarda esa URL para usarla en el paso de variables de entorno.

---

## 4. Variables de Entorno

### 4.1 Crear archivo `.env`

Copia y pega esto en un archivo llamado `.env` en la raíz del proyecto:

```env
# ============================================
# Eco Bocado — Configuración de Entorno
# ============================================

# --- Base de datos ---
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ecobocado?sslmode=require

# --- JWT ---
JWT_SECRET=mi_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRATION=24h

# --- Servidor ---
PORT=5000

# --- SMTP (opcional, para recuperación de contraseña) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=usuario@gmail.com
SMTP_PASS=contraseña
```

### 4.2 Explicación de variables

| Variable | ¿Requerida? | Default | Descripción |
|----------|-------------|---------|-------------|
| `DATABASE_URL` | **Sí** | — | URL de conexión PostgreSQL. Para local: `postgres://postgres:postgres@localhost:5432/ecobocado?sslmode=require`. Para cloud: la que proporcione el servicio. |
| `JWT_SECRET` | **Sí** | — | Clave secreta para firmar tokens JWT. Usa una cadena larga y aleatoria. |
| `JWT_EXPIRATION` | No | `24h` | Tiempo de expiración del token. Formato: `1h`, `7d`, `30d`. |
| `PORT` | No | `3000` | Puerto donde escuchará el servidor. |
| `SMTP_HOST` | No | `smtp.gmail.com` | Servidor SMTP para envío de correos. |
| `SMTP_PORT` | No | `587` | Puerto SMTP. |
| `SMTP_USER` | No | `usuario@gmail.com` | Usuario SMTP. |
| `SMTP_PASS` | No | `contraseña` | Contraseña SMTP. |

> **⚠️ Importante:** El archivo `.env` contiene credenciales sensibles. No lo subas al repositorio (está en `.gitignore`).

---

## 5. Ejecución

### 5.1 Modo desarrollo (con recarga automática)

```bash
npm run start:dev
```

El servidor se iniciará en `http://localhost:5000` (o el puerto configurado). Cualquier cambio en archivos `.ts` reinicia automáticamente el servidor.

### 5.2 Modo producción

```bash
npm run build      # Compila TypeScript a JavaScript en dist/
npm run start:prod # Ejecuta node dist/main
```

---

## 6. Verificación de Funcionamiento

### 6.1 Health check

```bash
curl http://localhost:5000/
```

Respuesta esperada:

```
Test para Nestjs
```

### 6.2 Probar endpoints básicos

#### a) Listar comercios (público)

```bash
curl http://localhost:5000/commerces
```

Respuesta esperada: Array JSON de comercios (vacío si no cargaste seed).

#### b) Listar productos activos (público)

```bash
curl http://localhost:5000/products
```

Respuesta esperada: Array JSON de productos activos.

#### c) Registrar un usuario cliente

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "password123"
  }'
```

Respuesta esperada: `201 Created` con un objeto `{ user, access_token }`.

#### d) Iniciar sesión

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "password123"
  }'
```

Respuesta esperada: `200 OK` con `{ user, access_token }`.

#### e) Ver perfil con token

```bash
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer <TOKEN_OBTENIDO_EN_LOGIN>"
```

Respuesta esperada: `200 OK` con datos del usuario.

### 6.3 Usar archivos REST Client

Los archivos en `api/` están preparados para VS Code REST Client (extensión `humao.rest-client`):

```
api/auth.http
api/commerces.http
api/orders.http
api/products.http
api/test.http
```

Abre cualquiera en VS Code y haz clic en "Send Request" sobre cada bloque.

---

## 7. Pruebas

### 7.1 Tests unitarios

```bash
npm run test
```

Ejecuta todos los archivos `*.spec.ts` dentro de `src/`. Configuración:

| Parámetro | Valor |
|-----------|-------|
| `rootDir` | `src` |
| Patrón de test | `.*\.spec\.ts$` |
| Transformador | `ts-jest` |
| Environment | `node` |

#### Ejecutar un test específico

```bash
npm run test -- src/app.controller.spec.ts
```

#### Tests con cobertura

```bash
npm run test:cov
```

Genera reporte en `coverage/`.

### 7.2 Tests e2e

```bash
npm run test:e2e
```

Ejecuta `test/*.e2e-spec.ts`. Usa `test/jest-e2e.json` como configuración.

> **⚠️ Nota:** Los tests e2e requieren conexión a base de datos real con datos de seed cargados.

### 7.3 Verificación completa

```bash
npm run build    # Que compile sin errores
npm run lint     # Que pase el linter
npm run test     # Que pasen los tests
```

---

## 8. Estructura del Proyecto

```
reduccion_desperdicio_backend/
├── api/                    # Archivos REST Client (.http)
│   ├── auth.http
│   ├── commerces.http
│   ├── orders.http
│   ├── products.http
│   └── test.http
├── database/               # Scripts SQL
│   ├── create_database.sql # DDL completo
│   ├── seed.sql            # Datos de prueba
│   ├── delete_table.sql    # Utilidad
│   └── inspect_db.js       # Utilidad
├── src/                    # Código fuente
│   ├── main.ts             # Punto de entrada (ValidationPipe global, listen)
│   ├── app.module.ts       # Módulo raíz (ConfigModule, TypeOrm, Mailer, Throttler)
│   ├── app.controller.ts   # GET / → "Test para Nestjs"
│   ├── app.service.ts
│   ├── data-source.ts      # DataSource independiente para scripts/CLI
│   ├── auth/               # Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/            # DTOs (register, login, forgot-password, reset-password)
│   │   ├── guards/         # JwtAuthGuard
│   │   └── strategies/     # JwtStrategy
│   ├── users/              # Gestión de usuarios
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── entities/
│   │       ├── user.entity.ts           # User + UserRole enum
│   │       ├── profile.entity.ts
│   │       ├── review.entity.ts
│   │       ├── notification.entity.ts    # Notification + NotificationType enum
│   │       └── password-history.entity.ts
│   ├── commerces/          # Comercios y restaurantes
│   │   ├── commerces.module.ts
│   │   ├── commerces.controller.ts      # CRUD de comercios
│   │   ├── restaurants.controller.ts    # Endpoints públicos (nearby, categories, detail)
│   │   ├── commerces.service.ts
│   │   ├── dto/            # CreateCommerceDto, UpdateCommerceDto, RestaurantDetailDto
│   │   └── entities/
│   │       ├── commerce.entity.ts       # Table: restaurants
│   │       └── location.entity.ts
│   ├── products/           # Productos y categorías
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── dto/            # CreateProductDto, UpdateProductDto
│   │   └── entities/
│   │       ├── product.entity.ts        # Table: product_excedente + ProductStatus enum
│   │       └── category.entity.ts
│   └── orders/             # Pedidos
│       ├── orders.module.ts
│       ├── orders.controller.ts
│       ├── orders.service.ts
│       ├── dto/            # CreateOrderDto, ValidatePickupDto
│       └── entities/
│           └── order.entity.ts          # + PaymentMethod, PaymentStatus, DeliveryStatus, OrderStatus enums
├── test/                   # Tests e2e
│   ├── app.e2e-spec.ts
│   ├── restaurants.e2e-spec.ts
│   └── jest-e2e.json
autenticación
├── README.md               # Este archivo
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
├── .prettierrc
├── .env.example
└── .gitignore
```

---

## 9. Solución de Problemas Comunes

### Error: `ECONNREFUSED` al conectar a PostgreSQL

**Causa:** PostgreSQL no está corriendo o los datos de conexión son incorrectos.

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
pg_isready

# Verificar la URL de conexión en .env
# Para local: postgres://postgres:postgres@localhost:5432/ecobocado?sslmode=require
```

### Error: `relation "users" does not exist`

**Causa:** No se ejecutó el script `create_database.sql`.

**Solución:**
```bash
psql -U postgres -d ecobocado -f database/create_database.sql
```

### Error: `JWT_SECRET must be defined in .env`

**Causa:** Falta la variable `JWT_SECRET` en el archivo `.env`.

**Solución:** Agregar `JWT_SECRET=una_clave_segura_aqui` al `.env`.

### Error: `Cannot find module '@nestjs/core'`

**Causa:** No se ejecutó `npm install`.

**Solución:** Ejecutar `npm install` en la raíz del proyecto.

### El servidor inicia pero el puerto está ocupado

**Causa:** Otro proceso está usando el puerto.

**Solución:** Cambiar el `PORT` en `.env` a otro valor (ej: `PORT=3001`).

### Error de SSL en conexión a BD local

**Causa:** `sslmode=require` no es compatible con PostgreSQL local sin SSL configurado.

**Solución:** Usar `postgres://postgres:postgres@localhost:5432/ecobocado` (sin `?sslmode=require`), o configurar SSL en PostgreSQL local.

---

## Dependencias y Librerías

### Runtime (`dependencies`)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@nestjs/common` | ^11.0.1 | Decoradores, guards, pipes, interceptors |
| `@nestjs/core` | ^11.0.1 | NestJS core (IoC, lifecycle) |
| `@nestjs/platform-express` | ^11.0.1 | Servidor HTTP Express |
| `@nestjs/config` | ^4.0.4 | Variables de entorno (`ConfigModule`, `ConfigService`) |
| `@nestjs/typeorm` | ^11.0.1 | Integración TypeORM con NestJS |
| `@nestjs/jwt` | ^11.0.2 | Generación y verificación de JWT |
| `@nestjs/passport` | ^11.0.5 | Integración Passport con NestJS |
| `@nestjs/throttler` | ^6.5.0 | Rate limiting (ThrottlerGuard) |
| `@nestjs-modules/mailer` | ^2.3.6 | Envío de correos (nodemailer + handlebars) |
| `typeorm` | ^0.3.28 | ORM para PostgreSQL |
| `pg` | ^8.20.0 | Driver PostgreSQL nativo |
| `passport` | ^0.7.0 | Middleware de autenticación |
| `passport-jwt` | ^4.0.1 | Estrategia JWT para Passport |
| `bcrypt` | ^6.0.0 | Hashing de contraseñas |
| `class-validator` | ^0.15.1 | Validación de DTOs basada en decoradores |
| `class-transformer` | ^0.5.1 | Transformación de objetos (usado por ValidationPipe) |
| `nodemailer` | ^8.0.10 | Envío de correos SMTP |
| `handlebars` | ^4.7.9 | Motor de plantillas para correos (`.hbs`) |
| `reflect-metadata` | ^0.2.2 | Polyfill de decoradores TypeScript |
| `rxjs` | ^7.8.1 | Programación reactiva (Observables) |

### Desarrollo (`devDependencies`)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `typescript` | ^5.7.3 | Compilador TypeScript |
| `@nestjs/cli` | ^11.0.0 | CLI de NestJS |
| `@nestjs/schematics` | ^11.0.0 | Plantillas para generación de código |
| `@nestjs/testing` | ^11.0.1 | Test utilities |
| `ts-node` | ^10.9.2 | Ejecución TypeScript directa |
| `ts-loader` | ^9.5.2 | TypeScript loader para Webpack |
| `tsconfig-paths` | ^4.2.0 | Resolución de aliases de paths |
| `eslint` | ^9.18.0 | Linter |
| `typescript-eslint` | ^8.20.0 | Reglas ESLint TypeScript |
| `@eslint/js` | ^9.18.0 | Base ESLint v9 |
| `@eslint/eslintrc` | ^3.2.0 | Compatibilidad flat config |
| `eslint-config-prettier` | ^10.0.1 | Desactiva reglas que chocan con Prettier |
| `eslint-plugin-prettier` | ^5.2.2 | Prettier como regla ESLint |
| `globals` | ^17.0.0 | Globals ESLint |
| `prettier` | ^3.4.2 | Formateador de código |
| `jest` | ^30.0.0 | Test runner |
| `ts-jest` | ^29.2.5 | Transformador TypeScript para Jest |
| `supertest` | ^7.0.0 | Test HTTP para e2e |
| `source-map-support` | ^0.5.21 | Source maps |
| `@types/node` | ^24.0.0 | Tipos Node.js |
| `@types/express` | ^5.0.0 | Tipos Express |
| `@types/jest` | ^30.0.0 | Tipos Jest |
| `@types/supertest` | ^7.0.0 | Tipos Supertest |
| `@types/bcrypt` | ^6.0.0 | Tipos bcrypt |
| `@types/passport-jwt` | ^4.0.1 | Tipos passport-jwt |
| `@types/nodemailer` | ^8.0.0 | Tipos nodemailer |
| `@types/jsonwebtoken` | ^9.0.10 | Tipos jsonwebtoken |
| `@types/ms` | ^2.1.0 | Tipos ms |

---

## Archivos de Configuración del Proyecto

| Archivo | Rol |
|---------|-----|
| `tsconfig.json` | TypeScript: `target ES2021`, `commonjs`, decoradores, `strictNullChecks: false`, `noImplicitAny: false` |
| `tsconfig.build.json` | Extiende `tsconfig.json`, excluye `test/`, `dist/`, `**/*spec.ts` |
| `nest-cli.json` | CLI NestJS: `deleteOutDir: true`, assets `*.hbs` a `dist/` |
| `eslint.config.mjs` | ESLint flat config: recommendedTypeChecked, `@typescript-eslint/no-explicit-any: off`, prettier |
| `.prettierrc` | `singleQuote: true`, `trailingComma: all` |
| `test/jest-e2e.json` | Jest e2e: `rootDir: .`, `testRegex: .e2e-spec.ts$` |
| `package.json` | Scripts, dependencias, Jest unit config (`rootDir: src`, `testRegex: .*.spec.ts$`) |
| `.gitignore` | Ignora `dist/`, `node_modules/`, `.env`, `coverage/
