import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './entities/commerce.entity';
import { CommercesService } from './commerces.service';
import { CommercesController } from './commerces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commerce])],
  controllers: [CommercesController],
  providers: [CommercesService],
  exports: [TypeOrmModule, CommercesService],
})
export class CommercesModule {}

