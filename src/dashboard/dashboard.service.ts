import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from '../products/entities/product.entity';
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

  async getCommerceStats(commerceId: string, user: User) {
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

    // Ofertas activas en este momento
    const activeOffers = await this.productRepository.count({
      where: { commerce: { id: commerceId }, isActive: true },
    });

    // Ofertas publicadas hoy
    const todayOffers = await this.productRepository.count({
      where: {
        commerce: { id: commerceId },
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    // Órdenes completadas hoy (platos vendidos)
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

    // Total recaudado hoy
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

    // Ofertas próximas a vencer (en las próximas 2 horas)
    const nearExpiryOffers = await this.productRepository
      .createQueryBuilder('product')
      .where('product.commerceId = :commerceId', { commerceId })
      .andWhere('product.isActive = true')
      .andWhere('product.expiryDate IS NOT NULL')
      .andWhere('product.expiryDate <= :twoHours', {
        twoHours: twoHoursFromNow,
      })
      .andWhere('product.expiryDate > :now', { now })
      .getMany();

    return {
      activeOffers,
      todayOffers,
      todayOrders: todayOrdersCount,
      todaySales: Number(salesResult?.totalSales ?? 0),
      totalUnitsSold: Number(salesResult?.totalUnitsSold ?? 0),
      nearExpiryOffers: nearExpiryOffers.map((p) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        expiryDate: p.expiryDate,
        price: p.price,
      })),
      nearExpiryCount: nearExpiryOffers.length,
    };
  }
}
