import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlsService } from './urls/urls.service';
import { UrlsController } from './urls/urls.controller';
import { ConfigModule } from '@nestjs/config';
import { UrlsModule } from './urls/urls.module';
import { RedirectController } from './urls/urls-redirect.controller';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(),
    UrlsModule,
  ],
  providers: [UrlsService],
  controllers: [UrlsController, RedirectController],
})
export class AppModule {}
