import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';

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
});
