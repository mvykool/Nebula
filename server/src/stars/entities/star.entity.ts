import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Star {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.stars)
  user: User;

  @ManyToOne(() => Project, (project) => project.stars)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;
}
