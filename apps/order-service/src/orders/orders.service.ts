import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { MICROSERVICES_CLIENTS } from 'src/constansts';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.PAYMENTS_SERVICE)
    private readonly paymentClient: ClientProxy,
  ) {}

  createPaymentOrder(order: any) {
    this.paymentClient.emit('payment-order-created', order);
  }
}
