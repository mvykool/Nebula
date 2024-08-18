import { Project } from 'src/projects/entities/project.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => Project, (project) => project.pages)
  project: Project;

  @ManyToOne(() => Page, (page) => page.children, { nullable: true })
  parent: Page;

  @OneToMany(() => Page, (page) => page.parent)
  children: Page;

  @Column({ type: 'varchar', length: 40 })
  created: Date;

  @Column({ type: 'varchar', length: 40 })
  updated: Date;
}
