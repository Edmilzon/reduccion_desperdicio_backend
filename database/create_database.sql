-- ======================================================
-- ESQUEMA COMPLETO — Eco Bocado
-- ======================================================

-- 1. Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'merchant', 'admin')),
    reset_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    reset_password_attempts INTEGER NOT NULL DEFAULT 0,
    token_version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categorías
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Restaurantes (commerce)
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    "ownerId" INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255),
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    image_url VARCHAR(255),
    nit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ubicaciones (sucursales)
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    name VARCHAR(255),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    description TEXT,
    phone VARCHAR(20)
);

-- 5. Productos excedentes
CREATE TABLE product_excedente (
    product_excedente_id SERIAL PRIMARY KEY,
    "commerceId" INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    "locationId" INT REFERENCES locations(location_id) ON DELETE CASCADE,
    "categoryId" INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    title VARCHAR(255),
    description TEXT,
    original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
    discount_price DECIMAL(10,2) NOT NULL CHECK (discount_price >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    image_url VARCHAR(255),
    pickup_start TIMESTAMP NOT NULL,
    pickup_end TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (pickup_end > pickup_start)
);

-- 6. Pedidos
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    "buyerId" INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    "productId" INT NOT NULL REFERENCES product_excedente(product_excedente_id) ON DELETE RESTRICT,
    quantity INT,
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'online')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'rejected')),
    delivery_status VARCHAR(30) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'qr_code_validation', 'not_picked_up')),
    total_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    reservation_code VARCHAR(255) UNIQUE,
    paid_at TIMESTAMP,
    delivered_at TIMESTAMP,
    receipt_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reseñas
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    client_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Perfiles
CREATE TABLE profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255)
);

-- 9. Notificaciones
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT,
    type VARCHAR(30) CHECK (type IN ('alert', 'reservation_confirmed')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Historial de contraseñas
CREATE TABLE password_history (
    id SERIAL PRIMARY KEY,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_restaurants_ownerId ON restaurants("ownerId");
CREATE INDEX idx_product_excedente_commerceId ON product_excedente("commerceId");
CREATE INDEX idx_product_excedente_locationId ON product_excedente("locationId");
CREATE INDEX idx_product_excedente_categoryId ON product_excedente("categoryId");
CREATE INDEX idx_locations_restaurant_id ON locations(restaurant_id);
CREATE INDEX idx_orders_buyerId ON orders("buyerId");
CREATE INDEX idx_orders_productId ON orders("productId");
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_client_id ON reviews(client_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_password_history_user_id ON password_history(user_id);
