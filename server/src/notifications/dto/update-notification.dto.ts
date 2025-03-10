import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdatePageDto extends PartialType(CreateNotificationDto) {}
