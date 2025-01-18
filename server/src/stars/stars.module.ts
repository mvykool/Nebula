import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarsService } from './stars.service';
import { StarsController } from './stars.controller';
import { Star } from './entities/star.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Star]),
    NotificationsModule,
    ProjectsModule,
  ],
  providers: [StarsService],
  controllers: [StarsController],
  exports: [StarsService],
})
export class StarsModule {}
