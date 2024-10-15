import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
  ) {}

  async createPage(createPageDto: CreatePageDto): Promise<Page> {
    const page: Page = new Page();
    page.title = createPageDto.title;
    page.content = createPageDto.content;

    // set project for pages
    const project = await this.projectsService.findOne(createPageDto.projectId);
    page.project = project;

    // provide parentid if exist

    if (createPageDto.parentId) {
      const parentPage = await this.pageRepository.findOneOrFail({
        where: { id: createPageDto.parentId },
      });
      page.parent = parentPage;
    }

    page.created = new Date();
    page.updated = new Date();

    return this.pageRepository.save(page);
  }

  findAll(): Promise<Page[]> {
    return this.pageRepository.find();
  }

  findOne(id: number): Promise<Page> {
    return this.pageRepository.findOneBy({ id });
  }

  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.findOne(id);

    if (updatePageDto.title) page.title = updatePageDto.title;
    if (updatePageDto.content) page.content = updatePageDto.content;

    page.updated = new Date();

    return this.pageRepository.save(page);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.pageRepository.delete(id);
  }
}
