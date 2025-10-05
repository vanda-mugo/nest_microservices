import { Controller, Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { MessagePattern } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { ClientProxy } from '@nestjs/microservices';
// Import MICROSERVICES_CLIENTS from its definition file
import { MICROSERVICES_CLIENTS } from '../constansts';

// lets add an endpoint that listents to /orders using tcp controller
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(MICROSERVICES_CLIENTS.PRODUCT_REDIS_CLIENT)
    private readonly productRedisClient: ClientProxy,
  ) {}

  // we will add a method that listens to /orders
  @MessagePattern('create-order')
  createOrder(@Payload() order: string) {
    console.log('Order Received in the order microservice :', order);
    this.ordersService.createPaymentOrder(order);
    // we want to emit a event that will be listened to by the product service through redis
    this.productRedisClient.emit('order.created', order);
    return { message: 'Order data received successfully', order };
  }
}
// we will add a method that listens to /orders
