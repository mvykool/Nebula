import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUser = {
  id: 1,
  name: 'John Doe',
  picture: 'url-to-picture',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
};

const mockUsers = [
  {
    ...mockUser,
    id: 1,
  },
  {
    ...mockUser,
    id: 2,
    username: 'janedoe',
  },
];

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue(mockUsers),
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        picture: 'url-to-picture',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(createUserDto),
      );
    });
  });

  describe('findAllUser', () => {
    it('should return an array of users', async () => {
      const result = await service.findAllUser();
      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('viewUser', () => {
    it('should return a single user by ID', async () => {
      const result = await service.viewUser(1);
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        picture: 'new-picture-url',
        username: 'updated-username',
        email: 'updated-email@example.com',
        password: 'newpassword123',
      };

      const result = await service.updateUser(1, updateUserDto);
      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateUserDto),
      );
    });
  });

  describe('removeUser', () => {
    it('should delete a user and return an affected count', async () => {
      const result = await service.removeUser(1);
      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const result = await service.findOne('johndoe');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'johndoe' },
      });
    });
  });
});
