import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  // we will add a method that listens to /orders
  @MessagePattern('get_product')
  getProduct(@Payload() productId: number) {
    console.log('Received product ID:', productId);
    return { message: 'Product data retrieved successfully', productId };
  }

  //create an event listener that listens to order_created event
  // this listens to events emitted by other microservices through redis transport layer, specifically the order service
  @EventPattern('order.created')
  updateStock(order: { id: number; productId: number }) {
    console.log('Order Created Event Received in Product Service:', order);

    console.log(
      `Updating stock for product ID: ${order.productId} due to order ID: ${order.productId}`,
    );
  }
}
