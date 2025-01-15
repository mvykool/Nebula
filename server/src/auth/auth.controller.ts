import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  Get,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

interface SignInDto {
  username: string;
  password: string; // This will be the hashed password from frontend
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    // Now passing back the complete response including user data
    console.log('Received signInDto:', signInDto);
    const response = await this.authService.signIn(
      signInDto.username,
      signInDto.password, // This is now the hashed password
    );

    return response; // This will include access_token, refresh_token, and data.user
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('User object:', req.user);
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    //calling refresh method
    try {
      const newTokens = await this.authService.refreshTokens(
        body.refresh_token,
      );
      return newTokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
