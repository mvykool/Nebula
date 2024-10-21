import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
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

  async createPage(
    createPageDto: CreatePageDto,
    projectId: number,
  ): Promise<Page> {
    const page: Page = new Page();
    page.title = createPageDto.title;
    page.content = createPageDto.content;

    // set project for pages
    const project = await this.projectsService.findOne(projectId);
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

  async findByProject(projectId: number): Promise<Page[]> {
    return this.pageRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  findOne(id: number): Promise<Page> {
    return this.pageRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.findOne(id);

    // If changing parent, verify it exists and belongs to same project
    if (updatePageDto.parentId) {
      const newParent = await this.pageRepository.findOne({
        where: {
          id: updatePageDto.parentId,
          project: { id: page.project.id },
        },
      });

      if (!newParent) {
        throw new BadRequestException(
          `Parent page with ID ${updatePageDto.parentId} not found in project`,
        );
      }

      // Prevent circular references
      if (await this.wouldCreateCircularReference(newParent, page.id)) {
        throw new BadRequestException(
          'Cannot set parent: would create circular reference',
        );
      }

      page.parent = newParent;
    }

    // Update other fields
    Object.assign(page, updatePageDto);

    return await this.pageRepository.save(page);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.pageRepository.delete(id);
  }

  private async wouldCreateCircularReference(
    parent: Page,
    childId: number,
  ): Promise<boolean> {
    let currentPage = parent;
    while (currentPage.parent) {
      if (currentPage.parent.id === childId) {
        return true;
      }
      currentPage = await this.pageRepository.findOne({
        where: { id: currentPage.parent.id },
        relations: ['parent'],
      });
    }
    return false;
  }
}
