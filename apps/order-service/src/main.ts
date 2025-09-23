import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // we are going to create a macro service instance here
  // and we will use the kafka transport strategy
  // to connect to the kafka broker
  // and we will listen to the messages from the order topic
  // and we will process the messages and send the response back to the client
  // this function qill enable the creation of a microservice instance and allow the microservice to
  // listen to the messages from the kafka broker/tcp server/rabbitmq broker
  // and process the messages and send the response back to the client
  // we will use the microservice options to configure the microservice instance
  // and we will use the transport strategy to connect to the kafka broker
  // and we will use the app.listen() method to start the microservice instance
  // and we will use the process.env.PORT variable to set the port number for the microservice instance
  // if the process.env.PORT variable is not set, we will use the default port number 3000
  // finally we will call the bootstrap function to start the microservice instance

  // nb for normal rest api we use NestFactory.create() method
  // but for microservices we use NestFactory.createMicroservice() method
  // and we pass the transport strategy as the second argument to the createMicroservice() method
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        // we define the host which is the ip address of the tcp server
        host: 'localhost',
        // the port is the ip port that the tcp server will listen to
        port: 4001,
      },
    },
  );
  await app.listen();
  console.log('Order Service is listening on port 4001');
}
bootstrap();

/**
 * when three microservices are hosted on the same host , this means that the microservices 
 * are basically hosted on the same ip address, they can be differentiated by their port numbers
 * they are listening to traffic directed at the host ip address 127.0.0.1 or local host and each of 
 * them is listening to a different port number
 * 
 * Service A is listening for connections to localhost:4001
  Service B is listening for connections to localhost:4002
  Service C is listening for connections to localhost:4003
 */
