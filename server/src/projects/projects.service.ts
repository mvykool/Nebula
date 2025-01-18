import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { PagesService } from '../pages/pages.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    public userService: UsersService,
    public pagesService: PagesService,
  ) {}
  async createProject(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const user = await this.userService.viewUser(userId);

    if (!user) {
      throw new Error('user no found');
    }

    const project: Project = new Project();
    project.name = createProjectDto.name;
    project.cover = createProjectDto.cover;
    project.description = createProjectDto.description;
    project.owner = user;
    project.publish = createProjectDto.publish;
    project.pages = [];
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  private generateSlug(name: string): string {
    // Convert to lowercase and replace spaces/special chars with dashes
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findByOwner(ownerId: number): Promise<Project[]> {
    console.log('Finding projects for owner:', ownerId);
    try {
      const projects = await this.projectRepository.find({
        where: { owner: { id: ownerId } },
        relations: ['owner', 'pages'],
      });
      console.log('Found projects:', projects);
      return projects;
    } catch (error) {
      console.error('Error in findByOwner:', error);
      throw error;
    }
  }

  async findPublishedProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { publish: true },
      relations: ['owner', 'pages'],
    });
  }

  findOne(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'pages'],
    });
  }
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (!project) {
      throw new BadRequestException(`Project with ID ${id} not found`);
    }

    // If publishing for the first time, generate a slug
    if (updateProjectDto.publish && !project.publishedSlug) {
      let slug = this.generateSlug(project.name);
      let counter = 0;

      // Ensure slug uniqueness
      while (
        await this.projectRepository.findOne({ where: { publishedSlug: slug } })
      ) {
        counter++;
        slug = `${this.generateSlug(project.name)}-${counter}`;
      }

      project.publishedSlug = slug;
    }

    // Update only the fields that are present in the DTO
    if (updateProjectDto.name !== undefined) {
      project.name = updateProjectDto.name;
    }
    if (updateProjectDto.cover !== undefined) {
      project.cover = updateProjectDto.cover;
    }
    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }
    if (updateProjectDto.publish !== undefined) {
      project.publish = updateProjectDto.publish;
    }

    // Save the updated project
    return this.projectRepository.save(project);
  }

  async getPublishedProjectBySlug(slug: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { publishedSlug: slug, publish: true },
      relations: ['owner', 'pages', 'pages.parent', 'pages.children'],
    });

    if (!project) {
      throw new BadRequestException('Published project not found');
    }

    return project;
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.projectRepository.delete(id);
  }
}
