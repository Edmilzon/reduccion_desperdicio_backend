import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('increment', { name: 'profile_id' })
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
