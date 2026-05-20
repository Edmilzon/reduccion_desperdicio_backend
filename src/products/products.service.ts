import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CommercesService } from '../commerces/commerces.service';
import { User, UserRole } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';

const NEAR_EXPIRY_HOURS = 2;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
    status?: string,
    categoryId?: number,
  ) {
    const where: Record<string, unknown> = { commerce: { id: commerceId } };
    if (
      status &&
      Object.values(ProductStatus).includes(status as ProductStatus)
    ) {
      where.status = status as ProductStatus;
    } else {
      where.status = ProductStatus.ACTIVE;
    }
    if (categoryId) where.category = { id: categoryId };

    const products = await this.productRepository.find({
      where,
      relations: ['commerce', 'category'],
      order: { createdAt: 'DESC' },
    });

    const now = new Date();
    const twoHoursFromNow = new Date(
      now.getTime() + NEAR_EXPIRY_HOURS * 60 * 60 * 1000,
    );

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
    if (!query || query.trim().length === 0) {
      return [];
    }

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.commerce', 'commerce')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere(
        '(product.title ILIKE :query OR product.description ILIKE :query OR commerce.name ILIKE :query)',
        { query: `%${query.trim()}%` },
      )
      .orderBy('product.createdAt', 'DESC');

    return qb.getMany();
  }

  async getCommerceStats(commerceId: number, user: User) {
    const commerce = await this.comerciosService.findOne(commerceId);

    if (commerce.owner.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permiso para ver el panel de este comercio',
      );
    }

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const twoHoursFromNow = new Date(
      now.getTime() + NEAR_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    const activeOffers = await this.productRepository.count({
      where: { commerce: { id: commerceId }, status: ProductStatus.ACTIVE },
    });

    const todayOffers = await this.productRepository.count({
      where: {
        commerce: { id: commerceId },
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const todayOrdersCount = await this.orderRepository.count({
      where: {
        product: { commerce: { id: commerceId } },
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    interface SalesResult {
      totalSales: string | null;
      totalUnitsSold: string | null;
    }

    const salesResult = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .innerJoin('product.commerce', 'commerce')
      .select('COALESCE(SUM(order.totalPrice), 0)', 'totalSales')
      .addSelect('COALESCE(SUM(order.quantity), 0)', 'totalUnitsSold')
      .where('commerce.id = :commerceId', { commerceId })
      .andWhere('order.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getRawOne<SalesResult>();

    const nearExpiryOffers = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.commerce', 'commerce')
      .where('commerce.id = :commerceId', { commerceId })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.pickupEnd IS NOT NULL')
      .andWhere('product.pickupEnd <= :twoHours', {
        twoHours: twoHoursFromNow,
      })
      .andWhere('product.pickupEnd > :now', { now })
      .getMany();

    return {
      activeOffers,
      todayOffers,
      todayOrders: todayOrdersCount,
      todaySales: Number(salesResult?.totalSales ?? 0),
      totalUnitsSold: Number(salesResult?.totalUnitsSold ?? 0),
      nearExpiryOffers: nearExpiryOffers.map((p) => ({
        id: p.id,
        title: p.title,
        quantity: p.quantity,
        pickupEnd: p.pickupEnd,
        price: p.price,
      })),
      nearExpiryCount: nearExpiryOffers.length,
    };
  }
}
