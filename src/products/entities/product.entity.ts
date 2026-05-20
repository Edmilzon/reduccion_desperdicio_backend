import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Commerce } from '../../commerces/entities/commerce.entity';
import { Category } from './category.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  SOLD_OUT = 'sold_out',
  EXPIRED = 'expired',
}

@Entity('product_excedente')
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'product_excedente_id' })
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ name: 'discount_price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

@Column({ name: 'pickup_start', type: 'timestamp' })
  pickupStart: Date;

  @Column({ name: 'pickup_end', type: 'timestamp' })
  pickupEnd: Date;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ManyToOne(() => Commerce, (commerce) => commerce.products, {
    onDelete: 'CASCADE',
  })
  commerce: Commerce;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
  })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
