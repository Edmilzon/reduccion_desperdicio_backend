import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommercesModule } from './commerces/commerces.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MailerModule } from '@nestjs-modules/mailer';
// @ts-ignore
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
          port: configService.get<number>('SMTP_PORT') || 587,
          auth: {
            user: configService.get<string>('SMTP_USER') || 'usuario@gmail.com',
            pass: configService.get<string>('SMTP_PASS') || 'contraseña',
          },
        },
        defaults: {
          from: '"No Reply" <noreply@ecobocado.com>',
        },
        template: {
          dir: join(__dirname, 'users/entities'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    // Se cambia el path de las plantillas para que apunte correctamente a la carpeta `src`
    // y se asegura que ThrottlerModule no de errores de tipo.
    ThrottlerModule.forRoot([
      { ttl: 60000, limit: 10 }, // Límite global por defecto
    ]),
    UsersModule,
    CommercesModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
