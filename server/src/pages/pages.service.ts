import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';

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
    const page = new Page();
    page.title = createPageDto.title;
    page.content = createPageDto.content;

    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    page.project = project;

    if (createPageDto.parentId) {
      const parentPage = await this.pageRepository.findOne({
        where: { id: createPageDto.parentId },
      });
      if (!parentPage) {
        throw new NotFoundException(
          `Parent page with ID ${createPageDto.parentId} not found`,
        );
      }
      page.parent = parentPage;
    }

    return this.pageRepository.save(page);
  }

  findAll(): Promise<Page[]> {
    return this.pageRepository.find({
      relations: ['parent', 'children'],
    });
  }

  async findByProject(projectId: number): Promise<Page[]> {
    return this.pageRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'parent', 'children'],
    });
  }

  findOne(id: number): Promise<Page> {
    return this.pageRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page> {
    // First, fetch the existing page with all necessary relations
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: ['project', 'parent', 'children'],
    });

    if (!page) {
      throw new BadRequestException(`Page with ID ${id} not found`);
    }

    // If changing parent, verify it exists and belongs to same project
    if (updatePageDto.parentId !== undefined) {
      if (updatePageDto.parentId === null) {
        // Remove parent relationship
        page.parent = null;
      } else {
        const newParent = await this.pageRepository.findOne({
          where: {
            id: updatePageDto.parentId,
            project: { id: page.project.id },
          },
          relations: ['project'],
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
    }

    // Update other fields
    if (updatePageDto.title !== undefined) {
      page.title = updatePageDto.title;
    }
    if (updatePageDto.content !== undefined) {
      page.content = updatePageDto.content;
    }

    page.updated = new Date();

    // Save the updated page
    return await this.pageRepository.save(page);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.pageRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.pageRepository.clear(); // Deletes all rows from the table
  }

  private async wouldCreateCircularReference(
    parent: Page,
    childId: number,
  ): Promise<boolean> {
    let currentPage = parent;
    const visited = new Set<number>();

    while (currentPage.parent) {
      if (visited.has(currentPage.id)) {
        return true; // Detected existing circular reference
      }
      if (currentPage.parent.id === childId) {
        return true;
      }

      visited.add(currentPage.id);

      currentPage = await this.pageRepository.findOne({
        where: { id: currentPage.parent.id },
        relations: ['parent'],
      });

      if (!currentPage) break;
    }

    return false;
  }
}
