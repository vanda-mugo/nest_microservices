import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  // we will add a method that listens to /orders
  @MessagePattern('get_product')
  getProduct(@Payload() productId: number) {
    console.log('Received product ID:', productId);
    return { message: 'Product data retrieved successfully', productId };
  }
}
