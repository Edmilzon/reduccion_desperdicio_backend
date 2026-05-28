import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './entities/commerce.entity';
import { Location } from './entities/location.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../products/entities/category.entity';
import { CommercesService } from './commerces.service';
import { CommercesController } from './commerces.controller';
import { RestaurantsController } from './restaurants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commerce, Location, Product, Category])],
  controllers: [CommercesController, RestaurantsController],
  providers: [CommercesService],
  exports: [TypeOrmModule, CommercesService],
})
export class CommercesModule {}
