-- Validación de recogida
-- Agrega fecha/hora de entrega para cerrar correctamente la venta.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;

-- Recomendado para validar códigos rápido.
CREATE INDEX IF NOT EXISTS idx_orders_reservation_code
ON orders (reservation_code);