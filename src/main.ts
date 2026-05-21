import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return server;
}

if (!process.env.VERCEL) {
  bootstrap().then((app) =>
    app.listen({ port: process.env.PORT ?? 3000, host: '0.0.0.0' }),
  );
}

let cachedApp: express.Express;
export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
}
