import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Commerce } from '../../commerces/entities/commerce.entity';
import { Profile } from './profile.entity';
import { Review } from './review.entity';
import { Notification } from './notification.entity';

export { Profile } from './profile.entity';

export enum UserRole {
  CLIENT = 'client',
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'user_id' })
  id: number;

  @Column({ name: 'email', unique: true, nullable: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @OneToMany(() => Commerce, (commerce) => commerce.owner)
  comercios: Commerce[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
