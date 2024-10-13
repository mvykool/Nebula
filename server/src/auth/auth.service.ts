import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
    };
    console.log('Payload:', payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async generateRefreshToken(
    username: string,
    pass: string,
  ): Promise<{ refresh_token: string }> {
    const user = await this.usersService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      picture: user.picture,
      email: user.email,
    };

    return {
      refresh_token: this.jwtService.sign(payload, {
        secret: 'secret',
        expiresIn: '7d',
      }),
    };
  }
}
