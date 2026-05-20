import { Controller, Get, Param } from '@nestjs/common';
import { CommercesService } from './commerces.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly commercesService: CommercesService) {}

  @Get(':id/detail')
  getDetail(@Param('id') id: string) {
    return this.commercesService.findDetail(id);
  }
}
