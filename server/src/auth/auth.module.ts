import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { StarsModule } from 'src/stars/stars.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { GoogleStrategy } from './interfaces/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    StarsModule,
    PassportModule,
    NotificationsModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Reflector, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
