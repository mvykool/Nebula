import { Project } from '../../projects/entities/project.entity';
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

  @ManyToOne(() => Page, (page) => page.children, {
    nullable: true,
    onDelete: 'CASCADE', // Add this to ensure child pages are deleted when parent is deleted
  })
  parent: Page;

  @OneToMany(() => Page, (page) => page.parent, {
    cascade: true, // Add this to automatically save children when saving parent
  })
  children: Page[];

  @CreateDateColumn({ type: 'varchar', length: 40 })
  created: Date;

  @UpdateDateColumn({ type: 'varchar', length: 40 })
  updated: Date;
}
