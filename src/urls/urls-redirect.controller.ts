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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('redirect')
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortUrl')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Redirects a shortened URL to its original destination',
  })
  @ApiParam({
    name: 'shortUrl',
    description: 'The unique identifier for the shortened URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL',
    headers: {
      Location: {
        description: 'The original URL to which the short URL redirects',
        schema: {
          type: 'string',
          example: 'http://localhost:3000/abc123',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlsService.incrementClickCount(shortUrl);

    return res.redirect(url.originalUrl);
  }
}
