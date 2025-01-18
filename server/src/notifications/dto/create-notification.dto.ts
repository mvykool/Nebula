export class CreateNotificationDto {
  recipientId: number;
  type: string;
  payload: Record<string, any>;
}
