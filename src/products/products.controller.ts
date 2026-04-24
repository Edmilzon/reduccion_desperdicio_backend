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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

interface AuthRequest extends Request {
  user: User;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: AuthRequest,
  ) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Debe ir antes de :id para evitar conflicto de rutas
  @Get('commerce/:commerceId')
  findByCommerce(
    @Param('commerceId') commerceId: string,
    @Query('status') status?: string,
  ) {
    return this.productsService.findByCommerce(commerceId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: AuthRequest,
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productsService.remove(id, req.user);
  }
}
