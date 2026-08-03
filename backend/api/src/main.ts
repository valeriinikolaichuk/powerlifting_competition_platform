import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(
    join(
      process.cwd(),
      '..',
      '..',
      'runtime',
      'dist',
      'runtime',
      'browser',
    ),
    {
      prefix: '/runtime/',
    },
  );

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://powerlifting-competition-platform-6.onrender.com',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();