import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { CommercesService } from './commerces.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly commercesService: CommercesService) {}

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
    @Query('category') category?: string,
  ) {
    if (!lat || !lng) {
      throw new BadRequestException(
        'lat and lng query parameters are required',
      );
    }
    const radiusKm = radius ? parseFloat(radius) : 0;
    return this.commercesService.findByCoordinates(
      parseFloat(lat),
      parseFloat(lng),
      radiusKm,
      category,
    );
  }

  @Get('categories')
  findActiveCategories() {
    return this.commercesService.findActiveCategories();
  }

  @Get(':id/detail')
  getDetail(@Param('id') id: string) {
    return this.commercesService.findDetail(+id);
  }
}
