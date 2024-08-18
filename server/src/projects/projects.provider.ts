import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity';

export const userProvider = [
  {
    provide: 'PROJECT_REPOSITORY',
    useFactory: (datasSource: DataSource) => datasSource.getRepository(Project),
    inject: ['DATA_SOURCE'],
  },
];
