import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
export interface IGetUserAuthInfoRequest extends Request {
  user: User;
}
