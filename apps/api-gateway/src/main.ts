import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// this we want to receive http request of user and then send tcp requests to the concerned microservices

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
