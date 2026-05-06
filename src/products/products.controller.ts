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
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('commerceId') commerceId?: string,
  ) {
    return this.productsService.findAll(
      categoryId ? +categoryId : undefined,
      commerceId ? +commerceId : undefined,
    );
  }

  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: string) {
    return this.productsService.findCategoryById(+id);
  }

  @Get('categories/slug/:slug')
  findCategoryBySlug(@Param('slug') slug: string) {
    return this.productsService.findCategoryBySlug(slug);
  }

  @Get('all')
  findAllWithCategory() {
    return this.productsService.findAllWithCategory();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Get('category/:categoryId')
  findProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('commerceId') commerceId?: string,
  ) {
    return this.productsService.findProductsByCategory(
      +categoryId,
      commerceId ? +commerceId : undefined,
    );
  }

  @Get('commerce/:commerceId')
  findByCommerce(
    @Param('commerceId') commerceId: string,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productsService.findByCommerce(
      +commerceId,
      status as any,
      categoryId ? +categoryId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: AuthRequest,
  ) {
    return this.productsService.update(+id, updateProductDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productsService.remove(+id, req.user);
  }
}
