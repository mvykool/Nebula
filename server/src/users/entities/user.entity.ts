import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  userName: string;

  @Column({ length: 500 })
  password: string;
}
