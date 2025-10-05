import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { MICROSERVICES_CLIENTS } from './constansts';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices';
import { OrdersService } from './orders/orders.service';

@Module({
  imports: [
    // to register client to be able to communicate with payment microservice
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.PAYMENTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4004,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.PRODUCT_REDIS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
