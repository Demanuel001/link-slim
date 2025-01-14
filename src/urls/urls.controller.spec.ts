import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';
import { NotFoundException } from '@nestjs/common';

describe('UrlsController', () => {
  let urlsController: UrlsController;
  let urlsService: UrlsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    urlsController = module.get<UrlsController>(UrlsController);
    urlsService = module.get<UrlsService>(UrlsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(urlsController).toBeDefined();
  });

  describe('create', () => {
    it('should return a shortened URL', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'http://example.com' };
      const req = { user: { userId: '123' } } as any;
      const url = { shortUrl: 'abc123', message: 'URL shortened successfully' };

      jest.spyOn(urlsService, 'create').mockResolvedValue(url);

      const result = await urlsController.create(createUrlDto, req);

      expect(result).toEqual({
        message: 'URL shortened successfully',
        shortUrl: 'http://localhost:3000/abc123',
      });
      expect(urlsService.create).toHaveBeenCalledWith(createUrlDto, '123');
    });

    it('should handle unauthenticated requests', async () => {
      const createUrlDto: CreateUrlDto = { originalUrl: 'http://example.com' };
      const req = { user: null } as any;
      const url = { shortUrl: 'abc123', message: 'URL shortened successfully' };

      jest.spyOn(urlsService, 'create').mockResolvedValue(url);

      const result = await urlsController.create(createUrlDto, req);

      expect(result).toEqual({
        message: 'URL shortened successfully',
        shortUrl: 'http://localhost:3000/abc123',
      });
      expect(urlsService.create).toHaveBeenCalledWith(createUrlDto, null);
    });
  });

  describe('List', () => {
    it('should return a list of URLs for authenticated user', async () => {
      const userId = '123';
      const urls = [
        {
          shortUrl: 'abc123',
          originalUrl: 'http://example.com',
          clicksCount: 10,
        },
        {
          shortUrl: 'def456',
          originalUrl: 'http://another.com',
          clicksCount: 20,
        },
      ];

      const req = { user: { userId } } as any;

      jest.spyOn(urlsService, 'findAllByUser').mockResolvedValue(urls);

      const result = await urlsController.findAllByUser(req);

      expect(result).toEqual(urls);
      expect(urlsService.findAllByUser).toHaveBeenCalledWith(userId);
    });

    it('should return an empty list if user has no URLs', async () => {
      const userId = '123';
      const urls: any[] = [];

      const req = { user: { userId } } as any;

      jest.spyOn(urlsService, 'findAllByUser').mockResolvedValue(urls);

      const result = await urlsController.findAllByUser(req);

      expect(result).toEqual(urls);
      expect(urlsService.findAllByUser).toHaveBeenCalledWith(userId);
    });

    it('should handle cases where user has no URLs', async () => {
      const userId = '123';
      const urls: any[] = [];

      const req = { user: { userId } } as any;

      jest.spyOn(urlsService, 'findAllByUser').mockResolvedValue(urls);

      const result = await urlsController.findAllByUser(req);

      expect(result).toEqual([]);
      expect(urlsService.findAllByUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '123';
      const req = { user: { userId } } as any;

      jest
        .spyOn(urlsService, 'findAllByUser')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(urlsController.findAllByUser(req)).rejects.toThrowError(
        NotFoundException,
      );
      expect(urlsService.findAllByUser).toHaveBeenCalledWith(userId);
    });
  });
});
