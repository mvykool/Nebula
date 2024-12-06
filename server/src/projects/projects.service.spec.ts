import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { PagesService } from '../pages/pages.service';

const mockProject = {
  name: 'project',
  cover: 'url-to-picture',
  published: false,
  description: '',
  ownereId: 1,
  pages: [],
};

const mockProjects = [
  {
    ...mockProject,
    id: 1,
  },
  {
    ...mockProject,
    id: 2,
    name: 'project',
  },
];

const mockUsersService = {
  viewUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
};

const mockPagesService = {
  findAll: jest.fn().mockResolvedValue([]),
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repositoryProject: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            save: jest.fn().mockResolvedValue(mockProject),
            find: jest.fn().mockResolvedValue(mockProjects),
            findOneBy: jest.fn().mockResolvedValue(mockProject),
            findOne: jest.fn().mockResolvedValue(mockProject),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PagesService,
          useValue: mockPagesService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repositoryProject = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should create and return a user', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'project',
        cover: 'url-to-picture',
        description: '',
        ownereId: 1,
        publish: false,
      };

      const result = await service.createProject(createProjectDto, 1);

      expect(result).toEqual(mockProject);
      expect(repositoryProject.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'project',
          cover: 'url-to-picture',
          publish: false,
          description: '',
          owner: { id: 1, name: 'Test User' },
          pages: [],
        }),
      );
    });
  });
});
