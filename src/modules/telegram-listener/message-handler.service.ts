import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as uuid from 'uuid';
import * as TelegramBot from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/mongoose';
import { createLogger } from '../../components/logger';
import { Signal } from './signal.schema';

const logger = createLogger(module);

@Injectable()
export class MessageHandlerService {
  constructor(
    @InjectModel(Signal.name) private readonly signalModel: Model<Signal>,
  ) {}

  async onMessage(message: TelegramBot.Message) {
    logger.info(`Received message: ${JSON.stringify(message)}`);

    const signalData = {
      uuid: uuid.v4(),
      tgMessage: message,
    };

    const signal = new this.signalModel(signalData);

    await signal.save().catch((err) => {
      logger.error(
        `SERVICE_ERROR: failed to save tgMessage signal to DB: ${err.message}`,
      );
    });
  }
}
