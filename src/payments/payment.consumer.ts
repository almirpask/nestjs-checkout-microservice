import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentConsumer {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'checkout.created',
    queue: 'microservice-payment',
  })
  async consume(msg: { checkout_id: number; total: number }) {
    try {
      await sleep(20000);
      console.log(msg);
    } catch (err) {
      return new Nack(true);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
