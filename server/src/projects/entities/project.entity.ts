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
import { User } from 'src/users/entities/user.entity';
import { Page } from 'src/pages/entities/page.entity';

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

  @CreateDateColumn({ type: 'varchar', length: 40 })
  created: Date;

  @UpdateDateColumn({ type: 'varchar', length: 40 })
  updated: Date;

  @Column({ type: 'boolean', default: false })
  publish: boolean;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Page, (page) => page.project)
  pages: Page[];
}
