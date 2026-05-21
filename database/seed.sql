-- ======================================================
-- SEED DATA - Datos de prueba para Eco Bocado
-- ======================================================

-- Tabla de usuarios
INSERT INTO users (email, password, role, reset_token) VALUES
('admin@ecobocado.com', '$2a$10$xYwZfakeHashForDemo123456789', 'admin', NULL),
('panaderia@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('restaurante@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('cafeteria@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('burger@cbb.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('pizza@cbb.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('coffee@cbb.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('cliente1@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('cliente2@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('cliente3@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL);

-- Tabla de categorías
INSERT INTO categories (name, slug) VALUES
('Panadería', 'panaderia'),
('Repostería', 'reposteria'),
('Bebidas', 'bebidas'),
('Comida Rápida', 'comida-rapida'),
('Frutas y Verduras', 'frutas-verduras'),
('Lácteos', 'lacteos'),
('Platos Preparados', 'platos-preparados'),
('Snacks', 'snacks');

-- Tabla de restaurantes
INSERT INTO restaurants ("ownerId", name, description, latitude, longitude, rating, image_url, nit) VALUES
(2, 'Panadería El Oro', 'Pan fresco diario, productos horneados artesanalmente', -12.046374, -77.042793, 4.8, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', '20123456789'),
(3, 'Delicias del Chef', 'Restaurante con comida casera y platillos del día', -12.055473, -77.023456, 4.5, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', '20123456790'),
(4, 'Café Central', 'Café espresso, repostería y desayunos', -12.038921, -77.028532, 4.7, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', '20123456791'),
(5, 'Dulce Pan', 'Pasteles, tartas y panes dulces', -12.067891, -77.012345, 4.6, 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=400', '20123456792'),
(6, 'Sabor casero', 'Comida peruano tradicional', -12.023456, -77.056789, 4.3, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', '20123456793'),
(8, 'Burger Street CBB', 'Las mejores hamburguesas de Cochabamba', -17.423083, -66.119639, 4.9, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', '30123456789'),
(9, 'Pizza Nostra', 'Pizza artesanal a la leña', -17.424000, -66.120000, 4.7, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', '30123456790'),
(10, 'Coffee Break', 'Café de especialidad y snacks', -17.422500, -66.118500, 4.8, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', '30123456791');

-- Tabla de ubicaciones
INSERT INTO locations ("restaurant_id", name, latitude, longitude, description, phone) VALUES
(1, 'Panadería El Oro - Main', -12.046374, -77.042793, 'Av. Utama 123, Lima', '999-111-111'),
(1, 'Panadería El Oro - Sucursal Centro', -12.047500, -77.041000, 'Jr. Comercio 456', '999-111-112'),
(2, 'Delicias del Chef', -12.055473, -77.023456, 'Av. España 789, Lima', '999-222-222'),
(3, 'Café Central', -12.038921, -77.028532, 'Plaza Mayor, Lima', '999-333-333'),
(3, 'Café Central - Terraza', -12.038900, -77.028500, 'Plaza Mayor - Terraza', '999-333-334'),
(4, 'Dulce Pan', -12.067891, -77.012345, 'Av. La Marina 321, Lima', '999-444-444'),
(5, 'Sabor casero', -12.023456, -77.056789, 'Jr. Huamachuco 654, Lima', '999-555-555'),
(6, 'Burger Street - Central', -17.423083, -66.119639, 'Calle Colombia 123, CBB', '444-111-111'),
(7, 'Pizza Nostra - Plaza', -17.424000, -66.120000, 'Av. Ballivian 456, CBB', '444-222-222'),
(8, 'Coffee Break - Recoleta', -17.422500, -66.118500, 'Av. Pando 789, CBB', '444-333-333');

-- Tabla de productos excedentes
INSERT INTO product_excedente ("commerceId", "locationId", "categoryId", title, description, original_price, discount_price, quantity, image_url, pickup_start, pickup_end, status) VALUES
(1, 1, 1, 'Pan Francés', 'Pan francés recién horneado', 2.50, 1.25, 30, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-01 08:00:00', '2026-05-01 14:00:00', 'active'),
(1, 1, 1, 'Conchas', 'Conchas de chocolate y vainilla', 3.00, 1.50, 20, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200', '2026-05-01 09:00:00', '2026-05-01 15:00:00', 'active'),
(1, 1, 1, 'Bolillos', 'Bolillos integrales', 1.80, 0.90, 25, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-01 07:00:00', '2026-05-01 13:00:00', 'active'),
(1, 1, 2, 'Cupcakes', 'Cupcakes de vainilla con frosting', 4.50, 2.25, 15, 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=200', '2026-05-01 10:00:00', '2026-05-01 16:00:00', 'active'),
(1, 1, 2, 'Brownies', 'Brownies de chocolate', 3.50, 1.75, 12, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200', '2026-05-01 11:00:00', '2026-05-01 17:00:00', 'active'),
(2, 3, 7, 'Menú del Día', 'Pollo a la olla con arroz y ensalada', 12.00, 6.00, 10, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200', '2026-05-01 12:00:00', '2026-05-01 15:00:00', 'active'),
(2, 3, 7, 'Ceviche', 'Ceviche de pescado fresco', 15.00, 7.50, 8, 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=200', '2026-05-01 11:00:00', '2026-05-01 14:00:00', 'active'),
(2, 3, 7, 'Lomo Saltado', 'Lomo saltado con papas fritas', 14.00, 7.00, 6, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200', '2026-05-01 12:30:00', '2026-05-01 16:00:00', 'active'),
(2, 3, 5, 'Ensalada Mixta', 'Ensalada con pollo y aderezo', 8.00, 4.00, 5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200', '2026-05-01 13:00:00', '2026-05-01 18:00:00', 'active'),
(3, 4, 3, 'Café Latte', 'Café latte con leche', 5.00, 2.50, 20, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200', '2026-05-01 07:00:00', '2026-05-01 12:00:00', 'active'),
(3, 4, 3, 'Cappuccino', 'Cappuccino con cocoa', 5.50, 2.75, 15, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200', '2026-05-01 08:00:00', '2026-05-01 13:00:00', 'active'),
(3, 4, 3, 'Jugo de Naranja', 'Jugo natural de naranja', 4.00, 2.00, 10, 'https://images.unsplash.com/photo-1600271884442-efd12d4f9666?w=200', '2026-05-01 07:00:00', '2026-05-01 11:00:00', 'active'),
(3, 4, 2, 'Croissant', 'Croissant de mantequilla', 3.50, 1.75, 12, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200', '2026-05-01 08:00:00', '2026-05-01 14:00:00', 'active'),
(3, 4, 2, 'Muffin', 'Muffin de arándanos', 4.00, 2.00, 8, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200', '2026-05-01 09:00:00', '2026-05-01 15:00:00', 'active'),
(4, 6, 2, 'Torta de Chocolate', 'Torta de chocolate con cobertura', 25.00, 12.50, 3, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200', '2026-05-01 14:00:00', '2026-05-01 18:00:00', 'active'),
(4, 6, 2, 'Pie de Manzana', 'Pie de manzana casero', 20.00, 10.00, 4, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=200', '2026-05-01 13:00:00', '2026-05-01 17:00:00', 'active'),
(4, 6, 2, 'Galletas', 'Galletas de chispas de chocolate', 5.00, 2.50, 20, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200', '2026-05-01 10:00:00', '2026-05-01 16:00:00', 'active'),
(4, 6, 8, 'Donas', 'Donas glaseadas', 3.50, 1.75, 15, 'https://images.unsplash.com/photo-1551024601-562963525cb8?w=200', '2026-05-01 11:00:00', '2026-05-01 17:00:00', 'active'),
(5, 7, 7, 'Arroz con Pollo', 'Arroz con pollo y ensalada', 10.00, 5.00, 8, 'https://images.unsplash.com/photo-1567620900862-93b6b94369aa?w=200', '2026-05-01 11:30:00', '2026-05-01 14:30:00', 'active'),
(5, 7, 7, 'Seco de Res', 'Seco de res con frejoles', 12.00, 6.00, 6, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200', '2026-05-01 12:00:00', '2026-05-01 15:00:00', 'active'),
(5, 7, 7, 'Causa', 'Causa limeña rellena', 9.00, 4.50, 5, 'https://images.unsplash.com/photo-1626645738196-c2a72c7c8e38?w=200', '2026-05-01 12:30:00', '2026-05-01 16:00:00', 'active'),
(5, 7, 5, 'Fruta del día', 'Fruta variada picadita', 5.00, 2.50, 10, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200', '2026-05-01 09:00:00', '2026-05-01 14:00:00', 'active'),
(6, 8, 4, 'Burger Master', 'Hamburguesa doble con queso', 45.00, 22.50, 5, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', '2026-05-01 19:00:00', '2026-05-01 22:00:00', 'active'),
(7, 9, 7, 'Pizza Familiar', 'Pizza pepperoni familiar', 80.00, 40.00, 3, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', '2026-05-01 18:00:00', '2026-05-01 21:00:00', 'active'),
(8, 10, 3, 'Combo Desayuno', 'Café + Croissant', 35.00, 17.50, 10, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200', '2026-05-01 07:00:00', '2026-05-01 10:30:00', 'active');

-- Tabla de perfiles
INSERT INTO profiles (user_id, full_name, phone, avatar_url) VALUES
(1, 'Admin Eco Bocado', '999-000-001', 'https://ui-avatars.com/api/?name=Admin&background=4CAF50&color=fff'),
(2, 'Carlos Mendoza', '999-111-111', 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=FF9800&color=fff'),
(3, 'María García', '999-222-222', 'https://ui-avatars.com/api/?name=Maria+Garcia&background=2196F3&color=fff'),
(4, 'Pedro Sánchez', '999-333-333', 'https://ui-avatars.com/api/?name=Pedro+Sanchez&background=9C27B0&color=fff'),
(5, 'Laura Torres', '999-444-444', 'https://ui-avatars.com/api/?name=Laura+Torres&background=E91E63&color=fff'),
(6, 'José López', '999-555-555', 'https://ui-avatars.com/api/?name=Jose+Lopez&background=00BCD4&color=fff'),
(7, 'Ana Castro', '999-666-666', 'https://ui-avatars.com/api/?name=Ana+Castro&background=FF5722&color=fff');

-- Tabla de pedidos
INSERT INTO orders ("buyerId", "productId", quantity, payment_method, payment_status, delivery_status, total_price, status) VALUES
(5, 1, 3, 'cash', 'paid', 'delivered', 3.75, 'confirmed'),
(5, 2, 2, 'online', 'paid', 'qr_code_validation', 3.00, 'confirmed'),
(6, 7, 1, 'cash', 'paid', 'delivered', 7.50, 'confirmed'),
(6, 11, 2, 'online', 'paid', 'delivered', 5.00, 'confirmed'),
(7, 15, 1, 'cash', 'paid', 'delivered', 2.50, 'confirmed'),
(7, 19, 2, 'online', 'pending', 'pending', 10.00, 'confirmed');

-- Tabla de reseñas
INSERT INTO reviews (order_id, client_id, restaurant_id, stars, comment) VALUES
(1, 5, 1, 5, 'Excelente pan, muy fresco y delicioso'),
(2, 5, 1, 4, 'Buen producto, aunque llegó un poco tarde'),
(3, 6, 2, 5, 'El ceviche estaba fresquísimo, recomendado'),
(4, 6, 3, 5, 'El mejor café de la zona, volveré'),
(5, 7, 4, 4, 'Las donas estaban delicious');

-- Tabla de notificaciones
INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
(2, 'Nueva orden', 'Tienes una nueva orden de compra', 'alert', false),
(2, 'Pedido confirmado', 'Tu pedido #12345 ha sido confirmado', 'reservation_confirmed', true),
(3, 'Stock bajo', 'El producto Menú del Día tiene poco stock', 'alert', false),
(5, 'Promoción especial', '10% de descuento en panadería hoy', 'alert', false),
(6, 'Pedido entregado', 'Tu pedido ha sido entregado', 'reservation_confirmed', true);

-- Resultado
SELECT 'Seed: ' || 
    (SELECT COUNT(*)::text || ' usuarios' FROM users) || ', ' ||
    (SELECT COUNT(*)::text || ' categorías' FROM categories) || ', ' ||
    (SELECT COUNT(*)::text || ' restaurantes' FROM restaurants) || ', ' ||
    (SELECT COUNT(*)::text || ' productos' FROM product_excedente) || ', ' ||
    (SELECT COUNT(*)::text || ' pedidos' FROM orders) AS r;