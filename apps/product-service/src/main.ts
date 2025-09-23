import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        // we shall define the host which the tcp server will listen to:  ip of the server that this microservice is running on
        host: 'localhost',
        // the port is the ip port that the tcp server will listen to
        port: 4002,
      },
    },
  );
  await app.listen();
  console.log('Product Service is listening on port 4002');
}
bootstrap();
