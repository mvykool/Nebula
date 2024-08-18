import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Page } from 'src/pages/entities/page.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'text' })
  cover: string;

  @Column({ type: 'text', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 40 })
  created: Date;

  @Column({ type: 'varchar', length: 40 })
  updated: Date;

  @ManyToOne(() => User, (user) => user.project)
  owner: User;

  @OneToMany(() => Page, (page) => page.project)
  pages: Page[];
}
