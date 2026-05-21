// Script de reseed completo para Eco Bocado
// Limpia y recrea todos los datos de prueba con coordenadas de Cochabamba, Bolivia
require('dotenv').config();
const { Client } = require('pg');

// Coordenadas reales en Cochabamba, Bolivia (radio de ~2km del centro)
const RESTAURANTS = [
  {
    id: 1,
    name: 'Panadería El Trigal',
    description: 'Pan artesanal fresco todos los días. Especialidad en pan integral y croissants.',
    lat: -17.3930, lng: -66.1570,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    nit: '20123456789',
  },
  {
    id: 2,
    name: 'Delicias del Chef',
    description: 'Restaurante con comida casera y platillos del día a precio justo.',
    lat: -17.3955, lng: -66.1590,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    nit: '20123456790',
  },
  {
    id: 3,
    name: 'Café Central Cochabamba',
    description: 'Café espresso de especialidad, repostería y desayunos.',
    lat: -17.3900, lng: -66.1555,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    nit: '20123456791',
  },
  {
    id: 4,
    name: 'Dulce Pan',
    description: 'Pasteles, tartas y panes dulces artesanales.',
    lat: -17.3975, lng: -66.1545,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=400',
    nit: '20123456792',
  },
  {
    id: 5,
    name: 'Sabor Boliviano',
    description: 'Cocina boliviana tradicional, platos típicos con ingredientes locales.',
    lat: -17.3880, lng: -66.1600,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    nit: '20123456793',
  },
];

// Locations para cada restaurante (coordenadas muy cercanas al restaurante)
const LOCATIONS = [
  // Panadería El Trigal
  { id: 1, restaurantId: 1, name: 'Panadería El Trigal - Principal', lat: -17.3930, lng: -66.1570, description: 'Av. Heroínas 123, Cochabamba', phone: '444-111-001' },
  { id: 2, restaurantId: 1, name: 'Panadería El Trigal - Sucursal Norte', lat: -17.3910, lng: -66.1565, description: 'Calle Sucre 456, Cochabamba', phone: '444-111-002' },
  // Delicias del Chef
  { id: 3, restaurantId: 2, name: 'Delicias del Chef', lat: -17.3955, lng: -66.1590, description: 'Av. San Martín 789, Cochabamba', phone: '444-222-001' },
  // Café Central
  { id: 4, restaurantId: 3, name: 'Café Central - Plaza', lat: -17.3900, lng: -66.1555, description: 'Plaza 14 de Septiembre, Cochabamba', phone: '444-333-001' },
  { id: 5, restaurantId: 3, name: 'Café Central - Terraza', lat: -17.3902, lng: -66.1553, description: 'Plaza 14 de Septiembre - Terraza', phone: '444-333-002' },
  // Dulce Pan
  { id: 6, restaurantId: 4, name: 'Dulce Pan', lat: -17.3975, lng: -66.1545, description: 'Av. Blanco Galindo 321, Cochabamba', phone: '444-444-001' },
  // Sabor Boliviano
  { id: 7, restaurantId: 5, name: 'Sabor Boliviano', lat: -17.3880, lng: -66.1600, description: 'Calle España 654, Cochabamba', phone: '444-555-001' },
];

