import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { MessageHandlerService } from './message-handler.service';

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
    this.telegramBot = new TelegramBot(this.telegramBotToken, {
      polling: true,
    });

    this.telegramBot.on('channel_post', (message) => {
      this.messageHandlerService.onMessage(message);
    });
  }
}
