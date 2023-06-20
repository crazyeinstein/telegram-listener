import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramListenerService } from './telegram-listener.service';
import { MessageHandlerService } from './message-handler.service';
import { ConfigModule } from '../config/config.module';
import { Signal, SignalSchema } from './signal.schema';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [
    ConfigModule,
    RmqModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
  ],
  providers: [TelegramListenerService, MessageHandlerService],
})
export class TelegramListenerModule {}
