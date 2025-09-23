import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payment')
export class PaymentController {
  @MessagePattern('payment-order-created')
  handlePaymentOrderCreated(order: Record<string, unknown>): {
    message: string;
    order: Record<string, unknown>;
  } {
    console.log('Payment order created:', order);
    // Here you can add logic to process the payment order
    return { message: 'Payment order processed successfully', order };
  }
}
