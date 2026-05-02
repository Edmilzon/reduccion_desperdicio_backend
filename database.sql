-- ======================================================
-- CREACIÓN DE TABLAS PARA EL MODELO ER DE EXCEDENTES
-- ======================================================

-- 1. Tabla de Usuarios (renombrada a 'users' para evitar palabra reservada)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'merchant', 'admin')),
    reset_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabla de Restaurantes
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    image_url VARCHAR(255),
    nit VARCHAR(50) UNIQUE
);

-- 4. Tabla de Productos Excedentes
CREATE TABLE product_excedente (
    product_excedente_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
    discount_price DECIMAL(10,2) NOT NULL CHECK (discount_price >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    image_url VARCHAR(255),
    pickup_start TIMESTAMP NOT NULL,
    pickup_end TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'expired')),
    CHECK (pickup_end > pickup_start)
);

-- 5. Tabla de Ubicaciones (puntos de recogida)
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    description TEXT,
    phone VARCHAR(20)
);

-- 6. Tabla de Pedidos
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    product_id INT NOT NULL REFERENCES product_excedente(product_excedente_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'online')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'rejected')),
    delivery_status VARCHAR(30) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'qr_code_validation')),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Reseñas
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    client_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabla de Perfiles de Usuario
CREATE TABLE profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255)
);

-- 9. Tabla de Notificaciones
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(30) NOT NULL CHECK (type IN ('alert', 'reservation_confirmed')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- ÍNDICES RECOMENDADOS PARA MEJORAR EL RENDIMIENTO
-- ======================================================
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_product_excedente_restaurant_id ON product_excedente(restaurant_id);
CREATE INDEX idx_product_excedente_category_id ON product_excedente(category_id);
CREATE INDEX idx_locations_restaurant_id ON locations(restaurant_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_client_id ON reviews(client_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);