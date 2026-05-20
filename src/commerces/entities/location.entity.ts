import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Commerce } from './commerce.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('increment', { name: 'location_id' })
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Commerce, { onDelete: 'CASCADE' })
  commerce: Commerce;

  @OneToMany(() => Product, (product) => product.location)
  products: Product[];
}
