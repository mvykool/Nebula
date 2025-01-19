import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleUser } from './interfaces/google-user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

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

  async googleSignIn(googleUser: GoogleUser) {
    let user = await this.usersService.findOneByEmail(googleUser.email);

    if (!user) {
      const createUserDto: CreateUserDto = {
        username: googleUser.email.split('@')[0],
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        password: null,
        isGoogleUser: true,
      };

      user = await this.usersService.createUser(createUserDto);
    }

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
    };

    // Use the same secret as in AuthGuard
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_REFRESH,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
      data: { user: payload },
    };
  }

  async createDemoUser() {
    const timestamp = Date.now();
    const createUserDto: CreateUserDto = {
      username: 'Demo User',
      email: `demo@demo.com`,
      name: 'demo',
      picture:
        'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
      password: timestamp.toString(),
      isDemo: true,
      demoExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const user = await this.usersService.createUser(createUserDto);

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
      isDemo: true,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_REFRESH,
        expiresIn: '1d', // shorter expiry for demo users
      }),
    ]);

    return {
      access_token,
      refresh_token,
      data: { user: payload },
    };
  }

  private readonly tempCodes = new Map<
    string,
    {
      access_token: string;
      refresh_token: string;
      data: any;
      expires: number;
    }
  >();

  async createTemporaryCode(
    access_token: string,
    refresh_token: string,
    data: any,
  ): Promise<string> {
    this.cleanupExpiredCodes(); // Clean up expired codes first

    const code = crypto.randomBytes(32).toString('hex');

    this.tempCodes.set(code, {
      access_token,
      refresh_token,
      data,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    });

    return code;
  }

  async exchangeTemporaryCode(code: string) {
    this.cleanupExpiredCodes(); // Clean up expired codes first

    const data = this.tempCodes.get(code);

    if (!data) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    if (Date.now() > data.expires) {
      this.tempCodes.delete(code);
      throw new UnauthorizedException('Code expired');
    }

    // Get the data and immediately delete the code
    const result = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      data: data.data,
    };

    this.tempCodes.delete(code);

    return result;
  }

  private cleanupExpiredCodes() {
    const now = Date.now();
    for (const [code, data] of this.tempCodes.entries()) {
      if (data.expires < now) {
        this.tempCodes.delete(code);
      }
    }
  }
}
