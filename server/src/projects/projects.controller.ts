import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    // Extract user ID from request object
    const ownerId = req.user.sub;
    return this.projectsService.createProject(createProjectDto, ownerId);
  }

  @Get()
  async findMine(@Req() req): Promise<Project[]> {
    try {
      console.log('Request user:', req.user); // Log the user object
      const ownerId = parseInt(req.user.sub); // Ensure ownerId is a number
      console.log('Owner ID:', ownerId); // Log the parsed owner ID

      const projects = await this.projectsService.findByOwner(ownerId);
      return projects;
    } catch (error) {
      console.error('Controller error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('published')
  async getPublishedProjects() {
    return this.projectsService.findPublishedProjects();
  }

  @Get('all')
  find() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get('p/:slug')
  @Public()
  async getPublishedProject(@Param('slug') slug: string) {
    return this.projectsService.getPublishedProjectBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
