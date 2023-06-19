import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import { TelegramListenerModule } from '../telegram-listener/telegram-listener.module';
import { RmqModule } from '../rmq/rmq.module';
import * as config from 'config';

@Module({
  imports: [
    ConfigModule,
    TelegramListenerModule,
    RmqModule,
    MongooseModule.forRoot(config.get('mongo.url')),
  ],
})
export class AppModule {}
