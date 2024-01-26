import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Checkout,
  CheckoutItem,
  CheckoutProduct,
} from './checkouts/entities/checkout.entity';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest',
      entities: [Checkout, CheckoutItem, CheckoutProduct],
      synchronize: true,
      logging: true,
    }),
    CheckoutsModule,
    RabbitmqModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
