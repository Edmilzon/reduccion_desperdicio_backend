import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './entities/commerce.entity';
import { Location } from './entities/location.entity';
import { CommercesService } from './commerces.service';
import { CommercesController } from './commerces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commerce, Location])],
  controllers: [CommercesController],
  providers: [CommercesService],
  exports: [TypeOrmModule, CommercesService],
})
export class CommercesModule {}
