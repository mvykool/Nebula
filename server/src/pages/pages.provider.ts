import { DataSource } from 'typeorm';
import { Page } from './entities/page.entity';

export const userProvider = [
  {
    provide: 'PAGE_REPOSITORY',
    useFactory: (datasSource: DataSource) => datasSource.getRepository(Page),
    inject: ['DATA_SOURCE'],
  },
];
