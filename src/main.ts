import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInfrastucture } from './infrastructure/swagger/swagger.infrastructure';
import { appConfigInstance } from './infrastructure/app-config/app-config.infrastructure';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors({
  //   origin: ['http://localhost:5173'],
  // });
  const swagger: SwaggerInfrastucture = new SwaggerInfrastucture();
  swagger.initialize(app);
  const port: number = appConfigInstance.PORT;

  await app.listen(port);
  console.log(`http://localhost:${port}/swagger`);
  console.log(`https://t.me/payments_test_rtn_bot`);
}

bootstrap();
