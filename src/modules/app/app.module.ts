import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TelegramListenerModule } from '../telegram-listener/telegram-listener.module';

@Module({
  imports: [ConfigModule, TelegramListenerModule],
})
export class AppModule {}
