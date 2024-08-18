import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

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
}
