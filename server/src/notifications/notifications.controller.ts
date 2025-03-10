import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserNotifications(@Request() req) {
    const userId = req.user.sub;
    return this.notificationsService.getUserNotifications(userId);
  }

  @Get('unread-count')
  @UseGuards(AuthGuard)
  getUnreadCount(@Request() req) {
    const userId = req.user.sub;
    return this.notificationsService.getUnreadCount(userId);
  }

  @Post(':id/read')
  @UseGuards(AuthGuard)
  markAsRead(@Param('id') id: number, @Request() req) {
    const userId = req.user.sub;
    return this.notificationsService.markAsRead(id, userId);
  }
}
