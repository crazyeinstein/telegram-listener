import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as uuid from 'uuid';
import { ConfigService } from '../config/config.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { MessageHandlerService } from './message-handler.service';
import { createLogger } from '../../components/logger';
import { run } from '../../components/context';

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
        run('tgm', { id: uuid.v4() }, () => {
          this.messageHandlerService.onMessage(message);
        });
      });
    } catch (err) {
      throw new Error(`Telegam bot module creation error: ${err.message}`);
    }
  }
}
