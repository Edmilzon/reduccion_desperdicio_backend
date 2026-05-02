import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Location } from './location.entity';
import { Review } from '../../users/entities/review.entity';

@Entity('restaurants')
export class Commerce {
  @PrimaryGeneratedColumn('increment', { name: 'restaurant_id' })
  id: number;

  @ManyToOne(() => User, (user) => user.comercios, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  nit: string;

  @OneToMany(() => Product, (product) => product.commerce)
  products: Product[];

  @OneToMany(() => Location, (location) => location.commerce)
  locations: Location[];

  @OneToMany(() => Review, (review) => review.commerce)
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
