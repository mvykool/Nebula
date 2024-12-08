import { Test, TestingModule } from '@nestjs/testing';
import { PagesService } from './pages.service';
import { ProjectsService } from '../projects/projects.service';
import { Page } from './entities/page.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockPage = {
  title: 'page',
  content: '',
  projectId: 1,
};

const mockProjectService = {
  findAll: jest.fn().mockResolvedValue([]),
};

describe('PagesController', () => {
  let service: PagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: getRepositoryToken(Page),
          useValue: {
            save: jest.fn().mockResolvedValue(mockPage),
            find: jest.fn().mockResolvedValue(mockPage),
            findAll: jest.fn().mockResolvedValue(mockPage),
            findOne: jest.fn().mockResolvedValue(mockPage),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: ProjectsService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
