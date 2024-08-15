import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PagesModule } from './pages/pages.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [UsersModule, ProjectsModule, PagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private dataSource: DataSource;
}
