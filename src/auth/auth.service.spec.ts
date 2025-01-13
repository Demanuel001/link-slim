import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(user as never);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual(user);
    });

    it('should throw an error if the email is invalid', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        authService.validateUser('wrong@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if the password is wrong', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(user as never);

      await expect(
        authService.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a valid JWT token', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue('valid.jwt.token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({ accessToken: 'valid.jwt.token' });
    });
  });
});
