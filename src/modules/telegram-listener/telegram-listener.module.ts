import { Module } from '@nestjs/common';
import { TelegramListenerService } from './telegram-listener.service';
import { MessageHandlerService } from './message-handler.service';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Signal, SignalSchema } from './signal.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
  ],
  providers: [TelegramListenerService, MessageHandlerService],
})
export class TelegramListenerModule {}
