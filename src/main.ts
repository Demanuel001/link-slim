import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Link-Slim')
    .setDescription(
      'Link-Slim: Rest API for URL shortening with user authentication.',
    )
    .setVersion('0.3.1')
    .addTag('link-slim')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.tags = [
    { name: 'users', description: 'User management' },
    { name: 'auth', description: 'Authentication endpoints' },
    { name: 'urls', description: 'URL shortening service' },
    { name: 'redirect', description: 'URL redirection service' },
  ];

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
