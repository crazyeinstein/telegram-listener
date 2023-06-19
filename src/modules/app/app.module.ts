import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TelegramListenerModule } from '../telegram-listener/telegram-listener.module';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [ConfigModule, TelegramListenerModule, RmqModule],
})
export class AppModule {}
