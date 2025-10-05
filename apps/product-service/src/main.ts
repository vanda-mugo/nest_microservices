import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const tcpMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        // we shall define the host which the tcp server will listen to:  ip of the server that this microservice is running on
        host: 'localhost',
        // the port is the ip port that the tcp server will listen to
        port: 4002,
      },
    });
  const redisMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });

  await Promise.all([tcpMicroservice.listen(), redisMicroservice.listen()]);
  console.log(
    'Product Service is listening on port 4002, and listening to Redis events at port 6379',
  );
}
bootstrap();

// we can run multiple microservices in a single nest application
