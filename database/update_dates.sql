-- ======================================================
-- UPDATE PRODUCT DATES - Actualizar fechas de productos
-- para que sean futuras y aparezcan en búsquedas cercanas
-- ======================================================

-- Actualizar todos los productos con fechas dinámicas basadas en NOW()
-- Desayunos (7am - 11am)
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '07:00:00',
  pickup_end   = (NOW()::date + INTERVAL '1 day') + TIME '11:00:00',
  status = 'active'
WHERE product_excedente_id IN (3, 10, 11, 12, 29);

-- Mañana (8am - 14pm)
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '08:00:00',
  pickup_end   = (NOW()::date + INTERVAL '1 day') + TIME '14:00:00',
  status = 'active'
WHERE product_excedente_id IN (1, 2, 13, 14);

-- Mediodía (11am - 16pm)
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '11:00:00',
  pickup_end   = (NOW()::date + INTERVAL '1 day') + TIME '16:00:00',
  status = 'active'
WHERE product_excedente_id IN (6, 7, 8, 9, 18, 19, 20, 21, 22);

-- Tarde (14pm - 19pm)
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '14:00:00',
  pickup_end   = (NOW()::date + INTERVAL '1 day') + TIME '19:00:00',
  status = 'active'
WHERE product_excedente_id IN (15, 16, 17, 4, 5);

-- Noche (18pm - 22pm)
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '18:00:00',
  pickup_end   = (NOW()::date + INTERVAL '1 day') + TIME '22:00:00',
  status = 'active'
WHERE product_excedente_id IN (23, 24, 25);

-- Verificar resultado
SELECT
  product_excedente_id,
  title,
  status,
  pickup_start,
  pickup_end
FROM product_excedente
ORDER BY product_excedente_id;
