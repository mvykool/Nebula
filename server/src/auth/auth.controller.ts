import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const { access_token, refresh_token } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('User object:', req.user);
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      const newTokens = await this.authService.refreshTokens(
        body.refresh_token,
      );
      return newTokens;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
