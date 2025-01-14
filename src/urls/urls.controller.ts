import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { createUrlSchema } from './schemas/create-url.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-Jwt-auth.guard';

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
}
