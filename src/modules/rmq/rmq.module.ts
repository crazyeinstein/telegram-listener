import { Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {}
