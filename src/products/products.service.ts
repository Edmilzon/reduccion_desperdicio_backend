import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CommercesService } from '../commerces/commerces.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly comerciosService: CommercesService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { commerceId, categoryId, ...productData } = createProductDto;

    const commerce = await this.comerciosService.findOne(commerceId);
    if (commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para añadir productos a este comercio',
      );
    }

    let category: Category | undefined;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    const product = this.productRepository.create({
      ...productData,
      commerce,
      category,
    });

    return this.productRepository.save(product);
  }

  async findAll(categoryId?: number, commerceId?: number) {
    const where: Record<string, unknown> = { status: ProductStatus.ACTIVE };
    if (categoryId) where.category = { id: categoryId };
    if (commerceId) where.commerce = { id: commerceId };

    return this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
    });
  }

  async findByCommerce(
    commerceId: number,
    status = ProductStatus.ACTIVE,
    categoryId?: number,
  ) {
    const where: Record<string, unknown> = { commerce: { id: commerceId } };
    if (status) where.status = status;
    if (categoryId) where.category = { id: categoryId };

    const products = await this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
      order: { createdAt: 'DESC' },
    });

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    return products.map((product) => ({
      ...product,
      isNearExpiry: product.pickupEnd
        ? product.pickupEnd <= twoHoursFromNow && product.pickupEnd > now
        : false,
    }));
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['commerce', 'commerce.owner', 'category'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar este producto',
      );
    }

    const { categoryId, ...rest } = updateProductDto;
    Object.assign(product, rest);

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      product.category = category;
    }

    return this.productRepository.save(product);
  }

  async remove(id: number, user: User) {
    const product = await this.findOne(id);
    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este producto',
      );
    }
    product.status = ProductStatus.SOLD_OUT;
    return this.productRepository.save(product);
  }

  async findAllCategories() {
    return this.categoryRepository.find();
  }

  async findCategoryById(id: number, includeProducts = false) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      ...(includeProducts ? { relations: ['products'] } : {}),
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findCategoryBySlug(slug: string, includeProducts = false) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      ...(includeProducts ? { relations: ['products'] } : {}),
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findProductsByCategory(categoryId: number, commerceId?: number) {
    const where: Record<string, unknown> = {
      category: { id: categoryId },
      status: ProductStatus.ACTIVE,
    };
    if (commerceId) {
      where.commerce = { id: commerceId };
    }

    return this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
    });
  }

  async findAllWithCategory() {
    return this.productRepository.find({
      relations: ['category'],
    });
  }

  async search(query: string) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.commerce', 'commerce')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere(
        '(product.title ILIKE :query OR product.description ILIKE :query OR commerce.name ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('product.createdAt', 'DESC');

    return qb.getMany();
  }
}
