import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => User)
  buyer: User;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CONFIRMED })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
