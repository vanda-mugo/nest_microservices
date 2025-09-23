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
