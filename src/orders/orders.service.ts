import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus,
} from './entities/order.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import {
  Notification,
  NotificationType,
} from '../users/entities/notification.entity';
import { CreateOrderDto } from './dto/order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { productId, quantity, paymentMethod } = createOrderDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['commerce'],
    });

    if (!product) throw new NotFoundException('Producto no encontrado');
    if (product.status !== ProductStatus.ACTIVE)
      throw new BadRequestException('Esta oferta ya no está disponible');
    if (product.quantity < quantity) {
      throw new BadRequestException(
        `Solo quedan ${product.quantity} unidades disponibles`,
      );
    }

    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.status = ProductStatus.SOLD_OUT;
    }
    await this.productRepository.save(product);

    const reservationCode = crypto.randomUUID();

    const selectedPaymentMethod = paymentMethod || PaymentMethod.CASH;

    const order = this.orderRepository.create({
      product,
      buyer: user,
      quantity,
      totalPrice: Number(product.price) * quantity,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      deliveryStatus: DeliveryStatus.PENDING,
      status: OrderStatus.CONFIRMED,
      reservationCode,
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.notificationRepository.save({
      userId: user.id,
      title: 'Reserva confirmada',
      content: `Tu reserva en ${product.commerce.name} por ${product.title} (x${quantity}) fue confirmada. Código: ${reservationCode.slice(0, 8).toUpperCase()}. Total: Bs ${Number(product.price) * quantity}`,
      type: NotificationType.RESERVATION_CONFIRMED,
      user,
    });

    const fullOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['product', 'product.commerce', 'buyer'],
    });
    
    return this.mapOrderResponse(fullOrder!);
  }

  async payOrder(orderId: number, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, buyer: { id: user.id } },
      relations: ['product', 'product.commerce'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status === OrderStatus.CANCELLED)
      throw new BadRequestException('No se puede pagar una orden cancelada');
    if (order.paymentStatus === PaymentStatus.PAID)
      throw new BadRequestException('El pedido ya fue pagado');
    if (order.paymentMethod === PaymentMethod.CASH) {
      throw new BadRequestException(
        'Los pedidos en efectivo se pagan al recoger',
      );
    }

    order.paymentStatus = PaymentStatus.PAID;
    order.paidAt = new Date();
    order.receiptUrl = `https://api.ecobocado.app/receipts/${order.reservationCode}`;

    return this.orderRepository.save(order);
  }

  async findMyOrders(user: User) {
    await this.markExpiredOrdersAsNotPickedUp();
    const orders = await this.orderRepository.find({
      where: { buyer: { id: user.id } },
      relations: ['product', 'product.commerce', 'buyer'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapOrderResponse(order));
  }

  async cancelOrder(orderId: number, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, buyer: { id: user.id } },
      relations: ['product'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status === OrderStatus.CANCELLED)
      throw new BadRequestException('La orden ya fue cancelada');

    order.product.quantity += order.quantity;
    order.product.status = ProductStatus.ACTIVE;
    await this.productRepository.save(order.product);

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  private mapOrderResponse(order: Order) {
    return {
      id: order.id,
      reservationCode: order.reservationCode,
      quantity: order.quantity,
      totalPrice: Number(order.totalPrice),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      status: order.status,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      product: order.product
        ? {
            id: order.product.id,
            title: order.product.title,
            description: order.product.description,
            price: Number(order.product.price),
            imageUrl: order.product.imageUrl,
            pickupStart: order.product.pickupStart,
            pickupEnd: order.product.pickupEnd,
            commerce: order.product.commerce
              ? {
                  id: order.product.commerce.id,
                  name: order.product.commerce.name,
                }
              : null,
          }
        : null,
      buyer: order.buyer
        ? {
            id: order.buyer.id,
            email: order.buyer.email,
          }
        : null,
    };
  }

  async findMerchantOrders(user: User) {
  await this.markExpiredOrdersAsNotPickedUp();

  const orders = await this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.product', 'product')
    .leftJoinAndSelect('product.commerce', 'commerce')
    .leftJoinAndSelect('commerce.owner', 'owner')
    .leftJoinAndSelect('order.buyer', 'buyer')
    .where('commerce.owner_id = :ownerId', { ownerId: user.id })
    .andWhere('order.paymentMethod = :paymentMethod', {
      paymentMethod: PaymentMethod.CASH,
    })
    .orderBy('order.created_at', 'DESC')
    .getMany();

  return orders.map((order) => this.mapOrderResponse(order));
}

async markAsPaidAndDelivered(orderId: number, user: User) {
  const order = await this.orderRepository.findOne({
    where: { id: orderId },
    relations: ['product', 'product.commerce', 'product.commerce.owner', 'buyer'],
  });
  if (!order) {
    throw new NotFoundException('Orden no encontrada');
  }
  if (order.product.commerce.owner.id !== user.id) {
    throw new BadRequestException(
      'No tienes permiso para actualizar este pedido',
    );
  }
  if (order.paymentMethod !== PaymentMethod.CASH) {
    throw new BadRequestException(
      'Solo los pedidos con pago en sucursal pueden marcarse manualmente',
    );
  }
  if (order.deliveryStatus === DeliveryStatus.NOT_PICKED_UP) {
    throw new BadRequestException(
      'No se puede entregar un pedido marcado como no recogido',
    );
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestException(
      'No se puede entregar una orden cancelada',
    );
  }
  order.paymentStatus = PaymentStatus.PAID;
  order.deliveryStatus = DeliveryStatus.DELIVERED;
  order.paidAt = new Date();

  const savedOrder = await this.orderRepository.save(order);
  return this.mapOrderResponse(savedOrder);
}

async markExpiredOrdersAsNotPickedUp() {
  const now = new Date();

  const orders = await this.orderRepository.find({
    where: {
      status: OrderStatus.CONFIRMED,
      deliveryStatus: DeliveryStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
    },
    relations: ['product'],
  });

  const expiredOrders = orders.filter((order) => {
    return order.product?.pickupEnd && new Date(order.product.pickupEnd) < now;
  });

  for (const order of expiredOrders) {
    order.deliveryStatus = DeliveryStatus.NOT_PICKED_UP;
    await this.orderRepository.save(order);
  }
}
}
