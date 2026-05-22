-- HU-15 Pago contra entrega / Pago en sucursal
-- Script para actualizar la tabla orders en ambientes donde synchronize=false.
-- Ejecutar antes de probar POST /orders, GET /orders/merchant y PATCH /orders/:id/mark-paid-delivered.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS reservation_code VARCHAR(255) UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(255);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(255) DEFAULT 'cash';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(255) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(255) DEFAULT 'pending';

UPDATE orders SET payment_method = 'cash' WHERE payment_method IS NULL;
UPDATE orders SET payment_status = 'pending' WHERE payment_status IS NULL;
UPDATE orders SET delivery_status = 'pending' WHERE delivery_status IS NULL;