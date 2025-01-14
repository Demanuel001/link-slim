import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { createUrlSchema } from './schemas/create-url.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-Jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface JwtPayload {
  userId: string;
  email: string;
}

@Controller('urls')
export class UrlsController {
  private readonly baseUrl: string;

  constructor(
    private readonly urlsService: UrlsService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_URL');
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createUrlSchema)) createUrlDto: CreateUrlDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as JwtPayload)?.userId || null;
    const url = await this.urlsService.create(createUrlDto, userId);

    return {
      message: 'URL shortened successfully',
      shortUrl: `${this.baseUrl}/${url.shortUrl}`,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllByUser(@Req() req: Request) {
    const userId = (req.user as JwtPayload)?.userId;
    const urls = await this.urlsService.findAllByUser(userId);

    return urls;
  }

  @Delete(':shortUrl')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('shortUrl') shortUrl: string, @Req() req: Request) {
    const userId = (req.user as JwtPayload)?.userId || null;
    await this.urlsService.delete(shortUrl, userId);
    return;
  }
}
