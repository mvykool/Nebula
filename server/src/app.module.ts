import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PagesModule } from './pages/pages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Project } from './projects/entities/project.entity';
import { Page } from './pages/entities/page.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { imagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User, Project, Page],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    UsersModule,
    ProjectsModule,
    PagesModule,
    AuthModule,
    imagesModule,
  ],
})
export class AppModule {}
