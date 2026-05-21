// Script para actualizar fechas de productos en Neon DB
// Uso: node database/run_update.js

require('dotenv').config();
const { Client } = require('pg');

const sql = `
UPDATE product_excedente
SET
  pickup_start = (NOW()::date + INTERVAL '1 day') + TIME '07:00:00',
  pickup_end   = (NOW()::date + INTERVAL '7 days') + TIME '23:00:00',
  status = 'active';
`;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('Connected to Neon DB...');

  try {
    const result = await client.query(sql);
    console.log(`✅ Actualizados ${result.rowCount} productos con fechas futuras.`);

    // Mostrar resultados
    const check = await client.query(`
      SELECT product_excedente_id, title, status, 
             pickup_start::text, pickup_end::text 
      FROM product_excedente 
      ORDER BY product_excedente_id
    `);
    console.log('\nProductos actualizados:');
    check.rows.forEach(r => {
      console.log(`  [${r.product_excedente_id}] ${r.title} | status: ${r.status} | hasta: ${r.pickup_end}`);
    });
  } finally {
    await client.end();
    console.log('\nDone!');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
