import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword',
      };
      const hashedPassword = 'hashedpassword';
      const mockUser = {
        id: '1',
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const result = await usersService.create(userData);

      expect(result).toEqual({
        message: 'User created successfully',
        userId: '1',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...userData, password: hashedPassword },
      });
    });

    it('should return error 409 if the email is already in use', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword',
      };

      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '4.5.0',
        },
      );

      jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

      await expect(usersService.create(userData)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await usersService.findAll();
      expect(result).toEqual(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await usersService.findOne('1');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object),
      });
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await usersService.findOne('999');
      expect(result).toBeNull();
    });
  });
});
