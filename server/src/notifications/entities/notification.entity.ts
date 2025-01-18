import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  recipient: User;

  @Column()
  type: string;

  @Column('json')
  payload: Record<string, any>;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created: Date;
}
