// Script para resetear todos los datos de prueba con fechas válidas
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to Neon DB...');

  try {
    // Primero verificamos los datos existentes
    const products = await client.query(`
      SELECT product_excedente_id, title, status, pickup_end, "commerceId"
      FROM product_excedente 
      ORDER BY product_excedente_id
    `);
    
    console.log('Productos en BD:');
    products.rows.forEach(r => {
      console.log(`  [${r.product_excedente_id}] title="${r.title}" | commerce=${r.commerceId} | status: ${r.status} | pickup_end: ${r.pickup_end}`);
    });

    const locations = await client.query(`
      SELECT location_id, name, latitude, longitude, restaurant_id
      FROM locations
      ORDER BY location_id
    `);
    console.log('\nLocations en BD:');
    locations.rows.forEach(r => {
      console.log(`  [${r.location_id}] ${r.name} | lat=${r.latitude} lng=${r.longitude} | restaurant_id=${r.restaurant_id}`);
    });

    const restaurants = await client.query(`
      SELECT restaurant_id, name, latitude, longitude
      FROM restaurants
      ORDER BY restaurant_id
    `);
    console.log('\nRestaurants en BD:');
    restaurants.rows.forEach(r => {
      console.log(`  [${r.restaurant_id}] ${r.name} | lat=${r.latitude} lng=${r.longitude}`);
    });

  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
