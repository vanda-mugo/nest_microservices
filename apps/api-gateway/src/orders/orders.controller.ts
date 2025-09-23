import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../constant';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ORDERS_SERVICE)
    private readonly ordersServiceClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() orderData: any) {
    // we shall call the order registeration microservice here using tcp client

    return this.ordersServiceClient.send('create-order', orderData);
  }
}

/**
 * so note here we are using the client proxy instance to send a message to the order microservice
 * the send method takes two arguments, the first argument is the pattern which is a string that identifies
 * the message, in this case we are using 'create-order' as the pattern, the second argument is the data
 * that we want to send to the microservice, in this case we are sending the orderData object
 *
 * the other means is by message brokers or event bus  where the microservices communicate with each other
 * using a message broker or an event bus, in this case we are using kafka as the message broker
 *
 */
