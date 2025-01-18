import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Star } from './entities/star.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ProjectsService } from '../projects/projects.service';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class StarsService {
  constructor(
    @InjectRepository(Star)
    private starsRepository: Repository<Star>,
    private notificationsService: NotificationsService,
    private projectsService: ProjectsService,
  ) {}

  async toggleStar(userId: number, projectId: number) {
    const existingStar = await this.starsRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    if (existingStar) {
      await this.starsRepository.remove(existingStar);
      await this.updateStarCount(projectId);
      return { starred: false };
    }

    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const star = this.starsRepository.create({
      user: { id: userId },
      project: { id: projectId },
    });

    await this.starsRepository.save(star);
    await this.updateStarCount(projectId);

    // Create notification for project owner
    if (project.owner.id !== userId) {
      await this.notificationsService.create({
        recipientId: project.owner.id,
        type: 'PROJECT_STARRED',
        payload: {
          projectId,
          projectName: project.name,
          starredByUserId: userId,
        },
      });
    }

    return { starred: true };
  }

  private async updateStarCount(projectId: number) {
    const count = await this.starsRepository.count({
      where: { project: { id: projectId } },
    });

    await this.projectsService.updateStarCount(projectId, count);
  }

  async getProjectStars(projectId: number) {
    return this.starsRepository.count({
      where: { project: { id: projectId } },
    });
  }

  async hasUserStarred(userId: number, projectId: number) {
    const star = await this.starsRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });
    return !!star;
  }

  async getUserStarredProjects(userId: number): Promise<Project[]> {
    const stars = await this.starsRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'project.owner'],
      order: { createdAt: 'DESC' },
    });

    // Extract and return the projects from stars
    return stars.map((star) => star.project);
  }
}
