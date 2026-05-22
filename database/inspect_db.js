require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to Neon DB...\n');

  try {
    const products = await client.query(`
      SELECT p.product_excedente_id, p.title, p.status, p.quantity,
             p.pickup_end, p."commerceId", p."locationId"
      FROM product_excedente p
      ORDER BY p.product_excedente_id
    `);
    console.log(` Productos (${products.rowCount}):`);
    products.rows.forEach(r => console.log(
      `  [${r.product_excedente_id}] ${r.title} | qty=${r.quantity} | status=${r.status} | commerce=${r.commerceId} | location=${r.locationId ?? '—'} | pickup_end=${r.pickup_end?.toISOString?.() ?? r.pickup_end}`
    ));

    const locations = await client.query(`
      SELECT l.location_id, l.name, l.latitude, l.longitude, l.restaurant_id,
             r.name AS restaurant_name
      FROM locations l
      LEFT JOIN restaurants r ON l.restaurant_id = r.restaurant_id
      ORDER BY l.location_id
    `);
    console.log(`\n Locations (${locations.rowCount}):`);
    locations.rows.forEach(r => console.log(
      `  [${r.location_id}] ${r.name} (${r.restaurant_name}) | lat=${r.latitude} lng=${r.longitude}`
    ));

    const restaurants = await client.query(`
      SELECT r.restaurant_id, r.name, r.latitude, r.longitude,
             COUNT(l.location_id) AS sucursales
      FROM restaurants r
      LEFT JOIN locations l ON l.restaurant_id = r.restaurant_id
      GROUP BY r.restaurant_id
      ORDER BY r.restaurant_id
    `);
    console.log(`\n Restaurantes (${restaurants.rowCount}):`);
    restaurants.rows.forEach(r => console.log(
      `  [${r.restaurant_id}] ${r.name} | lat=${r.latitude} lng=${r.longitude} | sucursales=${r.sucursales}`
    ));

    const orders = await client.query(`
      SELECT o.order_id, o.status, o.payment_method, o.payment_status,
             o.delivery_status, o.reservation_code IS NOT NULL AS has_code
      FROM orders o
      ORDER BY o.order_id
    `);
    console.log(`\n Pedidos (${orders.rowCount}):`);
    orders.rows.forEach(r => console.log(
      `  [${r.order_id}] method=${r.payment_method} | payment=${r.payment_status} | delivery=${r.delivery_status} | status=${r.status} | code=${r.has_code ? '✅' : '❌'}`
    ));

  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
