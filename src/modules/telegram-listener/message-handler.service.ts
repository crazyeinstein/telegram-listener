import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as uuid from 'uuid';
import * as TelegramBot from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/mongoose';
import { createLogger } from '../../components/logger';
import { Signal } from './signal.schema';
import { RmqService } from '../rmq/rmq.service';
import { ConfigService } from '../config/config.service';

const logger = createLogger(module);

@Injectable()
export class MessageHandlerService {
  private signalsExchange: string;

  constructor(
    @InjectModel(Signal.name) private readonly signalModel: Model<Signal>,
    private readonly rmqService: RmqService,
    private readonly configService: ConfigService,
  ) {
    this.signalsExchange = this.configService.get(
      'rmq.betBot.topology.exchanges.signals.name',
    );
  }

  async onMessage(message: TelegramBot.Message) {
    logger.info(`Received message: ${JSON.stringify(message)}`);

    const signalData = {
      uuid: uuid.v4(),
      tgMessage: message,
    };

    await this.rmqService.betBotRmqWrapper.publish(
      this.signalsExchange,
      '',
      Buffer.from(JSON.stringify(signalData)),
    );

    const signal = new this.signalModel(signalData);

    await signal.save().catch((err) => {
      logger.error(
        `SERVICE_ERROR: failed to save tgMessage signal to DB: ${err.message}`,
      );
    });
  }
}
