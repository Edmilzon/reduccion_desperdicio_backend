import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './entities/commerce.entity';
import { Location } from './entities/location.entity';
import { Product } from '../products/entities/product.entity';
import { CommercesService } from './commerces.service';
import { CommercesController } from './commerces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commerce, Location, Product])],
  controllers: [CommercesController],
  providers: [CommercesService],
  exports: [TypeOrmModule, CommercesService],
})
export class CommercesModule {}
