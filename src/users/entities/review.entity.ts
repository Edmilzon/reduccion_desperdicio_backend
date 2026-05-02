import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Commerce } from '../../commerces/entities/commerce.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('increment', { name: 'review_id' })
  id: number;

  @Column({ name: 'order_id', unique: true })
  orderId: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  stars: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  client: User;

  @ManyToOne(() => Commerce, { onDelete: 'CASCADE' })
  commerce: Commerce;
}
