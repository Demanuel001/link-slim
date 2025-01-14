import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

jest.mock('nanoid', () => {
  return {
    customAlphabet: jest.fn().mockReturnValue(() => 'abcd12'),
  };
});

describe('UrlsService', () => {
  let service: UrlsService;

  const mockPrismaService = {
    url: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a short URL successfully', async () => {
      const createUrlDto = { originalUrl: 'https://example.com' };
      const userId = 'test-user-id';
      const shortUrl = 'abcd12';

      (customAlphabet as jest.Mock).mockReturnValue(() => shortUrl);

      mockPrismaService.url.create.mockResolvedValue({ shortUrl });

      const result = await service.create(createUrlDto, userId);

      expect(result.message).toBe('URL shortened successfully');
      expect(result.shortUrl).toBe(shortUrl);

      expect(mockPrismaService.url.create).toHaveBeenCalledWith({
        data: {
          originalUrl: createUrlDto.originalUrl,
          shortUrl,
          userId,
        },
      });

      expect(mockPrismaService.url.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByShortUrl', () => {
    it('should return the URL if found', async () => {
      const shortUrl = 'abcd12';
      const url = { originalUrl: 'https://example.com', shortUrl };

      mockPrismaService.url.findUnique.mockResolvedValue(url);

      const result = await service.findByShortUrl(shortUrl);

      expect(result).toEqual(url);
      expect(mockPrismaService.url.findUnique).toHaveBeenCalledWith({
        where: { shortUrl },
      });
    });

    it('should throw a NotFoundException if URL is not found', async () => {
      const shortUrl = 'abcd12';

      mockPrismaService.url.findUnique.mockResolvedValue(null);

      await expect(service.findByShortUrl(shortUrl)).rejects.toThrowError(
        new NotFoundException('URL not found'),
      );
    });
  });

  describe('incrementClickCount', () => {
    it('should increment click count for a short URL', async () => {
      const shortUrl = 'abcd12';
      const updatedUrl = {
        shortUrl,
        originalUrl: 'https://example.com',
        clicksCount: 2,
      };

      mockPrismaService.url.update.mockResolvedValue(updatedUrl);

      const result = await service.incrementClickCount(shortUrl);

      expect(result.clicksCount).toBe(2);
      expect(mockPrismaService.url.update).toHaveBeenCalledWith({
        where: { shortUrl },
        data: { clicksCount: { increment: 1 } },
      });
    });
  });

  describe('findAllByUser', () => {
    it('should return all URLs for a user', async () => {
      const userId = 'test-user-id';
      const urls = [
        {
          shortUrl: 'abcd12',
          originalUrl: 'https://example.com',
          clicksCount: 2,
          updatedAt: new Date(),
        },
        {
          shortUrl: 'def456',
          originalUrl: 'https://another.com',
          clicksCount: 3,
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.url.findMany.mockResolvedValue(urls);

      const result = await service.findAllByUser(userId);

      expect(result).toEqual(urls);
      expect(mockPrismaService.url.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        select: {
          originalUrl: true,
          shortUrl: true,
          clicksCount: true,
          updatedAt: true,
        },
      });
    });
  });
});
