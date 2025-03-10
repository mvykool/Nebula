import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Star } from 'src/stars/entities/star.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => Star, (star) => star.user)
  stars: Star[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];

  @Column({ nullable: true })
  isGoogleUser: boolean;

  @Column({ default: false })
  isDemo: boolean;

  @Column({ nullable: true })
  demoExpiresAt: Date;
}
