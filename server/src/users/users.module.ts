import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userProvider } from './users.provider';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...userProvider, UsersService],
})
export class UsersModule {}
