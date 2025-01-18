import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StarsService } from './stars.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('stars')
export class StarsController {
  constructor(private readonly starsService: StarsService) {}

  @Post('projects/:id')
  @UseGuards(AuthGuard)
  toggleStar(@Request() req, @Param('id') projectId: number) {
    const userId = req.user.sub;
    return this.starsService.toggleStar(userId, projectId);
  }

  @Get('projects/:id/count')
  getProjectStars(@Param('id') projectId: number) {
    return this.starsService.getProjectStars(projectId);
  }

  @Get('projects/:id/has-starred')
  @UseGuards(AuthGuard)
  hasUserStarred(@Request() req, @Param('id') projectId: number) {
    const userId = req.user.sub;
    return this.starsService.hasUserStarred(userId, projectId);
  }
  @Get('my-starred')
  @UseGuards(AuthGuard)
  async getMyStarredProjects(@Request() req) {
    const userId = req.user.sub;
    return this.starsService.getUserStarredProjects(userId);
  }
}
