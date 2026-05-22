-- ======================================================
-- SEED DATA — Eco Bocado
-- ======================================================

-- Usuarios
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
('cliente3@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('cliente4@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('cliente5@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('cliente6@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'client', NULL),
('lachacra@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('sushi@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL),
('helados@ejemplo.com', '$2a$10$xYwZfakeHashForDemo123456789', 'merchant', NULL);

-- Categorías
INSERT INTO categories (name, slug) VALUES
('Panadería', 'panaderia'),
('Repostería', 'reposteria'),
('Bebidas', 'bebidas'),
('Comida Rápida', 'comida-rapida'),
('Frutas y Verduras', 'frutas-verduras'),
('Lácteos', 'lacteos'),
('Platos Preparados', 'platos-preparados'),
('Snacks', 'snacks'),
('Carnes', 'carnes'),
('Pescados y Mariscos', 'pescados-mariscos');

-- Restaurantes
INSERT INTO restaurants ("ownerId", name, description, latitude, longitude, rating, image_url, nit) VALUES
(2, 'Panadería El Oro', 'Pan fresco diario, productos horneados artesanalmente', -12.046374, -77.042793, 4.8, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', '20123456789'),
(3, 'Delicias del Chef', 'Restaurante con comida casera y platillos del día', -12.055473, -77.023456, 4.5, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', '20123456790'),
(4, 'Café Central', 'Café espresso, repostería y desayunos', -12.038921, -77.028532, 4.7, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', '20123456791'),
(5, 'Dulce Pan', 'Pasteles, tartas y panes dulces', -12.067891, -77.012345, 4.6, 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=400', '20123456792'),
(6, 'Sabor casero', 'Comida peruana tradicional', -12.023456, -77.056789, 4.3, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', '20123456793'),
(8, 'Burger Street CBB', 'Las mejores hamburguesas de Cochabamba', -17.423083, -66.119639, 4.9, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', '30123456789'),
(9, 'Pizza Nostra', 'Pizza artesanal a la leña', -17.424000, -66.120000, 4.7, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', '30123456790'),
(10, 'Coffee Break', 'Café de especialidad y snacks', -17.422500, -66.118500, 4.8, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', '30123456791'),
(14, 'La Chacra', 'Comida orgánica y saludable, productos frescos de la granja', -12.089123, -77.034567, 4.4, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', '20123456794'),
(15, 'Sushi Roll', 'Sushi fresco, rolls y cocina nikkei', -12.034567, -77.045678, 4.6, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', '20123456795'),
(16, 'Helados Artesanal', 'Helados artesanales de temporada, sabores únicos', -12.056789, -77.067890, 4.7, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', '20123456796');

-- Ubicaciones (sucursales)
INSERT INTO locations (restaurant_id, name, latitude, longitude, description, phone) VALUES
(1, 'Panadería El Oro - Main', -12.046374, -77.042793, 'Av. Utama 123, Lima', '999-111-111'),
(1, 'Panadería El Oro - Sucursal Centro', -12.047500, -77.041000, 'Jr. Comercio 456', '999-111-112'),
(2, 'Delicias del Chef', -12.055473, -77.023456, 'Av. España 789, Lima', '999-222-222'),
(2, 'Delicias del Chef - Sucursal Sur', -12.065473, -77.013456, 'Av. Grau 1234, Lima', '999-222-223'),
(3, 'Café Central', -12.038921, -77.028532, 'Plaza Mayor, Lima', '999-333-333'),
(3, 'Café Central - Terraza', -12.038900, -77.028500, 'Plaza Mayor - Terraza', '999-333-334'),
(4, 'Dulce Pan', -12.067891, -77.012345, 'Av. La Marina 321, Lima', '999-444-444'),
(4, 'Dulce Pan - Sucursal Centro', -12.057891, -77.022345, 'Jr. de la Unión 567, Lima', '999-444-445'),
(5, 'Sabor casero', -12.023456, -77.056789, 'Jr. Huamachuco 654, Lima', '999-555-555'),
(5, 'Sabor casero - Sucursal Norte', -12.013456, -77.066789, 'Av. Los Olivos 890, Lima', '999-555-556'),
(6, 'Burger Street - Central', -17.423083, -66.119639, 'Calle Colombia 123, CBB', '444-111-111'),
(6, 'Burger Street - Norte', -17.413083, -66.129639, 'Av. Ayacucho 456, CBB', '444-111-112'),
(7, 'Pizza Nostra - Plaza', -17.424000, -66.120000, 'Av. Ballivian 456, CBB', '444-222-222'),
(7, 'Pizza Nostra - Sur', -17.434000, -66.110000, 'Calle La Paz 789, CBB', '444-222-223'),
(8, 'Coffee Break - Recoleta', -17.422500, -66.118500, 'Av. Pando 789, CBB', '444-333-333'),
(8, 'Coffee Break - Centro', -17.412500, -66.128500, 'Calle España 321, CBB', '444-333-334'),
(9, 'La Chacra - Main', -12.089123, -77.034567, 'Av. La Molina 111, Lima', '999-666-111'),
(9, 'La Chacra - Norte', -12.079123, -77.044567, 'Av. Universitaria 222, Lima', '999-666-112'),
(10, 'Sushi Roll', -12.034567, -77.045678, 'Av. Larco 777, Lima', '999-777-777'),
(11, 'Helados Artesanal', -12.056789, -77.067890, 'Malecón 123, Lima', '999-888-888');

-- Productos excedentes
INSERT INTO product_excedente ("commerceId", "locationId", "categoryId", title, description, original_price, discount_price, quantity, image_url, pickup_start, pickup_end, status) VALUES
-- Panadería El Oro (commerce 1)
(1, 1, 1, 'Pan Francés', 'Pan francés recién horneado', 2.50, 1.25, 30, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-01 08:00:00', '2026-05-01 14:00:00', 'active'),
(1, 1, 1, 'Conchas', 'Conchas de chocolate y vainilla', 3.00, 1.50, 20, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200', '2026-05-01 09:00:00', '2026-05-01 15:00:00', 'active'),
(1, 1, 1, 'Bolillos', 'Bolillos integrales', 1.80, 0.90, 25, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-01 07:00:00', '2026-05-01 13:00:00', 'active'),
(1, 1, 2, 'Cupcakes', 'Cupcakes de vainilla con frosting', 4.50, 2.25, 15, 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=200', '2026-05-01 10:00:00', '2026-05-01 16:00:00', 'active'),
(1, 1, 2, 'Brownies', 'Brownies de chocolate', 3.50, 1.75, 12, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200', '2026-05-01 11:00:00', '2026-05-01 17:00:00', 'active'),
(1, 1, 1, 'Pan Integral', 'Pan integral con semillas', 3.00, 1.50, 18, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-02 08:00:00', '2026-05-02 14:00:00', 'active'),
(1, 2, 1, 'Pan de Molde', 'Pan de molde artesanal', 4.00, 2.00, 10, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-05-01 08:00:00', '2026-05-01 12:00:00', 'active'),
(1, 2, 2, 'Biscochos', 'Biscochos esponjosos', 2.00, 1.00, 40, 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=200', '2026-05-02 09:00:00', '2026-05-02 15:00:00', 'active'),
-- Delicias del Chef (commerce 2)
(2, 3, 7, 'Menú del Día', 'Pollo a la olla con arroz y ensalada', 12.00, 6.00, 10, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200', '2026-05-01 12:00:00', '2026-05-01 15:00:00', 'active'),
(2, 3, 7, 'Ceviche', 'Ceviche de pescado fresco', 15.00, 7.50, 8, 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=200', '2026-05-01 11:00:00', '2026-05-01 14:00:00', 'active'),
(2, 3, 7, 'Lomo Saltado', 'Lomo saltado con papas fritas', 14.00, 7.00, 6, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200', '2026-05-01 12:30:00', '2026-05-01 16:00:00', 'active'),
(2, 3, 5, 'Ensalada Mixta', 'Ensalada con pollo y aderezo', 8.00, 4.00, 5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200', '2026-05-01 13:00:00', '2026-05-01 18:00:00', 'active'),
(2, 3, 9, 'Parrilla Mixta', 'Parrilla para dos personas', 28.00, 14.00, 4, 'https://images.unsplash.com/photo-1558030083-cf0e5a9a6b8e?w=200', '2026-05-02 12:00:00', '2026-05-02 16:00:00', 'active'),
(2, 4, 7, 'Tallarines Verdes', 'Tallarines con albahaca y nueces', 11.00, 5.50, 7, 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=200', '2026-05-02 11:00:00', '2026-05-02 14:00:00', 'active'),
-- Café Central (commerce 3)
(3, 5, 3, 'Café Latte', 'Café latte con leche', 5.00, 2.50, 20, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200', '2026-05-01 07:00:00', '2026-05-01 12:00:00', 'active'),
(3, 5, 3, 'Cappuccino', 'Cappuccino con cocoa', 5.50, 2.75, 15, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200', '2026-05-01 08:00:00', '2026-05-01 13:00:00', 'active'),
(3, 5, 3, 'Jugo de Naranja', 'Jugo natural de naranja', 4.00, 2.00, 10, 'https://images.unsplash.com/photo-1600271884442-efd12d4f9666?w=200', '2026-05-01 07:00:00', '2026-05-01 11:00:00', 'active'),
(3, 5, 2, 'Croissant', 'Croissant de mantequilla', 3.50, 1.75, 12, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200', '2026-05-01 08:00:00', '2026-05-01 14:00:00', 'active'),
(3, 5, 2, 'Muffin', 'Muffin de arándanos', 4.00, 2.00, 8, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200', '2026-05-01 09:00:00', '2026-05-01 15:00:00', 'active'),
(3, 6, 3, 'Té Chai', 'Té chai latte especiado', 6.00, 3.00, 10, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200', '2026-05-02 08:00:00', '2026-05-02 12:00:00', 'active'),
(3, 6, 3, 'Smoothie Verde', 'Smoothie de espinaca y manzana', 7.00, 3.50, 6, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200', '2026-05-02 09:00:00', '2026-05-02 13:00:00', 'active'),
-- Dulce Pan (commerce 4)
(4, 7, 2, 'Torta de Chocolate', 'Torta de chocolate con cobertura', 25.00, 12.50, 3, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200', '2026-05-01 14:00:00', '2026-05-01 18:00:00', 'active'),
(4, 7, 2, 'Pie de Manzana', 'Pie de manzana casero', 20.00, 10.00, 4, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=200', '2026-05-01 13:00:00', '2026-05-01 17:00:00', 'active'),
(4, 7, 2, 'Galletas', 'Galletas de chispas de chocolate', 5.00, 2.50, 20, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200', '2026-05-01 10:00:00', '2026-05-01 16:00:00', 'active'),
(4, 7, 8, 'Donas', 'Donas glaseadas', 3.50, 1.75, 15, 'https://images.unsplash.com/photo-1551024601-562963525cb8?w=200', '2026-05-01 11:00:00', '2026-05-01 17:00:00', 'active'),
(4, 8, 2, 'Torta Tres Leches', 'Torta tres leches con merengue', 22.00, 11.00, 2, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=200', '2026-05-02 14:00:00', '2026-05-02 18:00:00', 'active'),
(4, 8, 2, 'Alfajores', 'Alfajores de dulce de leche', 3.00, 1.50, 25, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200', '2026-05-02 10:00:00', '2026-05-02 16:00:00', 'active'),
-- Sabor casero (commerce 5)
(5, 9, 7, 'Arroz con Pollo', 'Arroz con pollo y ensalada', 10.00, 5.00, 8, 'https://images.unsplash.com/photo-1567620900862-93b6b94369aa?w=200', '2026-05-01 11:30:00', '2026-05-01 14:30:00', 'active'),
(5, 9, 7, 'Seco de Res', 'Seco de res con frejoles', 12.00, 6.00, 6, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200', '2026-05-01 12:00:00', '2026-05-01 15:00:00', 'active'),
(5, 9, 7, 'Causa', 'Causa limeña rellena', 9.00, 4.50, 5, 'https://images.unsplash.com/photo-1626645738196-c2a72c7c8e38?w=200', '2026-05-01 12:30:00', '2026-05-01 16:00:00', 'active'),
(5, 9, 5, 'Fruta del día', 'Fruta variada picadita', 5.00, 2.50, 10, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200', '2026-05-01 09:00:00', '2026-05-01 14:00:00', 'active'),
(5, 10, 7, 'Ají de Gallina', 'Ají de gallina con arroz y papa', 11.00, 5.50, 5, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200', '2026-05-02 12:00:00', '2026-05-02 15:00:00', 'active'),
(5, 10, 7, 'Papa Rellena', 'Papas rellenas de carne', 3.50, 1.75, 12, 'https://images.unsplash.com/photo-1624378441888-8c1b3b5e2e1e?w=200', '2026-05-02 10:00:00', '2026-05-02 14:00:00', 'active'),
-- Burger Street CBB (commerce 6)
(6, 11, 4, 'Hamburguesa Clásica', 'Hamburguesa con queso, lechuga y tomate', 15.00, 7.50, 20, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', '2026-05-01 11:00:00', '2026-05-01 15:00:00', 'active'),
(6, 11, 4, 'Hamburguesa BBQ', 'Hamburguesa con cebolla caramelizada y BBQ', 18.00, 9.00, 15, 'https://images.unsplash.com/photo-1565299507177-b0ac605638b1?w=200', '2026-05-01 12:00:00', '2026-05-01 16:00:00', 'active'),
(6, 11, 8, 'Papas Fritas', 'Papas fritas con queso derretido', 6.00, 3.00, 30, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200', '2026-05-01 10:00:00', '2026-05-01 14:00:00', 'active'),
(6, 12, 4, 'Hamburguesa Vegetariana', 'Hamburguesa de lentejas y quinoa', 14.00, 7.00, 10, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200', '2026-05-02 11:00:00', '2026-05-02 15:00:00', 'active'),
(6, 12, 3, 'Malteada', 'Malteada de chocolate o vainilla', 8.00, 4.00, 12, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200', '2026-05-02 10:00:00', '2026-05-02 14:00:00', 'active'),
-- Pizza Nostra (commerce 7)
(7, 13, 4, 'Pizza Margherita', 'Pizza clásica con mozzarella y albahaca', 22.00, 11.00, 8, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200', '2026-05-01 12:00:00', '2026-05-01 16:00:00', 'active'),
(7, 13, 4, 'Pizza Pepperoni', 'Pizza con pepperoni y queso extra', 25.00, 12.50, 6, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200', '2026-05-01 13:00:00', '2026-05-01 17:00:00', 'active'),
(7, 13, 4, 'Pizza Vegetariana', 'Pizza con verduras frescas', 24.00, 12.00, 5, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200', '2026-05-01 14:00:00', '2026-05-01 18:00:00', 'active'),
(7, 14, 4, 'Pizza Hawaiana', 'Pizza con piña y jamón', 23.00, 11.50, 7, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200', '2026-05-02 12:00:00', '2026-05-02 16:00:00', 'active'),
(7, 14, 3, 'Gaseosa Personal', 'Gaseosa de 500ml', 3.00, 1.50, 25, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200', '2026-05-02 11:00:00', '2026-05-02 17:00:00', 'active'),
-- Coffee Break (commerce 8)
(8, 15, 3, 'Espresso Doble', 'Café espresso doble italiano', 4.00, 2.00, 25, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=200', '2026-05-01 07:00:00', '2026-05-01 11:00:00', 'active'),
(8, 15, 3, 'Matcha Latte', 'Té matcha con leche de almendras', 7.00, 3.50, 10, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=200', '2026-05-01 08:00:00', '2026-05-01 12:00:00', 'active'),
(8, 15, 8, 'Cookie', 'Cookie de chocolate artesanal', 3.00, 1.50, 20, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200', '2026-05-01 09:00:00', '2026-05-01 15:00:00', 'active'),
(8, 16, 3, 'Limonada Frozen', 'Limonada frozen con hierbabuena', 6.00, 3.00, 15, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200', '2026-05-02 10:00:00', '2026-05-02 14:00:00', 'active'),
(8, 16, 6, 'Yogurt con Granola', 'Yogurt natural con granola', 6.50, 3.25, 8, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200', '2026-05-02 08:00:00', '2026-05-02 12:00:00', 'active'),
-- La Chacra (commerce 9)
(9, 17, 5, 'Ensalada Orgánica', 'Ensalada de kale, quinoa y aguacate', 12.00, 6.00, 10, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200', '2026-05-01 10:00:00', '2026-05-01 14:00:00', 'active'),
(9, 17, 6, 'Queso Fresco', 'Queso fresco artesanal de cabra', 8.00, 4.00, 8, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200', '2026-05-01 09:00:00', '2026-05-01 13:00:00', 'active'),
(9, 17, 5, 'Jugo Verde', 'Jugo detox de vegetales', 6.00, 3.00, 15, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=200', '2026-05-01 08:00:00', '2026-05-01 12:00:00', 'active'),
(9, 18, 5, 'Wrap de Pollo', 'Wrap integral con pollo y verduras', 10.00, 5.00, 6, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200', '2026-05-02 11:00:00', '2026-05-02 15:00:00', 'active'),
(9, 18, 9, 'Hamburguesa de Lentejas', 'Hamburguesa vegetal con pan integral', 11.00, 5.50, 5, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200', '2026-05-02 12:00:00', '2026-05-02 16:00:00', 'active'),
-- Sushi Roll (commerce 10)
(10, 19, 10, 'Roll California', 'Roll de cangrejo, aguacate y pepino', 18.00, 9.00, 10, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200', '2026-05-01 12:00:00', '2026-05-01 16:00:00', 'active'),
(10, 19, 10, 'Nigiri Salmón', 'Nigiri de salmón fresco', 20.00, 10.00, 8, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200', '2026-05-01 13:00:00', '2026-05-01 17:00:00', 'active'),
(10, 19, 10, 'Ceviche Nikkei', 'Ceviche nikkei con pescado fresco', 16.00, 8.00, 5, 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=200', '2026-05-01 11:00:00', '2026-05-01 15:00:00', 'active'),
(10, 19, 4, 'Makis Tempura', 'Makis tempura de camarón', 22.00, 11.00, 6, 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=200', '2026-05-02 12:00:00', '2026-05-02 16:00:00', 'active'),
-- Helados Artesanal (commerce 11)
(11, 20, 6, 'Helado de Lucuma', 'Helado artesanal de lúcuma', 7.00, 3.50, 20, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200', '2026-05-01 14:00:00', '2026-05-01 18:00:00', 'active'),
(11, 20, 6, 'Helado de Chocolate', 'Helado de chocolate belga', 7.00, 3.50, 18, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200', '2026-05-01 15:00:00', '2026-05-01 19:00:00', 'active'),
(11, 20, 3, 'Batido de Mango', 'Batido natural de mango', 8.00, 4.00, 12, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200', '2026-05-01 10:00:00', '2026-05-01 14:00:00', 'active'),
(11, 20, 8, 'Helado de Vainilla', 'Helado de vainilla con chispas', 6.00, 3.00, 25, 'https://images.unsplash.com/photo-1505394033641-40f6ad2718ad?w=200', '2026-05-02 13:00:00', '2026-05-02 17:00:00', 'active'),
-- Productos agotados / vencidos (para variedad de estados)
(1, 1, 1, 'Pan de Ayer', 'Pan del día anterior a mitad de precio', 2.00, 1.00, 0, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '2026-04-30 08:00:00', '2026-04-30 14:00:00', 'sold_out'),
(3, 5, 3, 'Café del Día Anterior', 'Café preparado por la mañana', 3.00, 1.50, 0, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200', '2026-04-29 07:00:00', '2026-04-29 11:00:00', 'expired');

-- Perfiles
INSERT INTO profiles (user_id, full_name, phone, avatar_url) VALUES
(1, 'Admin Eco Bocado', '999-000-001', 'https://ui-avatars.com/api/?name=Admin&background=4CAF50&color=fff'),
(2, 'Carlos Mendoza', '999-111-111', 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=FF9800&color=fff'),
(3, 'María García', '999-222-222', 'https://ui-avatars.com/api/?name=Maria+Garcia&background=2196F3&color=fff'),
(4, 'Pedro Sánchez', '999-333-333', 'https://ui-avatars.com/api/?name=Pedro+Sanchez&background=9C27B0&color=fff'),
(5, 'Laura Torres', '999-444-444', 'https://ui-avatars.com/api/?name=Laura+Torres&background=E91E63&color=fff'),
(6, 'José López', '999-555-555', 'https://ui-avatars.com/api/?name=Jose+Lopez&background=00BCD4&color=fff'),
(7, 'Ana Castro', '999-666-666', 'https://ui-avatars.com/api/?name=Ana+Castro&background=FF5722&color=fff'),
(8, 'Roberto Quispe', '999-777-001', 'https://ui-avatars.com/api/?name=Roberto+Quispe&background=607D8B&color=fff'),
(9, 'Carmen Flores', '999-777-002', 'https://ui-avatars.com/api/?name=Carmen+Flores&background=795548&color=fff'),
(10, 'Diego Rojas', '999-777-003', 'https://ui-avatars.com/api/?name=Diego+Rojas&background=8BC34A&color=fff'),
(11, 'Valeria Torres', '999-777-004', 'https://ui-avatars.com/api/?name=Valeria+Torres&background=FFC107&color=fff'),
(12, 'Mateo Vargas', '999-777-005', 'https://ui-avatars.com/api/?name=Mateo+Vargas&background=03A9F4&color=fff'),
(13, 'Sofía Castro', '999-777-006', 'https://ui-avatars.com/api/?name=Sofia+Castro&background=E91E63&color=fff'),
(14, 'Ricardo Huerta', '999-666-000', 'https://ui-avatars.com/api/?name=Ricardo+Huerta&background=4CAF50&color=fff'),
(15, 'Kenji Tanaka', '999-777-000', 'https://ui-avatars.com/api/?name=Kenji+Tanaka&background=F44336&color=fff'),
(16, 'Lucía Mendoza', '999-888-000', 'https://ui-avatars.com/api/?name=Lucia+Mendoza&background=9C27B0&color=fff');

-- Pedidos
INSERT INTO orders ("buyerId", "productId", quantity, payment_method, payment_status, delivery_status, total_price, status, reservation_code, paid_at, receipt_url) VALUES
-- Órdenes existentes (dueños CBB comprando en Lima)
(5, 1, 3, 'cash', 'paid', 'delivered', 3.75, 'confirmed', 'RES-001', '2026-05-01 10:00:00', NULL),
(5, 2, 2, 'online', 'paid', 'qr_code_validation', 3.00, 'confirmed', 'RES-002', '2026-05-01 11:00:00', 'https://receipts.ecobocado.com/rec-002.pdf'),
(6, 7, 1, 'cash', 'paid', 'delivered', 7.50, 'confirmed', 'RES-003', '2026-05-01 12:30:00', NULL),
(6, 11, 2, 'online', 'paid', 'delivered', 5.00, 'confirmed', 'RES-004', '2026-05-01 09:30:00', 'https://receipts.ecobocado.com/rec-004.pdf'),
(7, 15, 1, 'cash', 'paid', 'delivered', 2.50, 'confirmed', 'RES-005', '2026-05-01 14:00:00', NULL),
(7, 19, 2, 'online', 'pending', 'pending', 10.00, 'confirmed', 'RES-006', NULL, NULL),
-- Clientes reales comprando
(8, 5, 3, 'online', 'paid', 'delivered', 5.25, 'confirmed', 'RES-007', '2026-05-01 15:00:00', 'https://receipts.ecobocado.com/rec-007.pdf'),
(8, 34, 2, 'cash', 'paid', 'delivered', 15.00, 'confirmed', 'RES-008', '2026-05-01 13:00:00', NULL),
(9, 26, 1, 'online', 'paid', 'qr_code_validation', 14.00, 'confirmed', 'RES-009', '2026-05-02 12:00:00', 'https://receipts.ecobocado.com/rec-009.pdf'),
(9, 39, 1, 'cash', 'paid', 'delivered', 11.00, 'confirmed', 'RES-010', '2026-05-01 18:00:00', NULL),
(10, 49, 2, 'online', 'paid', 'delivered', 12.00, 'confirmed', 'RES-011', '2026-05-01 11:00:00', 'https://receipts.ecobocado.com/rec-011.pdf'),
(10, 58, 3, 'cash', 'paid', 'delivered', 10.50, 'confirmed', 'RES-012', '2026-05-01 16:00:00', NULL),
(11, 44, 2, 'online', 'paid', 'delivered', 4.00, 'confirmed', 'RES-013', '2026-05-02 09:00:00', 'https://receipts.ecobocado.com/rec-013.pdf'),
(11, 54, 1, 'cash', 'paid', 'qr_code_validation', 9.00, 'confirmed', 'RES-014', '2026-05-02 14:00:00', NULL),
(12, 28, 1, 'online', 'paid', 'delivered', 3.00, 'confirmed', 'RES-015', '2026-05-02 10:30:00', 'https://receipts.ecobocado.com/rec-015.pdf'),
(12, 36, 2, 'cash', 'paid', 'delivered', 6.00, 'confirmed', 'RES-016', '2026-05-01 12:00:00', NULL),
(13, 52, 1, 'online', 'paid', 'delivered', 5.00, 'confirmed', 'RES-017', '2026-05-02 13:00:00', 'https://receipts.ecobocado.com/rec-017.pdf'),
(13, 60, 2, 'cash', 'pending', 'pending', 8.00, 'confirmed', 'RES-018', NULL, NULL),
-- Pedido cancelado
(8, 21, 2, 'online', 'rejected', 'pending', 5.00, 'cancelled', 'RES-019', NULL, NULL),
(9, 41, 1, 'cash', 'paid', 'not_picked_up', 12.00, 'cancelled', 'RES-020', '2026-05-01 17:00:00', NULL);

-- Reseñas
INSERT INTO reviews (order_id, client_id, restaurant_id, stars, comment) VALUES
(1, 5, 1, 5, 'Excelente pan, muy fresco y delicioso'),
(2, 5, 1, 4, 'Buen producto, aunque llegó un poco tarde'),
(3, 6, 2, 5, 'El ceviche estaba fresquísimo, recomendado'),
(4, 6, 3, 5, 'El mejor café de la zona, volveré'),
(5, 7, 4, 4, 'Las donas estaban delicious'),
(7, 8, 1, 5, 'Brownies espectaculares, súper recomendados'),
(8, 8, 6, 4, 'Buena hamburguesa, relación calidad-precio excelente'),
(9, 9, 2, 5, 'La parrilla mixta increíble, volveré por más'),
(10, 9, 7, 3, 'La pizza estaba bien, pero un poco fría al recoger'),
(11, 10, 9, 5, 'Ensalada orgánica fresquísima, el queso de cabra delicioso'),
(12, 10, 11, 5, 'Helado de lúcuma espectacular, cremoso y natural'),
(13, 11, 8, 4, 'Buen café espresso, atención rápida'),
(14, 11, 10, 5, 'Roll California fresco y bien preparado'),
(15, 12, 3, 4, 'Té chai rico, aunque esperaba más cantidad'),
(16, 12, 6, 5, 'Papas fritas con queso, las mejores de CBB');

-- Notificaciones
INSERT INTO notifications (user_id, title, content, type, is_read) VALUES
(2, 'Nueva orden', 'Tienes una nueva orden de compra #RES-001', 'alert', false),
(2, 'Pedido confirmado', 'Tu pedido #RES-002 ha sido confirmado', 'reservation_confirmed', true),
(3, 'Stock bajo', 'El producto Menú del Día tiene poco stock', 'alert', false),
(5, 'Promoción especial', '10% de descuento en panadería hoy', 'alert', false),
(6, 'Pedido entregado', 'Tu pedido #RES-004 ha sido entregado', 'reservation_confirmed', true),
(5, 'Nuevo pedido', 'Has recibido una orden en Burger Street CBB', 'alert', false),
(6, 'Reserva confirmada', 'Tu pedido #RES-009 en Delicias del Chef está listo', 'reservation_confirmed', true),
(8, 'Bienvenido', 'Gracias por registrarte en Eco Bocado', 'alert', true),
(9, 'Recordatorio', 'Tienes un pedido pendiente por recoger', 'alert', false),
(10, 'Reserva confirmada', 'Tu pedido #RES-011 en La Chacra está confirmado', 'reservation_confirmed', true),
(11, 'Reserva confirmada', 'Tu pedido #RES-013 en Coffee Break está listo', 'reservation_confirmed', true),
(12, 'Pedido cancelado', 'Tu pedido #RES-019 ha sido cancelado', 'alert', false),
(13, 'Nueva oferta', 'Helados Artesanal tiene nuevo sabor de temporada', 'alert', false),
(2, 'Producto agotado', 'El Pan Francés se ha agotado por hoy', 'alert', false);
