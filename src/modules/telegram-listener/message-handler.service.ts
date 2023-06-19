import { Injectable } from '@nestjs/common';
import { createLogger } from '../../components/logger';
import * as TelegramBot from 'node-telegram-bot-api';

const logger = createLogger(module);

@Injectable()
export class MessageHandlerService {
  async onMessage(message: TelegramBot.Message) {
    logger.info(`Received message: ${JSON.stringify(message)}`);
  }
}
