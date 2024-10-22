import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { PagesService } from 'src/pages/pages.service';

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
    const pages = await this.pagesService.findAll();

    if (!user) {
      throw new Error('user no found');
    }

    const project: Project = new Project();
    project.name = createProjectDto.name;
    project.cover = createProjectDto.cover;
    project.description = createProjectDto.description;
    project.owner = user;
    project.publish = createProjectDto.publish;
    project.pages = pages;
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findByOwner(ownerId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async findPublishedProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { publish: true },
      relations: ['owner'],
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

  remove(id: number): Promise<{ affected?: number }> {
    return this.projectRepository.delete(id);
  }
}