// Productos con títulos y datos completos
const PRODUCTS = [
  // Panadería El Trigal (commerce 1, location 1)
  { id: 1, commerceId: 1, locationId: 1, categoryId: 1, title: 'Pan Francés', description: 'Pan francés recién horneado, crujiente por fuera y suave por dentro', originalPrice: 8.00, price: 4.00, quantity: 30, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
  { id: 2, commerceId: 1, locationId: 1, categoryId: 1, title: 'Conchas de Chocolate', description: 'Conchas esponjosas de chocolate artesanales', originalPrice: 10.00, price: 5.00, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200' },
  { id: 3, commerceId: 1, locationId: 2, categoryId: 1, title: 'Pan Integral', description: 'Pan integral con semillas, muy nutritivo', originalPrice: 12.00, price: 6.00, quantity: 25, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
  { id: 4, commerceId: 1, locationId: 1, categoryId: 2, title: 'Cupcakes de Vainilla', description: 'Cupcakes con frosting de vainilla', originalPrice: 15.00, price: 7.50, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1486427944544-d2c6128e4612?w=200' },
  { id: 5, commerceId: 1, locationId: 1, categoryId: 2, title: 'Brownies de Chocolate', description: 'Brownies húmedos con chispas de chocolate', originalPrice: 12.00, price: 6.00, quantity: 12, imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200' },
  // Delicias del Chef (commerce 2, location 3)
  { id: 6, commerceId: 2, locationId: 3, categoryId: 7, title: 'Menú del Día', description: 'Pollo a la olla con arroz blanco y ensalada fresca', originalPrice: 40.00, price: 20.00, quantity: 10, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
  { id: 7, commerceId: 2, locationId: 3, categoryId: 7, title: 'Sopa de Maní', description: 'Sopa de maní boliviana con papa y pollo', originalPrice: 25.00, price: 12.50, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200' },
  { id: 8, commerceId: 2, locationId: 3, categoryId: 7, title: 'Fricasé', description: 'Fricasé de cerdo con chuño y pan', originalPrice: 35.00, price: 17.50, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200' },
  { id: 9, commerceId: 2, locationId: 3, categoryId: 5, title: 'Ensalada Mixta', description: 'Ensalada con tomate, lechuga, zanahoria y aderezo', originalPrice: 20.00, price: 10.00, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200' },
  // Café Central (commerce 3, location 4)
  { id: 10, commerceId: 3, locationId: 4, categoryId: 3, title: 'Café Latte', description: 'Café latte con leche fresca de vaca', originalPrice: 18.00, price: 9.00, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=200' },
  { id: 11, commerceId: 3, locationId: 4, categoryId: 3, title: 'Cappuccino Artesanal', description: 'Cappuccino doble con cocoa en polvo', originalPrice: 20.00, price: 10.00, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200' },
  { id: 12, commerceId: 3, locationId: 5, categoryId: 3, title: 'Jugo de Naranja Natural', description: 'Jugo de naranja boliviana recién exprimido', originalPrice: 15.00, price: 7.50, quantity: 10, imageUrl: 'https://images.unsplash.com/photo-1600271884442-efd12d4f9666?w=200' },
  { id: 13, commerceId: 3, locationId: 4, categoryId: 2, title: 'Croissant de Mantequilla', description: 'Croissant hojaldrado con mantequilla francesa', originalPrice: 14.00, price: 7.00, quantity: 12, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200' },
  { id: 14, commerceId: 3, locationId: 4, categoryId: 2, title: 'Muffin de Arándanos', description: 'Muffin esponjoso con arándanos frescos', originalPrice: 16.00, price: 8.00, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200' },
  // Dulce Pan (commerce 4, location 6)
  { id: 15, commerceId: 4, locationId: 6, categoryId: 2, title: 'Torta de Chocolate', description: 'Torta de chocolate tres capas con ganache', originalPrice: 80.00, price: 40.00, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' },
  { id: 16, commerceId: 4, locationId: 6, categoryId: 2, title: 'Pie de Manzana', description: 'Pie de manzana casero con canela', originalPrice: 60.00, price: 30.00, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=200' },
  { id: 17, commerceId: 4, locationId: 6, categoryId: 2, title: 'Galletas de Avena', description: 'Galletas integrales con avena y pasas', originalPrice: 20.00, price: 10.00, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200' },
  { id: 18, commerceId: 4, locationId: 6, categoryId: 8, title: 'Donas Glaseadas', description: 'Donas clásicas glaseadas con azúcar y frutilla', originalPrice: 15.00, price: 7.50, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1551024601-562963525cb8?w=200' },
  // Sabor Boliviano (commerce 5, location 7)
  { id: 19, commerceId: 5, locationId: 7, categoryId: 7, title: 'Silpancho', description: 'Silpancho cochabambino con arroz, papa y huevo frito', originalPrice: 35.00, price: 17.50, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1567620900862-93b6b94369aa?w=200' },
  { id: 20, commerceId: 5, locationId: 7, categoryId: 7, title: 'Pique Macho', description: 'Pique macho con papas, carne y salchichas', originalPrice: 50.00, price: 25.00, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200' },
  { id: 21, commerceId: 5, locationId: 7, categoryId: 7, title: 'Api con Pastel', description: 'Api morado tradicional con pastel frito', originalPrice: 25.00, price: 12.50, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a72c7c8e38?w=200' },
  { id: 22, commerceId: 5, locationId: 7, categoryId: 5, title: 'Ensalada de Frutas', description: 'Frutas de temporada picadas con crema', originalPrice: 18.00, price: 9.00, quantity: 10, imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200' },
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log('✅ Conectado a Neon DB...\n');

  try {
    // 1. Eliminar locations duplicadas (mantener solo IDs 1-7)
    console.log('🧹 Limpiando locations duplicadas...');
    await client.query(`DELETE FROM locations WHERE location_id > 7`);
    console.log('   ✅ Locations extra eliminadas\n');

    // 2. Actualizar restaurants con nombres y coordenadas de Cochabamba
    console.log('🏪 Actualizando restaurantes...');
    for (const r of RESTAURANTS) {
      await client.query(
        `UPDATE restaurants SET name=$1, description=$2, latitude=$3, longitude=$4, rating=$5, image_url=$6, nit=$7 WHERE restaurant_id=$8`,
        [r.name, r.description, r.lat, r.lng, r.rating, r.imageUrl, r.nit, r.id]
      );
      console.log(`   ✅ [${r.id}] ${r.name}`);
    }

    // 3. Actualizar locations con nombres y coordenadas correctas
    console.log('\n📍 Actualizando ubicaciones...');
    for (const l of LOCATIONS) {
      await client.query(
        `UPDATE locations SET name=$1, latitude=$2, longitude=$3, description=$4, phone=$5, restaurant_id=$6 WHERE location_id=$7`,
        [l.name, l.lat, l.lng, l.description, l.phone, l.restaurantId, l.id]
      );
      console.log(`   ✅ [${l.id}] ${l.name}`);
    }

    // 4. Actualizar productos: títulos + fechas futuras + locationId correcto
    console.log('\n📦 Actualizando productos...');
    const futureEnd = new Date();
    futureEnd.setDate(futureEnd.getDate() + 7);
    const futureStart = new Date();
    futureStart.setHours(futureStart.getHours() - 1);

    for (const p of PRODUCTS) {
      await client.query(
        `UPDATE product_excedente 
         SET title=$1, description=$2, original_price=$3, discount_price=$4, 
             quantity=$5, image_url=$6, "locationId"=$7, "categoryId"=$8,
             pickup_start=$9, pickup_end=$10, status='active'
         WHERE product_excedente_id=$11`,
        [p.title, p.description, p.originalPrice, p.price, p.quantity, p.imageUrl, p.locationId, p.categoryId, futureStart, futureEnd, p.id]
      );
      console.log(`   ✅ [${p.id}] ${p.title}`);
    }

    // 5. Verificación final
    console.log('\n📊 Verificación final:');
    const rCount = await client.query('SELECT COUNT(*) FROM restaurants');
    const lCount = await client.query('SELECT COUNT(*) FROM locations');
    const pCount = await client.query('SELECT COUNT(*) FROM product_excedente WHERE status=\'active\'');
    console.log(`   Restaurantes: ${rCount.rows[0].count}`);
    console.log(`   Locations: ${lCount.rows[0].count}`);
    console.log(`   Productos activos: ${pCount.rows[0].count}`);

    // 6. Probar el endpoint nearby simulando lat/lng de Cochabamba centro
    const nearbyTest = await client.query(`
      SELECT l.location_id, l.name as loc_name, r.name as rest_name, l.latitude, l.longitude,
             COUNT(p.product_excedente_id) as active_products
      FROM locations l
      JOIN restaurants r ON l.restaurant_id = r.restaurant_id
      LEFT JOIN product_excedente p ON p."locationId" = l.location_id AND p.status='active' AND p.pickup_end >= NOW()
      GROUP BY l.location_id, l.name, r.name, l.latitude, l.longitude
      ORDER BY l.location_id
    `);
    console.log('\n🗺️  Datos para el mapa:');
    nearbyTest.rows.forEach(row => {
      console.log(`   [Loc ${row.location_id}] ${row.loc_name} (${row.rest_name}) - lat:${row.latitude} lng:${row.longitude} | productos activos: ${row.active_products}`);
    });

    console.log('\n✅ ¡Reseed completo exitoso!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}

main().catch(err => process.exit(1));
