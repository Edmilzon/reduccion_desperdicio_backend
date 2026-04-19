import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommercesService } from './commerces.service';
import { CreateCommerceDto, UpdateCommerceDto } from './dto/commerce.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commerces')
export class CommercesController {
  constructor(private readonly commercesService: CommercesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommerceDto: CreateCommerceDto, @Request() req) {
    return this.commercesService.create(createCommerceDto, req.user);
  }

  @Get()
  findAll() {
    return this.commercesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commercesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommerceDto: UpdateCommerceDto,
    @Request() req,
  ) {
    return this.commercesService.update(id, updateCommerceDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commercesService.remove(id, req.user);
  }
}
