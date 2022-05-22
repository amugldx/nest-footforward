import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Footforward api')
    .setDescription('Ecommerce shoes store')
    .setVersion('1.0')
    // { type: 'http', scheme: 'bearer', bearerFormat: 'Bearer' },
    // 'access-token',
    .addTag('footforward')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  await app.listen(3333);
}
bootstrap();
