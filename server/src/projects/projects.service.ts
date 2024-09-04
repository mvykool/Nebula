import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const project: Project = new Project();
    project.name = createProjectDto.name;
    project.cover = createProjectDto.cover;
    project.description = createProjectDto.description;
    project.owner = user;
    return this.projectRepository.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findByOwner(ownerId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'pages'],
    });
    return projects;
  }

  findOne(id: number): Promise<Project> {
    return this.projectRepository.findOneBy({ id });
  }

  async update(id: number, updateProject: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, updateProject);
    return this.findOne(id);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.projectRepository.delete(id);
  }
}
