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
  Put,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { createUrlSchema } from './schemas/create-url.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-Jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUrlDto } from './dto/update-url.dto';

interface JwtPayload {
  userId: string;
  email: string;
}

@ApiTags('urls')
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
  @ApiOperation({ summary: 'Shorten a new URL' })
  @ApiBody({
    type: CreateUrlDto,
    examples: {
      valid: {
        summary: 'Valid request',
        description: 'A request with a valid URL to shorten',
        value: {
          originalUrl: 'https://example.com',
        },
      },
      invalid: {
        summary: 'Invalid request',
        description: 'A request with an invalid URL format',
        value: {
          originalUrl: 'invalid-url',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'URL successfully shortened',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format',
  })
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
  @ApiOperation({ summary: 'Get all shortened URLs by user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of shortened URLs',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async findAllByUser(@Req() req: Request) {
    const userId = (req.user as JwtPayload)?.userId;
    const urls = await this.urlsService.findAllByUser(userId);

    return urls;
  }

  @Delete(':shortUrl')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a shortened URL' })
  @ApiParam({ name: 'shortUrl', description: 'Shortened URL to be deleted' })
  @ApiBody({
    type: UpdateUrlDto,
    examples: {
      valid: {
        summary: 'Valid request',
        description: 'A request to update the original URL of a shortened URL',
        value: {
          originalUrl: 'https://new-example.com',
        },
      },
      invalid: {
        summary: 'Invalid request',
        description: 'A request with an invalid URL format',
        value: {
          originalUrl: 'not-a-url',
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'URL successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to delete this URL',
  })
  async delete(@Param('shortUrl') shortUrl: string, @Req() req: Request) {
    const userId = (req.user as JwtPayload)?.userId || null;
    await this.urlsService.delete(shortUrl, userId);
    return;
  }

  @Put(':shortUrl')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates the original URL of a shortening' })
  @ApiParam({
    name: 'shortUrl',
    description: 'Shortened URL that will be updated',
  })
  @ApiBody({ type: UpdateUrlDto })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'URL successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to update this URL',
  })
  async updateOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Body('originalUrl') originalUrl: string,
    @Req() req: Request,
  ) {
    const userId = (req.user as JwtPayload)?.userId;
    const updatedUrl = await this.urlsService.updateOriginalUrl(
      shortUrl,
      originalUrl,
      userId,
    );

    return {
      message: 'URL updated successfully',
      updatedUrl: updatedUrl.originalUrl,
      shortUrl: updatedUrl.shortUrl,
    };
  }
}
