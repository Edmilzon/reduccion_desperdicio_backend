import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
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
      category = await this.categoryRepository.findOne({ where: { id: categoryId } });
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

  async findAll(categoryId?: string, commerceId?: string) {
    const where: Record<string, unknown> = { isActive: true };
    if (categoryId) where.category = { id: categoryId };
    if (commerceId) where.commerce = { id: commerceId };

    return this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
    });
  }

  async findByCommerce(commerceId: string, status = 'active', categoryId?: string) {
    const where: Record<string, unknown> = { commerce: { id: commerceId } };
    if (status === 'active') where.isActive = true;
    if (status === 'expired') where.isActive = false;
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
      isNearExpiry: product.expiryDate
        ? product.expiryDate <= twoHoursFromNow && product.expiryDate > now
        : false,
    }));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['commerce', 'commerce.owner', 'category'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para editar este producto',
      );
    }

    const { categoryId, ...rest } = updateProductDto;
    Object.assign(product, rest);

    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      product.category = category;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string, user: User) {
    const product = await this.findOne(id);
    if (product.commerce.owner.id !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este producto',
      );
    }
    product.isActive = false;
    return this.productRepository.save(product);
  }

  async findAllCategories() {
    return this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findCategoryBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }

  async findProductsByCategory(categoryId: string, commerceId?: string) {
    const where: Record<string, unknown> = {
      category: { id: categoryId },
      isActive: true,
    };
    if (commerceId) {
      where.commerce = { id: commerceId };
    }

    return this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
    });
  }
}