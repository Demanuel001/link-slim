import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortUrl')
  @HttpCode(HttpStatus.FOUND)
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlsService.incrementClickCount(shortUrl);

    return res.redirect(url.originalUrl);
  }
}
