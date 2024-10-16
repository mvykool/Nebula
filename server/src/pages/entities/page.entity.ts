import { Project } from 'src/projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => Project, (project) => project.pages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => Page, (page) => page.children, { nullable: true })
  parent: Page;

  @OneToMany(() => Page, (page) => page.parent)
  children: Page;

  @CreateDateColumn({ type: 'varchar', length: 40 })
  created: Date;

  @UpdateDateColumn({ type: 'varchar', length: 40 })
  updated: Date;
}
