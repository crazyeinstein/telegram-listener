import { Module } from '@nestjs/common';
import { TelegramListenerService } from './telegram-listener.service';
import { MessageHandlerService } from './message-handler.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [TelegramListenerService, MessageHandlerService],
})
export class TelegramListenerModule {}
