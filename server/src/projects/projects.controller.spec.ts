import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
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

describe('Project service', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            save: jest.fn().mockResolvedValue(mockProject),
            find: jest.fn().mockResolvedValue(mockProjects),
            findAll: jest.fn().mockResolvedValue(mockProjects),
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
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should create and return a project', async () => {
      const createProjectDto: CreateProjectDto = {
        cover: 'url-to-picture',
        description: '',
        name: 'project',
        ownereId: 1,
        publish: false,
      };

      const result = await service.createProject(createProjectDto, 1);
      expect(result).toEqual(mockProject);
      expect(repository.save).toHaveBeenCalledWith(
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

  describe('find all projects', () => {
    it('should return an array of projects', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockProjects);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('find one project', () => {
    it('should return a single project by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockProject);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['owner', 'pages'],
      });
    });
  });

  describe('update project', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateProjectDto = {
        name: 'Updated Name',
        cover: 'new-picture-url',
        description: 'updated-username',
        publish: true,
        ownereId: 1,
      };

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(mockProject);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateUserDto),
      );
    });
  });

  describe('remove project', () => {
    it('should delete a project and return an affected count', async () => {
      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
