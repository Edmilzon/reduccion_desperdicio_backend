import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommercesService } from './commerces.service';
import { CreateCommerceDto, UpdateCommerceDto } from './dto/commerce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commerces')
export class CommercesController {
  constructor(private readonly commerceService: CommercesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommerceDto: CreateCommerceDto, @Request() req) {
    return this.commerceService.create(createCommerceDto, req.user);
  }

  @Get()
  findAll() {
    return this.commerceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commerceService.findOne(+id);
  }

  @Get(':id/products')
  findProductsByCommerce(@Param('id') id: string) {
    return this.commerceService.findProductsByCommerce(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommerceDto: UpdateCommerceDto,
    @Request() req,
  ) {
    return this.commerceService.update(+id, updateCommerceDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commerceService.remove(+id, req.user);
  }
}
