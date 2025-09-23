import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constant';
import { OrdersController } from './orders/orders.controller';

/**
 * note by this is the api gateway module where we will register all the microservices clients
 * so that we can use them in the controller to send requests to the respective microservices
 * In NestJS microservices, ClientModule.register() (or ClientsModule.register()) is used to 
 * configure and provide client proxies that allow your application to communicate with other microservices.
 * 
 * It registers a client (like Kafka, Redis, NATS, TCP, etc.) with specific connection options (such as transport, URLs, clientId, etc.).
This enables your service to send messages or requests to other microservices using the chosen transport protocol.
It abstracts the communication details, so you can inject and use the client in your services/controllers without manual setup.
It’s essential for building scalable, decoupled, and maintainable microservices architectures, where services interact over a message broker or network.
 */

@Module({
  imports: [
    // we will import the clients here
    ClientsModule.register([
      // here we will register each of the clients for each microservice
      {
        name: MICROSERVICES_CLIENTS.USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4003,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4002,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService],
})
export class AppModule {}
