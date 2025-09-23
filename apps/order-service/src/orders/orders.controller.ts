import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { MessagePattern } from '@nestjs/microservices';

// lets add an endpoint that listents to /orders using tcp controller
@Controller('orders')
export class OrdersController {
  // we will add a method that listens to /orders
  @MessagePattern('create-order')
  createOrder(@Payload() order: string) {
    console.log('Order Received in the order microservice :', order);
    return { message: 'Order data received successfully', order };
  }
}
// we will add a method that listens to /orders
