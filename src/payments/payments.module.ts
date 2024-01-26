import { Module } from '@nestjs/common';
import { PaymentConsumer } from './payment.consumer';

@Module({
  providers: [PaymentConsumer],
})
export class PaymentsModule {}
