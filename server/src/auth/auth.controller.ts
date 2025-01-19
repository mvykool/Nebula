import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
  UseGuards,
  Get,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';

interface SignInDto {
  username: string;
  password: string; // This will be the hashed password from frontend
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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

  @Public()
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

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Public()
  @Post('exchange-code')
  async exchangeTemporaryCode(@Body() body: { code: string }) {
    try {
      console.log('Received exchange request for code:', body.code);

      if (!body.code) {
        console.log('No code provided in request');
        throw new UnauthorizedException('Code is required');
      }

      const result = await this.authService.exchangeTemporaryCode(body.code);
      console.log('Exchange successful:', {
        hasAccessToken: !!result.access_token,
        hasRefreshToken: !!result.refresh_token,
        hasUserData: !!result.data,
      });

      return result;
    } catch (error) {
      console.error('Exchange error:', error);
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Failed to exchange code');
    }
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req, @Response() res) {
    try {
      console.log('Google callback received user:', req.user);

      // Generate tokens
      const { access_token, refresh_token, data } =
        await this.authService.googleSignIn(req.user);

      // Create temporary code
      const code = await this.authService.createTemporaryCode(
        access_token,
        refresh_token,
        data,
      );

      console.log('Generated temporary code');

      // Construct redirect URL
      const frontendUrl = process.env.FRONTEND_URL;
      const redirectUrl = `${frontendUrl}/auth/callback?code=${code}`;

      console.log('Redirecting to frontend:', redirectUrl);

      // Use 302 Found for redirect
      return res.status(302).redirect(redirectUrl);
    } catch (error) {
      console.error('Error in Google callback:', error);
      const frontendUrl = process.env.FRONTEND_URL;
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }

  @Public()
  @Post('demo')
  async createDemoAccess() {
    return this.authService.createDemoUser();
  }
}
