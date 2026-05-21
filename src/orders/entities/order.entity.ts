import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../users/entities/review.entity';

export enum PaymentMethod {
  CASH = 'cash',
  ONLINE = 'online',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  QR_CODE_VALIDATION = 'qr_code_validation',
}

export enum OrderStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'order_id' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  buyer: User;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'delivery_status',
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  deliveryStatus: DeliveryStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CONFIRMED })
  status: OrderStatus;

  @OneToOne(() => Review, (review) => review.order)
  review: Review;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
