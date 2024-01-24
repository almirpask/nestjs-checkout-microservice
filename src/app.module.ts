import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckoutsModule } from './checkouts/checkouts.module';

@Module({
  imports: [CheckoutsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
