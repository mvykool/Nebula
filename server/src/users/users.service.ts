import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.picture = createUserDto.picture;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.isGoogleUser = createUserDto.isGoogleUser || false;
    user.isDemo = createUserDto.isDemo || false;
    user.demoExpiresAt = createUserDto.demoExpiresAt;

    if (createUserDto.password) {
      user.password = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );
    }

    return this.userRepository.save(user);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.picture = updateUserDto.picture;
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;

    // Only hash the password if it's being updated
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltRounds,
      );
    } else {
      const existingUser = await this.viewUser(id);
      user.password = existingUser.password;
    }

    user.id = id;
    return this.userRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id',
        'username',
        'password',
        'name',
        'picture',
        'email',
        'isDemo',
        'isGoogleUser',
      ],
    });
    return user;
  }

  // Helper method to verify password
  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password', 'name', 'picture', 'email'],
    });
  }
}
