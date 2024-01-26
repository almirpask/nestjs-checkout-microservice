import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://rabbitmq:rabbitmq@rabbitmq:5672',
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
