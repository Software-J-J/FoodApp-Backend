import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const logger = new Logger('Main-FoodApp');

  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: '*', 
    credentials: true,
  };

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors(corsOptions);
  await app.listen(envs.port);
  logger.log(`Products Microservice running on PORT: ${envs.port}`);
}
bootstrap();
