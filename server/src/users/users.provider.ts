import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (datasSource: DataSource) => datasSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
