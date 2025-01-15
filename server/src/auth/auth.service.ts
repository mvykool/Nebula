import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    hashedPassword: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    data: { user: any };
  }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Direct comparison since passwords are hashed the same way
    const isPasswordValid = await bcrypt.compare(hashedPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    console.log('Password comparison:', {
      provided: hashedPassword,
      stored: user.password,
    });

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_REFRESH,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
      data: {
        user: {
          sub: user.id,
          username: user.username,
          name: user.name,
          picture: user.picture,
          email: user.email,
        },
      },
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.SECRET_REFRESH,
      });

      const user = await this.usersService.findOne(decoded.username);
      if (!user) {
        throw new UnauthorizedException();
      }

      const payload = {
        sub: user.id,
        username: user.username,
        name: user.name,
        picture: user.picture,
        email: user.email,
      };

      const newAccessToken = await this.jwtService.signAsync(payload);
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_REFRESH,
        expiresIn: '7d',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
