import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('RestaurantsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /restaurants/categories', () => {
    it('should return a list of active categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('slug');
      }
    });
  });

  describe('GET /restaurants/nearby', () => {
    it('should require lat and lng query params', async () => {
      await request(app.getHttpServer())
        .get('/restaurants/nearby')
        .expect(400);
    });

    it('should return nearby locations within a radius', async () => {
      // Coordenadas de Lima (Panadería El Oro en seed)
      const response = await request(app.getHttpServer())
        .get('/restaurants/nearby?lat=-12.046374&lng=-77.042793&radius=5')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('restaurantId');
      expect(response.body[0]).toHaveProperty('distance');
      expect(response.body[0].distance).toBeLessThanOrEqual(5);
    });

    it('should filter locations by category slug', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants/nearby?lat=-12.046374&lng=-77.042793&radius=5&category=panaderia')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Todos los resultados deben ser válidos
      for (const loc of response.body) {
        expect(loc.availableOffers).toBeGreaterThan(0);
      }
    });

    it('should filter locations by category ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants/nearby?lat=-12.046374&lng=-77.042793&radius=5&category=1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
