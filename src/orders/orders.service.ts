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

    const order = this.orderRepository.create({
      product,
      buyer: user,
      quantity,
      totalPrice: Number(product.price) * quantity,
      paymentMethod: paymentMethod || PaymentMethod.CASH,
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

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['product', 'product.commerce'],
    });
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
    return this.orderRepository.find({
      where: { buyer: { id: user.id } },
      relations: ['product', 'product.commerce'],
      order: { createdAt: 'DESC' },
    });
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
}
