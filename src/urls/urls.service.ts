import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UrlsService {
  private readonly nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    6,
  );

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUrlDto, userId?: string) {
    const shortUrl = this.nanoid();

    const url = await this.prisma.url.create({
      data: {
        originalUrl: data.originalUrl,
        shortUrl,
        userId: userId || null,
      },
    });

    return { message: 'URL shortened successfully', shortUrl: url.shortUrl };
  }

  async findByShortUrl(shortUrl: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  async incrementClickCount(shortUrl: string) {
    return this.prisma.url.update({
      where: { shortUrl },
      data: { clicksCount: { increment: 1 } },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.url.findMany({
      where: { userId },
      select: {
        originalUrl: true,
        shortUrl: true,
        clicksCount: true,
      },
    });
  }
}
