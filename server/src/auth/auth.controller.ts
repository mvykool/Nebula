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
import { JwtService } from '@nestjs/jwt';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const accessToken = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    const refreshToken = await this.authService.generateRefreshToken(
      signInDto.username,
      signInDto.password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('User object:', req.user);
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(body.refreshToken, {
        secret: 'REFRESH_TOKEN_SECRET',
      });

      // If the token is valid, issue a new access token
      const newAccessToken = await this.authService.generateRefreshToken(
        decoded.username,
        decoded.password,
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
