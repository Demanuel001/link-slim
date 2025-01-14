import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './urls-redirect.controller';
import { UrlsService } from './urls.service';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('UrlsRedirectController', () => {
  let redirectController: RedirectController;
  let urlsService: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            findByShortUrl: jest.fn(),
            incrementClickCount: jest.fn(),
          },
        },
      ],
    }).compile();

    redirectController = module.get<RedirectController>(RedirectController);
    urlsService = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(redirectController).toBeDefined();
  });

  describe('redirect', () => {
    it('should redirect to the original URL', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'http://example.com';
      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue({
        id: '1',
        originalUrl,
        shortUrl,
        clicksCount: 0,
        userId: 'user1',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest
        .spyOn(urlsService, 'incrementClickCount')
        .mockResolvedValue(undefined);

      await redirectController.redirect(shortUrl, res);

      expect(urlsService.findByShortUrl).toHaveBeenCalledWith(shortUrl);
      expect(urlsService.incrementClickCount).toHaveBeenCalledWith(shortUrl);
      expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw NotFoundException if short URL is not found', async () => {
      const shortUrl = 'abc123';
      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(urlsService, 'findByShortUrl').mockResolvedValue(null);

      await expect(redirectController.redirect(shortUrl, res)).rejects.toThrow(
        NotFoundException,
      );
      expect(urlsService.findByShortUrl).toHaveBeenCalledWith(shortUrl);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });
});
