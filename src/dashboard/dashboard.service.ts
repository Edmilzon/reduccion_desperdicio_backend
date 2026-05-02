import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Commerce } from '../commerces/entities/commerce.entity';
import { User, UserRole } from '../users/entities/user.entity';

interface SalesRawResult {
  totalSales: string;
  totalUnitsSold: string;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Commerce)
    private readonly commerceRepository: Repository<Commerce>,
  ) {}

  async getCommerceStats(commerceId: number, user: User) {
    const commerce = await this.commerceRepository.findOne({
      where: { id: commerceId },
      relations: ['owner'],
    });

    if (!commerce) {
      throw new ForbiddenException('Comercio no encontrado');
    }

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
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const activeOffers = await this.productRepository.count({
      where: { commerce: { id: commerceId }, status: ProductStatus.ACTIVE },
    });

    const todayOffers = await this.productRepository.count({
      where: {
        commerce: { id: commerceId },
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const todayOrdersCount = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .innerJoin('product.commerce', 'commerce')
      .where('commerce.id = :commerceId', { commerceId })
      .andWhere('order.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getCount();

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
      .getRawOne<SalesRawResult>();

    const nearExpiryOffers = await this.productRepository
      .createQueryBuilder('product')
      .where('product.commerceId = :commerceId', { commerceId })
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
