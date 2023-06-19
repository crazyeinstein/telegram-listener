import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { MessageHandlerService } from './message-handler.service';
import { createLogger } from '../../components/logger';

const logger = createLogger(module);

@Injectable()
export class TelegramListenerService implements OnApplicationBootstrap {
  private telegramBotToken: string;
  private telegramBot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageHandlerService: MessageHandlerService,
  ) {
    this.telegramBotToken = this.configService.get(
      'telegramBot.blogabet.token',
    );
  }

  async onApplicationBootstrap() {
    try {
      this.telegramBot = new TelegramBot(this.telegramBotToken, {
        polling: true,
      });

      const info = await this.telegramBot.getMe();

      logger.info(`Bot launched successfully: ${JSON.stringify(info)}`);

      this.telegramBot.on('channel_post', (message) => {
        this.messageHandlerService.onMessage(message);
      });
    } catch (err) {
      throw new Error(`Telegam bot module creation error: ${err.message}`);
    }
  }
}
