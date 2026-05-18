import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './entities/commerce.entity';
import { Product } from '../products/entities/product.entity';
import { CommercesService } from './commerces.service';
import { CommercesController } from './commerces.controller';
import { RestaurantsController } from './restaurants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commerce, Product])],
  controllers: [CommercesController, RestaurantsController],
  providers: [CommercesService],
  exports: [TypeOrmModule, CommercesService],
})
export class CommercesModule {}
