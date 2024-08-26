import { Project } from 'src/projects/entities/project.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

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

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => Project, (project) => project.owner)
  project: Project[];
}
