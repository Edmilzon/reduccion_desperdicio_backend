import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Commerce } from '../../commerces/entities/commerce.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  originalPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Precio de oferta (desperdicio reducido)

  @Column('int')
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  pickupDeadline: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Commerce, (commerce) => commerce.id)
  commerce: Commerce;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
