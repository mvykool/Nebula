import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Page } from '../../pages/entities/page.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'text', nullable: true })
  cover: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @Column({ type: 'boolean', default: false })
  publish: boolean;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Page, (page) => page.project, { cascade: true })
  pages: Page[];

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  publishedSlug: string;
}
